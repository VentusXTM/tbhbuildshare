# Tasks: Skill + Rune Planner

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2000 (code ~700 + data ~1300) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Cleanup) → PR 2 (Data + Rune Tree) → PR 3 (Integration) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Cleanup gear/pet/bestStats | PR 1 | ~212 lines, mostly deletions |
| 2 | Data files + rune-tree.js | PR 2 | ~1600 lines (1300 JSON static data) |
| 3 | Tabs + persistence + polish | PR 3 | ~195 lines, depends on PR 1+2 |

## Phase 1: Cleanup

- [ ] 1.1 `data.js` — Delete `PETS`, `RARITIES`, `GEAR_SLOTS`, `WEAPON_TYPES`, `OFFHAND_TYPES`, `ARMOR_TYPES`, `ACCESSORY_TYPES`
- [ ] 1.2 `data.js` — Fix `bestStats`: remove non-base-stats (dodgeChance, fireDamage, damageAbsorption, blockChance); verify remaining entries match highest per-hero values
- [ ] 1.3 `app.js` — Delete `renderPets()`, `renderGear()`, pet/gear event handlers, gear/pet from build model, gear/pet reset on hero switch, pet tag from saved build cards
- [ ] 1.4 `index.html` — Remove `#gear-grid`, `#pet-selector`, and their parent panel wrappers
- [ ] 1.5 `styles.css` — Remove gear styles (`.gear-grid`, `.gear-slot`, `.gear-placeholder`) and pet styles (`.pet-grid`, `.pet-card`)
- [ ] 1.6 `browse.html` — Remove pet rendering from build card `.build-tags`

## Phase 2: Data Files

- [ ] 2.1 `data/runes.json` — NEW: 197 rune definitions (id, name, key, maxLevel, costs[], statBonus, statPerLevel)
- [ ] 2.2 `data/rune_tree.json` — NEW: 197 nodes (x, y, connections[]; same fields as runes.json for merge)

## Phase 3: Rune Tree Module

- [ ] 3.1 `rune-tree.js` — NEW: `RuneTree` class with Canvas renderer (197 nodes at x,y coords, edges as lines, pan/zoom via drag/wheel, click allocate/deallocate, tooltip on hover with name/level/stat/gold). API: `load()`, `render()`, `reset()`, `getAllocations()`

## Phase 4: Tab Navigation

- [ ] 4.1 `index.html` — Add tab bar (`#tabs` with "Skill Planner" / "Rune Tree" buttons), wrap skill content in `#tab-skills`, add `#tab-runes` with `<canvas id="rune-canvas">` + tooltip div, load `rune-tree.js`
- [ ] 4.2 `app.js` — Add tab switching (show/hide panels on click, store in `#tab=` hash), init RuneTree instance, wire allocate callback

## Phase 5: Persistence

- [ ] 5.1 `app.js` — Save/load rune allocations to `localStorage` key `tbh_rune_allocations`, call on allocate and init
- [ ] 5.2 `app.js` — Add `#rune=...` share URL encoding (base64), decode on load, integrate with existing hash parsing

## Phase 6: Polish

- [ ] 6.1 `styles.css` — Add tab nav styles (`.tab-bar`, `.tab-btn`, `.tab-btn.active`), canvas container, rune tooltip, loading spinner
- [ ] 6.2 `app.js` — Loading state + error handling for JSON fetch (retry button on failure)
