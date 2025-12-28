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
    description: '3/4. Cleave (damages adjacent units when attacking). Red\'s answer to stacked creeps. Especially aggressive hero.',
    cardType: 'hero',
    colors: ['red'],
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,    equippedItems: [],
  },
  // Strong Mono-Red Hero
  {
    id: 'red-hero-fury-champion',
    name: 'Fury Champion',
    description: '6/6. Powerful mono-red hero with signature spell and strong ability.',
    cardType: 'hero',
    colors: ['red'],
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Allies gain +2 attack',
    signatureCardId: 'red-sig-fury-strike',
    equippedItems: [],
    ability: {
      name: 'Berserker Rage',
      description: 'This hero gains +3 attack this turn.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'buff_units',
      effectValue: 3,
    },
  },
]

export const rwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature units (physical objects that can be units)
  // More Cleave Effects
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
    id: 'rw-unit-strategic-scout',
    name: 'Strategic Scout',
    description: '5/5. When this enters, reveal the top 5 cards of your library. You may play a unit with 5 or less mana cost for free. Costs 5RW.',
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
    id: 'rw-unit-tactical-commander',
    name: 'Tactical Commander',
    description: '4/2. Bounce. When a hero is deployed to this lane, you may return target hero to base. That hero has rapid deploy and can be redeployed this turn. Costs 4RR.',
    cardType: 'generic',
    colors: ['red', 'red'],
    manaCost: 4,
    consumesRunes: true,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'rw-unit-mana-warrior',
    name: 'Mana Warrior',
    description: '3/3. You may stun this unit to add 1 mana to your mana pool this turn. Costs 3R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
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
  {
    id: 'rw-unit-cleaving-champion',
    name: 'Cleaving Champion',
    description: '3/3. Cleave (damages adjacent units when attacking). Costs 5 (4RWR).',
    cardType: 'generic',
    colors: ['red', 'red', 'white'], // Requires 2 red + 1 white runes (RWR)
    manaCost: 5,
    consumesRunes: true, // Requires RWR runes
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// ============================================================================
// Mono Red Aggro - Fast, Tower-Focused (RPS Aggro Archetype)
// ============================================================================

export const monoRedAggroCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Low-cost aggressive units (1-3 mana) - Reduced for clarity
  // Removed: Goblin Scout, Fire Striker, Battle Hound (weak red creeps)
  {
    id: 'red-aggro-raging-warrior',
    name: 'Raging Warrior',
    description: '4/2. Aggressive threat. 3R.',
    cardType: 'generic',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-tower-raider',
    name: 'Tower Raider',
    description: '3/3. When this enters, deal 2 damage to tower. Can attack towers directly. 3R.',
    cardType: 'generic',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'red-aggro-fury-striker',
    name: 'Fury Striker',
    description: '3/3. When this attacks, deal 1 damage to all enemy units. 3R.',
    cardType: 'generic',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // Removed: Goblin Raider, Swift Warrior, Tower Striker, Berserker Charge, Tower Bomber (redundant/weak)
  {
    id: 'red-unit-berserker',
    name: 'Berserker',
    description: '4/2. When this attacks, deal 2 damage to the tower. 3R.',
    cardType: 'generic',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
]


// RW Artifacts - Persistent effects in base (R, W, or RW colors only)
export const rwArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'rw-artifact-war-banner',
    name: 'War Banner Artifact',
    description: 'Artifact. All your heroes gain +2 attack, all your units gain +1 attack.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'damage_amplifier',
    effectValue: 2, // +2 to heroes, +1 to units (Core Game Redesign - hero-focused)
  },
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
    description: 'Artifact. All your units gain +0/+1.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 3,
    effectType: 'defensive_buff',
    effectValue: 1, // +1 health
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
  {
    id: 'rw-artifact-vanguard-generator',
    name: 'Vanguard Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary red rune and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['red'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary red rune per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'rw-artifact-unbreakable-column',
    name: 'Unbreakable Column Artifact',
    description: 'Artifact. All your units gain +0/+1.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 3,
    effectType: 'defensive_buff',
    effectValue: 1, // +1 health to all units
  },
  // Rune Generators - Single Color
  {
    id: 'rw-artifact-white-generator',
    name: 'Divine Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary white rune and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary white rune per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // Rune Generators - Dual Color
  {
    id: 'rw-artifact-dual-generator',
    name: 'Legion Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary red rune, 1 temporary white rune, and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 temporary runes (1R + 1W) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // Rune Generators - Flexible Either/Or
  {
    id: 'rw-artifact-flexible-generator',
    name: 'Adaptive Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary red rune or 1 temporary white rune (your choice) and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary rune (choice of R or W) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // 3+X Artifact Cycle
  {
    id: 'red-artifact-cleaving-aura',
    name: 'Cleaving Aura',
    description: 'Artifact. All your units gain +2 cleave.',
    cardType: 'artifact',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    effectType: 'cleave_aura',
    effectValue: 2, // +2 cleave
  },
  {
    id: 'white-artifact-divine-protection',
    name: 'Divine Protection',
    description: 'Artifact. At the start of your turn, both your towers gain 2 life.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: true, // Requires W rune
    effectType: 'tower_heal',
    effectValue: 2, // +2 HP to both towers
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
    description: 'Artifact. Target unit or hero gains Cleave (damages adjacent units when attacking) during your turn. Costs 3RG.',
    cardType: 'artifact',
    colors: ['red', 'green'],
    manaCost: 3,
    consumesRunes: true, // Requires RG runes
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
    consumesRunes: true, // Requires R rune
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
    description: 'Your hero initiates combat with target enemy hero. Players resolve combat manually. Costs 3RR.',
    cardType: 'spell',
    colors: ['red', 'red'], // Changed: requires 2 red runes instead of RW
    manaCost: 3,
    consumesRunes: true, // Added: now consumes runes
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
    colors: ['red', 'red'],
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
  {
    id: 'rw-spell-legions-charge',
    name: 'Legion\'s Charge',
    description: 'All your Legion units gain +2/+2 and haste this turn. Draw a card. Costs 4RRRR.',
    cardType: 'spell',
    colors: ['red', 'red', 'red', 'red'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a buff + card draw
      damage: 0,
    },
    initiative: false,
  },
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
    id: 'red-spell-forked-lightning',
    name: 'Forked Lightning',
    description: 'Deal 2 damage to up to 2 different targets. Costs 4R.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: true, // Requires R rune
    effect: {
      type: 'multi_target_damage',
      damage: 2,
      maxTargets: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'red-spell-chain-lightning',
    name: 'Chain Lightning',
    description: 'Deal 3 damage to target, then 2 damage to an adjacent unit, then 1 to another adjacent. Costs 5RR.',
    cardType: 'spell',
    colors: ['red', 'red'],
    manaCost: 5,
    consumesRunes: true, // Requires RR runes
    effect: {
      type: 'chain_damage',
      chainDamages: [3, 2, 1],
      affectsUnits: true,
      affectsHeroes: true,
    },
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
    consumesRunes: true, // Requires R rune
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
    supportEffect: 'Can fight enemy units',    equippedItems: [],
    ability: {
      name: 'Battle Rage',
      description: 'Fight all enemy units in front of this hero and adjacent to it.',
      manaCost: 1,
      cooldown: 0, // Can use multiple times
      effectType: 'multi_fight', // Custom effect: fights front + adjacent
      effectValue: 3, // Can hit up to 3 units
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
  // RG Dopamine Hit: Multi-Fight Unit
  {
    id: 'rg-unit-battle-tyrant',
    name: 'Battle Tyrant',
    description: '6/7. When this enters, it fights all enemy units in front of it and adjacent to it. (Can wipe 3 units if lucky) Costs 6RG.',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 6,
    consumesRunes: true, // Requires RG runes - high dopamine hit card
    attack: 6,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    specialEffects: ['multi_fight'], // Custom effect: fights front + adjacent on enter
  },
  // NEW: RG Mighty Units (5+ power) Synergy
  {
    id: 'rg-mighty-chieftain',
    name: 'Mighty Chieftain',
    description: '5/6. If you control a unit with 5+ attack, this gains +2/+0 and can attack twice. 5RG.',
    cardType: 'generic',
    colors: ['red', 'red', 'green'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rg-mighty-warlord',
    name: 'Warlord of the Wilds',
    description: '4/5. When you play a unit with 5+ attack, draw a card. 4RG.',
    cardType: 'generic',
    colors: ['red', 'red', 'green'],
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
    description: '3/4. Units with 5+ attack you play cost 1 less. 3RG.',
    cardType: 'generic',
    colors: ['red', 'green', 'green'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

export const rgSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'rg-fight-1',
    name: 'Fight Spell',
    description: 'Make unit fight enemy. Target unit deals damage equal to its attack to target enemy unit.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for fight mechanic
      damage: 0,
      affectsUnits: true,
      affectsHeroes: true,
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
    description: 'Mixes spells and combat',
    cardType: 'hero',
    colors: ['red', 'blue'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Spells deal +1 damage',    equippedItems: [],
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
    colors: ['red', 'blue'],
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
    description: 'Deal 5 damage. Costs 3RR.',
    cardType: 'spell',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true, // Requires RR runes
    effect: {
      type: 'targeted_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ru-spell-3',
    name: 'Arcane Burst',
    description: 'Damage 3 adjacent units. Costs 4U.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: true, // Requires U rune
    effect: {
      type: 'adjacent_damage',
      damage: 3,
      adjacentCount: 3,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  {
    id: 'ru-spell-4',
    name: 'Meteor',
    description: 'Deal 6 damage to all units',
    cardType: 'spell',
    colors: ['red', 'blue'],
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
  {
    id: 'rb-hero-reaper',
    name: 'Blood Reaper',
    description: 'Kills enemies for cards',
    cardType: 'hero',
    colors: ['red', 'black'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Draw card when unit dies',    equippedItems: [],
    ability: {
      name: 'Blood Sacrifice',
      description: 'Sacrifice a unit you control: Deal 3 damage to target unit or hero, draw a card.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'sacrifice_unit',
      effectValue: 3,
    },
  },
  // Black Dopamine Hit: Cross-Lane Assassin Hero
  {
    id: 'black-hero-cross-assassin',
    name: 'Cross-Lane Assassin',
    description: '4/8. Activated (1 mana): Move this hero to any battlefield. If it moves, it may fight an enemy unit there.',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Can move across battlefields',    equippedItems: [],
    bonusVsHeroes: 4,
    ability: {
      name: 'Shadow Step',
      description: 'Move this hero to any battlefield. If it moves, it may fight an enemy unit there.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'move_and_fight', // Custom effect: move across battlefields and fight
      effectValue: 1,
    },
  },
  // Blood Magic Heroes (Black's Rune Identity)
  {
    id: 'rb-hero-blood-mage',
    name: 'Blood Mage',
    description: '4/6. Blood Magic: Pay tower life instead of missing runes (B: 2 life/tower, R/G: 3 life/tower, U/W: 4 life/tower).',
    cardType: 'hero',
    colors: ['red', 'black'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    ability: {
      name: 'Blood Magic',
      description: 'Passive: Pay tower life instead of missing runes. B: 2 life/tower, R/G: 3 life/tower, U/W: 4 life/tower.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 0,
      bloodMagic: {
        enabled: true,
        description: 'Pay tower life for missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
      }
    }
  },
  {
    id: 'rb-hero-blood-adept',
    name: 'Blood Magic Adept',
    description: '3/7. Blood Magic with cost reduction. Pay 1 less life per rune (B: 1, R/G: 2, U/W: 3 per tower).',
    cardType: 'hero',
    colors: ['red', 'black'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    equippedItems: [],
    ability: {
      name: 'Efficient Blood Magic',
      description: 'Passive: Pay reduced tower life for missing runes. B: 1 life/tower, R/G: 2 life/tower, U/W: 3 life/tower.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 0,
      bloodMagic: {
        enabled: true,
        costReduction: 1,
        description: 'Pay reduced tower life for missing runes (B: 1, R/G: 2, U/W: 3 per tower)'
      }
    }
  },
  // Mono-Black Blood Magic Hero - Dark Ritualist (Black runes only, very cheap)
  {
    id: 'black-hero-dark-ritualist',
    name: 'Dark Ritualist',
    description: '3/8. Mono-Black Blood Magic: Pay 1 life per tower for BLACK runes only. Does not work for other colors.',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    equippedItems: [],
    ability: {
      name: 'Dark Ritual Blood Magic',
      description: 'Passive: Pay 1 life per tower (2 total) for BLACK runes only. Other colors cannot be substituted.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 0,
      bloodMagic: {
        enabled: true,
        costReduction: 1, // Reduces black cost from 2 to 1
        description: 'Pay 1 life/tower for BLACK runes only (mono-black support)'
      }
    }
  },
  // Strong Mono-Black Hero
  {
    id: 'black-hero-shadow-lord',
    name: 'Shadow Lord',
    description: '4/7. Powerful mono-black hero with signature spell and strong ability.',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'When enemy units die, draw a card',
    signatureCardId: 'black-sig-shadow-strike',
    equippedItems: [],
    ability: {
      name: 'Soul Drain',
      description: 'Deal 3 damage to target unit or hero. Gain 3 life.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'damage_target',
      effectValue: 3,
    },
  },
  // Shadowfiend - Scaling Black Hero
  {
    id: 'black-hero-shadowfiend',
    name: 'Shadowfiend',
    description: '2/6. Whenever an adjacent unit dies, this hero gains +1/+1 counter. When this hero dies, it loses half its counters (rounded down).',
    cardType: 'hero',
    colors: ['black'],
    attack: 2,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Gains +1/+1 counters from adjacent deaths',
    equippedItems: [],
    ability: {
      name: 'Necro Mastery',
      description: 'Deal 1 damage to a random enemy unit for each +1/+1 counter on this hero. Costs 2B.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'shadowfiend_ability', // Custom effect
      effectValue: 1, // 1 damage per counter
      runeCost: ['black'],
    },
  },
]

export const rbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Generic RB cards
  {
    id: 'rb-aggro-1',
    name: 'Ruthless Striker',
    description: 'Aggressive killer',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 4,
    attack: 5,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // New BR units for aggressive strategies
  {
    id: 'rb-unit-blood-warrior',
    name: 'Blood Warrior',
    description: '4/3. Whenever this deals combat damage, opponent loses 1 life. Costs 4RB.',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rb-unit-pain-dealer',
    name: 'Pain Dealer',
    description: '3/3. When this enters, opponent loses 2 life. Costs 3RB.',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 3,
    consumesRunes: true,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rb-unit-sacrifice-fiend',
    name: 'Sacrifice Fiend',
    description: '5/4. When this enters, you may sacrifice a unit. If you do, deal 3 damage to any target. Costs 5RB.',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'rb-unit-tower-saboteur',
    name: 'Tower Saboteur',
    description: '2/2. When this enters, target tower loses 1 armor. Costs 2RB.',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 2,
    consumesRunes: true,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'rb-unit-vampiric-assaulter',
    name: 'Vampiric Assaulter',
    description: '4/2. Whenever this attacks a tower, you gain 2 life. Costs 4RB.',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 4,
    consumesRunes: true,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
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
    consumesRunes: true, // Requires B rune
    refundMana: 3, // Free spell mechanic
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill of units with 4 or less health
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'rb-kill-1',
    name: 'Murder',
    description: 'Kill target unit',
    cardType: 'spell',
    colors: ['black'],
    consumesRunes: true, // Hard removal
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 999, // Effectively kill
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rb-spell-1',
    name: 'Terminate',
    description: 'Destroy target unit',
    cardType: 'spell',
    colors: ['black'],
    consumesRunes: true, // Hard removal
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 999, // Effectively kill
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rb-spell-2',
    name: 'Dark Pact',
    description: 'Draw 3 cards, lose 5 HP',
    cardType: 'spell',
    colors: ['black'],
    consumesRunes: true, // Powerful card draw
    manaCost: 3,
    effect: {
      type: 'targeted_damage',
      damage: 0,
    },
  },
  // New multi-target damage spells
  {
    id: 'black-spell-twin-strike',
    name: 'Twin Strike',
    description: 'Deal 4 damage to up to 2 different targets. Costs 5BB.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 5,
    consumesRunes: true, // Requires BB runes
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
    description: 'Deal 3 damage to target and all adjacent units (max 3). Costs 6B.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 6,
    consumesRunes: true, // Requires B rune
    effect: {
      type: 'adjacent_damage',
      damage: 3,
      adjacentCount: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // RB multicolor spell
  {
    id: 'rb-spell-dual-elimination',
    name: 'Dual Elimination',
    description: 'Deal 5 damage to up to 2 different targets. Costs 4RB.',
    cardType: 'spell',
    colors: ['red', 'black'],
    manaCost: 4,
    consumesRunes: true, // Requires RB runes
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
    id: 'rb-spell-tower-assault',
    name: 'Tower Assault',
    description: 'Deal 3 damage to target tower. Costs 3RB, refunds 3 mana.',
    cardType: 'spell',
    colors: ['red', 'black'],
    manaCost: 3,
    consumesRunes: true,
    refundMana: 3,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: false,
      affectsHeroes: false,
    },
    initiative: true,
  },
  {
    id: 'rb-spell-life-drain',
    name: 'Life Drain',
    description: 'Pay 3 life, draw 2 cards. Costs 2RB, refunds 2 mana.',
    cardType: 'spell',
    colors: ['red', 'black'],
    manaCost: 2,
    consumesRunes: true,
    refundMana: 2,
    effect: {
      type: 'targeted_damage',
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'rb-spell-tower-decay',
    name: 'Tower Decay',
    description: 'Target tower loses 2 armor permanently. Costs 2RB, refunds 2 mana.',
    cardType: 'spell',
    colors: ['red', 'black'],
    manaCost: 2,
    consumesRunes: true,
    refundMana: 2,
    effect: {
      type: 'targeted_damage',
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'rb-spell-suffering-curse',
    name: 'Suffering Curse',
    description: 'Target unit gets -3/-3 until end of turn. Costs 2RB, refunds 2 mana.',
    cardType: 'spell',
    colors: ['red', 'black'],
    manaCost: 2,
    consumesRunes: true,
    refundMana: 2,
    effect: {
      type: 'targeted_damage',
      damage: 0,
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
    supportEffect: 'Allies gain +0/+2',    equippedItems: [],
    ability: {
      name: 'Nature\'s Protection',
      description: 'Target unit gains +0/+4 this turn. If this hero is in front of it, it also gains +2/+0.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'buff_units',
      effectValue: 4,
    },
  },
  {
    id: 'white-hero-divine-guardian',
    name: 'Divine Guardian',
    description: '3/9. All your units gain +0/+2.',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'All your units gain +0/+2',
    signatureCardId: undefined,
    equippedItems: [],
  },
  // Strong Mono-White Hero
  {
    id: 'white-hero-divine-champion',
    name: 'Divine Champion',
    description: '4/8. Powerful mono-white hero with signature spell and strong ability.',
    cardType: 'hero',
    colors: ['white'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Allies gain +1/+1',
    signatureCardId: 'white-sig-divine-protection',
    equippedItems: [],
    ability: {
      name: 'Divine Blessing',
      description: 'Heal 5 to any target.',
      manaCost: 2,
      cooldown: 2,
      effectType: 'heal',
      effectValue: 5,
    },
  },
  // Chromatic Payoff Hero - Green's rune identity
  {
    id: 'gw-hero-chromatic-healer',
    name: 'Chromatic Healer',
    description: '3/7. Heals 2 when you cast spells with R or B runes.',
    cardType: 'hero',
    colors: ['green', 'white'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    equippedItems: [],
    ability: {
      name: 'Prismatic Mending',
      description: 'Passive: When you spend R or B runes, heal this hero for 2.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'heal_self',
      effectValue: 0,
      chromaticPayoff: {
        triggerColors: ['red', 'black'],
        effectType: 'heal',
        effectValue: 2,
        perRuneSpent: false,
        description: 'Heals 2 when you spend R or B runes'
      }
    }
  },
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
    description: 'Spell. Target hero gains +2/+2 permanently. 3GW.',
    cardType: 'spell',
    colors: ['green', 'green', 'white'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - permanent +2/+2 buff
    },
  },
  {
    id: 'gw-spell-offensive-blessing',
    name: 'Offensive Blessing',
    description: 'Spell. Target hero gains +4/+0 permanently. 4GW.',
    cardType: 'spell',
    colors: ['green', 'green', 'white'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - permanent +4/+0 buff
    },
  },
  {
    id: 'gw-spell-defensive-blessing',
    name: 'Defensive Blessing',
    description: 'Spell. Target hero gains +0/+4 permanently. 4GW.',
    cardType: 'spell',
    colors: ['green', 'green', 'white'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 0, // Placeholder - permanent +0/+4 buff
    },
  },
  {
    id: 'gw-spell-berserker-blessing',
    name: 'Berserker\'s Blessing',
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
    description: '5/5. Deals 1 damage to a random enemy per U or W rune spent.',
    cardType: 'hero',
    colors: ['green', 'black'],
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    equippedItems: [],
    ability: {
      name: 'Prismatic Destruction',
      description: 'Passive: Deal 1 damage to random enemy per U or W rune spent.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'damage_random',
      effectValue: 0,
      chromaticPayoff: {
        triggerColors: ['blue', 'white'],
        effectType: 'damage',
        effectValue: 1,
        perRuneSpent: true, // Triggers per rune!
        description: 'Deal 1 damage per U/W rune spent'
      }
    }
  },
]

export const gbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Generic GB cards
]

// ============================================================================
// Black Midrange Core - Efficient Removal, Card Draw, Value (RPS Midrange Archetype)
// ============================================================================

export const blackMidrangeCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Value units (3-5 mana)
  {
    id: 'black-midrange-insightful-scholar',
    name: 'Insightful Scholar',
    description: 'When this enters, draw a card.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 3,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'black-midrange-knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'When this attacks, draw a card. Costs 5BB.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 5,
    consumesRunes: true, // Requires BB runes
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

// ============================================================================
// Rune-Consuming Finishers - Payoffs for Multicolor Rune Generation
// ============================================================================


export const runeFinisherUnits: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Units with activated abilities that consume runes
]

export const gbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'gb-kill-1',
    name: 'Murder',
    description: 'Kill target unit',
    cardType: 'spell',
    colors: ['black'],
    consumesRunes: true, // Hard removal
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 999, // Effectively kill
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'gb-spell-1',
    name: 'Assassinate',
    description: 'Destroy target unit',
    cardType: 'spell',
    colors: ['black'],
    consumesRunes: true, // Hard removal
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 999,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// ============================================================================
// GU (Green/Blue) - Ramp Deck
// ============================================================================

export const guHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'gu-hero-druid',
    name: 'Mana Druid',
    description: 'Ramps into big spells',
    cardType: 'hero',
    colors: ['green', 'blue'],
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    supportEffect: 'Adjacent enemies get -1 attack each turn (stacks up to 3 times)',    equippedItems: [],
  },
  // Strong Mono-Blue Hero
  {
    id: 'blue-hero-arcane-master',
    name: 'Arcane Master',
    description: '3/7. Powerful mono-blue hero with signature spell and strong ability.',
    cardType: 'hero',
    colors: ['blue'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Draw an extra card each turn',
    signatureCardId: 'blue-sig-arcane-mastery',
    equippedItems: [],
    ability: {
      name: 'Time Warp',
      description: 'Return target unit to its owner\'s hand.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'return_to_base',
      effectValue: 0,
    },
  },
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
  {
    id: 'gu-finisher-1',
    name: 'Colossus',
    description: 'Big finisher',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 9,
    attack: 9,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    // Single color, so no rune requirement needed
  },
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
    description: 'All your units cannot be destroyed this turn.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    effect: {
      type: 'aoe_damage', // Placeholder - would be indestructible
      damage: 0,
    },
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
  {
    id: 'ub-hero-archmage',
    name: 'Dark Archmage',
    description: 'Control specialist. At the start of each turn, spawns a 2/3 Void Apprentice in an adjacent slot that deals 2 damage to the nearest enemy unit.',
    cardType: 'hero',
    colors: ['blue'],
    attack: 2,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
      supportEffect: 'Spawns Void Apprentice each turn', // Removed "Draw extra card each turn"    equippedItems: [],
    },
  {
    id: 'ub-hero-nature-guardian',
    name: 'Nature Guardian',
    description: 'Resilient control hero',
    cardType: 'hero',
    colors: ['green', 'black'], // Changed from green to green/black to enable black spells
    attack: 3, // Reduced from 4
    health: 7, // Reduced from 10
    maxHealth: 7, // Reduced from 10
    currentHealth: 7, // Reduced from 10
    supportEffect: 'When an enemy unit dies, gain +1 max mana this turn',    equippedItems: [],
    ability: {
      name: 'Steal Creep',
      description: 'Take control of target enemy unit (units only, not heroes)',
      manaCost: 1,
      cooldown: 4,
      effectType: 'steal_unit',
      effectValue: 0,
      startsOnCooldown: true, // Starts on cooldown at game start
    },
  },
  {
    id: 'ub-hero-druid',
    name: 'Verdant Archmage',
    description: 'Ramp and control',
    cardType: 'hero',
    colors: ['green', 'blue'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Gain +1 max mana each turn',
    signatureCardId: 'ub-sig-archmage-2', // Uses Arcane Sweep as signature
    equippedItems: [],
    ability: {
      name: 'Nature\'s Summon',
      description: 'Create a 3/3 Nature Sprite in an empty slot on this battlefield',
      manaCost: 1,
      cooldown: 2,
      effectType: 'create_unit',
      effectValue: 3, // 3/3 stats
    },
  },
  // Blood Magic Hero - Desperate Necromancer (Limited substitutions)
  {
    id: 'ub-hero-desperate-necromancer',
    name: 'Desperate Necromancer',
    description: '3/7. Blood Magic (max 2 runes per spell): Pay tower life for up to 2 missing runes per spell. B: 2, R/G: 3, U/W: 4 per tower.',
    cardType: 'hero',
    colors: ['blue', 'black'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    equippedItems: [],
    ability: {
      name: 'Limited Blood Magic',
      description: 'Passive: Pay tower life for up to 2 missing runes per spell. B: 2, R/G: 3, U/W: 4 per tower.',
      manaCost: 0,
      cooldown: 0,
      trigger: 'passive',
      effectType: 'buff_units',
      effectValue: 0,
      bloodMagic: {
        enabled: true,
        maxSubstitutions: 2,
        description: 'Pay tower life for up to 2 missing runes (B: 2, R/G: 3, U/W: 4 per tower)'
      }
    }
  },
]

export const ubCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // UB Control Archetype Units (minimal units - focus on spells)
  {
    id: 'ub-control-arcane-scholar',
    name: 'Arcane Scholar',
    description: 'Spell. Draw 2 cards. 3UB.',
    cardType: 'spell',
    colors: ['blue', 'blue', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'draw_cards',
      count: 2,
    },
  },
  // Green cards added to UB deck (UBG)
  // Verdant Colossus removed - replaced with Void Cascade AOE spell
  // 3+X Unit Cycle
  {
    id: 'blue-unit-arcane-scholar',
    name: 'Arcane Scholar',
    description: '3/3. When this enters, return target unit to its owner\'s hand.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true, // Requires U rune
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // More Cleave Units
  {
    id: 'green-unit-cleaving-beast',
    name: 'Cleaving Beast',
    description: '2/3. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true, // Requires G rune
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'black-unit-necromancer-apprentice',
    name: 'Necromancer Apprentice',
    description: '3/3. When this enters, draw a card and lose 1 life.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true, // Requires B rune
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'green-unit-druid-adept',
    name: 'Druid Adept',
    description: '2/4. When this enters, gain +1 max mana.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true, // Requires G rune
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // More 1-3 mana creeps
  // Blue creeps
  // REMOVED: Protective Aura (white-creep-protective-aura) - No longer fits color identity
]

// UBG Artifacts - Persistent effects in base (U, G, B, or combinations only)
export const ubArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'ub-artifact-void-generator',
    name: 'Void Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary blue rune and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary blue rune per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-sacrificial-altar',
    name: 'Sacrificial Altar Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary black rune and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary black rune per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-mana-surge',
    name: 'Mana Surge Artifact',
    description: 'Artifact. At the start of your turn, gain +2 temporary mana.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 4,
    consumesRunes: true, // Requires G rune
    effectType: 'mana_generation',
    effectValue: 2, // +2 temporary mana per turn
  },
  // Rune Generators - Single Color
  {
    id: 'ub-artifact-green-generator',
    name: 'Nature Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary green rune and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary green rune per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // Rune Generators - Dual Color
  {
    id: 'ub-artifact-ub-dual-generator',
    name: 'Void Shadow Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary blue rune, 1 temporary black rune, and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 temporary runes (1U + 1B) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-gu-dual-generator',
    name: 'Nature Arcane Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary green rune, 1 temporary blue rune, and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['green', 'blue'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 temporary runes (1G + 1U) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-bg-dual-generator',
    name: 'Shadow Growth Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary black rune, 1 temporary green rune, and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['black', 'green'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 temporary runes (1B + 1G) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-rb-dual-generator',
    name: 'Blood Fire Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary red rune, 1 temporary black rune, and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['red', 'black'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 temporary runes (1R + 1B) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-gw-dual-generator',
    name: 'Nature Light Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary green rune, 1 temporary white rune, and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['green', 'white'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 temporary runes (1G + 1W) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // Rune Generators - Flexible Either/Or
  {
    id: 'ub-artifact-ub-flexible-generator',
    name: 'Adaptive Void Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary blue rune or 1 temporary black rune (your choice) and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary rune (choice of U or B) per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // Rune Generators - Any Color (Premium)
  {
    id: 'ub-artifact-prismatic-generator',
    name: 'Prismatic Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary rune of any color and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: [], // Colorless - can generate any color
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary rune of any color per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  {
    id: 'ub-artifact-universal-mana-rock',
    name: 'Universal Mana Rock Artifact',
    description: 'Artifact. At the start of your turn, add 1 temporary rune of any color and 1 temporary mana to your mana pool.',
    cardType: 'artifact',
    colors: [], // Colorless - can generate any color
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary rune of any color per turn
    tempManaGeneration: 1, // Also generates 1 temporary mana
  },
  // 3+X Artifact Cycle
  {
    id: 'black-artifact-dark-pact',
    name: 'Dark Pact',
    description: 'Artifact. At the start of your turn, you lose 2 life but draw a card.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true, // Requires B rune
    effectType: 'life_loss_draw',
    effectValue: 2, // Lose 2 life, draw 1 card
  },
  {
    id: 'green-artifact-natures-blessing',
    name: 'Nature\'s Blessing',
    description: 'Artifact. Target ally gets +0/+5 this turn.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true, // Requires G rune
    effectType: 'target_buff',
    effectValue: 5, // +0/+5
  },
]

// Note: GW and UW artifacts removed - they don't work with RW vs UBG testing framework
// All artifacts must be RW (R, W, RW) or UBG (U, G, B, or combinations)

export const ubSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Mono-Blue Signature Spell
  {
    id: 'blue-sig-arcane-mastery',
    name: 'Arcane Mastery',
    description: 'Draw 2 cards. Costs 2U, refunds 2 mana.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    consumesRunes: true, // Requires U rune
    refundMana: 2, // Free spell mechanic
    effect: {
      type: 'draw_and_heal',
      drawCount: 2,
      healAmount: 0,
    },
    initiative: true,
  },
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
    description: 'Deal 5 damage to all enemy units. Costs 5UUB.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Requires UUB runes (2 blue, 1 black)
    manaCost: 5,
    consumesRunes: true, // Not generic - consumes UUB runes
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
    description: 'Deal 7 damage to target unit or hero. Costs 4UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
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
    effect: {
      type: 'aoe_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  {
    id: 'blue-spell-chain-lightning',
    name: 'Chain Lightning',
    description: 'Deal 3 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 4,
    effect: {
      type: 'aoe_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  {
    id: 'ub-spell-conditional-removal',
    name: 'Dark Bolt',
    description: 'Deal 5 damage to target unit. If it dies, draw a card. Costs 3UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
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
    description: 'Deal 4 damage to all enemy units. Costs 5UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
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
  // Low-Cost Dual-Color Spells (Double Spelling Enablers)
  {
    id: 'spell-return-to-base',
    name: 'Tactical Retreat',
    description: 'Return target card to its owner\'s base. It can be deployed next turn.',
    cardType: 'spell',
    colors: ['white', 'blue'],
    manaCost: 1,
    consumesRunes: true, // Requires U and W runes
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
    consumesRunes: true, // Requires U rune
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
  {
    id: 'white-spell-3w-protection',
    name: 'Divine Shield',
    description: 'Target unit gains protection from spells this turn. Heal target unit for 3.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: true, // Requires W rune
    effect: {
      type: 'draw_and_heal', // Using heal part
      damage: 0,
      healAmount: 3,
    },
    initiative: true,
  },
  // Hero-Threatening Mechanics
  {
    id: 'red-spell-hero-burn',
    name: 'Hero Strike',
    description: 'Deal 3 damage to target hero.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    consumesRunes: true, // Requires R rune
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsHeroes: true,
    },
    initiative: true,
  },
  {
    id: 'black-spell-hero-assassinate',
    name: 'Assassinate',
    description: 'Deal 4 damage to target hero.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: true, // Requires B rune
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsHeroes: true,
    },
    initiative: true,
  },
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
    id: 'white-spell-combat-trick',
    name: 'Divine Favor',
    description: 'Before combat: Target unit gains +0/+3 this turn.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage', // Placeholder
      damage: 0,
    },
    initiative: true,
  },
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
  {
    id: 'blue-spell-spell-synergy',
    name: 'Arcane Cascade',
    description: 'When you cast your second spell this turn, draw a card.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    consumesRunes: true, // Requires U rune
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom tracking
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
  {
    id: 'ub-spell-removal',
    name: 'Arcane Removal',
    description: 'Deal 6 damage to target unit or hero.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 6,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Early impactful spells
  {
    id: 'ub-spell-frost-bolt',
    name: 'Frost Bolt',
    description: 'Deal 2 damage to enemy unit in front of your hero.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
    effect: {
      type: 'front_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ub-spell-light-strike-array',
    name: 'Light Strike Array',
    description: 'Deal 2 damage to enemy unit in front of your hero and stun it.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
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
    id: 'ubg-spell-kill-hero-discard',
    name: 'Assassinate',
    description: 'Deal 7 damage to target unit or hero. Opponent discards a random card.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Premium removal - keeps rune requirement (uncommon)
    manaCost: 4,
    consumesRunes: true, // Not generic - consumes U and B runes
    effect: {
      type: 'targeted_damage',
      damage: 7,
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
    consumesRunes: true,
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
    consumesRunes: true,
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
    consumesRunes: true,
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
    consumesRunes: true,
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
    consumesRunes: true,
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
    consumesRunes: true,
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
    consumesRunes: true,
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
    id: 'free-spell-combat-flux',
    name: 'Combat Flux',
    description: 'Deal 2 damage to target unit and redirect its combat target. Costs 1UR, refunds 1 mana.',
    cardType: 'spell',
    colors: ['blue', 'red'],
    manaCost: 1,
    consumesRunes: true,
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
    description: 'Rare. Resilient support hero.',
    cardType: 'hero',
    colors: ['green', 'white'], // Converted from GGW to GW (2-rune max)
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Allies gain +0/+3. When a unit dies, put a +1/+1 counter on all your units.',    equippedItems: [],
    ability: {
      name: 'Nature\'s Embrace',
      description: 'All your units gain +2/+4 until end of turn. Put a +1/+1 counter on each of your units.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'buff_units',
      effectValue: 2,
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
    attack: 7,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rwg-unit-iron-golem',
    name: 'Iron Golem',
    description: 'Big defensive creature. Costs 6RW.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 6,
    consumesRunes: true, // Multicolor 6+ mana should require runes
    attack: 5,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
  // RGW Finisher Units - Require multiple colors
  {
    id: 'rwg-unit-primal-titan',
    name: 'Primal Titan',
    description: '6/6. When this enters, all your units gain +2/+2 until end of turn. Costs 7RRGG.',
    cardType: 'generic',
    colors: ['red', 'red', 'green', 'green'],
    manaCost: 7,
    consumesRunes: true,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rwg-unit-wild-colossus',
    name: 'Wild Colossus',
    description: '7/7. Trample. When this attacks, all your units gain +1/+1 until end of turn. Costs 8RRWW.',
    cardType: 'generic',
    colors: ['red', 'red', 'white', 'white'],
    manaCost: 8,
    consumesRunes: true,
    attack: 7,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rwg-unit-nature-warlord',
    name: 'Nature Warlord',
    description: '5/7. When this enters, if you control heroes of 3+ different colors, all your units gain +3/+3 until end of turn. Costs 5RRGW.',
    cardType: 'generic',
    colors: ['red', 'red', 'green', 'white'],
    manaCost: 5,
    consumesRunes: true,
    attack: 5,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
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
    description: 'All your units gain +3/+3 and trample this turn. If you control heroes of 3+ different colors, draw a card for each unit you control. Costs 8RRWW.',
    cardType: 'spell',
    colors: ['red', 'red', 'white', 'white'],
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
    description: 'All your units gain +3/+3 this turn. Costs 5RRW.',
    cardType: 'spell',
    colors: ['red', 'red', 'white'],
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
    description: 'Destroy all enemy units. Draw a card for each unit destroyed. Costs 7BBU.',
    cardType: 'spell',
    colors: ['black', 'black', 'blue'],
    manaCost: 7,
    consumesRunes: true,
    effect: {
      type: 'aoe_damage',
      damage: 999,
      affectsUnits: true,
      affectsHeroes: false,
      affectsEnemyUnits: true,
    },
  },
  // Mono-White Signature Spell
  {
    id: 'white-sig-divine-protection',
    name: 'Divine Protection',
    description: 'Target unit gains +0/+5 and protection from spells this turn. Costs 2W, refunds 2 mana.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 2,
    consumesRunes: true, // Requires W rune
    refundMana: 2, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff + protection
      damage: 0,
      affectsUnits: true,
    },
    initiative: true,
  },
  // White Dopamine Hit: Tower Healing & Protection
  {
    id: 'white-spell-divine-healing',
    name: 'Divine Healing',
    description: 'Heal your tower for 5 HP. Draw a card.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would be tower heal + draw
      damage: 0,
    },
  },
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
    description: 'Take control of target enemy unit. Costs 9UUBBRR, refunds 9 mana.',
    cardType: 'spell',
    rarity: 'rare',
    colors: ['blue', 'blue', 'black', 'black', 'red', 'red'], // UUBBRR
    consumesRunes: true, // Requires UUBBRR runes
    manaCost: 9,
    refundMana: 9, // Free spell mechanic - refunds mana cost
    effect: {
      type: 'steal_unit',
      affectsUnits: true,
      affectsHeroes: false,
    },
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
]

// ============================================================================
// UBR (Blue/Black/Red) - Grixis Units
// ============================================================================

export const ubrCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ubr-unit-grixis-titan',
    name: 'Grixis Titan',
    description: '8/6. When this enters, deal 5 damage to all enemy units. When this attacks, deal 3 damage to enemy tower. Costs 8UBR.',
    cardType: 'generic',
    colors: ['blue', 'black', 'red'],
    manaCost: 8,
    consumesRunes: true, // Requires UBR runes
    attack: 8,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'ubr-unit-void-destroyer',
    name: 'Void Destroyer',
    description: '7/7. When this enters, destroy target unit. When this attacks, draw a card and deal 2 damage to enemy tower. Costs 9UBR.',
    cardType: 'generic',
    colors: ['blue', 'black', 'red'],
    manaCost: 9,
    consumesRunes: true, // Requires UBR runes
    attack: 7,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
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
    consumesRunes: true, // Requires WUB runes
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
  {
    id: 'wub-unit-esper-titan',
    name: 'Esper Titan',
    description: '7/7. When this enters, destroy target unit. When this attacks, draw a card. Costs 7WUB.',
    cardType: 'generic',
    colors: ['white', 'blue', 'black'],
    manaCost: 7,
    consumesRunes: true, // Requires WUB runes
    attack: 7,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
  {
    id: 'wub-unit-void-tyrant',
    name: 'Void Tyrant',
    description: '8/6. When this enters, destroy all enemy units with 3 or less health. When this attacks, draw 2 cards. Costs 8WUB.',
    cardType: 'generic',
    colors: ['white', 'blue', 'black'],
    manaCost: 8,
    consumesRunes: true, // Requires WUB runes
    attack: 8,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
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
    id: 'wgu-spell-natures-shield',
    name: 'Nature\'s Shield',
    description: 'Target unit gains +0/+3 and protection from spells this turn. Draw a card. Costs 2WGU, refunds 2 mana.',
    cardType: 'spell',
    colors: ['white', 'green', 'blue'],
    manaCost: 2,
    consumesRunes: true, // Requires WGU runes
    refundMana: 2, // Free spell mechanic
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff + protection
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
]

// ============================================================================
// WGU (White/Green/Blue) - Bant Units
// ============================================================================

export const wguCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'wgu-unit-primal-titan',
    name: 'Primal Titan',
    description: '8/8. Trample. Protection from spells. When this attacks, all your units gain +2/+2 until end of turn. Costs 8WGU.',
    cardType: 'generic',
    colors: ['white', 'green', 'blue'],
    manaCost: 8,
    consumesRunes: true, // Requires WGU runes
    attack: 8,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  {
    id: 'wgu-unit-guardian-colossus',
    name: 'Guardian Colossus',
    description: '7/10. Protection from spells. When this enters, gain +2 max mana. All your units gain +1/+1 permanently. Costs 9WGU.',
    cardType: 'generic',
    colors: ['white', 'green', 'blue'],
    manaCost: 9,
    consumesRunes: true, // Requires WGU runes
    attack: 7,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
  },
]

// ============================================================================
// UW (Blue/White) - Control but Proactive
// ============================================================================

export const uwHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'uw-hero-paladin',
    name: 'Arcane Paladin',
    description: 'Proactive control',
    cardType: 'hero',
    colors: ['blue', 'white'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Allies gain +1/+1',    equippedItems: [],
  },
]

export const uwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Generic UW cards
  // White adjacency units - positional gameplay
  {
    id: 'white-unit-guardian-angel',
    name: 'Guardian Angel',
    description: 'Adjacent allies gain +0/+2. Costs 3W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: true, // Requires W rune
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'white-unit-holy-sentinel',
    name: 'Holy Sentinel',
    description: 'Adjacent allies gain +0/+3. Costs 4WW.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: true, // Requires WW runes
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'white-unit-fortified-bastion',
    name: 'Fortified Bastion',
    description: 'Adjacent allies gain +0/+4. Costs 5WWW.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    consumesRunes: true, // Requires WWW runes
    attack: 2,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
]

export const uwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Divine Wrath removed - replaced with artifact
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
  // WB cards can be added here if needed
]

export const wbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // WB spells can be added here if needed
]

// ============================================================================
// COMBO HEROES - Storm, Aristocrats, Bounce
// ============================================================================

export const comboHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Storm Combo: Rune Channeler - converts runes to tower damage
  {
    id: 'combo-hero-rune-channeler',
    name: 'Rune Channeler',
    description: 'Storm. Can convert runes into direct tower damage. Combo payoff for rune generation.',
    cardType: 'hero',
    colors: ['blue', 'black'],
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,    equippedItems: [],
    ability: {
      name: 'Rune Blast',
      description: 'Spend 3 runes of any color: Deal 2 damage to enemy tower. No cooldown.',
      manaCost: 0,
      cooldown: 0,
      effectType: 'rune_to_damage',
      effectValue: 2,
      runeCost: ['black', 'black', 'black'],
    },
  },
]

// ============================================================================
// COMBO UNITS - Enablers for the combo archetypes
// ============================================================================

export const comboCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Storm Combo pieces
  // Combo units removed - they don't play into rune mechanics
]

// ============================================================================
// CREEP-STACKING INCENTIVE CARDS - REMOVED
// All 0/X creatures removed - no longer relevant without auto-spawning creeps
// ============================================================================

export const creepStackingCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []

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
  {
    id: 'rare-red-titan',
    name: 'Inferno Titan',
    cardType: 'generic',
    rarity: 'rare',
    colors: ['red'],
    manaCost: 8,
    consumesRunes: true,
    attack: 6,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    description: '6/4, Cleave. When deployed: Deal 3 damage to all enemy units. When this attacks a tower: Deal 2 damage to the enemy nexus.',
  },
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
]

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
  ...comboCards,
  ...monoRedAggroCards,
  ...blackMidrangeCards,
  ...runeFinisherUnits,
  ...creepStackingCards,
  // Rare cards
  ...rareBlackCards,
  ...rareRedCards,
  ...rareGreenCards,
  ...rareUBCards,
  ...rareBRCards,
]

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
  // Rare artifacts (equipment)
  ...rareWhiteCards,
  ...rareRGCards,
  ...rareWGCards,
]

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
]

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
    staticAbility: 'Your units gain +0/+1',
    staticAbilityId: 'unit-health-buff',
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
    staticAbility: 'Units gain +0/+1 when played',
    staticAbilityId: 'unit-health-buff',
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



