// ============================================================
// TBH Build Share — Rune Tree Canvas Renderer
// ============================================================
// Renders 197 rune nodes on a canvas with pan/zoom, click to
// allocate/deallocate, hover tooltips, and parent lock mechanic.
// ============================================================

class RuneTree {
  // ─── Constructor ──────────────────────────────────────────
  constructor(canvasEl, tooltipEl, onAllocate) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.tooltipEl = tooltipEl;
    this.onAllocate = onAllocate;

    // State
    this.data = [];          // rune tree nodes
    this.allocations = {};   // { key: level }
    this.nodeMap = {};       // key -> node lookup

    // Camera
    this.panX = 0;
    this.panY = 0;
    this.scale = 1.0;

    // Interaction state
    this.dragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragPanX = 0;
    this.dragPanY = 0;
    this.hoveredKey = null;
    this.selectedKey = null;
    this.tooltipVisible = false;

    // Animation
    this.dirty = true;
    this.pulsePhase = 0;

    // Mouse position for tooltip
    this.mouseX = 0;
    this.mouseY = 0;

    // Bounds
    this.minScale = 0.5;
    this.maxScale = 2.0;

    // Node radius in canvas coords
    this.nodeRadius = 18;

    // Bind events
    this._bindEvents();

    // Start render loop
    this._renderLoop();
  }

  // ─── Load Data ────────────────────────────────────────────
  load(data, allocations) {
    this.data = data;
    this.allocations = allocations || {};
    this.nodeMap = {};

    // Build lookup and parent references
    for (const node of data) {
      this.nodeMap[node.key] = node;
      node._parentKeys = [];
      node._level = this.allocations[node.key] || 0;
    }

    // Reverse connections to find parents
    for (const node of data) {
      for (const childKey of node.connections) {
        const child = this.nodeMap[childKey];
        if (child) {
          child._parentKeys.push(node.key);
        }
      }
    }

    // Compute lock state for all nodes
    this._computeLocks();

    this.dirty = true;
  }

  // ─── Full Redraw ──────────────────────────────────────────
  render() {
    this.dirty = true;
  }

  // ─── Reset Allocations ────────────────────────────────────
  reset() {
    this.load(this.data, {});
    if (this.onAllocate) {
      this.onAllocate('__reset__', 0, 0);
    }
    this.dirty = true;
  }

  // ─── Get Current Allocations ──────────────────────────────
  getAllocations() {
    const result = {};
    for (const key of Object.keys(this.allocations)) {
      if (this.allocations[key] > 0) {
        result[key] = this.allocations[key];
      }
    }
    return result;
  }

  // ─── Lock Mechanic ────────────────────────────────────────
  _computeLocks() {
    for (const node of this.data) {
      // Root nodes (tier 1, innermost) are always unlocked
      if (node.tier === 1) {
        node._locked = false;
        continue;
      }

      // A node is unlocked if at least one parent has 1+ level
      const hasUnlockedParent = node._parentKeys.some(
        pk => (this.nodeMap[pk] && this.nodeMap[pk]._level > 0)
      );

      node._locked = !hasUnlockedParent;
    }
  }

  // ─── Allocate / Deallocate ────────────────────────────────
  _allocate(key) {
    const node = this.nodeMap[key];
    if (!node || node._locked) return false;
    if (node._level >= node.maxLevel) return false;

    node._level = (node._level || 0) + 1;
    this.allocations[key] = node._level;
    this._computeLocks();
    this.dirty = true;

    if (this.onAllocate) {
      this.onAllocate(key, node._level, 1);
    }
    return true;
  }

  _deallocate(key) {
    const node = this.nodeMap[key];
    if (!node || !node._level || node._level <= 0) return false;

    // Check if any children depend on this node
    const childrenDepend = node.connections.some(childKey => {
      const child = this.nodeMap[childKey];
      return child && child._level > 0 &&
        child._parentKeys.filter(pk => pk !== key)
          .every(pk => !this.nodeMap[pk] || this.nodeMap[pk]._level === 0);
    });

    if (childrenDepend) return false;

    node._level--;
    if (node._level <= 0) {
      node._level = 0;
      delete this.allocations[key];
    } else {
      this.allocations[key] = node._level;
    }
    this._computeLocks();
    this.dirty = true;

    if (this.onAllocate) {
      this.onAllocate(key, node._level, -1);
    }
    return true;
  }

  // ─── Node Color ───────────────────────────────────────────
  _getNodeColor(node) {
    if (node._level >= node.maxLevel) return '#ffcc00'; // Gold — max
    if (node._level > 0) return '#44bb44';               // Green — partial
    if (!node._locked) return '#4488ff';                  // Blue — available
    return '#444444';                                     // Gray — locked
  }

  // ─── Edge Color ───────────────────────────────────────────
  _getEdgeColor(fromLevel, toLocked) {
    if (fromLevel >= 1 && !toLocked) return '#4488ff';   // Blue — active
    if (fromLevel >= 1) return '#ffcc00';                 // Gold — fully active
    return '#333333';                                     // Dark — locked
  }

  // ─── Coordinate Helpers ──────────────────────────────────
  _worldToScreen(wx, wy) {
    return {
      x: (wx + this.panX) * this.scale + this.canvas.width / 2,
      y: (wy + this.panY) * this.scale + this.canvas.height / 2
    };
  }

  _screenToWorld(sx, sy) {
    return {
      x: (sx - this.canvas.width / 2) / this.scale - this.panX,
      y: (sy - this.canvas.height / 2) / this.scale - this.panY
    };
  }

  // ─── Render Loop ──────────────────────────────────────────
  _renderLoop() {
    // Pulse animation for selected node
    this.pulsePhase = (this.pulsePhase + 0.04) % (Math.PI * 2);

    if (this.dirty || this.selectedKey) {
      this._draw();
      this.dirty = false;
    }

    requestAnimationFrame(() => this._renderLoop());
  }

  // ─── Draw ─────────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear
    ctx.fillStyle = '#1a1f2a';
    ctx.fillRect(0, 0, w, h);

    if (this.data.length === 0) {
      ctx.fillStyle = '#5a6a7a';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading rune tree...', w / 2, h / 2);
      return;
    }

    // Draw edges first (behind nodes)
    this._drawEdges(ctx);

    // Draw nodes
    this._drawNodes(ctx);

    // Draw pan/zoom hint
    ctx.fillStyle = 'rgba(90, 106, 122, 0.5)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Drag to pan · Scroll to zoom · ${Math.round(this.scale * 100)}%`, w / 2, h - 12);
  }

  _drawEdges(ctx) {
    for (const node of this.data) {
      const from = this._worldToScreen(node.x, node.y);
      const fromLevel = node._level || 0;

      for (const childKey of node.connections) {
        const child = this.nodeMap[childKey];
        if (!child) continue;

        const to = this._worldToScreen(child.x, child.y);
        const color = this._getEdgeColor(fromLevel, child._locked);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = fromLevel > 0 ? 2 : 1;
        ctx.globalAlpha = fromLevel > 0 ? 0.8 : 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    }
  }

  _drawNodes(ctx) {
    const radius = this.nodeRadius;
    const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;

    for (const node of this.data) {
      const pos = this._worldToScreen(node.x, node.y);
      const color = this._getNodeColor(node);
      const isSelected = node.key === this.selectedKey;

      // Skip off-screen nodes
      if (pos.x < -50 || pos.x > ctx.canvas.width + 50 ||
          pos.y < -50 || pos.y > ctx.canvas.height + 50) {
        continue;
      }

      // Selection pulse ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Node background
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Node border
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(0,0,0,0.3)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Level indicator dots inside node
      const maxDots = Math.min(node.maxLevel, 5);
      const dotR = 2;
      const dotSpread = Math.min(radius - 4, 10);
      const dotStartAngle = -Math.PI / 2 - ((maxDots - 1) * 0.3) / 2;

      for (let i = 0; i < maxDots; i++) {
        const angle = dotStartAngle + i * 0.3;
        const dx = Math.cos(angle) * dotSpread;
        const dy = Math.sin(angle) * dotSpread;
        ctx.beginPath();
        ctx.arc(pos.x + dx, pos.y + dy, dotR, 0, Math.PI * 2);
        ctx.fillStyle = i < node._level ? '#ffffff' : 'rgba(255,255,255,0.2)';
        ctx.fill();
      }

      // Node label
      if (this.scale > 0.6) {
        ctx.fillStyle = '#b0b8c8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const label = this._truncateName(node.name, 14);
        ctx.fillText(label, pos.x, pos.y + radius + 4);
      }
    }
  }

  _truncateName(name, maxLen) {
    if (name.length <= maxLen) return name;
    return name.substring(0, maxLen - 1) + '\u2026';
  }

  // ─── Tooltip ──────────────────────────────────────────────
  _showTooltip(node) {
    const el = this.tooltipEl;
    if (!el) return;

    const level = node._level || 0;
    const nextCost = level < node.maxLevel ? node.costs[level] : 0;
    const totalStat = (level * node.statPerLevel).toFixed(node.statPerLevel < 1 ? 1 : 0);
    const statName = this._statDisplay(node.statBonus);

    el.innerHTML = `
      <div class="rune-tooltip-name">${node.name}</div>
      <div class="rune-tooltip-stat">${statName}: +${node.statPerLevel} per level</div>
      <div class="rune-tooltip-level">Level <strong>${level}</strong> / ${node.maxLevel}</div>
      <div class="rune-tooltip-total">Current total: +${totalStat} ${statName}</div>
      ${nextCost > 0
        ? `<div class="rune-tooltip-cost">Next level: <span class="gold">${this._formatGold(nextCost)}</span></div>`
        : level >= node.maxLevel
          ? '<div class="rune-tooltip-max">MAX LEVEL</div>'
          : '<div class="rune-tooltip-free">First level: FREE</div>'}
      ${node._locked ? '<div class="rune-tooltip-locked">Requires parent node with 1+ level</div>' : ''}
      <div class="rune-tooltip-tip">Left-click: +1 · Right-click: -1</div>
    `;

    // Position near cursor
    const tw = el.offsetWidth || 200;
    const th = el.offsetHeight || 120;
    let tx = this.mouseX + 15;
    let ty = this.mouseY - 10;

    // Keep on screen
    if (tx + tw > window.innerWidth - 10) tx = this.mouseX - tw - 10;
    if (ty + th > window.innerHeight - 10) ty = window.innerHeight - th - 10;
    if (ty < 10) ty = 10;

    el.style.left = tx + 'px';
    el.style.top = ty + 'px';
    el.style.display = 'block';
    this.tooltipVisible = true;
  }

  _hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
    this.tooltipVisible = false;
  }

  // ─── Helpers ──────────────────────────────────────────────
  _statDisplay(stat) {
    const names = {
      attackDamage: 'Attack Damage', attackSpeed: 'Attack Speed',
      critChance: 'Crit Chance', critDamage: 'Crit Damage',
      maxHp: 'Max HP', armor: 'Armor',
      moveSpeed: 'Move Speed', castSpeed: 'Cast Speed',
      cooldownReduction: 'CD Reduction', hpRegen: 'HP Regen',
      hpPerKill: 'HP/Kill', hpLeech: 'Life Leech',
      hpPerHit: 'HP/Hit', blockChance: 'Block Chance',
      dodgeChance: 'Dodge Chance', physicalDamage: 'Phys Dmg',
      fireDamage: 'Fire Dmg', coldDamage: 'Cold Dmg',
      lightningDamage: 'Lightning Dmg', elementalResistance: 'Elem Resist',
      damageReduction: 'Dmg Red', areaOfEffect: 'AoE',
      aoeDamage: 'AoE Dmg', projectileDamage: 'Proj Dmg',
      skillHeal: 'Skill Heal', duration: 'Duration',
      goldFind: 'Gold Find', xpBonus: 'XP Bonus',
      energyRegen: 'Energy Regen', energyMax: 'Energy Max'
    };
    return names[stat] || stat;
  }

  _formatGold(copper) {
    if (copper >= 10000) {
      const gold = (copper / 10000).toFixed(copper % 10000 === 0 ? 0 : 2);
      return gold + 'g';
    }
    return copper + ' copper';
  }

  _hitTest(sx, sy) {
    const radius = this.nodeRadius;
    // Iterate reverse so top-most (last drawn) is hit first
    for (let i = this.data.length - 1; i >= 0; i--) {
      const node = this.data[i];
      const pos = this._worldToScreen(node.x, node.y);
      const dx = sx - pos.x;
      const dy = sy - pos.y;
      if (dx * dx + dy * dy <= radius * radius * 1.5 * 1.5) {
        return node;
      }
    }
    return null;
  }

  // ─── Events ───────────────────────────────────────────────
  _bindEvents() {
    const canvas = this.canvas;

    // Mouse down — left for drag, right for context menu
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        // Right-click: deallocate
        const node = this._hitTest(e.offsetX, e.offsetY);
        if (node) {
          e.preventDefault();
          this._deallocate(node.key);
          this.selectedKey = null;
          this._hideTooltip();
        }
        return;
      }

      if (e.button === 0) {
        // Check if we hit a node first
        const node = this._hitTest(e.offsetX, e.offsetY);
        if (node) {
          // Click to allocate
          this._allocate(node.key);
          this.selectedKey = node.key;
          this._showTooltip(node);
          return;
        }

        // Start drag
        this.dragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.dragPanX = this.panX;
        this.dragPanY = this.panY;
        this.canvas.style.cursor = 'grabbing';
      }
    });

    // Mouse move
    canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (this.dragging) {
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        this.panX = this.dragPanX + dx / this.scale;
        this.panY = this.dragPanY + dy / this.scale;
        this.dirty = true;
        this._hideTooltip();
        return;
      }

      // Hover
      const node = this._hitTest(e.offsetX, e.offsetY);
      if (node) {
        this.canvas.style.cursor = 'pointer';
        if (this.hoveredKey !== node.key) {
          this.hoveredKey = node.key;
          this._showTooltip(node);
        }
      } else {
        this.canvas.style.cursor = 'default';
        if (this.hoveredKey) {
          this.hoveredKey = null;
          this._hideTooltip();
        }
      }
    });

    // Mouse up / leave
    const endDrag = () => {
      this.dragging = false;
      this.canvas.style.cursor = 'default';
    };
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', () => {
      endDrag();
      this._hideTooltip();
      this.hoveredKey = null;
    });

    // Wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta * this.scale));

      // Zoom toward mouse position
      const world = this._screenToWorld(e.offsetX, e.offsetY);
      this.scale = newScale;
      this.panX = (e.offsetX - this.canvas.width / 2) / this.scale - world.x;
      this.panY = (e.offsetY - this.canvas.height / 2) / this.scale - world.y;

      this.dirty = true;
    }, { passive: false });

    // Context menu prevention
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        if (document.activeElement === canvas || document.activeElement === document.body) {
          this.reset();
        }
      }
    });

    // Resize handler
    this._resizeObserver = new ResizeObserver(() => {
      this._resizeCanvas();
    });
    this._resizeObserver.observe(canvas.parentElement || canvas);

    // Initial resize
    this._resizeCanvas();
  }

  _resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Only resize if dimensions actually changed
    const newW = Math.floor(rect.width);
    const newH = Math.floor(rect.height);

    if (this.canvas.width !== newW * dpr || this.canvas.height !== newH * dpr) {
      this.canvas.width = newW * dpr;
      this.canvas.height = newH * dpr;
      this.canvas.style.width = newW + 'px';
      this.canvas.style.height = newH + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.dirty = true;
    }
  }

  // ─── Cleanup ──────────────────────────────────────────────
  destroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this._hideTooltip();
  }
}

// Export for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RuneTree };
}
