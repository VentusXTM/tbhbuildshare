# Proposal: Skill + Rune Planner

**Change**: `skill-planner`
**Status**: Draft (updated)
**Based on**: `wiki-audit` exploration

---

## Intent

Convert TBH Build Share from a hybrid build planner (skills + broken gear) to a **pure skill + rune planner** focused on:
- Passive skill trees + active skills (already verified 100% correct)
- Rune tree (data available from wiki: 197 runes, 663 levels, tree layout)
- Hero base stats with correct bestStat markers

Remove all out-of-scope features with incorrect or non-functional data (gear, pets).

## Scope — IN

### Part A: Cleanup

1. **Remove gear system entirely**
   - `data.js`: delete `GEAR_SLOTS`, `ARMOR_TYPES`, `ACCESSORY_TYPES`, `WEAPON_TYPES`, `OFFHAND_TYPES`, `RARITIES`
   - `app.js`: delete `renderGear()`, gear event handler, gear from build model (`this.build.gear`)
   - `index.html`: remove `#gear-grid` element
   - `styles.css`: remove gear-related styles
   - Share URL: remove gear encoding/decoding
   - Saved builds: gear field silently ignored on load

2. **Remove pet system entirely**
   - `data.js`: delete `TBH.PETS` array
   - `app.js`: delete `renderPets()`, pet selector event handler, pet from build model (`this.build.pet`)
   - `index.html`: remove `#pet-selector` element
   - `styles.css`: remove pet-related styles
   - Share URL: remove pet encoding/decoding
   - Saved builds: pet field silently ignored on load

3. **Fix bestStats**
   - Recompute by comparing each hero's stat values across all 6 heroes
   - Mark as "best" only if that hero has the highest value for that stat
   - Remove non-base-stats: dodgeChance, fireDamage, damageAbsorption, blockChance

### Part B: Rune Planner (New Feature)

4. **Add rune data** — embed `runes.json` (197 runes) and `rune_tree.json` (197 nodes, 663 levels, tree layout) from the wiki. Either as static JSON files fetched at runtime or inlined. Both datasets are available and verified.

5. **Create rune tree UI** — a new interactive tree view showing the 197 rune nodes connected in a DAG. Uses the x,y coordinates from `rune_tree.json` for node positioning. Canvas or SVG-based renderer.

6. **Rune allocation system** — users can allocate points into the rune tree, tracking investment per node. Each node shows its current level, stat bonus, and total gold cost invested.

7. **Integrate with builds** — rune allocations are stored in the build object, saved to localStorage, and encoded in share URLs.

8. **Dual view navigation** — skill tree view (per-hero) and rune tree view (account-wide) accessible via tabs or navigation.

## Scope — OUT

- Gear simulator (needs 5760 items + 63 stat system)
- Pet system (cosmetic only)
- Skill slot expansion system
- Rune cost calculator / gold optimizer (could be future enhancement)

## What Stays

- 6 heroes with base stats
- Skill tree system (8 tiers, passives per hero)
- 36 active skills
- Level system (max 100, 1 point/level)
- Save/load builds to localStorage
- Share builds via URL hash
- Browse saved builds page

## Backward Compatibility

- Existing `localStorage` builds with `gear` and `pet` fields load without error (silently ignored)
- Share URLs with gear/pet data decode without error
- Existing builds without rune data get an empty rune allocation

## Affected Files

| File | Changes |
|------|---------|
| `data.js` | Remove `PETS`, `RARITIES`, `GEAR_SLOTS`, `ARMOR_TYPES`, `ACCESSORY_TYPES`, `WEAPON_TYPES`, `OFFHAND_TYPES` |
| `app.js` | Remove gear/pet code. Add rune tree renderer, rune event handlers, rune in build model, rune in share URL |
| `index.html` | Remove gear/pet HTML. Add rune tree container + tab navigation |
| `browse.html` | Remove pet from build card. Add rune info |
| `styles.css` | Remove gear/pet styles. Add rune tree styles |
| `runes.json` | NEW — 197 runes data from wiki |
| `rune_tree.json` | NEW — tree layout with 197 nodes, 663 levels, costs |

## Effort

- **Lines changed**: ~500-800 (200 deletions + 300-600 new for rune UI)
- **Complexity**: Medium-High (rune tree renderer is the hard part)
- **Risk**: Medium (rune tree UI is new, existing skill tree is untouched)

## Open Questions

1. **Data loading**: embed JSON files vs. fetch from wiki at runtime?
2. **Rune tree renderer**: Canvas (faster) vs. SVG (interactive elements)?
3. **Per-build vs. account-wide**: are rune allocations per build or shared across builds?
4. **Rune costs**: show total gold cost or simplify to points-based allocation?

## Next Phase

Proceed to **design** → **tasks** → **apply** (specs are straightforward after design decisions)
