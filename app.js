// ============================================================
// TBH Build Share — Application
// ============================================================

class TBHBuildPlanner {
  constructor() {
    this.build = this.getDefaultBuild();
    this.savedBuilds = this.loadSavedBuilds();
    this.availablePoints = 100;
    this.usedPoints = 0;
    this.maxLevel = 100;
    this.init();
  }

  // ─── Default Build ────────────────────────────────────────
  getDefaultBuild() {
    return {
      id: Date.now().toString(36),
      name: 'Mi Build',
      hero: 'knight',
      level: 100,
      skillPoints: {},   // { skillId: level }
      equippedSkills: [], // skill IDs
      gear: {
        weapon: null,
        offhand: null,
        armor: null,
        accessory: null
      },
      pet: null,
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  // ─── Init ─────────────────────────────────────────────────
  init() {
    this.checkHash();
    this.render();
    this.bindEvents();
  }

  // ─── Render ───────────────────────────────────────────────
  render() {
    this.renderHeroSelector();
    this.renderBuildInfo();
    this.renderSkillTree();
    this.renderActiveSkills();
    this.renderPets();
    this.renderGear();
    this.renderStats();
    this.renderActions();
    this.renderSavedBuilds();
  }

  // ─── Hero Selector ────────────────────────────────────────
  renderHeroSelector() {
    const el = document.getElementById('hero-selector');
    if (!el) return;
    el.innerHTML = Object.values(TBH.HEROES).map(h => `
      <div class="hero-card ${this.build.hero === h.id ? 'active' : ''}"
           data-hero="${h.id}">
        <img src="${h.icon}" alt="${h.name}" loading="lazy"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect width=%2264%22 height=%2264%22 fill=%22%23161e28%22/><text x=%2232%22 y=%2236%22 text-anchor=%22middle%22 font-size=%2228%22 fill=%22%238899aa%22>${h.name[0]}</text></svg>'">
        <div class="hero-name">${h.name}</div>
        <div class="hero-class">${h.class}</div>
        ${h.cost > 0 ? `<div class="hero-cost">🪙 ${h.cost} Gold</div>` : '<div class="hero-cost" style="color:var(--success)">✓ Starter</div>'}
      </div>
    `).join('');
  }

  // ─── Build Info ───────────────────────────────────────────
  renderBuildInfo() {
    const el = document.getElementById('build-name');
    if (el) el.value = this.build.name;

    const levelEl = document.getElementById('hero-level');
    const levelDisp = document.getElementById('level-display');
    if (levelEl) levelEl.value = this.build.level;
    if (levelDisp) levelDisp.textContent = this.build.level;
  }

  // ─── Skill Tree ───────────────────────────────────────────
  renderSkillTree() {
    const el = document.getElementById('skill-tree');
    if (!el) return;

    this.calcUsedPoints();
    const available = this.availablePoints - this.usedPoints;
    const hero = TBH.HEROES[this.build.hero];
    if (!hero) return;

    // Points bar
    const pct = Math.min((this.usedPoints / this.availablePoints) * 100, 100);
    el.innerHTML = `
      <div class="points-bar">
        <span class="bar-label">Skill Points: <strong>${this.usedPoints}</strong> / ${this.availablePoints}</span>
        <div class="bar-track">
          <div class="bar-fill ${this.usedPoints > this.availablePoints ? 'over' : ''}" style="width:${pct}%"></div>
        </div>
        <span class="bar-label" style="color:var(--text-muted)">${available >= 0 ? available + ' left' : Math.abs(available) + ' over'}</span>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-sm btn-outline" data-action="max-out">MAX OUT</button>
        <button class="btn btn-sm btn-danger" data-action="reset-tree">RESET</button>
      </div>
    `;

    // Build tiers
    const tiers = hero.tiers;
    tiers.forEach(tier => {
      const canUnlock = this.usedPoints >= tier.pointsRequired;
      const locked = !canUnlock;
      const tierEl = document.createElement('div');
      tierEl.className = `skill-tier ${locked ? 'locked' : 'unlocked'}`;

      const tierUsed = tier.skills
        .filter(s => s.type === 'passive')
        .reduce((sum, s) => sum + (this.build.skillPoints[s.id] || 0), 0);

      tierEl.innerHTML = `
        <div class="tier-header">
          <span>TIER ${tier.tier} — ${tier.pointsRequired > 0 ? tier.pointsRequired + ' points' : 'Start'}</span>
          <span class="tier-status ${canUnlock ? 'unlocked' : 'locked'}">
            ${canUnlock ? '✓ AVAILABLE' : tier.pointsRequired + ' pts needed'}
          </span>
        </div>
        ${tier.skills.map(s => this.renderSkillRow(s, locked)).join('')}
      `;

      el.appendChild(tierEl);
    });
  }

  renderSkillRow(skill, locked) {
    const level = this.build.skillPoints[skill.id] || 0;
    const isPassive = skill.type === 'passive';
    const iconPath = `https://www.taskbarhero.wiki/game/skills/${skill.icon}.png`;
    const dots = Array.from({ length: skill.maxLevel }, (_, i) =>
      `<span class="dot ${i < level ? (skill.type === 'active' ? 'filled active-skill' : 'filled') : ''}"></span>`
    ).join('');

    return `
      <div class="skill-row ${locked ? 'locked' : ''}">
        <div class="skill-icon ${skill.type}">
          <img src="${iconPath}" alt="${skill.name}" loading="lazy"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 fill=%22%23161e28%22/><text x=%2212%22 y=%2216%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22%238899aa%22>${skill.name[0]}</text></svg>'">
        </div>
        <div class="skill-info">
          <div class="skill-name">${skill.name}</div>
          <div class="skill-meta">
            ${isPassive ? 'Passive' : `${skill.activation} · ${skill.element} · ${skill.range}r`}
            · max Lv${skill.maxLevel}
          </div>
        </div>
        <div class="skill-levels">
          <button class="dec-skill" data-skill="${skill.id}" ${locked || level <= 0 ? 'disabled' : ''}>−</button>
          <div class="level-dots">${dots}</div>
          <button class="inc-skill" data-skill="${skill.id}" ${locked || level >= skill.maxLevel || this.usedPoints >= this.availablePoints ? 'disabled' : ''}>+</button>
        </div>
      </div>
    `;
  }

  // ─── Active Skills Panel ──────────────────────────────────
  renderActiveSkills() {
    const el = document.getElementById('active-skills');
    if (!el) return;

    const heroSkills = TBH.getSkillsForHero(this.build.hero);
    const slots = TBH.SKILL_SLOTS[this.build.hero] || 4;

    if (heroSkills.length === 0) {
      el.innerHTML = '<div class="no-skills-msg">No active skills for this hero.</div>';
      return;
    }

    el.innerHTML = `
      <div style="margin-bottom:8px;font-size:12px;color:var(--text-muted)">
        Equip up to ${slots} active skills · ${this.build.equippedSkills.length}/${slots} used
      </div>
      ${heroSkills.map(s => {
        const equipped = this.build.equippedSkills.includes(s.id);
        const canEquip = this.build.equippedSkills.length < slots || equipped;
        const level = this.build.skillPoints[s.id] || 0;
        const iconPath = `https://www.taskbarhero.wiki/game/skills/${s.icon}.png`;
        return `
          <div class="active-skill-select ${equipped ? 'equipped' : ''}">
            <input type="checkbox" class="skill-check" data-skill="${s.id}"
                   ${equipped ? 'checked' : ''}
                   ${!equipped && !canEquip ? 'disabled' : ''}>
            <div style="width:24px;height:24px;flex-shrink:0;border-radius:4px;overflow:hidden;background:var(--bg-primary)">
              <img src="${iconPath}" width="24" height="24" alt="" loading="lazy"
                   onerror="this.style.display='none'">
            </div>
            <div class="skill-info">
              <span class="skill-name">${s.name}</span>
              <span class="skill-meta">${s.activation} · ${s.element} · Lv.${level}</span>
            </div>
            <span class="slot-indicator">${s.element}</span>
          </div>
        `;
      }).join('')}
    `;
  }

  // ─── Pets ─────────────────────────────────────────────────
  renderPets() {
    const el = document.getElementById('pet-selector');
    if (!el) return;

    el.innerHTML = TBH.PETS.map(p => `
      <div class="pet-card ${this.build.pet === p.id ? 'selected' : ''}" data-pet="${p.id}">
        <img src="${p.icon}" alt="${p.name}" loading="lazy"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect width=%2240%22 height=%2240%22 fill=%22%23161e28%22/><text x=%2220%22 y=%2224%22 text-anchor=%22middle%22 font-size=%2216%22 fill=%22%238899aa%22>${p.name[0]}</text></svg>'">
        <div class="pet-name">${p.name}</div>
        <div class="pet-bonus">${p.bonuses[0]}</div>
      </div>
    `).join('');
  }

  // ─── Gear ─────────────────────────────────────────────────
  renderGear() {
    const el = document.getElementById('gear-grid');
    if (!el) return;

    const hero = TBH.HEROES[this.build.hero];
    const rarities = TBH.RARITIES;

    const gearOptions = (slot, type) => {
      const current = this.build.gear[slot];
      return `<select data-gear-slot="${slot}">
        <option value="">— Empty —</option>
        ${rarities.map(r => {
          const val = `${r}/${type}`;
          return `<option value="${val}" ${current === val ? 'selected' : ''}>${r} ${type}</option>`;
        }).join('')}
      </select>`;
    };

    el.innerHTML = `
      <div class="gear-slot">
        <label>Weapon (${hero.mainWeapon})</label>
        ${gearOptions('weapon', hero.mainWeapon)}
      </div>
      <div class="gear-slot">
        <label>Off-hand (${hero.offHand})</label>
        ${gearOptions('offhand', hero.offHand)}
      </div>
      <div class="gear-slot">
        <label>Armor</label>
        ${gearOptions('armor', 'Armor')}
      </div>
      <div class="gear-slot">
        <label>Accessory</label>
        ${gearOptions('accessory', 'Accessory')}
      </div>
    `;
  }

  // ─── Stats ────────────────────────────────────────────────
  renderStats() {
    const el = document.getElementById('build-stats');
    if (!el) return;

    const hero = TBH.HEROES[this.build.hero];
    const s = hero.stats;
    const isBest = (stat) => hero.bestStats.includes(stat);

    el.innerHTML = `
      <div class="stat-item">
        <div class="stat-label">DPS</div>
        <div class="stat-value">${s.dps.toFixed(2)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">HP</div>
        <div class="stat-value ${isBest('maxHp') ? 'best' : 'good'}">${s.maxHp}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">ATK</div>
        <div class="stat-value ${isBest('attackDamage') ? 'best' : ''}">${s.attackDamage}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">ARM</div>
        <div class="stat-value ${isBest('armor') ? 'best' : 'good'}">${s.armor}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">ASPD</div>
        <div class="stat-value ${isBest('attackSpeed') ? 'best' : ''}">${s.attackSpeed}/s</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Crit</div>
        <div class="stat-value ${isBest('critChance') ? 'best' : ''}">${s.critChance}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Crit Dmg</div>
        <div class="stat-value ${isBest('critDamage') ? 'best' : ''}">${s.critDamage}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Move Spd</div>
        <div class="stat-value ${isBest('moveSpeed') ? 'best' : ''}">${s.moveSpeed}</div>
      </div>
    `;
  }

  // ─── Actions ──────────────────────────────────────────────
  renderActions() {
    // Already in HTML, events bound below
  }

  // ─── Saved Builds ─────────────────────────────────────────
  renderSavedBuilds() {
    const el = document.getElementById('saved-builds');
    if (!el) return;

    const builds = this.savedBuilds;
    if (builds.length === 0) {
      el.innerHTML = '<div class="empty-state"><h3>No saved builds</h3><p>Create your first build above and save it!</p></div>';
      return;
    }

    el.innerHTML = builds.map(b => {
      const hero = TBH.HEROES[b.hero];
      const skills = b.equippedSkills || [];
      const skillNames = skills.slice(0, 3).map(id => {
        const s = TBH.ACTIVE_SKILLS.find(a => a.id === id);
        return s ? s.name : null;
      }).filter(Boolean);
      const elements = skills.map(id => {
        const s = TBH.ACTIVE_SKILLS.find(a => a.id === id);
        return s ? s.element : null;
      }).filter((v, i, a) => v && a.indexOf(v) === i);
      const points = Object.values(b.skillPoints).reduce((a, b) => a + b, 0);

      return `
        <div class="build-card" data-build-id="${b.id}">
          <div class="build-header">
            <img src="${hero ? hero.icon : ''}" alt="${hero ? hero.name : '?'}"
                 onerror="this.style.display='none'">
            <div>
              <div class="build-title">${this.escHtml(b.name)}</div>
              <div class="build-hero">${hero ? hero.name : 'Unknown'} · Lv.${b.level} · ${points} pts</div>
            </div>
          </div>
          <div class="build-tags">
            ${elements.map(e => `<span class="element-${e}">${e}</span>`).join('')}
            ${b.pet ? `<span>🐾 ${TBH.PETS.find(p => p.id === b.pet)?.name || b.pet}</span>` : ''}
          </div>
          <div class="build-stats-line">
            <span>⚔ ${skillNames.slice(0, 3).join(', ') || 'No skills'}</span>
          </div>
          <div class="build-actions">
            <button class="btn btn-sm btn-primary load-build" data-build-id="${b.id}">Load</button>
            <button class="btn btn-sm btn-outline share-build" data-build-id="${b.id}">Share</button>
            <button class="btn btn-sm btn-danger delete-build" data-build-id="${b.id}">Del</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // ─── Events ───────────────────────────────────────────────
  bindEvents() {
    document.addEventListener('click', (e) => {
      // Hero selector
      const heroCard = e.target.closest('.hero-card');
      if (heroCard) {
        const hero = heroCard.dataset.hero;
        if (hero && hero !== this.build.hero) {
          this.build.hero = hero;
          this.build.skillPoints = {};
          this.build.equippedSkills = [];
          this.build.gear = { weapon: null, offhand: null, armor: null, accessory: null };
          this.build.pet = null;
          this.build.updatedAt = Date.now();
          this.saveToLocal();
          this.render();
        }
        return;
      }

      // Pet selector
      const petCard = e.target.closest('.pet-card');
      if (petCard) {
        const pet = petCard.dataset.pet;
        this.build.pet = this.build.pet === pet ? null : pet;
        this.build.updatedAt = Date.now();
        this.renderPets();
        return;
      }

      // Skill increment
      if (e.target.closest('.inc-skill')) {
        const btn = e.target.closest('.inc-skill');
        const skillId = btn.dataset.skill;
        const hero = TBH.HEROES[this.build.hero];
        let maxLv = 0;
        for (const tier of hero.tiers) {
          for (const s of tier.skills) {
            if (s.id === skillId) { maxLv = s.maxLevel; break; }
          }
        }
        const current = this.build.skillPoints[skillId] || 0;
        if (current < maxLv) {
          this.build.skillPoints[skillId] = current + 1;
          this.build.updatedAt = Date.now();
          this.saveToLocal();
          this.render();
        }
        return;
      }

      // Skill decrement
      if (e.target.closest('.dec-skill')) {
        const btn = e.target.closest('.dec-skill');
        const skillId = btn.dataset.skill;
        const current = this.build.skillPoints[skillId] || 0;
        if (current > 0) {
          this.build.skillPoints[skillId] = current - 1;
          if (this.build.skillPoints[skillId] <= 0) delete this.build.skillPoints[skillId];
          this.build.updatedAt = Date.now();
          this.saveToLocal();
          this.render();
        }
        return;
      }

      // Max out
      if (e.target.closest('[data-action="max-out"]')) {
        this.maxOutTree();
        return;
      }

      // Reset tree
      if (e.target.closest('[data-action="reset-tree"]')) {
        if (confirm('Reset all skill points?')) {
          this.build.skillPoints = {};
          this.build.equippedSkills = [];
          this.build.updatedAt = Date.now();
          this.saveToLocal();
          this.render();
        }
        return;
      }

      // Save build
      if (e.target.closest('[data-action="save-build"]')) {
        this.saveBuild();
        return;
      }

      // Share build
      if (e.target.closest('[data-action="share-build"]')) {
        this.shareCurrentBuild();
        return;
      }

      // Export build
      if (e.target.closest('[data-action="export-build"]')) {
        this.exportBuild();
        return;
      }

      // Import build
      if (e.target.closest('[data-action="import-build"]')) {
        this.showImportDialog();
        return;
      }

      // Load build from saved
      if (e.target.closest('.load-build')) {
        const id = e.target.closest('.load-build').dataset.buildId;
        this.loadBuild(id);
        return;
      }

      // Share saved build
      if (e.target.closest('.share-build')) {
        const id = e.target.closest('.share-build').dataset.buildId;
        const b = this.savedBuilds.find(x => x.id === id);
        if (b) this.shareBuild(b);
        return;
      }

      // Delete build
      if (e.target.closest('.delete-build')) {
        const id = e.target.closest('.delete-build').dataset.buildId;
        if (confirm('Delete this build?')) {
          this.deleteBuild(id);
        }
        return;
      }

      // Close modal
      if (e.target.closest('.modal-overlay') && !e.target.closest('.modal')) {
        this.closeModal();
      }
      if (e.target.closest('.close-modal')) {
        this.closeModal();
      }
    });

    // Change events
    document.addEventListener('change', (e) => {
      // Active skill checkbox
      if (e.target.closest('.skill-check')) {
        const cb = e.target.closest('.skill-check');
        const skillId = cb.dataset.skill;
        const slots = TBH.SKILL_SLOTS[this.build.hero] || 4;

        if (cb.checked) {
          if (this.build.equippedSkills.length >= slots) {
            cb.checked = false;
            this.showToast('Max ' + slots + ' active skills can be equipped', 'error');
            return;
          }
          if (!this.build.equippedSkills.includes(skillId)) {
            this.build.equippedSkills.push(skillId);
          }
        } else {
          this.build.equippedSkills = this.build.equippedSkills.filter(id => id !== skillId);
        }
        this.build.updatedAt = Date.now();
        this.saveToLocal();
        this.render();
        return;
      }

      // Gear select
      if (e.target.closest('[data-gear-slot]')) {
        const sel = e.target.closest('[data-gear-slot]');
        const slot = sel.dataset.gearSlot;
        this.build.gear[slot] = sel.value || null;
        this.build.updatedAt = Date.now();
        this.saveToLocal();
        return;
      }

      // Build name
      if (e.target.id === 'build-name') {
        this.build.name = e.target.value || 'Mi Build';
        this.build.updatedAt = Date.now();
        return;
      }

      // Level slider
      if (e.target.id === 'hero-level') {
        this.build.level = parseInt(e.target.value) || 100;
        this.availablePoints = this.build.level;
        document.getElementById('level-display').textContent = this.build.level;
        this.build.updatedAt = Date.now();
        this.saveToLocal();
        this.render();
        return;
      }

      // Modal import
      if (e.target.id === 'import-json') {
        // handled by button
      }
    });
  }

  // ─── Calc Points ──────────────────────────────────────────
  calcUsedPoints() {
    this.usedPoints = Object.values(this.build.skillPoints)
      .reduce((sum, v) => sum + v, 0);
    return this.usedPoints;
  }

  // ─── Max Out Tree ─────────────────────────────────────────
  maxOutTree() {
    const hero = TBH.HEROES[this.build.hero];
    if (!hero) return;

    this.build.skillPoints = {};
    let remaining = this.availablePoints;

    // Max passives first, from top tiers, but only what we can afford
    for (const tier of hero.tiers) {
      if (tier.pointsRequired > this.availablePoints) break;
      for (const skill of tier.skills) {
        if (remaining <= 0) break;
        const take = Math.min(skill.maxLevel, remaining);
        if (take > 0) {
          this.build.skillPoints[skill.id] = take;
          remaining -= take;
        }
      }
      if (remaining <= 0) break;
    }

    this.build.updatedAt = Date.now();
    this.saveToLocal();
    this.render();
  }

  // ─── Save / Load / Delete ─────────────────────────────────
  saveBuild() {
    const existing = this.savedBuilds.findIndex(b => b.id === this.build.id);
    this.build.updatedAt = Date.now();

    if (existing >= 0) {
      this.savedBuilds[existing] = { ...this.build };
    } else {
      this.build.id = Date.now().toString(36);
      this.savedBuilds.unshift({ ...this.build });
    }

    this.persistSavedBuilds();
    this.renderSavedBuilds();
    this.showToast('Build saved!', 'success');
  }

  loadBuild(id) {
    const b = this.savedBuilds.find(x => x.id === id);
    if (!b) {
      this.showToast('Build not found', 'error');
      return;
    }
    this.build = { ...b };
    this.availablePoints = b.level || 100;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showToast('Build loaded!', 'success');
  }

  deleteBuild(id) {
    this.savedBuilds = this.savedBuilds.filter(b => b.id !== id);
    this.persistSavedBuilds();
    this.renderSavedBuilds();
  }

  // ─── Share / Export / Import ──────────────────────────────
  shareCurrentBuild() {
    this.shareBuild(this.build);
  }

  shareBuild(build) {
    const json = JSON.stringify(build);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    const url = window.location.origin + window.location.pathname + '#build=' + encoded;
    this.showModal(
      'Share Build Link',
      `<p style="margin-bottom:12px;color:var(--text-secondary)">Copy this link to share your build:</p>
       <textarea readonly onclick="this.select()">${url}</textarea>
       <div style="margin-top:8px;display:flex;gap:8px">
         <button class="btn btn-sm btn-primary" onclick="navigator.clipboard.writeText('${url}').then(()=>{this.showToast('Link copied!','success')}).catch(()=>{})">Copy Link</button>
       </div>`
    );
  }

  exportBuild() {
    const json = JSON.stringify(this.build, null, 2);
    this.showModal(
      'Export Build (JSON)',
      `<textarea readonly onclick="this.select()">${this.escHtml(json)}</textarea>
       <div style="margin-top:8px;display:flex;gap:8px">
         <button class="btn btn-sm btn-primary" onclick="
           const b = new Blob([this.previousElementSibling.textContent], {type:'application/json'});
           const a = document.createElement('a');
           a.href = URL.createObjectURL(b);
           a.download = 'tbh-build.json';
           a.click();
         ">Download JSON</button>
         <button class="btn btn-sm btn-outline" onclick="
           navigator.clipboard.writeText(this.previousElementSibling.previousElementSibling.textContent);
           this.showToast('Copied!','success');
         ">Copy JSON</button>
       </div>`
    );
  }

  showImportDialog() {
    this.showModal(
      'Import Build',
      `<p style="margin-bottom:8px;color:var(--text-secondary)">Paste a build JSON or share link:</p>
       <textarea id="import-json" placeholder="Paste JSON or share URL here..."></textarea>
       <div style="margin-top:8px;display:flex;gap:8px">
         <button class="btn btn-sm btn-primary" onclick="planner.doImport()">Import</button>
       </div>`
    );
  }

  doImport() {
    const text = document.getElementById('import-json')?.value || '';
    try {
      // Try to extract from URL
      let json = text;
      if (text.includes('#build=')) {
        const encoded = text.split('#build=')[1].split('&')[0];
        json = decodeURIComponent(escape(atob(encoded)));
      }

      const build = JSON.parse(json);
      if (!build.hero || !build.skillPoints) {
        this.showToast('Invalid build data', 'error');
        return;
      }

      this.build = { ...this.getDefaultBuild(), ...build, id: Date.now().toString(36), updatedAt: Date.now() };
      this.availablePoints = this.build.level || 100;
      this.render();
      this.closeModal();
      this.showToast('Build imported!', 'success');
    } catch (e) {
      this.showToast('Failed to import: ' + e.message, 'error');
    }
  }

  // ─── Hash-based sharing ───────────────────────────────────
  checkHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#build=')) {
      try {
        const encoded = hash.split('#build=')[1].split('&')[0];
        const json = decodeURIComponent(escape(atob(encoded)));
        const build = JSON.parse(json);
        if (build.hero && build.skillPoints) {
          // Store in sessionStorage so we can load it
          sessionStorage.setItem('tbh_import', json);
          this.build = { ...this.getDefaultBuild(), ...build };
          this.availablePoints = this.build.level || 100;
          // Clear hash
          history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        // ignore invalid hash
      }
    }

    // Check sessionStorage for import
    const stored = sessionStorage.getItem('tbh_import');
    if (stored) {
      try {
        const build = JSON.parse(stored);
        if (build.hero && build.skillPoints) {
          this.build = { ...this.getDefaultBuild(), ...build };
          this.availablePoints = this.build.level || 100;
        }
      } catch (e) {}
      sessionStorage.removeItem('tbh_import');
    }
  }

  // ─── LocalStorage ─────────────────────────────────────────
  loadSavedBuilds() {
    try {
      const data = localStorage.getItem('tbh_builds');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  persistSavedBuilds() {
    try {
      localStorage.setItem('tbh_builds', JSON.stringify(this.savedBuilds));
    } catch {}
  }

  saveToLocal() {
    localStorage.setItem('tbh_current_build', JSON.stringify(this.build));
  }

  // ─── UI Helpers ───────────────────────────────────────────
  showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  showModal(title, content) {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h2>${title}</h2>
        ${content}
        <div class="modal-actions">
          <button class="btn btn-sm btn-outline close-modal">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  }

  escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// ─── Init ───────────────────────────────────────────────────
let planner;
document.addEventListener('DOMContentLoaded', () => {
  planner = new TBHBuildPlanner();
});
