// ============================================================
// TBH Build Share — Rune Tree SVG Renderer
// ============================================================
// Renders 197 rune nodes in SVG with pan/zoom, click to
// allocate/deallocate, hover tooltips, and parent lock mechanic.
// Data sourced from wiki's rune_tree.json for pixel-perfect layout.
// ============================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

class RuneTree {
  // ─── Constructor ──────────────────────────────────────────
  constructor(containerEl, tooltipEl, onAllocate) {
    this.container = containerEl;
    this.tooltipEl = tooltipEl;
    this.onAllocate = onAllocate;

    // State
    this.data = [];
    this.allocations = {};
    this.nodeMap = {};

    // Spacing multiplier for node positions
    this.spacing = 1.3;

    // Camera
    this.panX = 0;
    this.panY = 0;
    this.scale = 1.0;

    // Interaction state
    this.dragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragPan = { x: 0, y: 0 };
    this.hoveredKey = null;
    this.selectedKey = null;
    this.tooltipVisible = false;
    this.mouseX = 0;
    this.mouseY = 0;

    // Bounds
    this.minScale = 0.3;
    this.maxScale = 3.0;

    // SVG DOM refs
    this.svg = null;
    this.viewport = null;
    this.connectionsGroup = null;
    this.nodesGroup = null;
    this.nodeElMap = {};
    this.edgeElMap = [];

    // Bound handler ref for cleanup
    this._boundKeydown = null;

    this._createSVG();
    this._bindEvents();
  }

  // ─── SVG Setup ────────────────────────────────────────────
  _createSVG() {
    this.container.innerHTML = '';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('id', 'rune-svg');

    this.viewport = document.createElementNS(SVG_NS, 'g');
    this.viewport.setAttribute('class', 'viewport');

    this.connectionsGroup = document.createElementNS(SVG_NS, 'g');
    this.connectionsGroup.setAttribute('class', 'connections');

    this.nodesGroup = document.createElementNS(SVG_NS, 'g');
    this.nodesGroup.setAttribute('class', 'nodes');

    this.viewport.appendChild(this.connectionsGroup);
    this.viewport.appendChild(this.nodesGroup);
    svg.appendChild(this.viewport);
    this.container.appendChild(svg);
    this.svg = svg;
  }

  // ─── Load Data (wiki format: { nodes, edges, startNodes, bounds }) ─
  load(data, allocations) {
    // Normalise data: accept both wiki format {nodes, edges} and
    // the legacy array format for backward compat
    const nodes = Array.isArray(data) ? data : (data.nodes || []);
    const edges = Array.isArray(data) ? null : (data.edges || []);
    const startNodes = data.startNodes || [];
    this.data = nodes;
    this.allocations = allocations || {};
    this.nodeMap = {};

    // Build lookup — convert numeric keys to strings for consistency
    for (const node of nodes) {
      const key = String(node.key);
      this.nodeMap[key] = node;
      node._key = key;
      node._parentKeys = [];
      node._level = this.allocations[key] || 0;
      // Extract icon basename from wiki path (/game/runes/foo.png → foo.png)
      node._iconFile = node.icon ? node.icon.split('/').pop() : null;
      // Display name
      node._displayName = (node.name && typeof node.name === 'object')
        ? (node.name['en-US'] || node.name.en || node.key)
        : (node.name || node.key);
      // Build costs array from levels[]
      if (node.levels && Array.isArray(node.levels)) {
        node._costs = node.levels.map(l => l.costValue || 0);
      } else {
        node._costs = node.costs || [];
      }
      // maxLevel from levels length or explicit field
      if (node.maxLevel == null && node.levels) {
        node.maxLevel = node.levels.length;
      }
    }

    // Apply node spacing multiplier to all positions
    for (const node of nodes) {
      node.x *= this.spacing;
      node.y *= this.spacing;
    }

    // Process edges to build parent/child connections
    if (edges) {
      for (const edge of edges) {
        const fromKey = String(edge.from);
        const toKey = String(edge.to);
        const parent = this.nodeMap[fromKey];
        const child = this.nodeMap[toKey];
        if (parent && child) {
          if (!parent._connections) parent._connections = [];
          parent._connections.push(toKey);
          child._parentKeys.push(fromKey);
        }
      }
    } else {
      // Legacy format: use node.connections directly
      for (const node of nodes) {
        if (node.connections) {
          node._connections = node.connections.map(c => String(c));
          for (const childKey of node._connections) {
            const child = this.nodeMap[childKey];
            if (child) {
              child._parentKeys.push(node._key);
            }
          }
        }
      }
    }

    // Compute tiers via BFS from start nodes
    this._computeTiers(startNodes);

    // Compute lock state
    this._computeLocks();

    // Generate SVG DOM
    this.nodeElMap = {};
    this.edgeElMap = [];
    this.nodesGroup.innerHTML = '';
    this.connectionsGroup.innerHTML = '';

    this._generateNodes();
    this._generateEdges();
    this._centerView(startNodes);
    this._updateViewport();
    this._updateVisualState();
  }

  // ─── Compute Tiers (BFS from start nodes) ────────────────
  _computeTiers(startNodes) {
    const visited = new Set();
    const queue = [];
    const startKeys = startNodes.map(k => String(k));

    // Initialise all tiers to max (will be refined)
    for (const node of this.data) {
      node._tier = 999;
    }

    for (const key of startKeys) {
      if (this.nodeMap[key]) {
        this.nodeMap[key]._tier = 1;
        visited.add(key);
        queue.push(key);
      }
    }

    let head = 0;
    while (head < queue.length) {
      const key = queue[head++];
      const node = this.nodeMap[key];
      const childTier = node._tier + 1;
      const children = node._connections || [];
      for (const childKey of children) {
        const child = this.nodeMap[childKey];
        if (child && !visited.has(childKey)) {
          child._tier = childTier;
          visited.add(childKey);
          queue.push(childKey);
        } else if (child && childTier < child._tier) {
          // Update tier if we found a shorter path
          child._tier = childTier;
        }
      }
    }

    // Nodes not reachable from start → assign tier 0
    for (const node of this.data) {
      if (node._tier === 999) node._tier = 0;
    }
  }

  // ─── SVG DOM Generation ───────────────────────────────────
  _generateNodes() {
    for (const node of this.data) {
      const key = node._key || String(node.key);

      // Root node group
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'rune-node');
      g.setAttribute('data-key', key);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      // Background rect
      const bg = document.createElementNS(SVG_NS, 'rect');
      bg.setAttribute('class', 'node-bg');
      bg.setAttribute('x', '-32');
      bg.setAttribute('y', '-32');
      bg.setAttribute('width', '64');
      bg.setAttribute('height', '64');
      g.appendChild(bg);

      // Icon layer
      const iconLayer = document.createElementNS(SVG_NS, 'g');
      iconLayer.setAttribute('class', 'node-icon-layer');

      // Fallback rect (shown until image loads, or on error)
      const fallback = document.createElementNS(SVG_NS, 'rect');
      fallback.setAttribute('class', 'node-icon-fallback');
      fallback.setAttribute('x', '-26');
      fallback.setAttribute('y', '-26');
      fallback.setAttribute('width', '52');
      fallback.setAttribute('height', '52');
      fallback.setAttribute('rx', '6');
      fallback.setAttribute('fill', '#2a2a3a');
      iconLayer.appendChild(fallback);

      // Abbreviation text (shown until image loads)
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('class', 'node-icon-text');
      text.setAttribute('x', '0');
      text.setAttribute('y', '6');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#889');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('font-family', 'sans-serif');
      text.textContent = '?';
      iconLayer.appendChild(text);

      // Wiki icon image (pixel-art, covers fallback on load)
      if (node._iconFile) {
        const img = document.createElementNS(SVG_NS, 'image');
        img.setAttribute('class', 'node-icon');
        img.setAttribute('x', '-26');
        img.setAttribute('y', '-26');
        img.setAttribute('width', '52');
        img.setAttribute('height', '52');
        img.setAttribute('style', 'image-rendering:pixelated');
        img.setAttribute('href', `assets/runes/${node._iconFile}`);
        // On load: hide fallback rect + text so the image shows
        img.addEventListener('load', () => {
          fallback.style.display = 'none';
          text.style.display = 'none';
        });
        // On error: hide image, fallback remains visible
        img.addEventListener('error', () => {
          img.style.display = 'none';
        });
        iconLayer.appendChild(img);
      }

      g.appendChild(iconLayer);

      // Level badge (hidden by default, shown via _updateVisualState)
      const badgeG = document.createElementNS(SVG_NS, 'g');
      badgeG.setAttribute('class', 'node-level-badge');
      badgeG.style.display = 'none';

      const badgeBg = document.createElementNS(SVG_NS, 'rect');
      badgeBg.setAttribute('class', 'badge-bg');
      badgeBg.setAttribute('x', '14');
      badgeBg.setAttribute('y', '14');
      badgeBg.setAttribute('width', '20');
      badgeBg.setAttribute('height', '17');
      badgeBg.setAttribute('fill', '#11131a');
      badgeBg.setAttribute('stroke', '#586178');
      badgeBg.setAttribute('stroke-width', '1.5');
      badgeG.appendChild(badgeBg);

      const badgeText = document.createElementNS(SVG_NS, 'text');
      badgeText.setAttribute('class', 'badge-text');
      badgeText.setAttribute('x', '24');
      badgeText.setAttribute('y', '27');
      badgeText.setAttribute('text-anchor', 'middle');
      badgeText.setAttribute('fill', '#f6b73c');
      badgeText.setAttribute('font-size', '11');
      badgeText.setAttribute('font-weight', 'bold');
      badgeText.textContent = '0';
      badgeG.appendChild(badgeText);

      g.appendChild(badgeG);
      this.nodesGroup.appendChild(g);
      this.nodeElMap[key] = g;
    }
  }

  _generateEdges() {
    for (const node of this.data) {
      const children = node._connections || [];
      for (const childKey of children) {
        const child = this.nodeMap[childKey];
        if (!child) continue;

        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('class', 'rune-connection');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', child.x);
        line.setAttribute('y2', child.y);
        line.setAttribute('vector-effect', 'non-scaling-stroke');

        this.connectionsGroup.appendChild(line);
        this.edgeElMap.push({ line, fromKey: node._key });
      }
    }
  }

  // ─── Camera / Viewport ────────────────────────────────────
  _centerView(startNodes) {
    if (!this.data || this.data.length === 0) return;

    const xs = this.data.map(n => n.x);
    const ys = this.data.map(n => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    this.panX = -cx;
    this.panY = -cy;

    // Fit to container with padding, cap at 1.5 to avoid huge initial zoom
    const pad = 100;
    const rangeX = maxX - minX + pad * 2;
    const rangeY = maxY - minY + pad * 2;
    const cw = this.container.clientWidth || 800;
    const ch = this.container.clientHeight || 600;
    this.scale = Math.min(cw / rangeX, ch / rangeY, 1.5);
  }

  _updateViewport() {
    const cw = this.svg.clientWidth || this.container.clientWidth || 800;
    const ch = this.svg.clientHeight || this.container.clientHeight || 600;
    const t = `translate(${cw / 2}, ${ch / 2}) scale(${this.scale}) translate(${this.panX}, ${this.panY})`;
    this.viewport.setAttribute('transform', t);
  }

  // ─── Visual State ─────────────────────────────────────────
  _updateVisualState() {
    for (const node of this.data) {
      const key = node._key || String(node.key);
      const el = this.nodeElMap[key];
      if (!el) continue;

      el.classList.toggle('has-level', node._level > 0);
      el.classList.toggle('max-level', node._level >= node.maxLevel);
      el.classList.toggle('locked', node._locked);
      el.classList.toggle('selected', key === this.selectedKey);

      const badge = el.querySelector('.node-level-badge');
      if (badge) {
        const level = node._level || 0;
        badge.style.display = level > 0 ? '' : 'none';
        const bt = badge.querySelector('.badge-text');
        if (bt) bt.textContent = level;
      }
    }

    // Connection active state: gold when source has any level
    for (const { line, fromKey } of this.edgeElMap) {
      const fromNode = this.nodeMap[fromKey];
      line.classList.toggle('active', fromNode && fromNode._level > 0);
    }
  }

  // ─── Full Redraw (re-applies visual state + viewport) ─────
  render() {
    this._updateVisualState();
    this._updateViewport();
  }

  // ─── Reset Allocations ────────────────────────────────────
  reset() {
    this.load(this.data, {});
    if (this.onAllocate) {
      this.onAllocate('__reset__', 0, 0);
    }
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
      // Root nodes (tier 1) are always unlocked
      if (node._tier === 1) {
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
    this._updateVisualState();

    if (this.onAllocate) {
      this.onAllocate(key, node._level, 1);
    }
    return true;
  }

  _deallocate(key) {
    const node = this.nodeMap[key];
    if (!node || !node._level || node._level <= 0) return false;

    // Check if any children depend on this node
    const childrenDepend = (node._connections || []).some(childKey => {
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
    this._updateVisualState();

    if (this.onAllocate) {
      this.onAllocate(key, node._level, -1);
    }
    return true;
  }

  // ─── Tooltip ──────────────────────────────────────────────
  _showTooltip(node) {
    const el = this.tooltipEl;
    if (!el) return;

    const level = node._level || 0;
    const costs = node._costs || [];
    const nextCost = level < node.maxLevel ? costs[level] : 0;
    const maxLv = node.maxLevel || 1;

    // Find stat value at current level
    let currentValue = '';
    if (node.levels && Array.isArray(node.levels)) {
      const values = [];
      for (let i = 0; i < level && i < node.levels.length; i++) {
        const v = node.levels[i].value;
        if (v != null) values.push(v);
      }
      if (values.length > 0) {
        currentValue = '+ ' + values.join('/');
      }
    }

    // Effect description (just stat name for now)
    const statDisplay = node.stat || '';

    el.innerHTML = `
      <div class="rune-tooltip-name">${node._displayName}</div>
      <div class="rune-tooltip-stat">${statDisplay}</div>
      ${currentValue ? `<div class="rune-tooltip-value">${currentValue}</div>` : ''}
      <div class="rune-tooltip-level">Level <strong>${level}</strong> / ${maxLv}</div>
      ${nextCost > 0
        ? `<div class="rune-tooltip-cost">Next level: <span class="gold">${this._formatGold(nextCost)}</span></div>`
        : level >= maxLv
          ? '<div class="rune-tooltip-max">MAX LEVEL</div>'
          : '<div class="rune-tooltip-free">First level: FREE</div>'}
      ${node._locked ? '<div class="rune-tooltip-locked">Requires parent node with 1+ level</div>' : ''}
      <div class="rune-tooltip-tip">Left-click: +1 · Right-click: -1</div>
    `;

    // Position relative to container
    const containerRect = this.container.getBoundingClientRect();
    const tw = el.offsetWidth || 200;
    const th = el.offsetHeight || 120;
    let tx = this.mouseX - containerRect.left + 15;
    let ty = this.mouseY - containerRect.top - 10;

    // Keep within container bounds
    const maxX = containerRect.width - tw - 10;
    const maxY = containerRect.height - th - 10;
    if (tx > maxX) tx = maxX;
    if (tx < 10) tx = 10;
    if (ty > maxY) ty = maxY;
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
  _formatGold(amount) {
    // costValue from wiki data is in gold (e.g. 5000 = 5,000 Gold)
    if (amount >= 1000) {
      return amount.toLocaleString() + ' Gold';
    }
    return amount + ' Gold';
  }

  // ─── Events ───────────────────────────────────────────────
  _bindEvents() {
    // --- Mouse down ---
    this.svg.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        // Right-click: deallocate
        const nodeEl = e.target.closest('.rune-node');
        if (nodeEl) {
          e.preventDefault();
          const key = nodeEl.dataset.key;
          this._deallocate(key);
          this.selectedKey = null;
          this._hideTooltip();
        }
        return;
      }

      if (e.button === 0) {
        // Left-click: check if we hit a node
        const nodeEl = e.target.closest('.rune-node');
        if (nodeEl) {
          const key = nodeEl.dataset.key;
          this._allocate(key);
          this.selectedKey = key;
          this._showTooltip(this.nodeMap[key]);
          return;
        }

        // Start drag (background hit)
        this.dragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.dragPan = { x: this.panX, y: this.panY };
        this.svg.style.cursor = 'grabbing';
      }
    });

    // --- Mouse move ---
    this.svg.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (this.dragging) {
        const dx = (e.clientX - this.dragStart.x) / this.scale;
        const dy = (e.clientY - this.dragStart.y) / this.scale;
        this.panX = this.dragPan.x + dx;
        this.panY = this.dragPan.y + dy;
        this._updateViewport();
        this._hideTooltip();
        return;
      }

      // Hover
      const nodeEl = e.target.closest('.rune-node');
      if (nodeEl) {
        this.svg.style.cursor = 'pointer';
        const key = nodeEl.dataset.key;
        if (this.hoveredKey !== key) {
          this.hoveredKey = key;
          this._showTooltip(this.nodeMap[key]);
        }
      } else {
        this.svg.style.cursor = 'grab';
        if (this.hoveredKey) {
          this.hoveredKey = null;
          this._hideTooltip();
        }
      }
    });

    // --- Mouse up / leave ---
    const endDrag = () => {
      this.dragging = false;
      this.svg.style.cursor = 'grab';
    };
    this.svg.addEventListener('mouseup', endDrag);
    this.svg.addEventListener('mouseleave', () => {
      endDrag();
      this._hideTooltip();
      this.hoveredKey = null;
    });

    // --- Wheel zoom toward cursor ---
    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cw = this.svg.clientWidth || rect.width;
      const ch = this.svg.clientHeight || rect.height;

      // Current world position under cursor
      const worldX = (mx - cw / 2) / this.scale - this.panX;
      const worldY = (my - ch / 2) / this.scale - this.panY;

      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta * this.scale));
      this.scale = newScale;

      // Keep world position under cursor after zoom
      this.panX = (mx - cw / 2) / this.scale - worldX;
      this.panY = (my - ch / 2) / this.scale - worldY;

      this._updateViewport();
    }, { passive: false });

    // --- Context menu prevention ---
    this.svg.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- Keyboard: R to reset ---
    this._boundKeydown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        if (document.activeElement === this.svg || document.activeElement === document.body) {
          this.reset();
        }
      }
    };
    document.addEventListener('keydown', this._boundKeydown);
  }

  // ─── Cleanup ──────────────────────────────────────────────
  destroy() {
    if (this._boundKeydown) {
      document.removeEventListener('keydown', this._boundKeydown);
      this._boundKeydown = null;
    }
    this._hideTooltip();
  }
}

// Export for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RuneTree };
}
