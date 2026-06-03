// ============================================================
// TBH Build Share — Market Item Browser
// ============================================================
// Progressive-rendering grid of Steam Market items (3451 items).
// Filters by type / rarity, sorts by level / name, debounced
// search. Uses rAF (200/frame) + IntersectionObserver for
// scroll-to-load.
// ============================================================

/* ─── Rarity hex → label map (base) ──────────────────────────
   Extended dynamically from fetched data; unknown hex codes get
   label "Unknown" so the filter dropdown stays honest.       */
const RARITY_MAP_BASE = {
  'D7D7D7': 'Common',
  '7CE937': 'Uncommon',
  '519FFF': 'Rare',
  'E8695A': 'Epic',
  'EBBB00': 'Legendary',
  'FB86FF': 'Cosmic',
  'FF0080': 'Cosmic',
  '00F6FF': 'Cosmic',
  'FC00FF': 'Cosmic',
  'F6E7A2': 'Divine'
};

class MarketBrowser {

  // ─── Constructor ──────────────────────────────────────────
  constructor(containerEl, onError) {
    this.container = containerEl;         // #tab-market
    this.onError = onError || null;       // optional error callback

    // Data
    this.items = [];                      // all items from JSON
    this.rarityMap = {};                  // hex → label (extended)
    this.typeOptions = [];                // unique type values for dropdown
    this.rarityOptions = [];              // unique rarity labels for dropdown

    // Render state
    this.batchIndex = 0;                  // next item index to render
    this.renderQueue = [];                // filtered + sorted items to display
    this.rAFId = null;                    // current requestAnimationFrame id
    this.observer = null;                 // IntersectionObserver
    this.sentinel = null;                 // sentinel div at grid bottom
    this.gridEl = null;                   // .market-grid element
    this.filtersEl = null;                // .market-filters element
    this.emptyEl = null;                  // .market-empty element

    // Filter / sort / search state
    this.filterType = 'all';              // selected type
    this.filterRarity = 'all';            // selected rarity (label)
    this.sortBy = 'name';                 // 'name' | 'level'
    this.sortDir = 'asc';                 // 'asc' | 'desc'
    this.searchQuery = '';                // raw search input value

    // Fetched flag
    this._fetched = false;

    // Debounce timer for search
    this._searchTimer = null;

    // Bind delegated events
    this._boundChange = this._onChange.bind(this);
    this._boundInput = this._onInput.bind(this);
    this._boundClick = this._onClick.bind(this);
    document.addEventListener('change', this._boundChange);
    document.addEventListener('input', this._boundInput);
    document.addEventListener('click', this._boundClick);
  }

  // ─── Fetch Data ───────────────────────────────────────────
  fetch() {
    if (this._fetched) return Promise.resolve(this.items);
    this._fetched = true;

    return fetch('data/items.json')
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        this.items = data;
        this._buildRarityMap(data);
        this._extractTypeOptions(data);
        this.render();
      })
      .catch(err => {
        console.error('MarketBrowser fetch error:', err);
        if (this.onError) this.onError(err);
        this._fetched = false;
      });
  }

  // ─── Build Rarity Map (hex → label) ───────────────────────
  _buildRarityMap(items) {
    const seen = new Set(Object.keys(RARITY_MAP_BASE));
    const map = { ...RARITY_MAP_BASE };

    for (const item of items) {
      if (item.name_color && !seen.has(item.name_color)) {
        seen.add(item.name_color);
        map[item.name_color] = 'Unknown';
      }
    }

    this.rarityMap = map;

    // Build unique label list for dropdown
    const labels = new Set(Object.values(map));
    this.rarityOptions = ['all', ...Array.from(labels).sort()];
  }

  // ─── Extract Unique Type Values ───────────────────────────
  _extractTypeOptions(items) {
    const types = new Set();
    for (const item of items) {
      if (item.type) types.add(item.type);
    }
    this.typeOptions = ['all', ...Array.from(types).sort()];
  }

  // ─── Render Filter Bar (top of container) ─────────────────
  _renderFilterBar() {
    // Remove existing filter bar
    const old = this.container.querySelector('.market-filters');
    if (old) old.remove();

    const bar = document.createElement('div');
    bar.className = 'market-filters';

    // Type dropdown
    const typeSelect = document.createElement('select');
    typeSelect.className = 'market-filter-type';
    typeSelect.setAttribute('data-filter', 'type');
    this.typeOptions.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t === 'all' ? 'All Types' : t;
      if (t === this.filterType) opt.selected = true;
      typeSelect.appendChild(opt);
    });

    // Rarity dropdown
    const raritySelect = document.createElement('select');
    raritySelect.className = 'market-filter-rarity';
    raritySelect.setAttribute('data-filter', 'rarity');
    this.rarityOptions.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r === 'all' ? 'All Rarities' : r;
      if (r === this.filterRarity) opt.selected = true;
      raritySelect.appendChild(opt);
    });

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'market-filter-search';
    searchInput.placeholder = 'Search items...';
    searchInput.value = this.searchQuery;

    // Sort select
    const sortSelect = document.createElement('select');
    sortSelect.className = 'market-filter-sort';
    sortSelect.setAttribute('data-filter', 'sort');
    const sortOptions = [
      { value: 'name-asc', label: 'Name ↑' },
      { value: 'name-desc', label: 'Name ↓' },
      { value: 'level-asc', label: 'Level ↑' },
      { value: 'level-desc', label: 'Level ↓' }
    ];
    const currentSort = this.sortBy + '-' + this.sortDir;
    sortOptions.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      if (o.value === currentSort) opt.selected = true;
      sortSelect.appendChild(opt);
    });

    bar.appendChild(typeSelect);
    bar.appendChild(raritySelect);
    bar.appendChild(searchInput);
    bar.appendChild(sortSelect);
    this.container.insertBefore(bar, this.container.firstChild);
    this.filtersEl = bar;
  }

  // ─── Render Grid Container ────────────────────────────────
  _renderGrid() {
    const old = this.container.querySelector('.market-grid');
    if (old) old.remove();

    const grid = document.createElement('div');
    grid.className = 'market-grid';
    this.container.appendChild(grid);
    this.gridEl = grid;
  }

  // ─── Create Sentinel (for IntersectionObserver) ───────────
  _createSentinel() {
    const old = this.container.querySelector('.market-sentinel');
    if (old) old.remove();

    const el = document.createElement('div');
    el.className = 'market-sentinel';
    el.style.height = '1px';
    this.container.appendChild(el);
    this.sentinel = el;
  }

  // ─── Init IntersectionObserver ────────────────────────────
  _initObserver() {
    if (this.observer) this.observer.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && this.renderQueue.length > 0) {
          this._scheduleBatch();
        }
      }
    }, { rootMargin: '200px' });

    if (this.sentinel) {
      this.observer.observe(this.sentinel);
    }
  }

  // ─── Render Entry Point ───────────────────────────────────
  render() {
    if (!this.container) return;
    if (this.items.length === 0) return;

    // Build the render queue from current filter + sort
    this._applyFiltersToQueue();
    this._applySortToQueue();

    // Wipe container (preserve filter bar if already rendered)
    const existingGrid = this.container.querySelector('.market-grid');
    const existingSentinel = this.container.querySelector('.market-sentinel');
    if (existingGrid) existingGrid.remove();
    if (existingSentinel) existingSentinel.remove();

    // Render filter bar (only once, on first render)
    if (!this.filtersEl) {
      this._renderFilterBar();
    }

    // Empty state
    const existingEmpty = this.container.querySelector('.market-empty');
    if (existingEmpty) existingEmpty.remove();

    if (this.renderQueue.length === 0) {
      this._showEmpty();
      return;
    }

    // Create grid + sentinel
    this._renderGrid();
    this._createSentinel();
    this._initObserver();

    // Start progressive render
    this.batchIndex = 0;
    this._scheduleBatch();
  }

  // ─── Progressive Batch Render (rAF, 200/frame) ────────────
  _scheduleBatch() {
    if (this.rAFId) {
      cancelAnimationFrame(this.rAFId);
      this.rAFId = null;
    }
    this.rAFId = requestAnimationFrame(() => {
      this._renderBatch();
    });
  }

  _renderBatch() {
    if (!this.gridEl) return;

    const fragment = document.createDocumentFragment();
    const end = Math.min(this.batchIndex + 200, this.renderQueue.length);

    for (let i = this.batchIndex; i < end; i++) {
      const item = this.renderQueue[i];
      const card = this._renderCard(item);
      fragment.appendChild(card);
    }

    this.gridEl.appendChild(fragment);
    this.batchIndex = end;

    // If more items remain, schedule next batch
    if (this.batchIndex < this.renderQueue.length) {
      this._scheduleBatch();
    }
  }

  // ─── Render Single Card ───────────────────────────────────
  _renderCard(item) {
    const card = document.createElement('div');
    card.className = 'market-card';

    // Image
    const img = document.createElement('img');
    img.className = 'market-card-img';
    img.src = item.large_image || '';
    img.alt = item.name || '';
    img.loading = 'lazy';
    img.onerror = function () {
      this.style.display = 'none';
    };
    card.appendChild(img);

    // Info block
    const info = document.createElement('div');
    info.className = 'market-card-info';

    // Name (rarity-colored)
    const nameEl = document.createElement('div');
    nameEl.className = 'market-card-name';
    nameEl.textContent = item.name || 'Unknown';
    if (item.name_color) {
      nameEl.style.color = '#' + item.name_color;
    }
    info.appendChild(nameEl);

    // Type
    const typeEl = document.createElement('div');
    typeEl.className = 'market-card-type';
    typeEl.textContent = item.type || '';
    info.appendChild(typeEl);

    // Description (sanitized + truncated to 120 chars)
    if (item.description) {
      const descEl = document.createElement('div');
      descEl.className = 'market-card-desc';
      descEl.textContent = this._stripAndTruncate(item.description);
      info.appendChild(descEl);
    }

    card.appendChild(info);
    return card;
  }

  // ─── Strip HTML Entities and Truncate ─────────────────────
  _stripAndTruncate(html) {
    // Use a DOM parser to decode HTML entities safely
    const div = document.createElement('div');
    div.innerHTML = html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ');
    let text = div.textContent || div.innerText || '';
    // Final entity cleanup for any remaining escapes
    text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    // Collapse whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Truncate
    if (text.length > 120) {
      text = text.substring(0, 120) + '…';
    }

    return text;
  }

  // ─── Show Empty State ─────────────────────────────────────
  _showEmpty() {
    const el = document.createElement('div');
    el.className = 'market-empty';
    el.textContent = 'No items match your filters';
    this.container.appendChild(el);
    this.emptyEl = el;
  }

  // ─── Apply Filters to Queue ───────────────────────────────
  _applyFiltersToQueue() {
    this.renderQueue = this.items.filter(item => {
      // Type filter
      if (this.filterType !== 'all') {
        if (item.type !== this.filterType) return false;
      }
      // Rarity filter
      if (this.filterRarity !== 'all') {
        const label = this.rarityMap[item.name_color] || 'Unknown';
        if (label !== this.filterRarity) return false;
      }
      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const name = (item.name || '').toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }

  // ─── Apply Sort to Queue ──────────────────────────────────
  _applySortToQueue() {
    const dir = this.sortDir === 'asc' ? 1 : -1;

    this.renderQueue.sort((a, b) => {
      if (this.sortBy === 'name') {
        const na = (a.name || '').toLowerCase();
        const nb = (b.name || '').toLowerCase();
        return na.localeCompare(nb) * dir;
      }
      if (this.sortBy === 'level') {
        const la = this._extractLevel(a.type);
        const lb = this._extractLevel(b.type);
        return (la - lb) * dir;
      }
      return 0;
    });
  }

  // ─── Extract Level from Type Field ────────────────────────
  _extractLevel(typeStr) {
    if (!typeStr) return 0;
    const match = typeStr.match(/Lv\.?\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  // ─── Public: applyFilters ─────────────────────────────────
  applyFilters(type, rarity, query) {
    if (type !== undefined) this.filterType = type;
    if (rarity !== undefined) this.filterRarity = rarity;
    if (query !== undefined) this.searchQuery = query;
    this.reRenderGrid();
  }

  // ─── Public: applySort ────────────────────────────────────
  applySort(by, dir) {
    if (by !== undefined) this.sortBy = by;
    if (dir !== undefined) this.sortDir = dir;
    this.reRenderGrid();
  }

  // ─── Re-render Grid (wipe + re-apply filters/sort + rAF) ─
  reRenderGrid() {
    // Cancel pending rAF
    if (this.rAFId) {
      cancelAnimationFrame(this.rAFId);
      this.rAFId = null;
    }

    // Remove existing grid, sentinel, empty state
    const grid = this.container.querySelector('.market-grid');
    if (grid) grid.remove();
    const sentinel = this.container.querySelector('.market-sentinel');
    if (sentinel) sentinel.remove();
    const empty = this.container.querySelector('.market-empty');
    if (empty) empty.remove();

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Re-build queue and render
    this._applyFiltersToQueue();
    this._applySortToQueue();

    if (this.renderQueue.length === 0) {
      this._showEmpty();
      return;
    }

    this._renderGrid();
    this._createSentinel();
    this._initObserver();

    this.batchIndex = 0;
    this._scheduleBatch();
  }

  // ─── Destroy (cleanup) ────────────────────────────────────
  destroy() {
    // Cancel pending rAF
    if (this.rAFId) {
      cancelAnimationFrame(this.rAFId);
      this.rAFId = null;
    }

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Clear timers
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
      this._searchTimer = null;
    }

    // Remove event listeners
    document.removeEventListener('change', this._boundChange);
    document.removeEventListener('input', this._boundInput);
    document.removeEventListener('click', this._boundClick);

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }

    // Reset state
    this.batchIndex = 0;
    this.renderQueue = [];
    this.gridEl = null;
    this.sentinel = null;
    this.filtersEl = null;
    this.emptyEl = null;
    this._fetched = false;
  }

  // ═══════════════════════════════════════════════════════════
  //  Event Delegation (scoped to #tab-market)
  // ═══════════════════════════════════════════════════════════

  // ─── Change events (selects) ────────────────────────────
  _onChange(e) {
    const target = e.target;
    if (!target || !this.container) return;

    // Guard: only handle events inside #tab-market
    if (!target.closest('#tab-market')) return;

    const filter = target.dataset.filter;
    if (!filter) return;

    if (filter === 'type') {
      this.filterType = target.value;
      this.reRenderGrid();
    } else if (filter === 'rarity') {
      this.filterRarity = target.value;
      this.reRenderGrid();
    } else if (filter === 'sort') {
      const parts = target.value.split('-');
      this.sortBy = parts[0];
      this.sortDir = parts[1];
      this.reRenderGrid();
    }
  }

  // ─── Input events (search debounce) ─────────────────────
  _onInput(e) {
    const target = e.target;
    if (!target || !this.container) return;

    // Guard: only handle inside #tab-market
    if (!target.closest('#tab-market')) return;
    if (!target.classList.contains('market-filter-search')) return;

    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      this.searchQuery = target.value;
      this.reRenderGrid();
    }, 150);
  }

  // ─── Click events ─────────────────────────────────────
  _onClick(e) {
    const target = e.target;
    if (!target || !this.container) return;

    // Guard: only handle inside #tab-market
    if (!target.closest('#tab-market')) return;

    // Reserved for future card interactions
  }
}

// ─── Export for browser ───────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MarketBrowser };
}
