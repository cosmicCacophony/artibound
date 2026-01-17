import { Hero, BaseCard, GenericUnit, SpellCard, SpellEffect, BattlefieldDefinition, Color, HeroAbility, ArtifactCard } from './types'

// ============================================================================
// RW (Red/White) - Go Wide Beatdown
// ============================================================================

export const rwHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'rw-hero-commander',
    name: 'Legion Commander',
    description: 'Legion units get +1/+1.',
    cardType: 'hero',
    colors: ['red', 'white'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,    equippedItems: [],
    supportEffect: 'Legion units get +1/+1',
  },
  {
    id: 'rw-hero-captain',
    name: 'Legion Commander',
    description: 'Legion units get +1/+1.',
    cardType: 'hero',
    colors: ['red', 'white'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,    equippedItems: [],
    supportEffect: 'Legion units get +1/+1',
  },
  // Red Cleave Hero (Sven-like) - Tool to deal with creep-stacking cards
  {
    id: 'red-hero-cleaver',
    name: 'Cleave Warrior',
    description: '3/4. Cleave (damages adjacent units when attacking). Red answer to stacked creeps. Especially aggressive hero.',
    cardType: 'hero',
    colors: ['red'],
    attack: 3,
    height: 4,
    maxHealth: 4,
    currentHealth: 4,    equippedItems: [],
  },
  // BR Aggressive Spell-Synergy Heroes
  {
    id: 'red-hero-spell-slinger',
    name: 'Spell Slinger',
    description: '3/4. Whenever you cast a noncreature spell, this hero gains +2/+0 until end of turn.',
    cardType: 'hero',
    colors: ['red'],
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    supportEffect: 'Gains +2/+0 when you cast spells.',
    equippedItems: [],
    ability: {
      name: 'Spell Mastery',
      description: 'Passive: Whenever you cast a noncreature spell, this hero gains +2/+0 until end of turn.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 2,
    },
  },
  {
    id: 'red-hero-pyromancer',
    name: 'Pyromancer Prodigy',
    description: '2/5. Whenever you cast a spell, deal 1 damage to opponent tower.',
    cardType: 'hero',
    colors: ['red'],
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'Converts spells into tower damage.',
    equippedItems: [],
    ability: {
      name: 'Spell Burn',
      description: 'Passive: Whenever you cast a spell, deal 1 damage to opponent tower.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'damage_target',
      effectValue: 1,
    },
  },
]

export const rwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature units (physical objects that can be units)
  // More Cleave Effects
  // Vanguard Banner removed - replaced with red artifact
  // Legion Tribal Units (RW archetype) - Removed boring +1/+1 counter cards
  {
    id: 'rw-legion-champion',
    name: 'Legion Champion',
    description: 'Legion. When this attacks, all Legion units gain +1/+1 until end of turn.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 4,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // Ranged Units - Can attack from base/deploy zone
  {
    id: 'rw-unit-legion-archers',
    name: 'Legion Archers',
    description: 'Ranged. 3/3. Can attack from base/deploy zone, dealing 2 damage evenly to both towers.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    rangedAttack: 2,
  },
  // New Magic-inspired RW cards
  {
    id: 'rw-unit-legion-general',
    name: 'Legion General',
    description: '5/5. Legion. All Legion units gain +2/+2 attack. Costs 5RW.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'rw-unit-legion-vanguard',
    name: 'Legion Vanguard',
    description: '4/4. Legion. When this enters, create a 2/2 Legion token. All Legion units gain +1/+1 until end of turn.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 4,
    consumesRunes: true,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

// ============================================================================
// Mono Red Aggro - Fast, Tower-Focused (RPS Aggro Archetype)
// ============================================================================

export const monoRedAggroCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Artifact Forger moved to RB (artifact sacrifice fits RB aggressive)
  // Raging Warrior and Tower Raider removed (generic, don't fit guilds)
]


// RW Artifacts - Persistent effects in base (R, W, or RW colors only)
export const rwArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'rw-artifact-legion-standard',
    name: 'Legion Standard Artifact',
    description: 'Artifact. All your Legion units gain +3/+1.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 5,
    effectType: 'damage_amplifier',
    effectValue: 3, // +3 attack, +1 health handled separately if needed
  },
  {
    id: 'rw-artifact-rally-banner',
    name: 'Rally Banner Artifact',
    description: 'Artifact. All your heroes gain +2/+1, all your units gain +1/+1.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'damage_amplifier',
    effectValue: 2, // +2/+1 to heroes, +1/+1 to units (Core Game Redesign - hero-focused)
  },
  {
    id: 'rw-artifact-divine-aura',
    name: 'Divine Aura Artifact',
    description: 'Equipment. Target unit gets 3 regen.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 3,
    effectType: 'equipment',
    effectValue: 0,
    equipmentBonuses: {
      abilities: ['regen_3'],
    },
  },
  {
    id: 'rw-artifact-glorious-banner',
    name: 'Glorious Banner Artifact',
    description: 'Artifact. All your units gain +1/+1.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 4,
    effectType: 'damage_amplifier',
    effectValue: 1, // +1 attack, defensive buff handled separately if needed
  },
  // 3+X Artifact Cycle
  {
    id: 'white-spell-divine-protection',
    name: 'Divine Protection',
    description: 'Stun target unit. Costs 2W.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 2,
    effect: {
      type: 'stun',
      stunDuration: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  // Removed: Frontline Aura (outdated mechanic)
  {
    id: 'rw-artifact-legion-barracks',
    name: 'Legion Barracks',
    description: 'Artifact. At the start of your turn, spawn a 1/1 Legion token.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'token_generation',
    effectValue: 1, // Spawns 1x 1/1 Legion token each turn
  },
]

// RG Artifacts - Red/Green artifacts (for RG archetypes)
export const rgArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'rg-artifact-cleave-aura',
    name: 'Cleave Aura Artifact',
    description: 'Artifact. Target unit or hero gains Cleave (damages adjacent units when attacking) during your turn. Costs 3R.',
    cardType: 'artifact',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    effectType: 'damage_amplifier', // Placeholder - would need custom effect for granting cleave
    effectValue: 0, // Cleave is a special effect, not a stat boost
  },
]

export const rwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Mono-Red Signature Spell
  {
    id: 'red-sig-fury-strike',
    name: 'Fury Strike',
    description: 'Deal 4 damage to target unit or hero. Costs 3R, refunds 3 mana.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  // RW Combat Spells - Removed War Cry and Path of Valor
  {
    id: 'rw-spell-rally-legion',
    name: 'Rally the Legion',
    description: 'All Legion units get +2/+2 this round.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
  },
  // Additional RW Legion Synergy Spells
  {
    id: 'rw-spell-legion-formation',
    name: 'Legion Formation',
    description: 'All Legion units gain +1/+1 permanently. Draw a card for each Legion unit you control.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
  },
  {
    id: 'rw-spell-legion-charge',
    name: 'Legion Charge',
    description: 'All Legion units gain +3 attack this turn. They can attack immediately.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
  },
  // RW Fight Spells - Hero combat initiation
  {
    id: 'rw-spell-heroic-duel',
    name: 'Heroic Duel',
    description: 'Your hero initiates combat with target enemy hero. Players resolve combat manually.',
    cardType: 'spell',
    colors: ['red'], // Hero combat spell - keeps rune requirement (uncommon)
    manaCost: 3,
    consumesRunes: true, // Not generic - consumes runes
    effect: {
      type: 'targeted_damage', // Placeholder - manual resolution, no game tracking
      damage: 0,
    },
  },
  {
    id: 'rw-spell-champion-challenge',
    name: 'Champion Challenge',
    description: 'Your hero initiates combat with target enemy hero. Players resolve combat manually. Costs 3R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - manual resolution, no game tracking
      damage: 0,
    },
  },
  {
    id: 'rw-spell-whirling-death',
    name: 'Whirling Death',
    description: 'Deal 2 damage to caster\'s adjacent enemies and give them -2 attack. 2R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'adjacent_damage',
      damage: 2,
      adjacentCount: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Unbreakable Column removed - replaced with white artifact
  {
    id: 'rw-spell-fighting-words',
    name: 'Fighting Words',
    description: 'Target unit gains +3 attack permanently.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for permanent buff
      damage: 0,
    },
  },
  {
    id: 'rw-spell-into-the-fray',
    name: 'Into the Fray',
    description: 'Target unit gains +3/+3 this turn.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
  },
  {
    id: 'rw-spell-rally-banner',
    name: 'Rally Banner',
    description: 'All allies gain +1/+1 until end of turn. Draw a card.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
  },
  {
    id: 'rw-spell-battle-cry',
    name: 'Battle Cry',
    description: 'All allies gain +1 attack this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff
      damage: 0,
    },
  },
  // RW Token Generators - Require runes, create Legion tokens for go-wide synergy
  {
    id: 'rw-spell-legion-call',
    name: 'Legion Call',
    description: 'Create two 2/2 Legion tokens. Costs 3RW.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 3,
    consumesRunes: true, // Requires RW runes - encourages aggro commitment
    effect: {
      type: 'create_tokens', // Custom effect: creates 2x 2/2 Legion tokens
      tokenCount: 2,
      tokenStats: { attack: 2, health: 2 },
      tokenType: 'legion',
      damage: 0,
    },
  },
  {
    id: 'rw-spell-rally-troops',
    name: 'Rally the Troops',
    description: 'Create one 2/2 Legion token. Costs 2RW.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 2,
    consumesRunes: true, // Requires RW runes - cheaper option for early game
    effect: {
      type: 'create_tokens', // Custom effect: creates 1x 2/2 Legion token
      tokenCount: 1,
      tokenStats: { attack: 2, health: 2 },
      tokenType: 'legion',
      damage: 0,
    },
  },
  {
    id: 'rw-spell-rapid-deployment',
    name: 'Rapid Deployment',
    description: 'Create two 1/1 Legion tokens. Costs 2RW.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 2,
    consumesRunes: true, // Requires RW runes - early game token generation
    effect: {
      type: 'create_tokens', // Custom effect: creates 2x 1/1 Legion tokens
      tokenCount: 2,
      tokenStats: { attack: 1, health: 1 },
      tokenType: 'legion',
      damage: 0,
    },
  },
  // RW Combat Tricks - Removed Soul of Spring and Living Armor
  // RW Color Identity Cards - Heavy RRRR/WWWW costs to discourage splashing
  // Divine Wrath removed - replaced with artifact
  {
    id: 'rw-spell-war-banner',
    name: 'War Banner',
    description: 'All your units gain +1 attack. If you control 3+ Legion units, they gain +2 attack instead. Costs 2RR.',
    cardType: 'spell',
    colors: ['red', 'red'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a conditional buff
      damage: 0,
    },
    initiative: false,
  },
  // New multi-target damage spells
  {
    id: 'red-spell-chain-lightning',
    name: 'Chain Lightning',
    description: 'Deal 3 damage to target, then 2 damage to an adjacent unit, then 1 to another adjacent. Costs 5R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 5,
    effect: {
      type: 'chain_damage',
      chainDamages: [3, 2, 1],
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'red-spell-lightning-strike',
    name: 'Lightning Strike',
    description: 'Deal 4 damage to target unit or hero. Costs 3R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'red-spell-thunder-bolt',
    name: 'Thunder Bolt',
    description: 'Deal 3 damage to target unit or hero. If you control a red hero, deal 1 additional damage. Costs 2R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'red-spell-battle-rage',
    name: 'Battle Rage',
    description: 'Target hero becomes immune to damage this turn and fights an adjacent enemy unit. Costs 3R, refunds 3 mana.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for immunity + forced fight
      damage: 0,
      affectsUnits: false,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'red-spell-double-edged-sword',
    name: 'Double-Edged Sword',
    description: 'Target unit gains +6 attack but takes +6 additional damage when damaged this turn. Costs 1R, refunds 1 mana.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    refundMana: 1, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff + vulnerability
      damage: 0,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
]

// ============================================================================
// RG (Red/Green) - Beefy Aggro with Fight
// ============================================================================

export const rgHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // RG Dopamine Hit: Activated Fight Hero
  {
    id: 'rg-hero-axe-warrior',
    name: 'Axe Warrior',
    description: '4/10. Activated (1 mana): Fight all enemy units in front of this hero and adjacent to it. (Normally buff first since only 4 attack)',
    cardType: 'hero',
    colors: ['red', 'green'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Can fight enemy units.',
    equippedItems: [],
    ability: {
      name: 'Battle Rage',
      description: 'Fight all enemy units in front of this hero and adjacent to it.',
      manaCost: 1,
      cooldown: 0, // Can use multiple times
      effectType: 'multi_fight', // Custom effect: fights front + adjacent
      effectValue: 3, // Can hit up to 3 units
    },
  },
  // RG Mighty Champion
  {
    id: 'green-hero-mighty-champion',
    name: 'Mighty Champion',
    description: '4/6. Your creatures with 5+ power get +1/+1.',
    cardType: 'hero',
    colors: ['green'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Creatures with 5+ power get +1/+1',
    equippedItems: [],
    ability: {
      name: 'Mighty Blessing',
      description: 'Passive: Your creatures with 5+ power get +1/+1.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 1,
    },
  },
  // Chromatic Payoff Hero - Green's rune identity
  {
    id: 'rg-hero-chromatic-brawler',
    name: 'Chromatic Brawler',
    description: '4/6. Gains +2 attack when you cast spells with U or B runes.',
    cardType: 'hero',
    colors: ['red', 'green'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Chromatic payoff for U/B runes.',
    equippedItems: [],
    ability: {
      name: 'Elemental Fury',
      description: 'Passive: When you spend U or B runes, this hero gains +2 attack this turn.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 0,
      chromaticPayoff: {
        triggerColors: ['blue', 'black'],
        effectType: 'buff',
        effectValue: 2,
        perRuneSpent: false,
        description: 'Gains +2 attack when you spend U or B runes'
      }
    }
  },
]

export const rgCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Cleave units moved from RW (cleave is RG identity)
  {
    id: 'red-unit-cleaving-warrior',
    name: 'Cleaving Warrior',
    description: '2/2. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-unit-cleaving-berserker',
    name: 'Cleaving Berserker',
    description: '3/2. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: true, // Requires R rune
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  // RG Dopamine Hit: Multi-Fight Unit
  {
    id: 'rg-unit-battle-tyrant',
    name: 'Battle Tyrant',
    description: '5/5. When this enters, it fights all enemy units in front of it and adjacent to it. (Can wipe 3 units if lucky) Costs 6G.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 6,
    consumesRunes: true, // Requires G rune - high dopamine hit card
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    specialEffects: ['multi_fight'], // Custom effect: fights front + adjacent on enter
  },
  // NEW: RG Mighty Units (5+ power) Synergy
  {
    id: 'rg-mighty-chieftain',
    name: 'Mighty Chieftain',
    description: '5/5. If you control a unit with 5+ attack, this gains +2/+0 and can attack twice. 5G.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'rg-mighty-warlord',
    name: 'Warlord of the Wilds',
    description: '4/5. When you play a unit with 5+ attack, draw a card. 4G.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 4,
    consumesRunes: true,
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'rg-mighty-herald',
    name: 'Herald of Giants',
    description: '3/4. Units with 5+ attack you play cost 1 less. 3R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

export const rgSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // RG Balance: Increased costs and rune requirements
  {
    id: 'rg-fight-1',
    name: 'Fight Spell',
    description: 'Make unit fight enemy. Target unit deals damage equal to its attack to target enemy unit. Costs 4RG.',
    cardType: 'spell',
    colors: ['red', 'green'],
    manaCost: 4,
    consumesRunes: true, // Requires both R and G runes
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for fight mechanic
      damage: 0,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rg-spell-mighty-strike',
    name: 'Mighty Strike',
    description: 'Target creature with 5+ power deals damage equal to its power to target unit. Costs 5RG.',
    cardType: 'spell',
    colors: ['red', 'green'],
    manaCost: 5,
    consumesRunes: true, // Requires both R and G runes
    effect: {
      type: 'targeted_damage',
      damage: 0, // Damage equals creature's power
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rg-spell-overwhelming-force',
    name: 'Overwhelming Force',
    description: 'All your creatures with 5+ power get +2/+2 until end of turn. Costs 6RG.',
    cardType: 'spell',
    colors: ['red', 'green'],
    manaCost: 6,
    consumesRunes: true, // Requires both R and G runes
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for team buff
      damage: 0,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
]

// ============================================================================
// RU (Red/Blue) - Spell Slinger
// ============================================================================

export const ruHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'ru-hero-spellblade',
    name: 'Spellblade',
    description: '3/6. Whenever you cast your 2nd spell each turn, copy it and you can choose new targets.',
    cardType: 'hero',
    colors: ['red', 'blue'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Copies 2nd spell each turn',
    equippedItems: [],
    ability: {
      name: 'Spell Copy',
      description: 'Whenever you cast your 2nd spell each turn, copy it and you can choose new targets.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'custom',
      effectValue: 0,
    },
  },
]

export const ruCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // REMOVED: Fire Bolt (ru-sig-spellblade-1) - No longer fits color identity
]

export const ruSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'ru-spell-1',
    name: 'Lightning Bolt',
    description: 'Deal 4 damage',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    consumesRunes: true, // Not generic - consumes runes
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ru-spell-2',
    name: 'Fireball',
    description: 'Deal 5 damage. Costs 3R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ru-spell-4',
    name: 'Meteor',
    description: 'Deal 6 damage to all units',
    cardType: 'spell',
    colors: ['red'],
    consumesRunes: true, // Powerful AOE damage
    manaCost: 6,
    effect: {
      type: 'all_units_damage',
      damage: 6,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
]

// ============================================================================
// RB (Red/Black) - Kill All Enemies, Trade Resources
// ============================================================================

export const rbHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Strong Mono-Black Hero
  {
    id: 'black-hero-soul-reaper',
    name: 'Soul Reaper',
    description: '3/5. Whenever you cast a spell, opponent loses 1 life.',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'Converts spells into tower damage.',
    equippedItems: [],
    ability: {
      name: 'Soul Siphon',
      description: 'Passive: Whenever you cast a spell, opponent tower loses 1 HP.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'damage_target',
      effectValue: 1,
    },
  },
]

export const rbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Generic RB cards
  // New BR units for aggressive strategies
  // New Spell-Synergy BR Units
  {
    id: 'rb-unit-spell-fencer',
    name: 'Spell Fencer',
    description: '2/3. Whenever you cast a spell, this unit gets +1/+0 this turn. Costs 2R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 2,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'red-unit-tower-burner',
    name: 'Tower Burner',
    description: '3/2. Whenever you cast a noncreature spell, deal 1 damage to opponent tower. Costs 3R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  // RB Spell Velocity Units (keep existing, add new)
  {
    id: 'rb-unit-velocity-enforcer',
    name: 'Velocity Enforcer',
    description: '3/2. Whenever you cast your 2nd spell each turn, this deals 2 damage to enemy tower. Costs 3RB.',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    specialEffects: ['multispell_tower_damage'], // Deals tower damage on 2nd spell
  },
  // Moved from blackMidrangeCards - Token Ritualist (spell velocity support)
  {
    id: 'rb-unit-token-ritualist',
    name: 'Token Ritualist',
    description: '2/3. Sacrifice a token: Create a free spell in hand that deals 4 damage to any target. Costs 3B.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['token_sacrifice'], // Custom: sacrifice token to create free spell (spell velocity)
  },
  // Moved from monoRedAggroCards - Artifact Forger (artifact sacrifice fits RB)
  {
    id: 'rb-unit-artifact-forger',
    name: 'Artifact Forger',
    description: '3/3. Sacrifice an artifact: Create a 5/1 token. Costs 3R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['artifact_sacrifice'], // Custom: sacrifice artifact to create token
  },
]

export const rbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Mono-Black Signature Spell
  {
    id: 'black-sig-shadow-strike',
    name: 'Shadow Strike',
    description: 'Destroy target unit with 4 or less health. Costs 3B, refunds 3 mana.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill of units with 4 or less health
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  // New multi-target damage spells
  {
    id: 'black-spell-twin-strike',
    name: 'Twin Strike',
    description: 'Deal 4 damage to up to 2 different targets. Costs 5UBR.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'multi_target_damage',
      damage: 4,
      maxTargets: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'black-spell-spread-plague',
    name: 'Spread the Plague',
    description: 'All enemies get -1/-1 permanently. At the start of the next 2 turns, repeat this effect. Costs 6UBR.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for permanent debuff + repeat
      damage: 0,
    },
    initiative: true,
  },
  // RB multicolor spell
  {
    id: 'rb-spell-dual-elimination',
    name: 'Dual Elimination',
    description: 'Deal 5 damage to up to 2 different targets. Costs 4R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: true, // Requires R rune
    effect: {
      type: 'multi_target_damage',
      damage: 5,
      maxTargets: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // New BR spells for tower damage, life drain, and debuffs
  {
    id: 'rb-spell-ruthless-strike',
    name: 'Ruthless Strike',
    description: 'Deal 1 damage to tower and draw one card. Costs 1R, but costs no runes.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage',
      damage: 1,
      drawCount: 1,
    },
    initiative: true,
  },
  // RB Spell Velocity Spells
  {
    id: 'rb-spell-spell-storm',
    name: 'Spell Storm',
    description: 'Deal 2 damage to target. If this is your 2nd+ spell this turn, refund 2 mana. Costs 2RB.',
    cardType: 'spell',
    colors: ['red', 'black'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
    refundMana: 2, // Refunds 2 mana if 2nd+ spell
    specialEffects: ['multispell_refund'], // Refunds mana on 2nd+ spell
    initiative: true,
  },
  // New BR Spell-Synergy Spells
  {
    id: 'red-spell-quickfire-bolt',
    name: 'Quickfire Bolt',
    description: 'Deal 2 damage to target unit or tower. Refund 1 mana if you cast another spell this turn. Costs 1R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'rb-spell-double-strike',
    name: 'Double Strike',
    description: 'Deal 3 damage to target. Draw a card if this is your 2nd+ spell this turn. Costs 2B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      drawCount: 1, // Conditional on being 2nd+ spell
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'black-spell-execute-weakness',
    name: 'Execute Weakness',
    description: 'Destroy target unit with 3 or less health. Draw a card if you have cast 2+ spells this turn. Costs 3B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill
      drawCount: 1, // Conditional on 2+ spells
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'black-spell-weaken',
    name: 'Weaken',
    description: 'Target unit gets -2/-0 until end of turn. Costs 1B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage',
      damage: 0, // No immediate damage, debuff effect
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'red-spell-flame-sweep',
    name: 'Flame Sweep',
    description: 'Deal 1 damage to all units and 1 to opponent tower. Costs 2R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'aoe_damage',
      damage: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
]

// ============================================================================
// GW (Green/White) - Go Wide, Protect Units, Auras
// ============================================================================

export const gwHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'gw-hero-warden',
    name: 'Nature Warden',
    description: 'Protects and buffs team',
    cardType: 'hero',
    colors: ['green', 'white'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Grants barrier to allies',    equippedItems: [],
    ability: {
      name: 'Nature\'s Protection',
      description: 'Give target unit barrier this turn. If this hero is in front of it, it also gains +2/+0.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'custom', // Custom: grants barrier
      effectValue: 1,
    },
  },
  // GW Barrier Guardian (GWU pivot)
  {
    id: 'green-hero-barrier-guardian',
    name: 'Barrier Guardian',
    description: '2/7. Activated: Give target unit barrier until end of turn.',
    cardType: 'hero',
    colors: ['green'],
    attack: 2,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Can grant barrier to units',
    equippedItems: [],
    ability: {
      name: 'Grant Barrier',
      description: 'Give target unit barrier (damage immunity) until end of turn.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'custom', // Custom: grants barrier
      effectValue: 1,
    },
  },
  // GW Stun Enforcer (GWU pivot)
  {
    id: 'green-hero-stun-enforcer',
    name: 'Stun Enforcer',
    description: '3/6. Whenever you stun a unit, this hero gets +2/+0 this turn.',
    cardType: 'hero',
    colors: ['green'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Gains power when stunning enemies',
    equippedItems: [],
    ability: {
      name: 'Stun Synergy',
      description: 'Passive: Whenever you stun a unit, this hero gets +2/+0 this turn.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 2,
    },
  },
  // White Radiant Protector
  {
    id: 'white-hero-radiant-protector',
    name: 'Radiant Protector',
    description: '3/7. Activated: Give target unit barrier. When you give barrier, this hero gets +1/+1 permanently (max 3 times).',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Grows when granting barrier',
    equippedItems: [],
    ability: {
      name: 'Protective Blessing',
      description: 'Give target unit barrier this turn. This hero gains +1/+1 permanently (max 3 times).',
      manaCost: 2,
      cooldown: 1,
      effectType: 'custom', // Custom: grants barrier and grows
      effectValue: 1,
    },
  },
  // White Stun Specialist
  {
    id: 'white-hero-stun-specialist',
    name: 'Stun Specialist',
    description: '4/5. Whenever you stun 2+ units in one turn, draw a card.',
    cardType: 'hero',
    colors: ['white'],
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'Rewards stunning multiple units',
    equippedItems: [],
    ability: {
      name: 'Mass Stun Reward',
      description: 'Passive: Whenever you stun 2+ units in one turn, draw a card.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'draw_card',
      effectValue: 1,
    },
  },
  // Strong Mono-White Hero
  {
    id: 'white-hero-divine-champion',
    name: 'Divine Champion',
    description: '4/8. Activated: Swap positions with target unit and give it barrier.',
    cardType: 'hero',
    colors: ['white'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Can swap positions and grant barrier',
    signatureCardId: 'white-sig-divine-protection',
    equippedItems: [],
    ability: {
      name: 'Divine Swap',
      description: 'Swap positions with target unit and give it barrier.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'custom', // Custom: swap positions and grant barrier
      effectValue: 0,
    },
  },
  // White Hero: Mobile Stunner
  {
    id: 'white-hero-mobile-stunner',
    name: 'Mobile Stunner',
    description: '3/6. Activated: Move 4 paces and stun all adjacent enemy heroes.',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Can move and stun enemies',
    equippedItems: [],
    ability: {
      name: 'Stunning Charge',
      description: 'Move this hero 4 paces and stun all adjacent enemy heroes.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'move_hero',
      effectValue: 4, // Move 4 paces
    },
  },
  // White Hero: Deployment Stunner
  {
    id: 'white-hero-deployment-stunner',
    name: 'Deployment Stunner',
    description: '3/7. When deployed, stuns the enemy unit blocking it.',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Stuns blocking enemy on deployment',
    equippedItems: [],
    ability: {
      name: 'Deployment Strike',
      description: 'When this hero is deployed, stun the enemy unit in front of it.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'on_deploy',
      effectType: 'custom', // Custom: stuns blocking enemy on deployment
      effectValue: 1,
    },
  },
  // Chromatic Payoff Hero - Green's rune identity
]

export const gwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // REMOVED: Protective Aura (gw-sig-warden-1) - No longer fits color identity
  // Generic GW cards
  // Saproling removed
  // Glorious Banner removed - replaced with artifact
  // NEW: Permanent hero buff spells
  {
    id: 'gw-spell-balanced-growth',
    name: 'Balanced Growth',
    description: 'Target hero gains +2/+2 permanently and gains a 1 cost activated ability to move to an adjacent slot. 3G.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - permanent +2/+2 buff + movement ability
    },
  },
  {
    id: 'gw-spell-offensive-blessing',
    name: 'Offensive Blessing',
    description: 'Spell. Target hero gains +4/+0 permanently. 4G.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - permanent +4/+0 buff
    },
  },
  {
    id: 'gw-spell-berserker-blessing',
    name: 'Berserker Blessing',
    description: 'Spell. Target hero gains +5/+0 and Quickstrike permanently. 6GGW.',
    cardType: 'spell',
    colors: ['green', 'green', 'green', 'white'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - permanent +5/+0 and Quickstrike
    },
  },
  // New Mighty Creatures (5+ power)
  {
    id: 'gw-unit-barrier-titan',
    name: 'Barrier Titan',
    description: '4/6. Your creatures with 5+ power have barrier. Costs 5W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    consumesRunes: true,
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  // Stun/Barrier Cards
  {
    id: 'gw-unit-barrier-sentinel',
    name: 'Barrier Sentinel',
    description: '3/3 with Barrier. Costs 3W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['barrier'],
  },
  {
    id: 'white-unit-barrier-giver',
    name: 'Barrier Giver',
    description: '2/5. When this enters, give another unit barrier. Costs 4W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: true,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'gw-unit-combat-barrier',
    name: 'Combat Barrier',
    description: '4/4. When this blocks or is blocked, give it barrier. Costs 4W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: true,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // Stun Spells
  {
    id: 'uw-spell-mass-stun',
    name: 'Mass Stun',
    description: 'Stun up to 2 target units. Costs 5UW.',
    cardType: 'spell',
    colors: ['blue', 'white'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'stun',
      maxTargets: 2,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'white-spell-barrier-grant',
    name: 'Grant Barrier',
    description: 'Give up to 2 units barrier this turn. Costs 3W.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'custom', // Custom: grants barrier to 2 units
      maxTargets: 2,
    },
    initiative: true,
  },
  // 5+ Cost Spell Payoffs
  {
    id: 'wu-unit-spell-payoff',
    name: 'Spell Scholar',
    description: '3/4. Whenever you cast a 5+ cost spell, draw a card. Costs 4WU.',
    cardType: 'generic',
    colors: ['white', 'blue'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'gwu-spell-position-swap',
    name: 'Position Swap',
    description: 'Swap 2 units positions and give them both barrier. Costs 5GWU.',
    cardType: 'spell',
    colors: ['green', 'white', 'blue'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'custom', // Custom: swaps positions and grants barrier
      maxTargets: 2,
    },
    initiative: true,
  },
  {
    id: 'blue-spell-power-bounce',
    name: 'Power Bounce',
    description: 'Return all units with 3 or less power to hand. Refund 6 mana. Costs 6U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 6,
    consumesRunes: true,
    refundMana: 6,
    effect: {
      type: 'custom', // Custom: bounces low-power units
    },
    initiative: true,
  },
]

// ============================================================================
// GB (Green/Black) - Midrange, Beefy Units, Kill Spells
// ============================================================================

export const gbHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'gb-hero-reaper',
    name: 'Death Druid',
    description: 'Midrange threat',
    cardType: 'hero',
    colors: ['green', 'black'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Gain gold when units die',    equippedItems: [],
    ability: {
      name: 'Nature\'s Wrath',
      description: 'Destroy target unit with 3 or less health. Gain +1 max mana.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'damage_target',
      effectValue: 999, // Effectively destroy
    },
  },
  {
    id: 'gb-hero-assassin',
    name: 'Poison Assassin',
    description: 'Kill spells and threats',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Kill spells cost -1',    equippedItems: [],
    bonusVsHeroes: 4, // Assassin: deals double damage to heroes (4 base attack = 8 vs heroes)
  },
  // Chromatic Payoff Hero - Green's rune identity
  {
    id: 'gb-hero-chromatic-destroyer',
    name: 'Chromatic Destroyer',
    description: '4/6. When a unit across from it dies, heal tower for 2.',
    cardType: 'hero',
    colors: ['green', 'black'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    ability: {
      name: 'Death Healing',
      description: 'When a unit across from this hero dies, heal your tower for 2.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'custom',
      effectValue: 2,
    }
  },
  // Counter Master Hero - GB counter-based mighty support
  {
    id: 'gb-hero-counter-master',
    name: 'Counter Master',
    description: '3/6. Your creatures with +1/+1 counters have +1/+1. Activated: Put a +1/+1 counter on target creature. Costs 1GB.',
    cardType: 'hero',
    colors: ['green', 'black'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    ability: {
      name: 'Counter Mastery',
      description: 'Activated: Put a +1/+1 counter on target creature. Passive: Your creatures with +1/+1 counters have +1/+1.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'add_counter',
      effectValue: 1,
    },
    supportEffect: 'Your creatures with +1/+1 counters have +1/+1',
  },
]

export const gbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // GB (Green-Black) - Counter-Based Mighty Support
  {
    id: 'gb-unit-counter-bearer',
    name: 'Counter Bearer',
    description: '1/1. Enters with 2 +1/+1 counters. When this dies, return it to hand with +1/+1 counter. Costs 3GB.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 1,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    entersWithCounters: 2, // Enters with 2 +1/+1 counters (becomes 3/3, supports mighty)
    specialEffects: ['returns_with_counter'], // Returns to hand with +1/+1 when dies
  },
  {
    id: 'gb-unit-counter-shifter',
    name: 'Counter Shifter',
    description: '2/2. Enters with 2 +1/+1 counters. Activated: Move a +1/+1 counter from this to target creature. Costs 4GB.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    entersWithCounters: 2, // Enters with 2 +1/+1 counters (becomes 4/4, supports mighty)
    specialEffects: ['counter_transfer'], // Can move counters to other creatures
  },
  {
    id: 'gb-unit-mighty-revenant',
    name: 'Mighty Revenant',
    description: '2/2. Enters with 3 +1/+1 counters. When a creature with 5+ power dies, return this to hand with +1/+1 counter. Costs 5GB.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 5,
    consumesRunes: true,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    entersWithCounters: 3, // Enters with 3 +1/+1 counters (becomes 5/5, supports mighty)
    specialEffects: ['returns_with_counter_on_mighty_death'], // Returns when mighty unit dies
  },
  {
    id: 'gb-unit-counter-collective',
    name: 'Counter Collective',
    description: '3/3. All creatures with +1/+1 counters get +1/+1. When this dies, distribute its +1/+1 counters among your creatures. Costs 4GB.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['counter_anthem', 'distribute_counters_on_death'], // Buffs creatures with counters, distributes on death
  },
]

// ============================================================================
// Black Midrange Core - Efficient Removal, Card Draw, Value (RPS Midrange Archetype)
// ============================================================================

export const blackMidrangeCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Token Ritualist moved to RB (spell velocity support)
  // Insightful Scholar and Knowledge Seeker removed (generic, don't fit guilds)
]

// ============================================================================
// Rune-Consuming Finishers - Payoffs for Multicolor Rune Generation
// ============================================================================



export const gbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // GB Counter Support Spells
  {
    id: 'gb-spell-counter-growth',
    name: 'Counter Growth',
    description: 'Put two +1/+1 counters on target creature. If it has 5+ power, draw a card. Costs 3GB.',
    cardType: 'spell',
    colors: ['green', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'add_counters',
      damage: 0,
      effectValue: 2, // Adds 2 +1/+1 counters
    },
    initiative: true,
  },
]

// ============================================================================
// GU (Green/Blue) - Ramp Deck
// ============================================================================

export const guHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Strong Mono-Blue Hero
  // Chromatic Payoff Hero - Green's rune identity
  {
    id: 'gu-hero-chromatic-sage',
    name: 'Chromatic Sage',
    description: '2/6. Gain 1 mana when you cast spells with R or W runes.',
    cardType: 'hero',
    colors: ['green', 'blue'],
    attack: 2,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    ability: {
      name: 'Prismatic Abundance',
      description: 'Passive: When you spend R or W runes, gain 1 mana.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'mana_gain',
      effectValue: 0,
      chromaticPayoff: {
        triggerColors: ['red', 'white'],
        effectType: 'mana',
        effectValue: 1,
        perRuneSpent: false,
        description: 'Gain 1 mana when spending R or W runes'
      }
    }
  },
]

export const guCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // REMOVED: Leyline (gu-ramp-2) - No longer fits color identity (was easier)
]

export const guSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Mono-Green Signature Spell
  {
    id: 'green-sig-natures-growth',
    name: 'Nature\'s Growth',
    description: 'Gain +1 max mana. Target unit gains +3/+3. Costs 2G, refunds 2 mana.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 2,
    consumesRunes: true, // Requires G rune
    refundMana: 2, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for mana gain + buff
      damage: 0,
      affectsUnits: true,
    },
    initiative: true,
  },
  // Mana Surge removed - replaced with green artifact
  // Green Dopamine Hit: Combat Protection
  {
    id: 'green-spell-nature-shield',
    name: 'Nature\'s Shield',
    description: 'All your units gain +0/+4 until end of turn. They cannot be destroyed this turn.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 4,
    effect: {
      type: 'aoe_damage', // Placeholder - would be team buff + indestructible
      damage: 0,
    },
  },
  {
    id: 'green-spell-combat-protection',
    name: 'Combat Protection',
    description: 'Stun 3 units, look at the top 5 cards of library and put a unit with cost 5 or less in play. Costs 4G.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'stun', // Placeholder - would need custom effect for stun + library manipulation
      stunDuration: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'gu-spell-2',
    name: 'Titan\'s Wrath',
    description: 'Deal 10 damage',
    cardType: 'spell',
    colors: ['green', 'blue'],
    consumesRunes: true, // Powerful high damage
    manaCost: 7,
    effect: {
      type: 'targeted_damage',
      damage: 10,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// ============================================================================
// UB (Blue/Black) - Control Deck
// ============================================================================

export const ubHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Morgana-Inspired Curse Hero (Enhanced)
  {
    id: 'blue-hero-morgana-curser',
    name: 'Curse Weaver',
    description: '2/6. At start of turn: Create a Curse spell in hand. If enemy has cursed units at end of turn, create another Curse. When deployed: Curse target enemy unit. Draw a card whenever an enemy is cursed.',
    cardType: 'hero',
    colors: ['blue'],
    attack: 2,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Creates Curse spells each turn, curses spread if not removed.',
    equippedItems: [],
    ability: {
      name: 'Curse Mastery',
      description: 'At start of turn: Create a Curse spell in hand. If enemy has cursed units at end of turn, create another Curse. When deployed: Curse target enemy unit. Passive: Draw a card whenever an enemy is cursed.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'start_of_turn', // Creates curse spell each turn
      effectType: 'create_curse_spell', // Creates curse spell card
      effectValue: 1, // Creates 1 curse spell, spreads if curses not removed
      spreadEffect: true, // If curses not removed, create more
    },
  },
  {
    id: 'black-hero-night-harvester',
    name: 'Night Harvester',
    description: '3/5. Whenever you cast your 2nd spell each turn, draw a card and this hero gains +1/+1 until end of turn.',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'Multi-spell reward: card draw and buffs.',
    equippedItems: [],
    ability: {
      name: 'Night Harvest',
      description: 'Passive: Whenever you cast your 2nd spell each turn, draw a card and this hero gains +1/+1 until end of turn.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'draw_card',
      effectValue: 1,
    },
  },
]

export const ubCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // UB Control Archetype Units (minimal units - focus on spells)
  // Green cards added to UB deck (UBG)
  // Verdant Colossus removed - replaced with Void Cascade AOE spell
  // 3+X Unit Cycle
  // More Cleave Units
  // More 1-3 mana creeps
  // Blue creeps
  // REMOVED: Protective Aura (white-creep-protective-aura) - No longer fits color identity
  // REMOVED: Necromancer Apprentice, Druid Adept, Clue Investigator - Generic effects, don't support archetypes
  // New UB Curse/Stun Cards
  {
    id: 'ub-unit-spell-stunner',
    name: 'Spell Stunner',
    description: '2/3. Whenever you cast your 2nd spell each turn, stun target unit. Costs 3U.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // UB Multispell Support Units
  {
    id: 'ub-unit-spell-scribe',
    name: 'Spell Scribe',
    description: '2/3. When you cast your 2nd spell each turn, draw a card. Costs 3UB.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['multispell_draw'], // Draws on 2nd spell
  },
  {
    id: 'ub-unit-multispell-enabler',
    name: 'Multispell Enabler',
    description: '3/4. Spells you cast cost 1 less if you have cast 2+ spells this turn. Costs 4UB.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['multispell_cost_reduction'], // Reduces spell costs after 2nd spell
  },
  // UB Infinite Combo Pieces
  {
    id: 'ub-unit-combo-drawer',
    name: 'Combo Drawer',
    description: '2/2. When you cast a spell from the top of your library, draw a card. Costs 3UB.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    specialEffects: ['draw_on_top_cast'], // Infinite combo piece 2
  },
  {
    id: 'ub-unit-artifact-untapper',
    name: 'Artifact Untapper',
    description: '2/3. When you cast a spell, untap target artifact. Costs 3UB.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['untap_artifact'], // Infinite combo piece 3
  },
  {
    id: 'ub-unit-combo-finisher',
    name: 'Combo Finisher',
    description: '4/4. When you cast 10+ spells in a turn, you win the game. Costs 5UB.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 5,
    consumesRunes: true,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['combo_win_condition'], // Infinite combo piece 4
  },
  {
    id: 'ub-unit-multi-spell-stunner',
    name: 'Multi-Spell Stunner',
    description: '3/4. When this enters, if you have cast 2+ spells this turn, stun target unit. Costs 4B.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

// UBG Artifacts - Persistent effects in base (U, G, B, or combinations only)
export const ubArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  // UB Infinite Combo Pieces
  {
    id: 'ub-artifact-top-of-library',
    name: 'Sensei\'s Divining Top',
    description: 'Artifact. Pay 1 mana: Look at the top card of your library. You may cast it if it\'s a spell. Costs 2UB.',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 2,
    consumesRunes: true,
    effectType: 'custom',
    effectValue: 0,
    specialEffects: ['look_at_top_card'], // Infinite combo piece 1
  },
  {
    id: 'ub-artifact-clue-generator',
    name: 'Clue Generator Artifact',
    description: 'Artifact. At the start of every turn, create a clue token in base. Pay 2 or either U/B rune to draw a card and destroy this token. Costs 3UB.',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'token_generation',
    effectValue: 1, // Creates clue token each turn
  },
  // Rune Generators - 2 Mana Single Color (Mox/Seal style)
  {
    id: 'artifact-red-seal',
    name: 'Red Seal',
    description: 'Artifact. At the start of your turn, add 1 temporary red rune to your mana pool. Costs 2.',
    cardType: 'artifact',
    colors: ['red'],
    manaCost: 2,
    // No rune requirement - helps you get runes
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary red rune per turn
  },
  {
    id: 'artifact-blue-seal',
    name: 'Blue Seal',
    description: 'Artifact. At the start of your turn, add 1 temporary blue rune to your mana pool. Costs 2.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 2,
    // No rune requirement - helps you get runes
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary blue rune per turn
  },
  {
    id: 'artifact-black-seal',
    name: 'Black Seal',
    description: 'Artifact. At the start of your turn, add 1 temporary black rune to your mana pool. Costs 2.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 2,
    // No rune requirement - helps you get runes
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary black rune per turn
  },
  {
    id: 'artifact-green-seal',
    name: 'Green Seal',
    description: 'Artifact. At the start of your turn, add 1 temporary green rune to your mana pool. Costs 2.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 2,
    // No rune requirement - helps you get runes
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary green rune per turn
  },
  {
    id: 'artifact-white-seal',
    name: 'White Seal',
    description: 'Artifact. At the start of your turn, add 1 temporary white rune to your mana pool. Costs 2.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 2,
    // No rune requirement - helps you get runes
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary white rune per turn
  },
  // Rune Generators - 4 Mana Any Color (Premium)
  {
    id: 'artifact-prismatic-generator',
    name: 'Prismatic Generator',
    description: 'Artifact. At the start of your turn, add 1 temporary rune of any color and 1 temporary mana to your mana pool. Costs 4.',
    cardType: 'artifact',
    colors: [], // Colorless - can generate any color
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary rune of any color per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // 3+X Artifact Cycle
  {
    id: 'black-artifact-rune-scroll',
    name: 'Rune Scroll',
    description: 'Artifact. At the start of every turn, create a scroll token in base. Pay 2 or either B rune to draw a card and destroy this token. Costs 3B.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'token_generation',
    effectValue: 1, // Creates scroll token each turn
  },
  {
    id: 'black-artifact-rix-altar',
    name: 'Black Rix Altar',
    description: 'Artifact. Sacrifice a hero: Deal 4 damage to enemy tower. Costs 3B.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'custom',
    effectValue: 4, // 4 damage to enemy tower when hero sacrificed
  },
  {
    id: 'ubr-artifact-damage-tap',
    name: 'Void Strike Artifact',
    description: 'Artifact. Pay 1 mana: Deal 5 damage to any unit. Costs 6URB.',
    cardType: 'artifact',
    colors: ['blue', 'black', 'red'],
    manaCost: 6,
    consumesRunes: true,
    effectType: 'custom',
    effectValue: 5, // Deal 5 damage when tapped for 1 mana
  },
  {
    id: 'green-spell-natures-blessing',
    name: 'Nature\'s Blessing',
    description: 'Target creature gets +2/+2 and 2 regen. Costs 3G.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff + regen
      damage: 0,
    },
    initiative: true,
  },
]

// ============================================================================
// MONO-COLOR ARCHETYPE ARTIFACTS - 3 Mana Archetype Trackers
// ============================================================================

export const archetypeArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  // White Archetype Artifact - Stun Tracker
  {
    id: 'white-artifact-stun-tracker',
    name: 'Stun Master\'s Tome',
      description: 'Artifact. Tracks stuns you have caused. When you have stunned 5 units, draw 3 cards and all your units gain barrier this turn. Costs 3W.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 3,
    effectType: 'archetype_tracker',
    effectValue: 5, // Triggers at 5 stuns
  },
  // Green Archetype Artifact - Mighty Tracker
  {
    id: 'green-artifact-mighty-tracker',
    name: 'Mighty Champion\'s Banner',
    description: 'Artifact. Tracks mighty units (5+ power) you control. When you control 3 mighty units, all your mighty units gain +2/+2 permanently. Costs 3G.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'archetype_tracker',
    effectValue: 3, // Triggers at 3 mighty units
  },
  // Red Archetype Artifact - Tower Damage Tracker
  {
    id: 'red-artifact-tower-damage-tracker',
    name: 'Siege Master\'s Log',
    description: 'Artifact. Tracks different sources of damage to enemy tower. When you have dealt damage to tower from 6 different sources, deal 10 damage to enemy tower. Costs 3R.',
    cardType: 'artifact',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'archetype_tracker',
    effectValue: 6, // Triggers at 6 different damage sources
  },
  // Black Archetype Artifact - Multi-Spell Tracker
  {
    id: 'black-artifact-spell-velocity-tracker',
    name: 'Spell Slinger\'s Grimoire',
    description: 'Artifact. Tracks spells cast in a turn. When you cast 3 spells in a single turn, draw 2 cards and deal 3 damage to enemy tower. Costs 3B.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'archetype_tracker',
    effectValue: 3, // Triggers at 3 spells in a turn
  },
  // Blue Archetype Artifact - Spell Book
  {
    id: 'blue-artifact-spell-book',
    name: 'Arcane Spellbook',
    description: 'Artifact. When you play this, choose one: Stun 2 target units (pay BU runes), or deal 4 damage to all enemy units (pay UB runes). Then, create a Scrying Lens artifact that lets you look at the top card of your library each turn and choose to keep it or exile it. Costs 3U.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'spell_book',
    effectValue: 0, // Modal choice - requires BU or UB runes for the chosen effect
  },
  // Blue Scrying Artifact (created by Spell Book)
  {
    id: 'blue-artifact-scrying-lens',
    name: 'Scrying Lens',
    description: 'Artifact. At the start of your turn, look at the top card of your library. You may put it on top or exile it. Costs 0.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 0,
    consumesRunes: false,
    effectType: 'scry_artifact',
    effectValue: 1, // Scry 1 each turn
  },
]

// Note: GW and UW artifacts removed - they don't work with RW vs UBG testing framework
// All artifacts must be RW (R, W, RW) or UBG (U, G, B, or combinations)

export const ubSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Blue positioning spell - Cunning Plan-like
  {
    id: 'blue-spell-cunning-plan',
    name: 'Cunning Plan',
    description: 'Swap target ally or enemy unit at one location with target unit in another spot in the same lane.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    effect: {
      type: 'swap_heroes', // Reusing swap_heroes type for unit swapping
      damage: 0,
    },
  },
  // Signature spells (converted from units)
  // UB AOE spell - replaces one direct damage spell
  {
    id: 'ub-spell-void-cascade',
    name: 'Void Cascade',
    description: 'Deal 5 damage to all enemy units. Costs 5UBR.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'aoe_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  // Rune-consuming removal (3-5 mana) - Creates tension
  {
    id: 'ub-spell-premium-removal',
    name: 'Void Bolt',
    description: 'Deal 7 damage to target unit or hero. Costs 4B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 7,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Blue Dopamine Hit: AOE Board Clearing
  {
    id: 'blue-spell-thunderstorm',
    name: 'Thunderstorm',
    description: 'Deal 4 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'aoe_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  {
    id: 'ub-spell-conditional-removal',
    name: 'Dark Bolt',
    description: 'Deal 5 damage to target unit. If it dies, draw a card. Costs 3B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ub-spell-midrange-aoe',
    name: 'Shadow Wave',
    description: 'Deal 4 damage to all enemy units. Costs 5U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'aoe_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  // UB Curse Support Spells
  {
    id: 'ub-spell-curse',
    name: 'Curse',
    description: 'Curse target unit (opponent pays 3 mana to remove). If a cursed unit is not removed by end of turn, create another Curse spell in hand. Costs 2UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'curse',
      curseCost: 3, // 3 mana to remove
      affectsUnits: true,
      affectsHeroes: false,
    },
    specialEffects: ['curse_spread'], // Creates another curse if not removed
    initiative: true,
  },
  // UB Multispell Support Spells
  {
    id: 'ub-spell-dismember',
    name: 'Dismember',
    description: 'Destroy target unit with 4 or less health. You may pay 4 life instead of paying UB runes. Costs 1UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 1,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 999, // Effectively destroy
      affectsUnits: true,
      affectsHeroes: true,
    },
    lifeCost: 4, // Can pay 4 life instead of runes
    initiative: true,
  },
  {
    id: 'ub-spell-spell-cascade',
    name: 'Spell Cascade',
    description: 'Deal 4 damage to target. Look at top 3 cards, you may cast a spell from among them without paying its mana cost. Costs 6UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
    specialEffects: ['cascade'], // Look at top 3, cast spell for free
  },
  // Low-Cost Dual-Color Spells (Double Spelling Enablers)
  {
    id: 'spell-return-to-base',
    name: 'Tactical Retreat',
    description: 'Return target card to its owner\'s base. It can be deployed next turn.',
    cardType: 'spell',
    colors: ['white', 'blue'],
    manaCost: 1,
    effect: {
      type: 'return_to_base', // Returns card to base
      damage: 0,
    },
    initiative: true, // Quickcast - enables double spelling
  },
  {
    id: 'spell-natures-wisdom',
    name: 'Nature\'s Wisdom',
    description: 'Draw 2 cards and gain 2 life. Costs 2UG.',
    cardType: 'spell',
    colors: ['green', 'blue'],
    manaCost: 2,
    consumesRunes: true, // Requires UG runes
    effect: {
      type: 'draw_and_heal', // Draw cards and heal
      damage: 0,
      drawCount: 2,
      healAmount: 2,
    },
    initiative: true, // Quickcast - enables double spelling
  },
  // More 3-Mana Rune-Cost Cards
  {
    id: 'red-spell-3r-removal',
    name: 'Fire Blast',
    description: 'Deal 4 damage to target unit or tower.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'black-spell-3b-draw',
    name: 'Dark Insight',
    description: 'Draw 2 cards, lose 2 life.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true, // Requires B rune
    effect: {
      type: 'draw_and_heal', // Using draw_and_heal with negative heal
      damage: 0,
      drawCount: 2,
      healAmount: -2, // Negative heal = lose life
    },
    initiative: true,
  },
  {
    id: 'blue-spell-3u-bounce',
    name: 'Arcane Return',
    description: 'Return target unit to its owner\'s hand.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true, // Requires U rune
    effect: {
      type: 'return_to_base', // Reusing return_to_base for bounce
      damage: 0,
    },
    initiative: true,
  },
  // Blue Tempo Spells - Bounce + Draw (Repulse-style)
  {
    id: 'blue-spell-repulse',
    name: 'Repulse',
    description: 'Return target unit to its owner\'s hand. Draw a card. Costs 3U, refunds 3 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true, // Requires U rune
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'return_to_base',
      damage: 0,
      drawCount: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'blue-spell-double-repulse',
    name: 'Double Repulse',
    description: 'Return up to 2 target units to their owners\' hands. Draw a card. Costs 5UU, refunds 5 mana.',
    cardType: 'spell',
    colors: ['blue', 'blue'],
    manaCost: 5,
    consumesRunes: true, // Requires UU runes
    refundMana: 5, // Free spell mechanic
    effect: {
      type: 'return_to_base',
      damage: 0,
      drawCount: 1,
      maxTargets: 2, // Can target up to 2 units
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'blue-spell-temporal-shift',
    name: 'Temporal Shift',
    description: 'Return target unit to its owner\'s hand. Draw a card. Costs 2U, refunds 2 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    refundMana: 2, // Free spell mechanic
    effect: {
      type: 'return_to_base',
      damage: 0,
      drawCount: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'blue-spell-arcane-repulsion',
    name: 'Arcane Repulsion',
    description: 'Return target unit to its owner\'s hand. Draw 2 cards. Costs 4U, refunds 4 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: true, // Requires U rune
    refundMana: 4, // Free spell mechanic
    effect: {
      type: 'return_to_base',
      damage: 0,
      drawCount: 2,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'green-spell-3g-ramp',
    name: 'Wild Growth',
    description: 'Gain +1 max mana. Target unit gains +2/+2 this turn.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true, // Requires G rune
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
    initiative: true,
  },
  // Hero-Threatening Mechanics
  {
    id: 'black-spell-force-fight',
    name: 'Forced Duel',
    description: 'Target hero fights target unit.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true, // Requires B rune
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for fight
      damage: 0,
    },
    initiative: true,
  },
  // Removed: Battle Rage (temporary buff removed)
  {
    id: 'blue-spell-position-swap',
    name: 'Tactical Swap',
    description: 'Swap two units\' positions.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    effect: {
      type: 'swap_heroes', // Reusing swap type for unit swapping
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'black-spell-resource-trade',
    name: 'Dark Bargain',
    description: 'Draw 2 cards, lose 3 life.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 2,
    consumesRunes: true, // Requires B rune
    effect: {
      type: 'draw_and_heal',
      damage: 0,
      drawCount: 2,
      healAmount: -3, // Negative heal = lose life
    },
    initiative: true,
  },
  {
    id: 'green-spell-synergy-payoff',
    name: 'Nature\'s Call',
    description: 'If you control 3+ units, all your units gain +1/+1.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder
      damage: 0,
    },
    initiative: true,
  },
  // Nature's Revenge removed - replaced with artifact
  // UB Control Archetype Spells
  {
    id: 'ub-spell-thunderstorm',
    name: 'Thunderstorm',
    description: 'Deal 3 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Requires U and B runes
    manaCost: 4,
    consumesRunes: true, // Not generic - consumes U and B runes
    effect: {
      type: 'aoe_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  // Early impactful spells
  {
    id: 'ub-spell-light-strike-array',
    name: 'Light Strike Array',
    description: 'Deal 2 damage to enemy unit in front of your hero and stun it.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'damage_and_stun',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
      stunDuration: 1,
    },
  },
  // UBG Removal Spells (from ARTIFACT_CARD_ANALYSIS.md)
  {
    id: 'ubg-spell-deal-3-initiative',
    name: 'Tactical Strike',
    description: 'Deal 3 damage to target unit. You get initiative (play next card first).',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ubg-spell-invulnerable-reflect',
    name: 'Reflective Shield',
    description: 'Target hero gains invulnerable this turn. Any damage that hero would take is reflected back to the source. Costs 2U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    consumesRunes: true, // Requires U rune
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for invulnerable + reflect
      damage: 0,
    },
  },
  {
    id: 'ubg-spell-move-hero',
    name: 'Tactical Repositioning',
    description: 'Move target hero to be directly in front of target unit in different battlefield.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for hero movement
      damage: 0,
    },
  },
  {
    id: 'ubg-spell-aoe-2-all',
    name: 'Frost Wave',
    description: 'Deal 2 damage to all enemy units in target battlefield.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    effect: {
      type: 'aoe_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  {
    id: 'ubg-spell-aoe-6-distributed',
    name: 'Arcane Barrage',
    description: 'Deal 6 damage evenly divided to target unit and adjacent units. 0 units: 6 to tower. 1 unit: 3+3. 2 units: 2+2+2. 3 units: 2+2+2. Costs 4UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 4,
    consumesRunes: true, // Requires UB runes
    effect: {
      type: 'adjacent_damage',
      damage: 6,
      adjacentCount: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Verdant Wrath removed - Void Cascade already provides the same AOE effect (5 damage to all enemy units)
  
  // NEW: UB Draw Synergy Creatures
  {
    id: 'ub-draw-synergy-arcane-adept',
    name: 'Arcane Adept',
    description: '3/4. If you drew 2+ cards this turn, this gains +2/+0 until end of turn. 4UB.',
    cardType: 'generic',
    colors: ['blue', 'blue', 'black'],
    manaCost: 4,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'ub-draw-synergy-knowledge-hunter',
    name: 'Knowledge Hunter',
    description: '4/5. If you drew 2+ cards this turn, this can attack twice this turn. 5UUB.',
    cardType: 'generic',
    colors: ['blue', 'blue', 'blue', 'black'],
    manaCost: 5,
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'ub-draw-synergy-void-scholar',
    name: 'Void Scholar',
    description: '2/3. If you drew 2+ cards this turn, this costs 2 less to play. 3UB.',
    cardType: 'generic',
    colors: ['blue', 'blue', 'black'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// ============================================================================
// Free Spells (Urza Block Inspired) - Cost X + Runes, Refund X Mana
// ============================================================================
// These spells cost mana upfront but refund it after casting, effectively
// making them "free" in terms of mana but still requiring runes to cast.
// Inspired by Urza block cards like Treachery, Frantic Search, and Snap.

export const freeSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Mono-Blue (U) - Cantrips and utility
  {
    id: 'free-spell-arcane-refraction',
    name: 'Arcane Refraction',
    description: 'Draw 1 card. Costs 1U, refunds 1 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 1,
    refundMana: 1,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - would need custom draw effect
    },
    initiative: true,
  },
  {
    id: 'free-spell-deep-study',
    name: 'Deep Study',
    description: 'Draw 2 cards. Costs 2U, refunds 2 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    consumesRunes: true,
    refundMana: 2,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - would need custom draw effect
    },
    initiative: true,
  },
  {
    id: 'free-spell-tactical-reposition',
    name: 'Tactical Reposition',
    description: 'Swap 2 units to different locations. Costs 2U, refunds 2 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    refundMana: 2,
    effect: {
      type: 'swap_heroes',
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'free-spell-aether-pulse',
    name: 'Aether Pulse',
    description: 'Deal 3 damage to all enemy units. Costs 3U, refunds 3 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true,
    refundMana: 3,
    effect: {
      type: 'aoe_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: false,
      affectsEnemyUnits: true,
    },
    initiative: true,
  },
  {
    id: 'free-spell-mana-snap',
    name: 'Mana Snap',
    description: 'Return target unit to its owner\'s hand. Costs 1U, refunds 1 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 1,
    refundMana: 1,
    effect: {
      type: 'return_to_base',
      damage: 0,
    },
    initiative: true,
  },
  // Blue/Red (UR) - Damage + draw
  {
    id: 'free-spell-bolt-of-insight',
    name: 'Bolt of Insight',
    description: 'Deal 4 damage to target unit and draw 1 card. Costs 2UR, refunds 2 mana.',
    cardType: 'spell',
    colors: ['blue', 'red'],
    manaCost: 2,
    refundMana: 2,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'free-spell-arcane-chain-lightning',
    name: 'Arcane Chain Lightning',
    description: 'Deal 3 damage to all enemy units. Costs 3UR, refunds 3 mana.',
    cardType: 'spell',
    colors: ['blue', 'red'],
    manaCost: 3,
    refundMana: 3,
    effect: {
      type: 'aoe_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: false,
      affectsEnemyUnits: true,
    },
    initiative: true,
  },
  {
    id: 'free-spell-combat-flux',
    name: 'Combat Flux',
    description: 'Deal 2 damage to target unit and redirect its combat target. Costs 1UR, refunds 1 mana.',
    cardType: 'spell',
    colors: ['blue', 'red'],
    manaCost: 1,
    refundMana: 1,
    effect: {
      type: 'targeted_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  // Blue/Black (UB) - Draw + mana/removal
  {
    id: 'free-spell-dark-revelation',
    name: 'Dark Revelation',
    description: 'Draw 2 cards and gain 2 mana. Costs 2UB, refunds 2 mana (net +2 mana).',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 2,
    consumesRunes: true,
    refundMana: 2,
    effect: {
      type: 'add_temporary_runes',
      runeColors: ['colorless', 'colorless'], // Using temp runes to represent mana gain
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'free-spell-treacherous-extraction',
    name: 'Treacherous Extraction',
    description: 'Destroy target unit and draw 1 card. Costs 3UB, refunds 3 mana.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 3,
    consumesRunes: true,
    refundMana: 3,
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure destroy
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
]

// ============================================================================
// RWG (Red/White/Green) - Go-Wide Beatdown + Growth
// ============================================================================

export const rwgHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Rare Heroes - Double Color Requirements (Draft Dopamine Hits)
  {
    id: 'bbu-hero-void-tyrant',
    name: 'Void Tyrant',
    description: 'Rare. Token generator.',
    cardType: 'hero',
    colors: ['black', 'blue'],
    attack: 1,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'At the start of each turn, create a 1/1 black token in the nearest slot.',    equippedItems: [],
  },
  {
    id: 'ggw-hero-nature-guardian',
    name: 'Nature Guardian',
    description: '2/5. Whenever this attacks, add a 1/1 attacking in an adjacent slot. GW.',
    cardType: 'hero',
    colors: ['green', 'white'],
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'Creates tokens when attacking',
    equippedItems: [],
    ability: {
      name: 'Nature\'s Swarm',
      description: 'Whenever this attacks, create a 1/1 token in an adjacent slot.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'create_unit',
      effectValue: 1,
    },
  },
]

export const rwgCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // RWG Convergence Units
  {
    id: 'rwg-unit-wild-legionnaire',
    name: 'Wild Legionnaire',
    description: 'Legion. When this attacks, put a +1/+1 counter on it.',
    cardType: 'generic',
    colors: ['red', 'white', 'green'], // 3RGW
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rwg-unit-primal-banner',
    name: 'Primal Banner',
    description: 'All your units gain +1/+1. At the start of your next turn, all your units gain +1/+1 again. Costs 5RWG.',
    cardType: 'generic',
    colors: ['red', 'white', 'green'],
    manaCost: 5, // 2RWG = 5 total mana
    consumesRunes: true, // 3-color card should require runes
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // RGW Big Dumb Creatures - Higher floor, lower ceiling
  {
    id: 'rwg-unit-wild-beast',
    name: 'Wild Beast',
    description: 'Big aggressive creature. Costs 6RG.',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 6,
    consumesRunes: true, // Multicolor 6+ mana should require runes
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  // RGW Finisher Units - Require multiple colors
  {
    id: 'rwg-unit-primal-titan',
    name: 'Primal Titan',
    description: '5/5. When this enters, all your units gain +2/+2 until end of turn. Costs 7RRGG.',
    cardType: 'generic',
    colors: ['red', 'red', 'green', 'green'],
    manaCost: 7,
    consumesRunes: true,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'rwg-unit-nature-warlord',
    name: 'Nature Warlord',
    description: '5/5. When this enters, if you control heroes of 3+ different colors, all your units gain +3/+3 until end of turn. Costs 5RWG.',
    cardType: 'generic',
    colors: ['red', 'white', 'green'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

export const rwgSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // RWG Convergence Spells
  {
    id: 'rwg-spell-convergence-rally',
    name: 'Convergence Rally',
    description: 'All your units gain +2/+2 permanently. If you control heroes of 4 different colors, they gain +3/+3 instead.',
    cardType: 'spell',
    colors: ['red', 'white', 'green'],
    consumesRunes: true, // Powerful 3-color buff
    manaCost: 6, // 3RWG = 6 total mana
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for permanent team buff that scales with color count
      damage: 0,
    },
  },
  {
    id: 'rwg-spell-growth-rally',
    name: 'Growth Rally',
    description: 'All your units gain +1/+1. Put a +1/+1 counter on each of your units.',
    cardType: 'spell',
    colors: ['red', 'white', 'green'],
    manaCost: 4, // 1RWG = 4 total mana
    consumesRunes: true, // Not generic - consumes R, W, and G runes
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for team buff + permanent counters
      damage: 0,
    },
  },
  // RGW Finishers - Require multiple colors
  {
    id: 'rwg-spell-wild-convergence',
    name: 'Wild Convergence',
    description: 'All your units gain +3/+3 and trample this turn. If you control heroes of 3+ different colors, draw a card for each unit you control. Costs 8RW.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 8,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff + card draw
      damage: 0,
    },
  },
  // RGW Buff Finishers - Simple, effective
  {
    id: 'rwg-spell-overwhelming-force',
    name: 'Overwhelming Force',
    description: 'All your units gain +3/+3 this turn. Costs 5RW.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff
      damage: 0,
    },
  },
  // Rare Hero Signature Spells - Powerful finishers for pack synergy moments
  {
    id: 'bbu-spell-void-annihilation',
    name: 'Void Annihilation',
    description: 'Destroy all units. Costs 6UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'aoe_damage',
      damage: 999,
      affectsUnits: true,
      affectsHeroes: false,
      affectsEnemyUnits: false,
    },
  },
  // Mono-White Signature Spell
  // White Dopamine Hit: Tower Healing & Protection
  {
    id: 'white-spell-divine-protection',
    name: 'Divine Protection',
    description: 'Target unit gains indestructible until end of turn. (Cannot be destroyed)',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would be indestructible buff
      damage: 0,
    },
  },
  {
    id: 'white-spell-disarm',
    name: 'Disarm',
    description: 'Target enemy unit cannot attack this turn. Draw a card.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 2,
    effect: {
      type: 'stun', // Stun prevents attacking
      damage: 0,
    },
  },
  // New blue multi-target damage spell
  {
    id: 'blue-spell-arcane-missiles',
    name: 'Arcane Missiles',
    description: 'Deal 3 damage split among up to 3 targets (you choose distribution). Costs 3U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true, // Requires U rune
    effect: {
      type: 'split_damage',
      damage: 3,
      maxTargets: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// ============================================================================
// UBG (Blue/Black/Green) - Control + Resilience
// ============================================================================

export const ubgHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'ubg-hero-void-druid',
    name: 'Void Druid',
    description: 'Draw synergy - creates expendable units',
    cardType: 'hero',
    colors: ['blue', 'black'],
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'When you draw your 2nd card each turn, create a 1/1 Void Spawn in the nearest slot. When it dies, deal 1 damage to any unit.',    equippedItems: [],
  },
  {
    id: 'ubg-hero-shadow-sage',
    name: 'Shadow Sage',
    description: 'Resilient control hero',
    cardType: 'hero',
    colors: ['black', 'green'],
    attack: 2,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'When an enemy unit dies, draw a card.',    equippedItems: [],
    bonusVsHeroes: 3, // Assassin: deals bonus damage to heroes
  },
]

export const ubgCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Shadow Growth removed - replaced with artifact
]

export const ubgSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Exorcism moved to UBR (Grixis wedge) - control finisher
  {
    id: 'ubr-spell-exorcism',
    name: 'Exorcism',
    description: 'Deal 12 total damage distributed to enemy units in front and tower. 0 units: 12 to tower. 1 unit: 6 to unit, 6 to tower. 2 units: 4 to each unit, 4 to tower. 3 units: 3 to each unit, 3 to tower. Costs 8UUUBBBR, refunds 8 mana.',
    cardType: 'spell',
    rarity: 'rare',
    colors: ['blue', 'blue', 'blue', 'black', 'black', 'black', 'red'], // PROHIBITIVE: 3U, 3B, 1R
    consumesRunes: true, // This spell requires and consumes UBR runes
    manaCost: 8,
    refundMana: 8, // Free spell mechanic - refunds mana cost
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for Exorcism damage distribution
      damage: 12, // Total damage, distribution handled by custom logic based on units in front
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ubr-spell-dominate-will',
    name: 'Dominate Will',
    description: 'Take control of target enemy unit. Costs 9UBR, refunds 9 mana.',
    cardType: 'spell',
    rarity: 'rare',
    colors: ['blue', 'black', 'red'],
    consumesRunes: true,
    manaCost: 9,
    refundMana: 9, // Free spell mechanic - refunds mana cost
    effect: {
      type: 'steal_unit',
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  // UBR Enhanced Curses with -1/-1 Counters
  {
    id: 'ubr-spell-grixis-curse',
    name: 'Grixis Curse',
    description: 'Curse target unit (opponent pays 4 mana to remove). Cursed unit gets -1/-1. If this kills the unit, draw a card. Costs 3UBR.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'curse_with_debuff',
      curseCost: 4, // Higher cost than default (3)
      debuffValue: -1, // -1/-1 counter
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'ubr-unit-curse-enforcer',
    name: 'Curse Enforcer',
    description: '3/4. Cursed units get -2/-2. When a cursed unit dies, deal 2 damage to enemy tower. Costs 4UBR.',
    cardType: 'generic',
    colors: ['blue', 'black', 'red'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['curse_amplifier', 'curse_death_damage'], // Amplifies curse debuff, deals tower damage on curse death
  },
  // NEW: 4GUB spell - 6 damage, draw a card when it kills
  {
    id: 'gub-spell-predatory-bolt',
    name: 'Predatory Bolt',
    description: 'Deal 6 damage to target unit or hero. If this kills a unit, draw a card. Costs 4GUB.',
    cardType: 'spell',
    colors: ['green', 'blue', 'black'],
    manaCost: 4,
    consumesRunes: true, // Requires GUB runes
    effect: {
      type: 'targeted_damage',
      damage: 6,
      affectsUnits: true,
      affectsHeroes: true,
      // Note: The "draw a card when it kills" mechanic would need custom implementation
    },
  },
  // UBR Big Finisher Spells
  {
    id: 'ubr-spell-grixis-devastation',
    name: 'Grixis Devastation',
    description: 'Deal 10 damage to target unit or hero. Draw 2 cards. Deal 5 damage to enemy tower. Costs 8UBR, refunds 8 mana.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 8,
    consumesRunes: true, // Requires UBR runes
    refundMana: 8, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 10,
      drawCount: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'ubr-spell-void-annihilation',
    name: 'Void Annihilation',
    description: 'Deal 8 damage to all enemy units. Draw a card for each unit destroyed. Costs 9UBR, refunds 9 mana.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 9,
    consumesRunes: true, // Requires UBR runes
    refundMana: 9, // Free spell mechanic
    effect: {
      type: 'aoe_damage',
      damage: 8,
      drawCount: 1, // Will draw per unit destroyed (custom implementation needed)
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  // UBR Card Advantage Spells - AOE + Draw (balanced for control)
  {
    id: 'ubr-spell-grixis-wave',
    name: 'Grixis Wave',
    description: 'Deal 3 damage to all enemy units. Draw 2 cards. Costs 6UBR.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 6,
    consumesRunes: true, // Requires UBR runes
    effect: {
      type: 'aoe_damage',
      damage: 3,
      drawCount: 2,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
    initiative: true,
  },
  {
    id: 'ubr-spell-void-blast',
    name: 'Void Blast',
    description: 'Deal 4 damage to all enemy units. Draw 1 card. Costs 5UBR.',
    cardType: 'spell',
    colors: ['blue', 'black', 'red'],
    manaCost: 5,
    consumesRunes: true, // Requires UBR runes
    effect: {
      type: 'aoe_damage',
      damage: 4,
      drawCount: 1,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
    initiative: true,
  },
]

// ============================================================================
// UBR (Blue/Black/Red) - Grixis Units
// ============================================================================

export const ubrCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ubr-unit-grixis-titan',
    name: 'Grixis Titan',
    description: '4/4. When this enters, deal 5 damage to all enemy units. When this attacks, deal 3 damage to enemy tower. Costs 7UBR.',
    cardType: 'generic',
    colors: ['blue', 'black', 'red'],
    manaCost: 7,
    consumesRunes: true, // Requires UBR runes
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

// ============================================================================
// GBR (Green/Black/Red) - Blood Magic Built-in
// ============================================================================
// All GBR cards have built-in Blood Magic - no hero needed!

export const gbrHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // GBR heroes can be added here if needed
]

export const gbrCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // GRb (Green-Red-Black) - Mighty + Death Triggers + Counter Moving
  {
    id: 'gbr-unit-counter-mover',
    name: 'Counter Mover',
    description: '3/3. Enters with 3 +1/+1 counters. Activated: Move a +1/+1 counter from this to target creature. Costs 3GBR.',
    cardType: 'generic',
    colors: ['green', 'black', 'red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    entersWithCounters: 3, // Enters with 3 +1/+1 counters (becomes 6/6, mighty)
    specialEffects: ['counter_transfer'], // Can move counters to make other units mighty
  },
  {
    id: 'gbr-unit-undercosted-carrier',
    name: 'Undercosted Carrier',
    description: '1/1. Enters with 4 +1/+1 counters. Activated: Move up to 2 +1/+1 counters from this to target creature. Costs 2GB.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 2,
    consumesRunes: true,
    attack: 1,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    entersWithCounters: 4, // Enters with 4 +1/+1 counters (becomes 5/5, mighty)
    specialEffects: ['counter_transfer_multiple'], // Can move multiple counters to make units mighty
  },
  {
    id: 'gbr-unit-mighty-revenant',
    name: 'Mighty Revenant',
    description: '4/4. When this dies, return it to hand with a +1/+1 counter. If you control a creature with 5+ power, return it with 2 +1/+1 counters instead. Costs 5GRB.',
    cardType: 'generic',
    colors: ['green', 'red', 'black'],
    manaCost: 5,
    consumesRunes: true,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['returns_with_counter', 'mighty_bonus_counter'], // Returns with counter, bonus if mighty present
  },
  {
    id: 'gbr-unit-death-counter',
    name: 'Death Counter',
    description: '2/2. Enters with 2 +1/+1 counters. When a creature with 5+ power dies, put a +1/+1 counter on this. Costs 3GB.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    entersWithCounters: 2, // Enters with 2 +1/+1 counters (becomes 4/4, supports mighty)
    specialEffects: ['gains_counter_on_mighty_death'], // Gains counter when mighty unit dies
  },
  {
    id: 'gbr-unit-blood-ritualist',
    name: 'Blood Ritualist',
    description: '6/6. Blood Magic (built-in): Pay tower life for missing runes. B: 2, R/G: 3, U/W: 4 per tower. Costs 5GBR.',
    cardType: 'generic',
    colors: ['green', 'black', 'red'],
    manaCost: 5,
    consumesRunes: true, // Requires GBR runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'gbr-unit-sacrificial-beast',
    name: 'Sacrificial Beast',
    description: '7/5. Blood Magic (built-in). When this enters, deal 3 damage to each tower. Costs 6GBR.',
    cardType: 'generic',
    colors: ['green', 'black', 'red'],
    manaCost: 6,
    consumesRunes: true, // Requires GBR runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    attack: 7,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

export const gbrSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'gbr-spell-blood-ritual',
    name: 'Blood Ritual',
    description: 'Deal 8 damage to target unit or hero. Draw 2 cards. Blood Magic (built-in). Costs 5GBR.',
    cardType: 'spell',
    colors: ['green', 'black', 'red'],
    manaCost: 5,
    consumesRunes: true, // Requires GBR runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    effect: {
      type: 'targeted_damage',
      damage: 8,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'gbr-spell-life-drain',
    name: 'Life Drain',
    description: 'Deal 5 damage to target. Heal your towers for 5. Blood Magic (built-in). Costs 4GBR.',
    cardType: 'spell',
    colors: ['green', 'black', 'red'],
    manaCost: 4,
    consumesRunes: true, // Requires GBR runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    effect: {
      type: 'targeted_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// ============================================================================
// GBRU (Green/Black/Red/Blue) - 4-Color Blood Magic
// ============================================================================

export const gbruCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'gbru-unit-prismatic-destroyer',
    name: 'Prismatic Destroyer',
    description: '8/8. Blood Magic (built-in). When this enters, destroy all units with 3 or less health. Costs 7GBRU.',
    cardType: 'generic',
    colors: ['green', 'black', 'red', 'blue'],
    manaCost: 7,
    consumesRunes: true, // Requires GBRU runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    attack: 8,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
]

export const gbruSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'gbru-spell-ultimate-destruction',
    name: 'Ultimate Destruction',
    description: 'Deal 10 damage to target unit or hero. Draw 3 cards. Blood Magic (built-in). Costs 8GBRU.',
    cardType: 'spell',
    colors: ['green', 'black', 'red', 'blue'],
    manaCost: 8,
    consumesRunes: true, // Requires GBRU runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    effect: {
      type: 'targeted_damage',
      damage: 10,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// ============================================================================
// GBRW (Green/Black/Red/White) - 4-Color Blood Magic
// ============================================================================

export const gbrwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'gbrw-unit-divine-ritualist',
    name: 'Divine Ritualist',
    description: '7/9. Blood Magic (built-in). When this enters, all your units gain +2/+2 until end of turn. Costs 7GBRW.',
    cardType: 'generic',
    colors: ['green', 'black', 'red', 'white'],
    manaCost: 7,
    consumesRunes: true, // Requires GBRW runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    attack: 7,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
  },
]

export const gbrwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'gbrw-spell-divine-wrath',
    name: 'Divine Wrath',
    description: 'Destroy all enemy units. Heal your towers for 10. Blood Magic (built-in). Costs 9GBRW.',
    cardType: 'spell',
    colors: ['green', 'black', 'red', 'white'],
    manaCost: 9,
    consumesRunes: true, // Requires GBRW runes
    bloodMagic: {
      enabled: true,
      description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
    },
    effect: {
      type: 'aoe_damage',
      damage: 999, // Effectively destroy all
      affectsUnits: true,
      affectsHeroes: false,
      affectsEnemyUnits: true,
    },
  },
]

// Void Apprentice - Spawned by Dark Archmage (not a playable card, only spawned)
// Removed from playable cards - only spawned by hero ability

// ============================================================================
// WUB (White/Blue/Black) - Esper Control/Value
// ============================================================================

export const wubSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'wub-spell-esper-command',
    name: 'Esper Command',
    description: 'Destroy target unit. Draw 2 cards. Costs 4WUB, refunds 4 mana.',
    cardType: 'spell',
    colors: ['white', 'blue', 'black'],
    manaCost: 4,
    consumesRunes: true, // Requires WUB runes
    refundMana: 4, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill
      drawCount: 2,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'wub-spell-soul-extraction',
    name: 'Soul Extraction',
    description: 'Deal 4 damage to target unit or hero. Draw a card. Costs 3WUB, refunds 3 mana.',
    cardType: 'spell',
    colors: ['white', 'blue', 'black'],
    manaCost: 3,
    consumesRunes: true, // Requires WUB runes
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 4,
      drawCount: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'wub-spell-divine-judgment',
    name: 'Divine Judgment',
    description: 'Destroy target unit or hero. Draw 2 cards. Gain 3 life. Costs 5WUB, refunds 5 mana.',
    cardType: 'spell',
    colors: ['white', 'blue', 'black'],
    manaCost: 5,
    consumesRunes: true, // Requires WUB runes
    refundMana: 5, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill
      drawCount: 2,
      healAmount: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'wub-spell-void-purge',
    name: 'Void Purge',
    description: 'Return target unit to its owner\'s hand. Draw a card. Costs 2WUB, refunds 2 mana.',
    cardType: 'spell',
    colors: ['white', 'blue', 'black'],
    manaCost: 2,
    consumesRunes: true,
    refundMana: 2, // Free spell mechanic
    effect: {
      type: 'return_to_base',
      damage: 0,
      drawCount: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  // WUB Big Finisher Spells
  {
    id: 'wub-spell-esper-dominance',
    name: 'Esper Dominance',
    description: 'Destroy all enemy units. Draw 3 cards. Gain 5 life. Costs 8WUB, refunds 8 mana.',
    cardType: 'spell',
    colors: ['white', 'blue', 'black'],
    manaCost: 8,
    consumesRunes: true, // Requires WUB runes
    refundMana: 8, // Free spell mechanic
    effect: {
      type: 'aoe_damage',
      damage: 999, // Effectively destroy all
      drawCount: 3,
      healAmount: 5,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'wub-spell-final-judgment',
    name: 'Final Judgment',
    description: 'Destroy target unit or hero. Draw 4 cards. Gain 7 life. Costs 9WUB, refunds 9 mana.',
    cardType: 'spell',
    colors: ['white', 'blue', 'black'],
    manaCost: 9,
    consumesRunes: true, // Requires WUB runes
    refundMana: 9, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill
      drawCount: 4,
      healAmount: 7,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
]

// ============================================================================
// WUB (White/Blue/Black) - Esper Units
// ============================================================================

export const wubCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // UWb (White-Blue-Black) - Stun/Barrier Control
  {
    id: 'wub-unit-stun-barrier-titan',
    name: 'Stun Barrier Titan',
    description: '5/7. Activated: Choose one - Stun target unit, or give target unit barrier. Costs 2WUB. Costs 7WUB to play.',
    cardType: 'generic',
    colors: ['white', 'blue', 'black'],
    manaCost: 7,
    consumesRunes: true,
    attack: 5,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    specialEffects: ['stun_or_barrier'], // Can stun or grant barrier
  },
  {
    id: 'wub-unit-curse-enforcer',
    name: 'Curse Enforcer',
    description: '3/4. When you curse a unit, draw a card. Cursed units you control have barrier. Costs 4UB.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['curse_draw', 'cursed_barrier'], // Draws on curse, gives barrier to cursed units
  },
  {
    id: 'wub-unit-esper-titan',
    name: 'Esper Titan',
    description: '4/4. Lifelink. Barrier. When this attacks, draw a card. Costs 7WUB.',
    cardType: 'generic',
    colors: ['white', 'blue', 'black'],
    manaCost: 7,
    consumesRunes: true, // Requires WUB runes
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['lifelink', 'barrier'],
  },
]

// ============================================================================
// WGU (White/Green/Blue) - Bant Control/Value
// ============================================================================

export const wguSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'wgu-spell-bant-growth',
    name: 'Bant Growth',
    description: 'Gain +1 max mana. Target unit gains +2/+2 and protection from spells this turn. Draw a card. Costs 3WGU, refunds 3 mana.',
    cardType: 'spell',
    colors: ['white', 'green', 'blue'],
    manaCost: 3,
    consumesRunes: true, // Requires WGU runes
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for ramp + buff + protection
      damage: 0,
      drawCount: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'wgu-spell-primal-ramp',
    name: 'Primal Ramp',
    description: 'Gain +2 max mana. All your units gain +1/+1 until end of turn. Costs 4WGU, refunds 4 mana.',
    cardType: 'spell',
    colors: ['white', 'green', 'blue'],
    manaCost: 4,
    consumesRunes: true, // Requires WGU runes
    refundMana: 4, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for ramp + team buff
      damage: 0,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'wgu-spell-guardians-blessing',
    name: 'Guardian\'s Blessing',
    description: 'Target unit gains +2/+2 permanently. Draw a card. Costs 3WGU, refunds 3 mana.',
    cardType: 'spell',
    colors: ['white', 'green', 'blue'],
    manaCost: 3,
    consumesRunes: true, // Requires WGU runes
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for permanent buff
      damage: 0,
      drawCount: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  // GWU Big Finisher Spells
  {
    id: 'wgu-spell-bant-ascendancy',
    name: 'Bant Ascendancy',
    description: 'Gain +2 max mana. All your units gain +3/+3 and protection from spells until end of turn. Draw 3 cards. Costs 8WGU, refunds 8 mana.',
    cardType: 'spell',
    colors: ['white', 'green', 'blue'],
    manaCost: 8,
    consumesRunes: true, // Requires WGU runes
    refundMana: 8, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for ramp + team buff + protection + draw
      damage: 0,
      drawCount: 3,
      affectsUnits: true,
    },
    initiative: true,
  },
  // New UB Curse/Stun Spells
  {
    id: 'ub-spell-curse-and-refund',
    name: 'Curse Trap',
    description: 'Stun target unit and curse it (opponent pays 3 mana to remove). Refund 3 mana, draw a card. Costs 3U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    refundMana: 3,
    effect: {
      type: 'custom', // Custom: stuns and curses
      stunDuration: 1,
      drawCount: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'blue-spell-simple-stun',
    name: 'Frost Bind',
    description: 'Stun target unit for 1 turn. Costs 2U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'stun',
      stunDuration: 1,
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'ub-spell-curse-and-draw',
    name: 'Cursed Binding',
    description: 'Curse target unit (opponent pays 4 to remove). If you have cast 2+ spells this turn, draw 2 cards. Costs 4B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    effect: {
      type: 'custom', // Custom: curses and draws conditionally
      drawCount: 2, // Conditional on 2+ spells
      affectsUnits: true,
    },
    initiative: true,
  },
  {
    id: 'black-spell-stun-and-damage',
    name: 'Dark Shackles',
    description: 'Stun target unit and deal 2 damage to it. Costs 2B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 2,
    effect: {
      type: 'stun',
      stunDuration: 1,
      damage: 2,
      affectsUnits: true,
    },
    initiative: true,
  },
]

// ============================================================================
// WGU (White/Green/Blue) - Bant Units
// ============================================================================

export const wguCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'wgu-unit-primal-titan',
    name: 'Primal Titan',
    description: '5/5. When this enters, stun 2 target units. Costs 7UGW.',
    cardType: 'generic',
    colors: ['blue', 'green', 'white'],
    manaCost: 7,
    consumesRunes: true, // Requires UGW runes
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'uww-unit-regenerative-guardian',
    name: 'Regenerative Guardian',
    description: '5/5. Adjacent units get 3 regen and +2/+2. Costs 5UW.',
    cardType: 'generic',
    colors: ['blue', 'white'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// ============================================================================
// UW (Blue/White) - Control but Proactive
// ============================================================================

export const uwHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'uw-hero-paladin',
    name: 'Arcane Paladin',
    description: '3/6. If you have cast 6 mana worth of spells this turn, create a 3/3 creature.',
    cardType: 'hero',
    colors: ['blue', 'white'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Creates creatures from spell casting.',
    equippedItems: [],
    ability: {
      name: 'Spell Summoning',
      description: 'If you have cast 6 mana worth of spells this turn, create a 3/3 creature.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'create_unit',
      effectValue: 0,
    },
  },
]

export const uwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Generic UW cards
  // White adjacency units - positional gameplay
  {
    id: 'white-unit-holy-sentinel',
    name: 'Holy Sentinel',
    description: 'Adjacent units get 3 regen. Costs 4W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: true,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'white-unit-fortified-bastion',
    name: 'Fortified Bastion',
    description: '3/4. Adjacent units get +1/+1. Costs 3W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'white-unit-target-buffer',
    name: 'Target Buffer',
    description: '2/2. Whenever you target this, it gets +1/+1 permanently. Costs 3W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
]

export const uwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Divine Wrath removed - replaced with artifact
  // White Stun Spell
  {
    id: 'white-spell-stun',
    name: 'Stun',
    description: 'Stun target enemy unit or hero. Costs 2W.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 2,
    effect: {
      type: 'stun',
      stunDuration: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  // Unbreakable Column Spell (replacement for artifact)
  {
    id: 'white-spell-unbreakable-column',
    name: 'Unbreakable Column',
    description: 'Two allies get +2/+1 this turn and 1 regen permanently. Costs 5W.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff + permanent regen
      damage: 0,
    },
    initiative: true,
  },
  // White/Blue Stun Spell (2 turns)
  {
    id: 'wgu-spell-prolonged-stun',
    name: 'Prolonged Stun',
    description: 'Stun target enemy unit or hero for 2 turns. Costs 3WU.',
    cardType: 'spell',
    colors: ['white', 'blue'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'stun',
      stunDuration: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true,
  },
  // Blue/White Tower Heal + Draw
  {
    id: 'uw-spell-divine-restoration',
    name: 'Divine Restoration',
    description: 'Heal target tower for 6 and draw 3 cards. Costs 5UW.',
    cardType: 'spell',
    colors: ['blue', 'white'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'draw_and_heal',
      damage: 0, // Placeholder - would need custom effect for tower heal
      drawCount: 3,
    },
    initiative: true,
  },
  // Blue/White Move + Stun
  {
    id: 'uw-spell-reposition-stun',
    name: 'Reposition and Stun',
    description: 'Move target enemy unit to an empty slot within range 4 and stun all adjacent units. Costs 1UW.',
    cardType: 'spell',
    colors: ['blue', 'white'],
    manaCost: 1,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for move + stun adjacent
      damage: 0,
    },
    initiative: true,
  },
  // Blue/White/White Mass Bounce
  {
    id: 'uww-spell-selective-bounce',
    name: 'Selective Bounce',
    description: 'Each player chooses 1 unit to keep, then bounce all other units to their owner\'s hand. Costs 6UW.',
    cardType: 'spell',
    colors: ['blue', 'white'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for selective bounce
      damage: 0,
    },
    initiative: true,
  },
]

// ============================================================================
// WB (White/Black) - Life Channeler
// ============================================================================

export const wbHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'wb-hero-life-channeler',
    name: 'Life Channeler',
    description: '3/6. Whenever you spend tower life (Blood Magic), put a counter on this hero. Remove 5 counters: Heal 5 to any tower or unit.',
    cardType: 'hero',
    colors: ['white', 'black'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    ability: {
      name: 'Life Transfer',
      description: 'Remove 5 counters from this hero to heal 5 to any tower or unit.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'heal_target',
      effectValue: 5,
    },
  },
]

export const wbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // WB (White-Black) - Life Channeler
  {
    id: 'wb-unit-life-channeler',
    name: 'Life Channeler',
    description: '3/4. When you lose life, draw a card. Costs 4WB.',
    cardType: 'generic',
    colors: ['white', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['life_loss_draw'], // Draws when you lose life
  },
  {
    id: 'wb-unit-life-converter',
    name: 'Life Converter',
    description: '2/3. Pay 2 life: Put a +1/+1 counter on target creature. Costs 3WB.',
    cardType: 'generic',
    colors: ['white', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    specialEffects: ['life_to_counters'], // Converts life to counters
  },
]

export const wbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // WB Life-Based Removal
  {
    id: 'wb-spell-life-drain',
    name: 'Life Drain',
    description: 'Destroy target unit with 3 or less health. You gain life equal to its health. Costs 3WB.',
    cardType: 'spell',
    colors: ['white', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 999, // Effectively destroy
      affectsUnits: true,
      affectsHeroes: false,
    },
    specialEffects: ['life_gain_on_kill'], // Gains life equal to killed unit's health
    initiative: true,
  },
]

// ============================================================================
// COMBO HEROES - Storm, Aristocrats, Bounce
// ============================================================================

export const comboHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Storm Combo: Rune Channeler - converts runes to tower damage
  {
    id: 'combo-hero-rune-channeler',
    name: 'Rune Channeler',
    description: '2/5. If you have cast 3 colors worth of spells this turn, create a 5/1 creature.',
    cardType: 'hero',
    colors: ['blue', 'black'],
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    supportEffect: 'Creates creatures from multicolor casting',
    equippedItems: [],
    ability: {
      name: 'Multicolor Summoning',
      description: 'If you have cast 3 colors worth of spells this turn, create a 5/1 creature.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'create_unit',
      effectValue: 0,
    },
  },
]

// ============================================================================
// COMBO UNITS - Enablers for the combo archetypes
// ============================================================================


// ============================================================================
// CREEP-STACKING INCENTIVE CARDS - REMOVED
// All 0/X creatures removed - no longer relevant without auto-spawning creeps
// ============================================================================


// ============================================================================
// RARE CARDS - Guild System Showcase
// ============================================================================

// 5 Mono-Color Rares

export const rareWhiteCards: (Omit<ArtifactCard, 'location' | 'owner'>)[] = [
]

export const rareBlueHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'rare-blue-archmage',
    name: 'Archmage\'s Apprentice',
    cardType: 'hero',
    rarity: 'rare',
    colors: ['blue'],
    manaCost: 4,
    attack: 2,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    signatureCardId: 'rare-blue-archmage-sig',
    equippedItems: [],
    ability: {
      name: 'Mana Surge',
      description: 'When you cast your first spell each turn, restore 2 mana',
      trigger: 'on_spell_cast',
      manaCost: 0,
      cooldown: 0,
      effectType: 'custom',
      manaRestore: 2,
    },
    description: '2/6. When you cast your first spell each turn, restore 2 mana. Spellcaster synergy hero.',
  },
]

export const rareBlackCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
]

export const rareRedCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
]

export const rareGreenCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
]

// 5 Guild Rares

export const rareRGCards: (Omit<ArtifactCard, 'location' | 'owner'>)[] = [
  {
    id: 'rare-rg-battlemaster',
    name: 'Savage Battlemaster',
    cardType: 'artifact',
    rarity: 'rare',
    colors: ['red', 'green'],
    manaCost: 3,
    consumesRunes: true,
    effectType: 'equipment',
    effectValue: 0,
    equipCost: 3,
    equipmentBonuses: {
      attack: 1,
      health: 1,
      abilities: ['cleave']
    },
    description: 'Equipment. +1/+1 and Cleave. When equipped unit dies, return to base. Re-equip for 3 mana. RG aggro finisher.',
  },
]

export const rareWGCards: (Omit<ArtifactCard, 'location' | 'owner'>)[] = [
  {
    id: 'rare-wg-sanctuary',
    name: 'Guardian\'s Sanctuary',
    cardType: 'artifact',
    rarity: 'rare',
    colors: ['white', 'green'],
    manaCost: 7,
    consumesRunes: true,
    effectType: 'equipment',
    effectValue: 0,
    equipCost: 2,
    equipmentBonuses: {
      attack: 2,
      health: 4,
      abilities: ['taunt', 'At start of turn: Heal 2 HP to your towers']
    },
    description: 'Equipment. +2/+4, Taunt. At start of turn: Heal 2 HP to all your towers. Returns to base when unit dies.',
  },
]

export const rareWUHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'rare-wu-spellweaver',
    name: 'Spellweaver\'s Aegis',
    cardType: 'hero',
    rarity: 'rare',
    colors: ['white', 'blue'],
    manaCost: 5,
    consumesRunes: true,
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    signatureCardId: 'rare-wu-spellweaver-sig',
    supportEffect: 'Spell cost reduction.',
    equippedItems: [],
    ability: {
      name: 'Arcane Protection',
      description: 'Your spells cost 1 less. When you cast a spell, your towers gain +1 armor until end of turn.',
      trigger: 'passive',
      manaCost: 0,
      cooldown: 0,
      effectType: 'custom',
      spellCostReduction: 1,
    },
    description: '3/7. Your spells cost 1 less. When you cast a spell, your towers gain +1 armor until end of turn. WU spellcaster.',
  },
]

export const rareUBCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rare-ub-assassin',
    name: 'Shadowmind Assassin',
    cardType: 'generic',
    rarity: 'rare',
    colors: ['blue', 'black'],
    manaCost: 6,
    consumesRunes: true,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    description: '4/4. When deployed: Destroy target unit with 3 or less power, draw a card. When this kills a unit in combat: Draw a card. Rewards spell-heavy control.',
  },
]

export const rareBRCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rare-br-demolisher',
    name: 'Chaos Demolisher',
    cardType: 'generic',
    rarity: 'rare',
    colors: ['black', 'red'],
    manaCost: 7,
    consumesRunes: true,
    attack: 5,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    description: '5/3, Cleave. When deployed: Deal 2 damage to all units and all towers. Aggressive control finisher for BR.',
  },
]


// ============================================================================
// ALL CARDS COMBINED
// ============================================================================

const allowedTwoColorCombos = new Set([
  'black-red',   // BR
  'black-blue',  // UB
  'green-red',   // RG
])

const allowedThreeColorCombos = new Set([
  'black-blue-red',   // UBR
  'black-green-red',  // BRG
  'green-red-white',  // RGW
  'blue-green-white', // UWG
  'black-blue-white', // UWB
])

const isAllowedDraftColor = (colors?: Color[]): boolean => {
  if (!colors || colors.length === 0) return true
  const uniqueColors = Array.from(new Set(colors))
  if (uniqueColors.length <= 1) return true
  const colorKey = uniqueColors.sort().join('-')
  if (uniqueColors.length === 2) {
    return allowedTwoColorCombos.has(colorKey)
  }
  if (uniqueColors.length === 3) {
    return allowedThreeColorCombos.has(colorKey)
  }
  return false
}

export const allHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  ...rwHeroes,
  ...rgHeroes,
  ...ruHeroes,
  ...rbHeroes,
  ...gwHeroes,
  ...gbHeroes,
  ...guHeroes,
  ...ubHeroes,
  ...uwHeroes,
  ...wbHeroes,
  ...rwgHeroes,
  ...ubgHeroes,
  ...gbrHeroes,
  ...comboHeroes,
  // Rare heroes
  ...rareBlueHeroes,
  ...rareWUHeroes,
].filter(hero => isAllowedDraftColor(hero.colors))

export const allCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  ...rwCards,
  ...rgCards,
  ...ruCards,
  ...rbCards,
  ...gwCards,
  ...gbCards,
  ...guCards,
  ...ubCards,
  ...uwCards,
  ...wbCards,
  ...rwgCards,
  ...ubgCards,
  ...gbrCards,
  ...gbruCards,
  ...gbrwCards,
  ...wguCards, // WGU (White/Green/Blue) - Bant Units
  ...wubCards, // WUB (White/Blue/Black) - Esper Units
  ...ubrCards, // UBR (Blue/Black/Red) - Grixis Units
  ...monoRedAggroCards,
  ...blackMidrangeCards,
  // Rare cards
  ...rareBlackCards,
  ...rareRedCards,
  ...rareGreenCards,
  ...rareUBCards,
  ...rareBRCards,
].filter(card => isAllowedDraftColor(card.colors))

// ============================================================================
// RUNE MANIPULATION SPELLS - Ramp, Seals, Mana Rocks
// ============================================================================

// ============================================================================
// VARIABLE RUNE COST SPELLS - Riftbound-style (1R, 2UU, 7UUU, etc.)
// ============================================================================

export const allArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  ...rwArtifacts,
  ...rgArtifacts,
  ...ubArtifacts,
  ...archetypeArtifacts, // Mono-color archetype tracking artifacts
  // Rare artifacts (equipment)
  ...rareWhiteCards,
  ...rareRGCards,
  ...rareWGCards,
].filter(artifact => isAllowedDraftColor(artifact.colors))

export const allSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  ...rwSpells,
  ...ruSpells,
  ...rbSpells,
  ...gbSpells,
  ...guSpells,
  ...ubSpells,
  ...freeSpells, // Free spells that refund mana after casting
  ...uwSpells,
  ...wbSpells,
  ...rwgSpells,
  ...ubgSpells,
  ...gbrSpells,
  ...gbruSpells,
  ...gbrwSpells,
  ...wubSpells, // WUB (White/Blue/Black) - Esper Control/Value
  ...wguSpells, // WGU (White/Green/Blue) - Bant Control/Value
].filter(spell => isAllowedDraftColor(spell.colors))

// ============================================================================
// BATTLEFIELDS
// ============================================================================

export const archetypeBattlefields: BattlefieldDefinition[] = [
  // RW - Go Wide
  {
    id: 'battlefield-rw-wide',
    name: 'Training Grounds',
    description: 'RW battlefield - supports go wide',
    colors: ['red', 'white'],
    staticAbility: 'You can deploy 5 units instead of 4',
    staticAbilityId: 'sixth-slot',
  },
  // RG - Beefy
  {
    id: 'battlefield-rg-beefy',
    name: 'Arena of Champions',
    description: 'RG battlefield - supports beefy units',
    colors: ['red', 'green'],
    staticAbility: 'Units with 5+ health gain +1/+1',
    staticAbilityId: 'beefy-buff',
  },
  // RU - Spells
  {
    id: 'battlefield-ru-spells',
    name: 'Arcane Nexus',
    description: 'RU battlefield - spell focus',
    colors: ['red', 'blue'],
    staticAbility: 'Spells deal +1 damage',
    staticAbilityId: 'spell-damage-buff',
  },
  // RB - Kill
  {
    id: 'battlefield-rb-kill',
    name: 'Blood Arena',
    description: 'RB battlefield - kill focus',
    colors: ['red', 'black'],
    staticAbility: 'Gain 2 gold when you kill an enemy unit',
    staticAbilityId: 'kill-gold',
  },
  // GW - Go Wide Protect
  {
    id: 'battlefield-gw-protect',
    name: 'Sanctuary',
    description: 'GW battlefield - protection',
    colors: ['green', 'white'],
    staticAbility: 'Your units gain 1 regen',
    staticAbilityId: 'unit-regen-buff',
  },
  // GB - Midrange
  {
    id: 'battlefield-gb-midrange',
    name: 'Graveyard',
    description: 'GB battlefield - midrange',
    colors: ['green', 'black'],
    staticAbility: 'Gain 2 gold when units die',
    staticAbilityId: 'death-gold-bonus',
  },
  // GU - Ramp
  {
    id: 'battlefield-gu-ramp',
    name: 'Mana Grove',
    description: 'GU battlefield - ramp',
    colors: ['green', 'blue'],
    staticAbility: 'Gain +1 max mana each turn',
    staticAbilityId: 'mana-ramp',
  },
  // UB - Control
  {
    id: 'battlefield-ub-control',
    name: 'Shadow Market',
    description: 'UB battlefield - control',
    colors: ['blue', 'black'],
    staticAbility: 'Gain extra gold for killing units',
    staticAbilityId: 'gold-on-kill',
  },
  // UW - Proactive Control
  {
    id: 'battlefield-uw-control',
    name: 'Temple Grounds',
    description: 'UW battlefield - proactive control',
    colors: ['blue', 'white'],
    staticAbility: 'Units gain barrier when played',
    staticAbilityId: 'unit-barrier-buff',
  },
]

export const genericBattlefields: BattlefieldDefinition[] = [
  {
    id: 'battlefield-neutral-1',
    name: 'Neutral Ground',
    description: 'Neutral battlefield',
    colors: [],
    staticAbility: 'No special ability',
    staticAbilityId: 'none',
  },
  {
    id: 'battlefield-neutral-2',
    name: 'Training Field',
    description: 'Neutral battlefield',
    colors: [],
    staticAbility: 'Units gain +1 attack on first turn',
    staticAbilityId: 'first-turn-buff',
  },
  {
    id: 'battlefield-neutral-3',
    name: 'Ancient Ruins',
    description: 'Neutral battlefield',
    colors: [],
    staticAbility: 'Gain 1 gold each turn',
    staticAbilityId: 'gold-per-turn',
  },
]

export const allBattlefields: BattlefieldDefinition[] = [
  ...archetypeBattlefields,
  ...genericBattlefields,
]



