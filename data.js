// ============================================================
// TBH Build Share — Game Database
// Data extracted from https://www.taskbarhero.wiki/
// ============================================================

const TBH = {};

// ─── Heroes ─────────────────────────────────────────────────
TBH.HEROES = {
  knight: {
    id: 'knight',
    name: 'Knight',
    class: 'Tank',
    order: 0,
    mainWeapon: 'Sword',
    offHand: 'Shield',
    unlock: 'Starter',
    cost: 0,
    description: 'A tanky melee fighter with strong defense and shields equipment.',
    icon: 'https://www.taskbarhero.wiki/game/ui/Arrage_ChaAnim_Knight_Large_0.png',
    portrait: 'https://www.taskbarhero.wiki/game/heroes/portraits/Hero_101.png',
    stats: {
      dps: 1.82,
      attackDamage: 2,
      attackSpeed: 0.90,
      critChance: 2.5,
      critDamage: 140,
      maxHp: 130,
      armor: 45,
      moveSpeed: 950,
      castSpeed: 1.00,
      cooldownReduction: 0
    },
    bestStats: ['attackDamage', 'maxHp', 'armor', 'moveSpeed'],
    tiers: [
      { tier: 1, pointsRequired: 0, label: 'available from start',
        skills: [
          { id: '101001', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement', maxLevel: 3, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '101002', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement', maxLevel: 8, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '10101', type: 'active', name: 'Piercing Thrust', slug: 'piercing-thrust', maxLevel: 5, icon: 'Skill_10101', activation: 'Baseattack Count', element: 'Physical', range: 200 },
          { id: '10201', type: 'active', name: 'Shield Charge', slug: 'shield-charge', maxLevel: 5, icon: 'Skill_10201', activation: 'Cooldown', element: 'Physical', range: 900 }
        ]
      },
      { tier: 2, pointsRequired: 10, label: '10 points to unlock',
        skills: [
          { id: '101011', type: 'passive', name: 'Armor Enhancement', slug: 'armor-enhancement', maxLevel: 8, icon: 'Passive_Armor', statBonus: 'armor' },
          { id: '101012', type: 'passive', name: 'HP Regen Enhancement', slug: 'hp-regen-enhancement', maxLevel: 5, icon: 'Passive_HpRegenPerSec', statBonus: 'hpRegen' },
          { id: '10301', type: 'active', name: 'Retribution Strike', slug: 'retribution-strike', maxLevel: 5, icon: 'Skill_10301', activation: 'Baseattack Count', element: 'Physical', range: 150 }
        ]
      },
      { tier: 3, pointsRequired: 20, label: '20 points to unlock',
        skills: [
          { id: '101021', type: 'passive', name: 'HP Per Kill Enhancement', slug: 'hp-per-kill-enhancement', maxLevel: 10, icon: 'Passive_AddHpPerKill', statBonus: 'hpPerKill' },
          { id: '101022', type: 'passive', name: 'Block Chance Enhancement', slug: 'block-chance-enhancement', maxLevel: 10, icon: 'Passive_BlockChance', statBonus: 'blockChance' },
          { id: '10401', type: 'active', name: 'Aegis Field', slug: 'aegis-field', maxLevel: 5, icon: 'Skill_10401', activation: 'Cooldown', element: 'Physical', range: 150 }
        ]
      },
      { tier: 4, pointsRequired: 30, label: '30 points to unlock',
        skills: [
          { id: '101031', type: 'passive', name: 'Physical Damage Enhancement', slug: 'physical-damage-enhancement', maxLevel: 10, icon: 'Passive_PhysicalDamagePercent', statBonus: 'physicalDamage' },
          { id: '101032', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement-2', maxLevel: 10, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '10501', type: 'active', name: 'Sacred Blade', slug: 'sacred-blade', maxLevel: 5, icon: 'Skill_10501', activation: 'Cooldown', element: 'Physical', range: 150 }
        ]
      },
      { tier: 5, pointsRequired: 40, label: '40 points to unlock',
        skills: [
          { id: '101041', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction', maxLevel: 10, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' },
          { id: '101042', type: 'passive', name: 'HP Regen Enhancement', slug: 'hp-regen-enhancement-2', maxLevel: 10, icon: 'Passive_HpRegenPerSec', statBonus: 'hpRegen' },
          { id: '10601', type: 'active', name: 'Unyielding Will', slug: 'unyielding-will', maxLevel: 5, icon: 'Skill_10601', activation: 'Cooldown', element: 'Physical', range: 150 }
        ]
      },
      { tier: 6, pointsRequired: 50, label: '50 points to unlock',
        skills: [
          { id: '101051', type: 'passive', name: 'HP Per Kill Enhancement', slug: 'hp-per-kill-enhancement-3', maxLevel: 10, icon: 'Passive_AddHpPerKill', statBonus: 'hpPerKill' },
          { id: '101052', type: 'passive', name: 'Block Chance Enhancement', slug: 'block-chance-enhancement-2', maxLevel: 10, icon: 'Passive_BlockChance', statBonus: 'blockChance' }
        ]
      },
      { tier: 7, pointsRequired: 60, label: '60 points to unlock',
        skills: [
          { id: '101061', type: 'passive', name: 'Attack Speed Enhancement', slug: 'attack-speed-enhancement', maxLevel: 10, icon: 'Passive_AttackSpeed', statBonus: 'attackSpeed' },
          { id: '101062', type: 'passive', name: 'All Elemental Resistance Enhancement', slug: 'all-elemental-resistance-enhancement', maxLevel: 10, icon: 'Passive_AllElementalResistance', statBonus: 'elementalResistance' }
        ]
      },
      { tier: 8, pointsRequired: 70, label: '70 points to unlock',
        skills: [
          { id: '101071', type: 'passive', name: 'Damage Reduction Enhancement', slug: 'damage-reduction-enhancement', maxLevel: 10, icon: 'Passive_DamageReduction', statBonus: 'damageReduction' },
          { id: '101072', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement-2', maxLevel: 10, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' }
        ]
      }
    ]
  },

  ranger: {
    id: 'ranger',
    name: 'Ranger',
    class: 'Ranged DPS',
    order: 1,
    mainWeapon: 'Bow',
    offHand: 'Arrow',
    unlock: 'Starter',
    cost: 0,
    description: 'An agile archer specializing in precise ranged attacks with bow.',
    icon: 'https://www.taskbarhero.wiki/game/ui/Arrage_ChaAnim_Ranger_Large_0.png',
    portrait: 'https://www.taskbarhero.wiki/game/heroes/portraits/Hero_201.png',
    stats: {
      dps: 1.02,
      attackDamage: 1,
      attackSpeed: 1.00,
      critChance: 4.0,
      critDamage: 150,
      maxHp: 60,
      armor: 8,
      moveSpeed: 850,
      castSpeed: 1.00,
      cooldownReduction: 0
    },
    bestStats: ['attackSpeed', 'critChance', 'critDamage'],
    tiers: [
      { tier: 1, pointsRequired: 0, label: 'available from start',
        skills: [
          { id: '201001', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement', maxLevel: 3, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '201002', type: 'passive', name: 'Attack Speed Enhancement', slug: 'attack-speed-enhancement', maxLevel: 8, icon: 'Passive_AttackSpeed', statBonus: 'attackSpeed' },
          { id: '20101', type: 'active', name: 'Rapid Fire', slug: 'rapid-fire', maxLevel: 5, icon: 'Skill_20101', activation: 'Baseattack Count', element: 'Physical', range: 1150 },
          { id: '20201', type: 'active', name: 'Scatter Shot', slug: 'scatter-shot', maxLevel: 5, icon: 'Skill_20201', activation: 'Cooldown', element: 'Physical', range: 1650 }
        ]
      },
      { tier: 2, pointsRequired: 10, label: '10 points to unlock',
        skills: [
          { id: '201011', type: 'passive', name: 'Critical Chance Enhancement', slug: 'critical-chance-enhancement', maxLevel: 8, icon: 'Passive_CriticalChance', statBonus: 'critChance' },
          { id: '201012', type: 'passive', name: 'Critical Damage Enhancement', slug: 'critical-damage-enhancement', maxLevel: 3, icon: 'Passive_CriticalDamage', statBonus: 'critDamage' },
          { id: '20301', type: 'active', name: 'Arrow Rain', slug: 'arrow-rain', maxLevel: 5, icon: 'Skill_20301', activation: 'Cooldown', element: 'Physical', range: 1300 }
        ]
      },
      { tier: 3, pointsRequired: 20, label: '20 points to unlock',
        skills: [
          { id: '201021', type: 'passive', name: 'Dodge Chance Enhancement', slug: 'dodge-chance-enhancement', maxLevel: 10, icon: 'Passive_DodgeChance', statBonus: 'dodgeChance' },
          { id: '201022', type: 'passive', name: 'Projectile Damage Enhancement', slug: 'projectile-damage-enhancement', maxLevel: 10, icon: 'Passive_AttackDamage', statBonus: 'projectileDamage' },
          { id: '20401', type: 'active', name: 'Swift Surge', slug: 'swift-surge', maxLevel: 5, icon: 'Skill_20401', activation: 'Cooldown', element: 'Physical', range: 1200 }
        ]
      },
      { tier: 4, pointsRequired: 30, label: '30 points to unlock',
        skills: [
          { id: '201031', type: 'passive', name: 'Dodge Chance Enhancement', slug: 'dodge-chance-enhancement-2', maxLevel: 10, icon: 'Passive_DodgeChance', statBonus: 'dodgeChance' },
          { id: '201032', type: 'passive', name: 'Attack Speed Enhancement', slug: 'attack-speed-enhancement-2', maxLevel: 10, icon: 'Passive_AttackSpeed', statBonus: 'attackSpeed' },
          { id: '20501', type: 'active', name: 'Piercing Arrow', slug: 'piercing-arrow', maxLevel: 5, icon: 'Skill_20501', activation: 'Baseattack Count', element: 'Physical', range: 1200 }
        ]
      },
      { tier: 5, pointsRequired: 40, label: '40 points to unlock',
        skills: [
          { id: '201041', type: 'passive', name: 'Dodge Chance Enhancement', slug: 'dodge-chance-enhancement-3', maxLevel: 10, icon: 'Passive_DodgeChance', statBonus: 'dodgeChance' },
          { id: '201042', type: 'passive', name: 'Movement Speed Enhancement', slug: 'movement-speed-enhancement', maxLevel: 10, icon: 'Passive_MovementSpeed', statBonus: 'moveSpeed' },
          { id: '20601', type: 'active', name: 'Skewer Shot', slug: 'skewer-shot', maxLevel: 5, icon: 'Skill_20601', activation: 'Baseattack Count', element: 'Physical', range: 1200 }
        ]
      },
      { tier: 6, pointsRequired: 50, label: '50 points to unlock',
        skills: [
          { id: '201051', type: 'passive', name: 'Dodge Chance Enhancement', slug: 'dodge-chance-enhancement-4', maxLevel: 10, icon: 'Passive_DodgeChance', statBonus: 'dodgeChance' },
          { id: '201052', type: 'passive', name: 'Life Leech Enhancement', slug: 'life-leech-enhancement', maxLevel: 10, icon: 'Passive_HpLeech', statBonus: 'hpLeech' }
        ]
      },
      { tier: 7, pointsRequired: 60, label: '60 points to unlock',
        skills: [
          { id: '201061', type: 'passive', name: 'Area of Effect Damage Enhancement', slug: 'area-of-effect-damage-enhancement', maxLevel: 10, icon: 'Passive_AreaOfEffectDamage', statBonus: 'aoeDamage' },
          { id: '201062', type: 'passive', name: 'Projectile Damage Enhancement', slug: 'projectile-damage-enhancement-2', maxLevel: 10, icon: 'Passive_AttackDamage', statBonus: 'projectileDamage' }
        ]
      },
      { tier: 8, pointsRequired: 70, label: '70 points to unlock',
        skills: [
          { id: '201071', type: 'passive', name: 'Dodge Chance Enhancement', slug: 'dodge-chance-enhancement-5', maxLevel: 10, icon: 'Passive_DodgeChance', statBonus: 'dodgeChance' },
          { id: '201072', type: 'passive', name: 'Attack Speed Enhancement', slug: 'attack-speed-enhancement-3', maxLevel: 10, icon: 'Passive_AttackSpeed', statBonus: 'attackSpeed' }
        ]
      }
    ]
  },

  sorcerer: {
    id: 'sorcerer',
    name: 'Sorcerer',
    class: 'AoE Mage',
    order: 2,
    mainWeapon: 'Staff',
    offHand: 'Orb',
    unlock: 'Starter',
    cost: 0,
    description: 'A powerful mage dealing devastating area magic damage.',
    icon: 'https://www.taskbarhero.wiki/game/ui/Arrage_ChaAnim_Sorcerer_Large_0.png',
    portrait: 'https://www.taskbarhero.wiki/game/heroes/portraits/Hero_301.png',
    stats: {
      dps: 1.14,
      attackDamage: 2,
      attackSpeed: 0.55,
      critChance: 5.0,
      critDamage: 165,
      maxHp: 50,
      armor: 5,
      moveSpeed: 770,
      castSpeed: 1.00,
      cooldownReduction: 0
    },
    bestStats: ['attackDamage', 'critChance', 'critDamage', 'castSpeed'],
    tiers: [
      { tier: 1, pointsRequired: 0, label: 'available from start',
        skills: [
          { id: '301001', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement', maxLevel: 3, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '301002', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction', maxLevel: 8, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' },
          { id: '30101', type: 'active', name: 'Fireball', slug: 'fireball', maxLevel: 5, icon: 'Skill_30101', activation: 'Cooldown', element: 'Fire', range: 950 },
          { id: '30201', type: 'active', name: 'Ice Orb', slug: 'ice-orb', maxLevel: 5, icon: 'Skill_30201', activation: 'Cooldown', element: 'Cold', range: 950 }
        ]
      },
      { tier: 2, pointsRequired: 10, label: '10 points to unlock',
        skills: [
          { id: '301011', type: 'passive', name: 'Area of Effect Enhancement', slug: 'area-of-effect-enhancement', maxLevel: 8, icon: 'Passive_AreaOfEffect', statBonus: 'areaOfEffect' },
          { id: '301012', type: 'passive', name: 'Critical Chance Enhancement', slug: 'critical-chance-enhancement', maxLevel: 3, icon: 'Passive_CriticalChance', statBonus: 'critChance' },
          { id: '30301', type: 'active', name: 'Lightning', slug: 'lightning', maxLevel: 5, icon: 'Skill_30301', activation: 'Cooldown', element: 'Lightning', range: 1050 }
        ]
      },
      { tier: 3, pointsRequired: 20, label: '20 points to unlock',
        skills: [
          { id: '301021', type: 'passive', name: 'Fire Damage Enhancement', slug: 'fire-damage-enhancement', maxLevel: 10, icon: 'Passive_FireDamagePercent', statBonus: 'fireDamage' },
          { id: '301022', type: 'passive', name: 'Cold Damage Enhancement', slug: 'cold-damage-enhancement', maxLevel: 10, icon: 'Passive_ColdDamagePercent', statBonus: 'coldDamage' },
          { id: '30401', type: 'active', name: 'Flame Hydra', slug: 'flame-hydra', maxLevel: 5, icon: 'Skill_30401', activation: 'Cooldown', element: 'Fire', range: 1100 }
        ]
      },
      { tier: 4, pointsRequired: 30, label: '30 points to unlock',
        skills: [
          { id: '301031', type: 'passive', name: 'Lightning Damage Enhancement', slug: 'lightning-damage-enhancement', maxLevel: 10, icon: 'Passive_LightningDamagePercent', statBonus: 'lightningDamage' },
          { id: '301032', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement', maxLevel: 10, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '30501', type: 'active', name: 'Snowstorm', slug: 'snowstorm', maxLevel: 5, icon: 'Skill_30501', activation: 'Cooldown', element: 'Cold', range: 1100 }
        ]
      },
      { tier: 5, pointsRequired: 40, label: '40 points to unlock',
        skills: [
          { id: '301041', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction-2', maxLevel: 10, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' },
          { id: '301042', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement-2', maxLevel: 10, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '30601', type: 'active', name: 'Meteor Strike', slug: 'meteor-strike', maxLevel: 5, icon: 'Skill_30601', activation: 'Cooldown', element: 'Fire', range: 1100 }
        ]
      },
      { tier: 6, pointsRequired: 50, label: '50 points to unlock',
        skills: [
          { id: '301051', type: 'passive', name: 'Cast Speed Enhancement', slug: 'cast-speed-enhancement', maxLevel: 10, icon: 'Passive_CastSpeed', statBonus: 'castSpeed' },
          { id: '301052', type: 'passive', name: 'Critical Damage Enhancement', slug: 'critical-damage-enhancement', maxLevel: 10, icon: 'Passive_CriticalDamage', statBonus: 'critDamage' }
        ]
      },
      { tier: 7, pointsRequired: 60, label: '60 points to unlock',
        skills: [
          { id: '301061', type: 'passive', name: 'All Elemental Resistance Enhancement', slug: 'all-elemental-resistance-enhancement', maxLevel: 10, icon: 'Passive_AllElementalResistance', statBonus: 'elementalResistance' },
          { id: '301062', type: 'passive', name: 'Area of Effect Enhancement', slug: 'area-of-effect-enhancement-2', maxLevel: 10, icon: 'Passive_AreaOfEffect', statBonus: 'areaOfEffect' }
        ]
      },
      { tier: 8, pointsRequired: 70, label: '70 points to unlock',
        skills: [
          { id: '301071', type: 'passive', name: 'Critical Chance Enhancement', slug: 'critical-chance-enhancement-2', maxLevel: 10, icon: 'Passive_CriticalChance', statBonus: 'critChance' },
          { id: '301072', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction-3', maxLevel: 10, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' }
        ]
      }
    ]
  },

  priest: {
    id: 'priest',
    name: 'Priest',
    class: 'Healer · Support',
    order: 3,
    mainWeapon: 'Scepter',
    offHand: 'Tome',
    unlock: 'Gold',
    cost: 500,
    description: 'A holy healer who supports allies with restoration magic.',
    icon: 'https://www.taskbarhero.wiki/game/ui/Arrage_ChaAnim_Priest_Large_0.png',
    portrait: 'https://www.taskbarhero.wiki/game/heroes/portraits/Hero_401.png',
    stats: {
      dps: 0.91,
      attackDamage: 1,
      attackSpeed: 0.90,
      critChance: 2.0,
      critDamage: 140,
      maxHp: 95,
      armor: 30,
      moveSpeed: 700,
      castSpeed: 1.00,
      cooldownReduction: 0
    },
    bestStats: ['maxHp', 'armor'],
    tiers: [
      { tier: 1, pointsRequired: 0, label: 'available from start',
        skills: [
          { id: '401001', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement', maxLevel: 3, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '401002', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement', maxLevel: 8, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '40101', type: 'active', name: 'Heal', slug: 'heal', maxLevel: 5, icon: 'Skill_40101', activation: 'Cooldown', element: 'Physical', range: 950 },
          { id: '40201', type: 'active', name: 'Blessing Of Might', slug: 'blessing-of-might', maxLevel: 5, icon: 'Skill_40201', activation: 'Continuous', element: 'Physical', range: 950 }
        ]
      },
      { tier: 2, pointsRequired: 10, label: '10 points to unlock',
        skills: [
          { id: '401011', type: 'passive', name: 'Armor Enhancement', slug: 'armor-enhancement', maxLevel: 8, icon: 'Passive_Armor', statBonus: 'armor' },
          { id: '401012', type: 'passive', name: 'Damage Absorption Enhancement', slug: 'damage-absorption-enhancement', maxLevel: 3, icon: 'Passive_DamageAbsorption', statBonus: 'damageAbsorption' },
          { id: '40301', type: 'active', name: 'Wrath of Heaven', slug: 'wrath-of-heaven', maxLevel: 5, icon: 'Skill_40301', activation: 'Cooldown', element: 'Lightning', range: 1050 }
        ]
      },
      { tier: 3, pointsRequired: 20, label: '20 points to unlock',
        skills: [
          { id: '401021', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction', maxLevel: 10, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' },
          { id: '401022', type: 'passive', name: 'Skill Heal Enhancement', slug: 'skill-heal-enhancement', maxLevel: 10, icon: 'Passive_HpRegenPerSec', statBonus: 'skillHeal' },
          { id: '40401', type: 'active', name: 'Sanctuary', slug: 'sanctuary', maxLevel: 5, icon: 'Skill_40401', activation: 'Cooldown', element: 'Physical', range: 1100 }
        ]
      },
      { tier: 4, pointsRequired: 30, label: '30 points to unlock',
        skills: [
          { id: '401031', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement-2', maxLevel: 10, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '401032', type: 'passive', name: 'Damage Absorption Enhancement', slug: 'damage-absorption-enhancement-2', maxLevel: 10, icon: 'Passive_DamageAbsorption', statBonus: 'damageAbsorption' },
          { id: '40501', type: 'active', name: 'Blessing of Warding', slug: 'blessing-of-warding', maxLevel: 5, icon: 'Skill_40501', activation: 'Continuous', element: 'Physical', range: 1100 }
        ]
      },
      { tier: 5, pointsRequired: 40, label: '40 points to unlock',
        skills: [
          { id: '401041', type: 'passive', name: 'Cast Speed Enhancement', slug: 'cast-speed-enhancement', maxLevel: 10, icon: 'Passive_CastSpeed', statBonus: 'castSpeed' },
          { id: '401042', type: 'passive', name: 'Block Chance Enhancement', slug: 'block-chance-enhancement', maxLevel: 10, icon: 'Passive_BlockChance', statBonus: 'blockChance' },
          { id: '40601', type: 'active', name: 'Resurrection', slug: 'resurrection', maxLevel: 5, icon: 'Skill_40601', activation: 'Cooldown', element: 'Physical', range: 1100 }
        ]
      },
      { tier: 6, pointsRequired: 50, label: '50 points to unlock',
        skills: [
          { id: '401051', type: 'passive', name: 'Physical Damage Enhancement', slug: 'physical-damage-enhancement', maxLevel: 10, icon: 'Passive_PhysicalDamagePercent', statBonus: 'physicalDamage' },
          { id: '401052', type: 'passive', name: 'All Elemental Resistance Enhancement', slug: 'all-elemental-resistance-enhancement', maxLevel: 10, icon: 'Passive_AllElementalResistance', statBonus: 'elementalResistance' }
        ]
      },
      { tier: 7, pointsRequired: 60, label: '60 points to unlock',
        skills: [
          { id: '401061', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction-2', maxLevel: 10, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' },
          { id: '401062', type: 'passive', name: 'Armor Enhancement', slug: 'armor-enhancement-2', maxLevel: 10, icon: 'Passive_Armor', statBonus: 'armor' }
        ]
      },
      { tier: 8, pointsRequired: 70, label: '70 points to unlock',
        skills: [
          { id: '401071', type: 'passive', name: 'Area of Effect Enhancement', slug: 'area-of-effect-enhancement', maxLevel: 10, icon: 'Passive_AreaOfEffect', statBonus: 'areaOfEffect' },
          { id: '401072', type: 'passive', name: 'Cast Speed Enhancement', slug: 'cast-speed-enhancement-2', maxLevel: 10, icon: 'Passive_CastSpeed', statBonus: 'castSpeed' }
        ]
      }
    ]
  },

  hunter: {
    id: 'hunter',
    name: 'Hunter',
    class: 'Trapper · Ranged',
    order: 4,
    mainWeapon: 'Crossbow',
    offHand: 'Bolt',
    unlock: 'Gold',
    cost: 500,
    description: 'A tactical expert using traps and crossbow.',
    icon: 'https://www.taskbarhero.wiki/game/ui/Arrage_ChaAnim_Abalist_Large_0.png',
    portrait: 'https://www.taskbarhero.wiki/game/heroes/portraits/Hero_501.png',
    stats: {
      dps: 1.43,
      attackDamage: 2,
      attackSpeed: 0.70,
      critChance: 4.5,
      critDamage: 155,
      maxHp: 70,
      armor: 15,
      moveSpeed: 750,
      castSpeed: 1.00,
      cooldownReduction: 0
    },
    bestStats: ['attackDamage', 'critChance', 'critDamage'],
    tiers: [
      { tier: 1, pointsRequired: 0, label: 'available from start',
        skills: [
          { id: '501001', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement', maxLevel: 3, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '501002', type: 'passive', name: 'Critical Chance Enhancement', slug: 'critical-chance-enhancement', maxLevel: 8, icon: 'Passive_CriticalChance', statBonus: 'critChance' },
          { id: '50101', type: 'active', name: 'Explosive Bolt', slug: 'explosive-bolt', maxLevel: 5, icon: 'Skill_50101', activation: 'Baseattack Count', element: 'Fire', range: 1100 },
          { id: '50201', type: 'active', name: 'Frost Bolt', slug: 'frost-bolt', maxLevel: 5, icon: 'Skill_50201', activation: 'Cooldown', element: 'Cold', range: 1100 }
        ]
      },
      { tier: 2, pointsRequired: 10, label: '10 points to unlock',
        skills: [
          { id: '501011', type: 'passive', name: 'Critical Damage Enhancement', slug: 'critical-damage-enhancement', maxLevel: 8, icon: 'Passive_CriticalDamage', statBonus: 'critDamage' },
          { id: '501012', type: 'passive', name: 'Dodge Chance Enhancement', slug: 'dodge-chance-enhancement', maxLevel: 3, icon: 'Passive_DodgeChance', statBonus: 'dodgeChance' },
          { id: '50301', type: 'active', name: 'Quick Loader', slug: 'quick-loader', maxLevel: 5, icon: 'Skill_50301', activation: 'Cooldown', element: 'Physical', range: 1050 }
        ]
      },
      { tier: 3, pointsRequired: 20, label: '20 points to unlock',
        skills: [
          { id: '501021', type: 'passive', name: 'Fire Damage Enhancement', slug: 'fire-damage-enhancement', maxLevel: 10, icon: 'Passive_FireDamagePercent', statBonus: 'fireDamage' },
          { id: '501022', type: 'passive', name: 'Cold Damage Enhancement', slug: 'cold-damage-enhancement', maxLevel: 10, icon: 'Passive_ColdDamagePercent', statBonus: 'coldDamage' },
          { id: '50401', type: 'active', name: 'Charge Trap', slug: 'charge-trap', maxLevel: 5, icon: 'Skill_50401', activation: 'Cooldown', element: 'Physical', range: 1150 }
        ]
      },
      { tier: 4, pointsRequired: 30, label: '30 points to unlock',
        skills: [
          { id: '501031', type: 'passive', name: 'Cooldown Reduction', slug: 'cooldown-reduction', maxLevel: 10, icon: 'Passive_CooldownReduction', statBonus: 'cooldownReduction' },
          { id: '501032', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement', maxLevel: 10, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '50501', type: 'active', name: 'Crossbow Turret', slug: 'crossbow-turret', maxLevel: 5, icon: 'Skill_50501', activation: 'Cooldown', element: 'Physical', range: 1100 }
        ]
      },
      { tier: 5, pointsRequired: 40, label: '40 points to unlock',
        skills: [
          { id: '501041', type: 'passive', name: 'Physical Damage Enhancement', slug: 'physical-damage-enhancement', maxLevel: 10, icon: 'Passive_PhysicalDamagePercent', statBonus: 'physicalDamage' },
          { id: '501042', type: 'passive', name: 'Critical Chance Enhancement', slug: 'critical-chance-enhancement-2', maxLevel: 10, icon: 'Passive_CriticalChance', statBonus: 'critChance' },
          { id: '50601', type: 'active', name: 'Shock Bolt', slug: 'shock-bolt', maxLevel: 5, icon: 'Skill_50601', activation: 'Baseattack Count', element: 'Lightning', range: 1100 }
        ]
      },
      { tier: 6, pointsRequired: 50, label: '50 points to unlock',
        skills: [
          { id: '501051', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement-2', maxLevel: 10, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '501052', type: 'passive', name: 'Area of Effect Enhancement', slug: 'area-of-effect-enhancement', maxLevel: 10, icon: 'Passive_AreaOfEffect', statBonus: 'areaOfEffect' }
        ]
      },
      { tier: 7, pointsRequired: 60, label: '60 points to unlock',
        skills: [
          { id: '501061', type: 'passive', name: 'Lightning Damage Enhancement', slug: 'lightning-damage-enhancement', maxLevel: 10, icon: 'Passive_LightningDamagePercent', statBonus: 'lightningDamage' },
          { id: '501062', type: 'passive', name: 'Critical Damage Enhancement', slug: 'critical-damage-enhancement-2', maxLevel: 10, icon: 'Passive_CriticalDamage', statBonus: 'critDamage' }
        ]
      },
      { tier: 8, pointsRequired: 70, label: '70 points to unlock',
        skills: [
          { id: '501071', type: 'passive', name: 'Attack Speed Enhancement', slug: 'attack-speed-enhancement', maxLevel: 10, icon: 'Passive_AttackSpeed', statBonus: 'attackSpeed' },
          { id: '501072', type: 'passive', name: 'HP Per Hit Enhancement', slug: 'hp-per-hit-enhancement', maxLevel: 10, icon: 'Passive_AddHpPerHit', statBonus: 'hpPerHit' }
        ]
      }
    ]
  },

  slayer: {
    id: 'slayer',
    name: 'Slayer',
    class: 'Berserker · Melee',
    order: 5,
    mainWeapon: 'Axe',
    offHand: 'Hatchet',
    unlock: 'Gold',
    cost: 500,
    description: 'A wild berserker dealing devastating melee damage through rage.',
    icon: 'https://www.taskbarhero.wiki/game/ui/Arrage_ChaAnim_Slayer_Large_0.png',
    portrait: 'https://www.taskbarhero.wiki/game/heroes/portraits/Hero_601.png',
    stats: {
      dps: 1.43,
      attackDamage: 2,
      attackSpeed: 0.70,
      critChance: 2.5,
      critDamage: 180,
      maxHp: 115,
      armor: 40,
      moveSpeed: 850,
      castSpeed: 1.00,
      cooldownReduction: 0
    },
    bestStats: ['attackDamage', 'critDamage', 'maxHp', 'armor'],
    tiers: [
      { tier: 1, pointsRequired: 0, label: 'available from start',
        skills: [
          { id: '601001', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement', maxLevel: 3, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '601002', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement', maxLevel: 8, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '60101', type: 'active', name: 'Slam Jump', slug: 'slam-jump', maxLevel: 5, icon: 'Skill_60101', activation: 'Cooldown', element: 'Physical', range: 850 },
          { id: '60201', type: 'active', name: 'Crushing Blow', slug: 'crushing-blow', maxLevel: 5, icon: 'Skill_60201', activation: 'Baseattack Count', element: 'Physical', range: 200 }
        ]
      },
      { tier: 2, pointsRequired: 10, label: '10 points to unlock',
        skills: [
          { id: '601011', type: 'passive', name: 'Area of Effect Enhancement', slug: 'area-of-effect-enhancement', maxLevel: 8, icon: 'Passive_AreaOfEffect', statBonus: 'areaOfEffect' },
          { id: '601012', type: 'passive', name: 'HP Per Kill Enhancement', slug: 'hp-per-kill-enhancement', maxLevel: 3, icon: 'Passive_AddHpPerKill', statBonus: 'hpPerKill' },
          { id: '60301', type: 'active', name: "Commander's Cry", slug: 'commander-s-cry', maxLevel: 5, icon: 'Skill_60301', activation: 'Cooldown', element: 'Physical', range: 150 }
        ]
      },
      { tier: 3, pointsRequired: 20, label: '20 points to unlock',
        skills: [
          { id: '601021', type: 'passive', name: 'Physical Damage Enhancement', slug: 'physical-damage-enhancement', maxLevel: 10, icon: 'Passive_PhysicalDamagePercent', statBonus: 'physicalDamage' },
          { id: '601022', type: 'passive', name: 'Life Leech Enhancement', slug: 'life-leech-enhancement', maxLevel: 10, icon: 'Passive_HpLeech', statBonus: 'hpLeech' },
          { id: '60401', type: 'active', name: 'Ground Slam', slug: 'ground-slam', maxLevel: 5, icon: 'Skill_60401', activation: 'Baseattack Count', element: 'Physical', range: 300 }
        ]
      },
      { tier: 4, pointsRequired: 30, label: '30 points to unlock',
        skills: [
          { id: '601031', type: 'passive', name: 'Attack Damage Enhancement', slug: 'attack-damage-enhancement-2', maxLevel: 10, icon: 'Passive_AttackDamage', statBonus: 'attackDamage' },
          { id: '601032', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement-2', maxLevel: 10, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '60501', type: 'active', name: 'Axe Spin', slug: 'axe-spin', maxLevel: 5, icon: 'Skill_60501', activation: 'Cooldown', element: 'Physical', range: 150 }
        ]
      },
      { tier: 5, pointsRequired: 40, label: '40 points to unlock',
        skills: [
          { id: '601041', type: 'passive', name: 'Critical Damage Enhancement', slug: 'critical-damage-enhancement', maxLevel: 10, icon: 'Passive_CriticalDamage', statBonus: 'critDamage' },
          { id: '601042', type: 'passive', name: 'Physical Damage Enhancement', slug: 'physical-damage-enhancement-2', maxLevel: 10, icon: 'Passive_PhysicalDamagePercent', statBonus: 'physicalDamage' },
          { id: '60601', type: 'active', name: 'Bloodlust', slug: 'bloodlust', maxLevel: 5, icon: 'Skill_60601', activation: 'Cooldown', element: 'Physical', range: 900 }
        ]
      },
      { tier: 6, pointsRequired: 50, label: '50 points to unlock',
        skills: [
          { id: '601051', type: 'passive', name: 'Area of Effect Damage Enhancement', slug: 'area-of-effect-damage-enhancement', maxLevel: 10, icon: 'Passive_AreaOfEffectDamage', statBonus: 'aoeDamage' },
          { id: '601052', type: 'passive', name: 'Area of Effect Enhancement', slug: 'area-of-effect-enhancement-2', maxLevel: 10, icon: 'Passive_AreaOfEffect', statBonus: 'areaOfEffect' }
        ]
      },
      { tier: 7, pointsRequired: 60, label: '60 points to unlock',
        skills: [
          { id: '601061', type: 'passive', name: 'Health Enhancement', slug: 'health-enhancement-3', maxLevel: 10, icon: 'Passive_MaxHp', statBonus: 'maxHp' },
          { id: '601062', type: 'passive', name: 'Movement Speed Enhancement', slug: 'movement-speed-enhancement', maxLevel: 10, icon: 'Passive_MovementSpeed', statBonus: 'moveSpeed' }
        ]
      },
      { tier: 8, pointsRequired: 70, label: '70 points to unlock',
        skills: [
          { id: '601071', type: 'passive', name: 'Area of Effect Damage Enhancement', slug: 'area-of-effect-damage-enhancement-2', maxLevel: 10, icon: 'Passive_AreaOfEffectDamage', statBonus: 'aoeDamage' },
          { id: '601072', type: 'passive', name: 'Duration Enhancement', slug: 'duration-enhancement', maxLevel: 10, icon: 'Passive_Duration', statBonus: 'duration' }
        ]
      }
    ]
  }
};

// ─── Active Skills Master List ─────────────────────────────
TBH.ACTIVE_SKILLS = [
  { id: '10101', hero: 'knight', name: 'Piercing Thrust',     slug: 'piercing-thrust',     activation: 'Baseattack Count', element: 'Physical',  range: 200,  maxLevel: 5, icon: 'Skill_10101' },
  { id: '10201', hero: 'knight', name: 'Shield Charge',       slug: 'shield-charge',       activation: 'Cooldown',         element: 'Physical',  range: 900,  maxLevel: 5, icon: 'Skill_10201' },
  { id: '10301', hero: 'knight', name: 'Retribution Strike',  slug: 'retribution-strike',  activation: 'Baseattack Count', element: 'Physical',  range: 150,  maxLevel: 5, icon: 'Skill_10301' },
  { id: '10401', hero: 'knight', name: 'Aegis Field',         slug: 'aegis-field',         activation: 'Cooldown',         element: 'Physical',  range: 150,  maxLevel: 5, icon: 'Skill_10401' },
  { id: '10501', hero: 'knight', name: 'Sacred Blade',        slug: 'sacred-blade',        activation: 'Cooldown',         element: 'Physical',  range: 150,  maxLevel: 5, icon: 'Skill_10501' },
  { id: '10601', hero: 'knight', name: 'Unyielding Will',     slug: 'unyielding-will',     activation: 'Cooldown',         element: 'Physical',  range: 150,  maxLevel: 5, icon: 'Skill_10601' },
  { id: '20101', hero: 'ranger', name: 'Rapid Fire',          slug: 'rapid-fire',          activation: 'Baseattack Count', element: 'Physical',  range: 1150, maxLevel: 5, icon: 'Skill_20101' },
  { id: '20201', hero: 'ranger', name: 'Scatter Shot',        slug: 'scatter-shot',        activation: 'Cooldown',         element: 'Physical',  range: 1650, maxLevel: 5, icon: 'Skill_20201' },
  { id: '20301', hero: 'ranger', name: 'Arrow Rain',          slug: 'arrow-rain',          activation: 'Cooldown',         element: 'Physical',  range: 1300, maxLevel: 5, icon: 'Skill_20301' },
  { id: '20401', hero: 'ranger', name: 'Swift Surge',         slug: 'swift-surge',         activation: 'Cooldown',         element: 'Physical',  range: 1200, maxLevel: 5, icon: 'Skill_20401' },
  { id: '20501', hero: 'ranger', name: 'Piercing Arrow',      slug: 'piercing-arrow',      activation: 'Baseattack Count', element: 'Physical',  range: 1200, maxLevel: 5, icon: 'Skill_20501' },
  { id: '20601', hero: 'ranger', name: 'Skewer Shot',         slug: 'skewer-shot',         activation: 'Baseattack Count', element: 'Physical',  range: 1200, maxLevel: 5, icon: 'Skill_20601' },
  { id: '30101', hero: 'sorcerer', name: 'Fireball',           slug: 'fireball',            activation: 'Cooldown',         element: 'Fire',      range: 950,  maxLevel: 5, icon: 'Skill_30101' },
  { id: '30201', hero: 'sorcerer', name: 'Ice Orb',            slug: 'ice-orb',             activation: 'Cooldown',         element: 'Cold',      range: 950,  maxLevel: 5, icon: 'Skill_30201' },
  { id: '30301', hero: 'sorcerer', name: 'Lightning',          slug: 'lightning',           activation: 'Cooldown',         element: 'Lightning', range: 1050, maxLevel: 5, icon: 'Skill_30301' },
  { id: '30401', hero: 'sorcerer', name: 'Flame Hydra',        slug: 'flame-hydra',         activation: 'Cooldown',         element: 'Fire',      range: 1100, maxLevel: 5, icon: 'Skill_30401' },
  { id: '30501', hero: 'sorcerer', name: 'Snowstorm',          slug: 'snowstorm',           activation: 'Cooldown',         element: 'Cold',      range: 1100, maxLevel: 5, icon: 'Skill_30501' },
  { id: '30601', hero: 'sorcerer', name: 'Meteor Strike',      slug: 'meteor-strike',       activation: 'Cooldown',         element: 'Fire',      range: 1100, maxLevel: 5, icon: 'Skill_30601' },
  { id: '40101', hero: 'priest', name: 'Heal',                slug: 'heal',                 activation: 'Cooldown',         element: 'Physical',  range: 950,  maxLevel: 5, icon: 'Skill_40101' },
  { id: '40201', hero: 'priest', name: 'Blessing Of Might',   slug: 'blessing-of-might',    activation: 'Continuous',       element: 'Physical',  range: 950,  maxLevel: 5, icon: 'Skill_40201' },
  { id: '40301', hero: 'priest', name: 'Wrath of Heaven',     slug: 'wrath-of-heaven',      activation: 'Cooldown',         element: 'Lightning', range: 1050, maxLevel: 5, icon: 'Skill_40301' },
  { id: '40401', hero: 'priest', name: 'Sanctuary',           slug: 'sanctuary',            activation: 'Cooldown',         element: 'Physical',  range: 1100, maxLevel: 5, icon: 'Skill_40401' },
  { id: '40501', hero: 'priest', name: 'Blessing of Warding', slug: 'blessing-of-warding',  activation: 'Continuous',       element: 'Physical',  range: 1100, maxLevel: 5, icon: 'Skill_40501' },
  { id: '40601', hero: 'priest', name: 'Resurrection',        slug: 'resurrection',         activation: 'Cooldown',         element: 'Physical',  range: 1100, maxLevel: 5, icon: 'Skill_40601' },
  { id: '50101', hero: 'hunter', name: 'Explosive Bolt',      slug: 'explosive-bolt',       activation: 'Baseattack Count', element: 'Fire',      range: 1100, maxLevel: 5, icon: 'Skill_50101' },
  { id: '50201', hero: 'hunter', name: 'Frost Bolt',          slug: 'frost-bolt',           activation: 'Cooldown',         element: 'Cold',      range: 1100, maxLevel: 5, icon: 'Skill_50201' },
  { id: '50301', hero: 'hunter', name: 'Quick Loader',        slug: 'quick-loader',         activation: 'Cooldown',         element: 'Physical',  range: 1050, maxLevel: 5, icon: 'Skill_50301' },
  { id: '50401', hero: 'hunter', name: 'Charge Trap',         slug: 'charge-trap',          activation: 'Cooldown',         element: 'Physical',  range: 1150, maxLevel: 5, icon: 'Skill_50401' },
  { id: '50501', hero: 'hunter', name: 'Crossbow Turret',     slug: 'crossbow-turret',      activation: 'Cooldown',         element: 'Physical',  range: 1100, maxLevel: 5, icon: 'Skill_50501' },
  { id: '50601', hero: 'hunter', name: 'Shock Bolt',          slug: 'shock-bolt',           activation: 'Baseattack Count', element: 'Lightning', range: 1100, maxLevel: 5, icon: 'Skill_50601' },
  { id: '60101', hero: 'slayer', name: 'Slam Jump',           slug: 'slam-jump',            activation: 'Cooldown',         element: 'Physical',  range: 850,  maxLevel: 5, icon: 'Skill_60101' },
  { id: '60201', hero: 'slayer', name: 'Crushing Blow',       slug: 'crushing-blow',        activation: 'Baseattack Count', element: 'Physical',  range: 200,  maxLevel: 5, icon: 'Skill_60201' },
  { id: '60301', hero: 'slayer', name: "Commander's Cry",     slug: 'commander-s-cry',      activation: 'Cooldown',         element: 'Physical',  range: 150,  maxLevel: 5, icon: 'Skill_60301' },
  { id: '60401', hero: 'slayer', name: 'Ground Slam',         slug: 'ground-slam',          activation: 'Baseattack Count', element: 'Physical',  range: 300,  maxLevel: 5, icon: 'Skill_60401' },
  { id: '60501', hero: 'slayer', name: 'Axe Spin',            slug: 'axe-spin',             activation: 'Cooldown',         element: 'Physical',  range: 150,  maxLevel: 5, icon: 'Skill_60501' },
  { id: '60601', hero: 'slayer', name: 'Bloodlust',           slug: 'bloodlust',            activation: 'Cooldown',         element: 'Physical',  range: 900,  maxLevel: 5, icon: 'Skill_60601' }
];

// ─── Run Slots per Hero ─────────────────────────────────────
TBH.SKILL_SLOTS = {
  knight:   2,
  ranger:   2,
  sorcerer: 2,
  priest:   2,
  hunter:   2,
  slayer:   2
};

// ─── Helper: all active skills for a hero ───────────────────
TBH.getSkillsForHero = function(heroId) {
  return TBH.ACTIVE_SKILLS.filter(s => s.hero === heroId);
};

// ─── Helper: get skill tree tiers (up to certain level cap) ─
TBH.getTiersForHero = function(heroId, maxPoints) {
  const hero = TBH.HEROES[heroId];
  if (!hero) return [];
  return hero.tiers.filter(t => {
    return t.pointsRequired <= (maxPoints || 100);
  });
};

// ─── Element colors for UI ──────────────────────────────────
TBH.ELEMENT_COLORS = {
  'Physical': '#a0a0a0',
  'Fire': '#ff4444',
  'Cold': '#44aaff',
  'Lightning': '#ffdd44'
};
