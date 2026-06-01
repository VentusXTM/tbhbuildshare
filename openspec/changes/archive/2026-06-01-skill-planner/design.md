# Design: Skill + Rune Planner

## Technical Approach

The app becomes two subsystems sharing a common shell: the **Skill Planner** (existing, cleaned up) and the **Rune Tree** (new, Canvas-based). Tab-based navigation within `index.html` switches between them. Rune data is account-wide, stored separately from per-hero builds. The rune tree renders 197 pre-positioned nodes on a `<canvas>` with pan/zoom, loading coordinates directly from `rune_tree.json`.

## Architecture Decisions

### Decision: Tab Navigation vs. Separate Page

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Separate page (`runes.html`) | Clean URL, but duplicates header/nav boilerplate | ❌ Rejected |
| **Tabs within index.html** | Zero new HTML pages, keeps SPA feel, tab state via URL hash | ✅ **Chosen** |
| Sub-nav under Planner | Could confuse "Planner" vs "Runes" identity | ❌ |

**Rationale**: The app is already a single-page class. Adding a third HTML page adds routing boilerplate and breaks the instant-switching feel. Tabs use existing patterns (no framework needed). Tab state stored as `#tab=skills|runes` in the URL hash alongside existing `#build=...`.

### Decision: Canvas vs. SVG Renderer

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Canvas** | Single draw surface, fast for 197 nodes + 195 edges, explicit hit-testing | ✅ **Chosen** |
| SVG | 390+ DOM nodes, pan/zoom requires CSS transforms, slower at this scale | ❌ Rejected |

**Rationale**: Canvas gives full control over the render loop, trivial pan/zoom via transform offsets, and handles 197 nodes without DOM overhead. The `rune_tree.json` provides exact x,y coordinates — Canvas maps them directly.

### Decision: Account-Wide vs. Per-Build Rune Allocations

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Account-wide** | One tree state shared across all builds, stored separately | ✅ **Chosen** |
| Per-build | Each hero build has its own tree, more complex save/share | ❌ Rejected |

**Rationale**: Runes are a global progression system in TBH — unlocking a rune benefits all heroes. Per-build would require copying tree state and create confusion ("why does this build have different runes?"). Stored under `localStorage` key `tbh_rune_allocations`.

### Decision: Static JSON Files vs. Inlining

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Static JSON in `/data/`** | Two extra HTTP requests, but clean separation | ✅ **Chosen** |
| Inline in data.js | Bloats data.js by ~200KB (197 nodes + 663 levels) | ❌ Rejected |

**Rationale**: `runes.json` and `rune_tree.json` are large structured datasets. Embedding them in `data.js` would make the file unmanageable. Fetched at app init with a loading spinner.

### Decision: Separate Module vs. Monolithic app.js

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **`rune-tree.js`** as a standalone class | Clean separation, testable in isolation | ✅ **Chosen** |
| Add rune code to app.js | app.js grows from 814 to ~1300 lines | ❌ Rejected |

**Rationale**: The rune tree renderer is a complex subsystem (canvas, pan/zoom, hit-testing, animations). Keeping it in its own file follows the existing pattern (data.js is separate) and keeps each file focused.

## Data Flow

```
                    ┌─────────────────┐
                    │   index.html    │
                    │  (tab shell)    │
                    └──┬──────────┬───┘
          ┌────────────┘          └────────────┐
          ▼                                    ▼
┌──────────────────┐              ┌──────────────────────┐
│  Skill Planner   │              │    Rune Tree Tab     │
│  (app.js,        │              │  (rune-tree.js,      │
│   existing)      │              │   canvas element)    │
└────────┬─────────┘              └──────────┬───────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────┐              ┌──────────────────────┐
│  tbh_builds      │              │  tbh_rune_allocations│
│  tbh_current_build│             │  (localStorage)      │
│  (localStorage)  │              │                      │
└──────────────────┘              └──────────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────┐              ┌──────────────────────┐
│  Share URL       │              │  Share URL           │
│  #build=...      │              │  #rune=...           │
└──────────────────┘              └──────────────────────┘

Data sources:
  /data/runes.json       → rune definitions (id, name, statBonus, maxLevel)
  /data/rune_tree.json   → tree layout (nodes with x,y, edges)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `data/runes.json` | **Create** | 197 rune definitions from wiki data |
| `data/rune_tree.json` | **Create** | 197 nodes with x,y coordinates, 663 levels, gold costs, edge connections |
| `rune-tree.js` | **Create** | `RuneTree` class — canvas renderer, pan/zoom, click allocation, tooltips |
| `data.js` | **Modify** | Remove `PETS`, `RARITIES`, all gear constants. Fix `bestStats` per hero (drop non-base stats) |
| `app.js` | **Modify** | Remove `renderGear()`, `renderPets()`, gear/pet from build model, gear/pet event handlers, pet from build cards. Add tab switching, rune allocation load/save/encode in share URL |
| `index.html` | **Modify** | Remove `#gear-grid`, pet panel. Replace right panel column with tab nav. Add `<canvas id="rune-canvas">` + tooltip div. Load `rune-tree.js` |
| `styles.css` | **Modify** | Remove gear/pet styles. Add tab nav styles, canvas container, rune tooltip styles |
| `browse.html` | **Modify** | Remove pet rendering from build cards |

## Interfaces / Contracts

```js
// Rune allocation data structure (localStorage + share URL)
// Stored under localStorage key "tbh_rune_allocations"
// Encoded in share URL as #rune=<base64>
{ "runeKey1": 3, "runeKey2": 1, "runeKeyN": 0 }

// Expected shape of rune_tree.json node
{
  "id": "rune_001",
  "name": "Attack Power",
  "key": "attack-power",
  "x": 450,       // canvas X coordinate
  "y": 120,       // canvas Y coordinate
  "maxLevel": 5,
  "costs": [0, 10000, 25000, 50000, 100000, 200000], // gold per level
  "statBonus": "attackDamage",
  "statPerLevel": 2,
  "connections": ["rune_002", "rune_003"]  // edge targets
}

// RuneTree class public API
class RuneTree {
  constructor(canvasEl, tooltipEl, onAllocate)  // init with DOM refs + callback
  load(data, allocations)                        // load JSON + current allocs
  render()                                       // full redraw
  reset()                                        // clear all allocations
  getAllocations()                               // returns { key: level }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Rune tree canvas rendering | Manual — open in browser, verify 197 nodes render at correct positions |
| Interaction | Click allocate/deallocate, pan/zoom | Manual — browser test with mouse events |
| Persistence | Save/load rune allocs to localStorage | Manual — allocate, refresh, verify state preserved |
| Share URL | Encode/decode rune allocs in #rune= | Manual — generate link, open in new tab, verify loaded |
| Regression | Skill planner still works without gear/pet | Manual — verify hero select, skill tree, active skills, stats, save/load still function |

## Migration / Rollout

- Existing localStorage `tbh_builds` entries with `gear` and `pet` fields continue loading — fields are silently dropped by the updated `getDefaultBuild()` spread
- Existing `tbh_current_build` with gear/pet — same silent-drop behavior
- No `tbh_rune_allocations` key = empty tree (zero allocation)
- No migration script needed; backward compatibility is implicit

## Open Questions

- None — all decisions resolved in the proposal phase.

## Implementation Order

1. **Cleanup** — Remove gear/pet from `data.js`, `app.js`, `index.html`, `styles.css`, `browse.html`. Fix `bestStats`. (Low risk, unblocks everything)
2. **Data** — Add `data/runes.json` and `data/rune_tree.json`. (No code dependency)
3. **Rune tree module** — Create `rune-tree.js` with Canvas renderer, pan/zoom, node interaction, tooltips. (Core new feature)
4. **Navigation** — Add tab system to `index.html`, wire app.js to show/hide skill vs. rune sections. (Depends on cleanup + rune-tree.js)
5. **Persistence** — Add `tbh_rune_allocations` save/load to app.js, add `#rune=...` share URL encoding. (Depends on tab nav)
6. **Polish** — Rune tree styles, loading states, responsive adjustments.
