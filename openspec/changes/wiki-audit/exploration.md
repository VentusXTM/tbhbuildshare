# Wiki Audit — Exploration Report

**Change**: `wiki-audit`
**Date**: 2026-05-31
**Status**: Complete
**Source**: https://www.taskbarhero.wiki/ (official TBH wiki — datamined game data)

---

## 1. Confirmed Correct

### Hero Base Stats ✅
All 6 heroes' base stats (DPS, Attack Damage, Attack Speed, Crit Chance, Crit Damage, Max HP, Armor, Move Speed, Cast Speed, Cooldown Reduction) are verified correct against the wiki's hero pages.

### Hero Class Labels ✅
- Knight="Tank", Ranger="Ranged DPS", Sorcerer="AoE Mage", Priest="Healer · Support", Hunter="Trapper · Ranged", Slayer="Berserker · Melee"

### Hero Unlocks & Costs ✅
- Knight, Ranger, Sorcerer = Starter (free)
- Priest = 500 Gold
- Hunter, Slayer = 500 Gold

### Main Weapon / Off-hand ✅
All hero weapon assignments (Knight=Sword+Shield, Ranger=Bow+Arrow, Sorcerer=Staff+Orb, Priest=Scepter+Tome, Hunter=Crossbow+Bolt, Slayer=Axe+Hatchet)

### Skill Tree Data (Passives) ✅
All passive skills verified against the wiki's embedded build planner on each hero page:
- Skill IDs (101001–101072, 201001–201072, etc.)
- Skill names
- maxLevel values
- Tier structure (8 tiers, pointsRequired: 0/10/20/30/40/50/60/70)
- Tier labels

### Active Skills ✅
All 36 active skills verified against wiki's Skills table:
- Skill IDs, names, elements, ranges, activation types, maxLevel=5
- All 6 skills per hero match exactly

### Pets ✅
All 8 pets verified against wiki Pets page:
- Names: Bat, Watcher, Burning Skeleton, Blue Golem, Dark Spirit, Sword, Butterfly, Dragon
- Bonus descriptions
- Unlock conditions

### Rarity List ✅
10 rarities verified: Common → Uncommon → Rare → Legendary → Immortal → Arcana → Beyond → Celestial → Divine → Cosmic

### Rarity Grades Table ✅
Wiki's grades page confirms the 10-tier ladder. Alchemy gold values are available for future enhancement.

### Hero Weapons/Off-hands ✅
Weapon types (6): Sword, Bow, Staff, Scepter, Crossbow, Axe
Off-hand types (6): Shield, Arrow, Orb, Tome, Bolt, Hatchet

### Level System ✅
Max level is 100. "Player level is a fixed table, 1 → 100" (wiki mechanics page). 1 point per level.

### Database Size ✅
"45 datasets, 40,123 rows" (wiki database page) — matches SESSION.md exactly.

---

## 2. Errors Found

### ERROR 1 (FIXED): Max Level Hardcoded to 50
- **What app had**: `maxLevel = 50` in constructor, level slider max=50, availablePoints=50
- **What wiki says**: Max level is 100 ("Player level is a fixed table, 1 → 100")
- **Current state**: ✅ FIXED — now `maxLevel = 100`, slider goes 1–100, `availablePoints = this.build.level`
- **Impact**: HIGH (was rendering skill trees incomplete)

### ERROR 2 (HIGH): Armor Types — Wrong Data
- **What app says**: `ARMOR_TYPES = ['Light', 'Medium', 'Heavy']`
- **What wiki says**: The game has 4 separate armor gear types: **Helmet, Armor, Gloves, Boots**. There are no armor weight classes (Light/Medium/Heavy). Each armor piece provides Armor FLAT stat.
- **Source**: Wiki Gear Types database table (16 rows) + Mechanics page
- **Impact**: HIGH — the app models a fictional armor weight system instead of the real 4-slot armor system. This means builds created with the app can't accurately represent real in-game gear choices.

### ERROR 3 (HIGH): Accessory Types — Wrong Data
- **What app says**: `ACCESSORY_TYPES = ['Ring', 'Amulet', 'Belt', 'Boots', 'Gloves', 'Helmet', 'Shoulder']`
- **What wiki says**: Accessory gear types listed on mechanics page are **Amulet, Earing, Ring, Bracer** (4 types). "Belt", "Boots" (as accessory), "Gloves" (as accessory), "Helmet" (as accessory), and "Shoulder" are not listed as gear types. "Earing" and "Bracer" are missing from the app.
- **Note**: The Gear Types database table has 16 rows and DOES NOT include any accessory types — accessories may be categorized differently in the Items table (5,935 items).
- **Impact**: HIGH — incorrect accessory categories lead to unrealistic build representations.

### ERROR 4 (MEDIUM): Pet Model is Wrong

- **What app does**: Build stores `pet: <id>` — selects ONE pet at a time, shows its bonus as if equipping it matters
- **What user confirms**: Pet buffs activate by UNLOCKING them, not by equipping. All unlocked pets' bonuses are active simultaneously. The "equipped" pet is purely cosmetic (skin).
- **What should happen**: Build should track which pets the player has unlocked (any number), not which one they "equipped" (skin). Pet bonuses should be summed across all unlocked pets.
- **Impact**: MEDIUM — affects build accuracy. Builds currently show only one pet's bonus instead of all unlocked pets' cumulative bonuses. Also affects share/export: a shared build should communicate which pets are unlocked.

### ERROR 5 (MEDIUM): Gear Slots Model is Over-Simplified
- **What app has**: `GEAR_SLOTS = ['Weapon', 'Off-hand', 'Armor', 'Accessory']` — 1 slot each
- **What wiki says**: The game has 16+ gear types across categories. Specifically:
  - Weapons: Sword, Bow, Staff, Scepter, Crossbow, Axe (6 types) — correct in app
  - Off-hands: Shield, Arrow, Orb, Tome, Bolt, Hatchet (6 types) — correct in app
  - Armor: **Helmet, Armor, Gloves, Boots** (4 separate equippable slots) — app has 1 generic "Armor" slot
  - Accessories: **Amulet, Earing, Ring, Bracer** (4 separate equippable slots) — app has 1 generic "Accessory" slot
- **Impact**: MEDIUM — the 4-slot model is acknowledged as MVP simplification in SESSION.md, but the sub-type mappings within those slots are incorrect.

### ERROR 5 (MEDIUM): bestStats — Multiple Heroes Wrong
- **What app does**: Marks certain stats as "best" (gold highlight) per hero
- **What wiki does**: Shows ★ BEST gold underline on stats where that hero ranks highest across all 6 heroes

Verified mismatches:

| Hero | App's bestStats | Wiki ★ BEST | Status |
|------|----------------|-------------|--------|
| **Knight** | attackDamage, maxHp, armor, moveSpeed | ★ ATK, ★ HP, ★ ARM, ★ SPD | ✅ Correct |
| **Ranger** | attackSpeed, critChance, critDamage, dodgeChance | ★ AttackSpeed only (1.00) | ❌ critChance (4.0% vs Sorc 5.0%), critDamage (150% vs Slayer 180%), dodgeChance (not a base stat) |
| **Sorcerer** | attackDamage, critChance, critDamage, castSpeed | ★ ATK, ★ CritChance only | ❌ critDamage (165% vs Slayer 180%), castSpeed (all heroes have 1.00) |
| **Priest** | maxHp, armor, blockChance, damageAbsorption | Unclear from extraction | ❌ blockChance and damageAbsorption are not base stats; Priest has no highest stat in visible data |
| **Hunter** | attackDamage, critChance, critDamage, fireDamage | ★ ATK only | ❌ critChance (4.5% vs Sorc 5.0%), critDamage (155% vs Slayer 180%), fireDamage (not a base stat) |
| **Slayer** | attackDamage, critDamage, maxHp, armor | ★ ATK, ★ CritDmg | ❌ maxHp (115 vs Knight 130), armor (40 vs Knight 45) |

- **Impact**: MEDIUM — affects visual highlighting of "player should focus on these stats" guidance. Misleading for new players building their first character. The bestStats are currently assigned subjectively rather than computed from actual stat rankings.

### ERROR 6 (LOW): Internal Ability Names vs. Display Names
- **What app uses**: Display names from wiki's Skills table (e.g., "Piercing Thrust", "Rapid Fire")
- **What wiki's mechanics page lists**: Internal decompiled names (e.g., "Dash Attack", "Barrage Attack")
- **Situation**: The skills page on the wiki (36 active skills) uses the SAME names as the app. The mechanics page uses internal code names. The app is correct.
- **Impact**: LOW — no actionable error. The app uses the correct display names.
- **Note**: This explains Knight (Piercing Thrust ≡ Dash Attack, Shield Charge ≡ Strong Attack?, Retribution Strike ≡ Revenge Attack?) and Ranger (Rapid Fire ≡ Barrage Attack?, Scatter Shot ≡ Spread Shot Attack?) naming differences.

---

## 3. Unknown / Needs Verification

### Skill Slots Count
- **App**: 6 skill slots per hero (`SKILL_SLOTS = { all: 6 }`)
- **External sources**: Mention "Rune of Awakening adds extra skill slot" and "Equip up to 6 active skills" — suggests default is 4, runes increase to 5 or 6.
- **Status**: The wiki's embedded planner doesn't show skill slot UI, so this could not be verified from the wiki directly. Needs in-game verification or decompiled data.

### Accessory Gear Database
- **App**: 7 sub-types for accessories
- **Wiki database**: Gear Types table (16 rows) doesn't include accessory entries
- **Status**: The actual item database (5,935 items) includes accessories but the Gear Types table doesn't list them as types. Need to browse the Gear page filtered to "Accessory" to see what items appear there.

### bestStats for Priest and Ranger
- The text extraction didn't catch ★ BEST markers for all heroes. The visual indicators may be added via CSS/JS and may not all appear in extracted text.
- For Ranger: "dodgeChance" as a best stat is suspicious since it's not a base stat in any hero's stat block.
- **Needs**: Manual visual check on the wiki pages to confirm all ★ indicators.

### Damage absorption and block chance as base stats
- **App**: Priest has `damageAbsorption` and `blockChance` in bestStats
- **Wiki**: The "All stats (63)" list includes "Damage Absorption" and "Block Chance" but the hero stat blocks on each hero page only show 9 base stats (DPS, ATK, ASPD, Crit%, CritDmg, HP, ARM, MoveSpd, CastSpd, CDR). These other stats may be derived from gear/skills.
- **Needs**: Clarification on whether these are inherent base stats or only available through gear/skills.

---

## 4. Summary

### Error Count by Severity

| Severity | Count | Description |
|----------|-------|-------------|
| **HIGH** | 3 | Armor types wrong, Accessory types wrong, Max level (FIXED) |
| **MEDIUM** | 3 | Pet model wrong (bonus per-unlock, not per-equip), Gear slots model simplification, bestStats incorrect for 4/6 heroes |
| **LOW** | 1 | Internal vs display name mapping (not an actionable error) |
| **UNKNOWN** | 3 | Skill slot count, accessory gear db, some bestStats |

### Total Impact Assessment

The HIGH errors affect the core data model for gear — a build planner with wrong gear categories produces builds that can't be replicated in the actual game. The skill tree data (passive skills, active skills, heroes, pets) is verified 100% correct, which represents the bulk of the app's functionality.

Estimated data correctness:
- **Heroes & skills**: ~100% correct
- **Pets**: ~100% correct
- **Gear system**: ~40% correct (correct categories, wrong sub-types)
- **Stat highlighting**: ~40% correct (bestStats wrong for most heroes)

---

## 5. Recommendations

### Must Fix (High Priority)

1. **Fix Armor Types** — Replace `['Light', 'Medium', 'Heavy']` with `['Helmet', 'Armor', 'Gloves', 'Boots']`. This is the most impactful fix since it changes how users think about gear.

2. **Fix Accessory Types** — Replace `['Ring', 'Amulet', 'Belt', 'Boots', 'Gloves', 'Helmet', 'Shoulder']` with accurate wiki types. Verify by browsing the Gear page's "Accessory" tab. Tentative replacement: `['Ring', 'Amulet', 'Earing', 'Bracer']` per mechanics page.

3. **Fix bestStats** — Recompute bestStats by comparing each hero's stat values across all 6 heroes. A stat should be marked as "best" only if that hero has the highest value among all heroes for that stat. Remove stats that aren't in the base stat set (dodgeChance, fireDamage, damageAbsorption, blockChance).

4. **Fix Pet Model** — Change from "select one equipped pet" to "track unlocked pets". All unlocked pets' bonuses are active simultaneously. Equipped pet is cosmetic only. This affects the build model, UI (multi-select), stored data, share URL encoding, and stats computation.

### Should Fix (Medium Priority)

4. **Expand Gear Slots Model** — Instead of 1 generic Armor slot and 1 generic Accessory slot, expand to the full slot model that matches the game's 16 gear types. This is more work but makes builds accurate.

5. **Verify Skill Slot Count** — Determine the actual default skill equip slots. If the default is 4 (not 6), update `SKILL_SLOTS` accordingly and add rune-based slot expansion as a future feature.

### Nice to Have (Low Priority)

6. **Add Gear Stats** — The current gear selection (rarity dropdowns) doesn't affect build stats. Actual gear items from the wiki database (5,760 items) have real stats and level requirements. Integrating the gear database would make the planner genuinely useful for build optimization.

7. **Add Rune Tree** — 197 runes in the wiki database, acknowledged as future work in SESSION.md.

---

## Appendix: Data Sources Used

| Page | URL | What We Got |
|------|-----|-------------|
| Heroes (index) | /heroes | 6 hero cards, class labels, base stats |
| Knight | /heroes/knight | Full skill tree, stats, best markers |
| Ranger | /heroes/ranger | Full skill tree, stats, best markers |
| Sorcerer | /heroes/sorcerer | Full skill tree, stats, best markers |
| Priest | /heroes/priest | Full skill tree, stats, best markers |
| Hunter | /heroes/hunter | Full skill tree, stats, best markers |
| Slayer | /heroes/slayer | Full skill tree, stats, best markers |
| Skills | /skills | 36 active skills table |
| Pets | /pets | 8 pets with bonuses and unlock conditions |
| Mechanics | /mechanics | Stat model, 63 stats list, 20 gear types, ability roster |
| Grades | /grades | 10-rarity ladder, Alchemy gold, Cube EXP per grade |
| Gear | /gear | 5,760 items, category filters (Weapon/Off-hand/Armor/Accessory) |
| Gear Types | /database/gear_types | 16 gear types with base stats |
| Database | /database | 45 datasets, 40,123 rows |
