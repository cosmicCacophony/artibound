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
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    signatureCardId: 'rw-sig-commander-1',
    equippedItems: [],
    supportEffect: 'Legion units get +1/+1',
  },
  {
    id: 'rw-hero-captain',
    name: 'Legion Commander',
    description: 'Legion units get +1/+1.',
    cardType: 'hero',
    colors: ['red', 'white'],
    attack: 4,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    signatureCardId: 'rw-sig-captain-1',
    equippedItems: [],
    supportEffect: 'Legion units get +1/+1',
  },
  // Red Cleave Hero (Sven-like) - Tool to deal with creep-stacking cards
  {
    id: 'red-hero-cleaver',
    name: 'Cleave Warrior',
    description: '4/6. Cleave (damages adjacent units when attacking). Red\'s answer to stacked creeps. Especially aggressive hero.',
    cardType: 'hero',
    colors: ['red'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    signatureCardId: 'red-sig-cleaver-1',
    equippedItems: [],
  },
]

export const rwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature units (physical objects that can be units)
  // Rally Banner removed - replaced with artifact
  {
    id: 'rw-sig-captain-2',
    name: 'Battle Standard',
    description: 'Captain signature - team buff. All allies gain +1 attack.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  // Cleave Warrior signature card
  {
    id: 'red-sig-cleaver-1',
    name: 'Cleave Strike',
    description: 'Cleave Warrior signature - aggressive unit with cleave. 4/4. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // More Cleave Effects
  {
    id: 'red-unit-cleaving-warrior',
    name: 'Cleaving Warrior',
    description: '3/3. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'red-unit-cleaving-berserker',
    name: 'Cleaving Berserker',
    description: '4/3. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: true, // Requires R rune
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
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
  {
    id: 'rw-bounce-war-banner-carrier',
    name: 'War Banner Carrier',
    description: 'Bounce. 1/3. When a hero is deployed to this lane, you may return target hero to base. Draw a card.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 2,
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
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
    id: 'rw-unit-cleaving-champion',
    name: 'Cleaving Champion',
    description: '4/4. Cleave (damages adjacent units when attacking). Costs 5 (4RWR).',
    cardType: 'generic',
    colors: ['red', 'red', 'white'], // Requires 2 red + 1 white runes (RWR)
    manaCost: 5,
    consumesRunes: true, // Requires RWR runes
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
  // Low-cost aggressive units (1-3 mana)
  {
    id: 'red-aggro-goblin-scout',
    name: 'Goblin Scout',
    description: 'Can attack towers directly.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 1,
    attack: 2,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
  },
  {
    id: 'red-aggro-fire-striker',
    name: 'Fire Striker',
    description: 'Haste. When this attacks, deal 1 damage to tower.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 2,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-battle-hound',
    name: 'Battle Hound',
    description: 'When this attacks, deal 2 damage to tower.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-raging-warrior',
    name: 'Raging Warrior',
    description: 'Aggressive threat.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune - above vanilla rate
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-tower-raider',
    name: 'Tower Raider',
    description: 'When this enters, deal 2 damage to tower. Can attack towers directly.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune - has powerful ability
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'red-aggro-fury-striker',
    name: 'Fury Striker',
    description: 'When this attacks, deal 1 damage to all enemy units.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune - has powerful ability
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // More 1-3 mana creeps
  {
    id: 'red-aggro-goblin-raider',
    name: 'Goblin Raider',
    description: 'Can attack towers directly.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 1,
    attack: 2,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
  },
  {
    id: 'red-aggro-swift-warrior',
    name: 'Swift Warrior',
    description: 'Haste.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 2,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-tower-striker',
    name: 'Tower Striker',
    description: 'When this attacks, deal 1 damage to tower.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-berserker-charge',
    name: 'Berserker Charge',
    description: 'Aggressive threat.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'red-aggro-tower-bomber',
    name: 'Tower Bomber',
    description: 'When this enters, deal 2 damage to tower.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // 3+X Unit Cycle
  {
    id: 'red-unit-berserker',
    name: 'Berserker',
    description: '4/2. When this attacks, deal 2 damage to the tower.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: true, // Requires R rune
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
]

export const monoRedAggroSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Direct damage spells (2-3 mana)
  {
    id: 'red-aggro-bolt',
    name: 'Fire Bolt',
    description: 'Deal 4 damage to target unit or tower.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'red-aggro-strike',
    name: 'Lightning Strike',
    description: 'Deal 3 damage to target unit. If it dies, deal 2 damage to tower.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'red-spell-grant-cleave',
    name: 'Battle Rage',
    description: 'Target unit gains cleave this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for granting cleave
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'red-spell-position-buff',
    name: 'Frontline Charge',
    description: 'If you have a hero in front of target unit, that unit gains +3/+3 this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect
      damage: 0,
    },
    initiative: true,
  },
  {
    id: 'red-aggro-blast',
    name: 'Fire Blast',
    description: 'Deal 5 damage to target unit or tower.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'red-aggro-burn',
    name: 'Burning Strike',
    description: 'Deal 4 damage to target unit or tower. Costs 3RR.',
    cardType: 'spell',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Combat tricks (1-2 mana)
  {
    id: 'red-aggro-surge',
    name: 'Power Surge',
    description: 'Target unit gains +1/+1 and can attack towers this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a buff
      damage: 0,
    },
  },
  {
    id: 'red-aggro-rage',
    name: 'Battle Rage',
    description: 'Target unit gains +2/+2 this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a buff
      damage: 0,
    },
  },
]

// RW Artifacts - Persistent effects in base (R, W, or RW colors only)
export const rwArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'rw-artifact-war-banner',
    name: 'War Banner Artifact',
    description: 'Artifact. All your units gain +1 attack.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'damage_amplifier',
    effectValue: 1,
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
    description: 'Artifact. All your units gain +1/+1.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'damage_amplifier',
    effectValue: 1, // +1 attack, defensive buff handled separately if needed
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
    description: 'Artifact. At the start of your turn, add 1 temporary red rune to your rune pool.',
    cardType: 'artifact',
    colors: ['red'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 temporary red rune per turn
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
    description: 'Artifact. At the start of your turn, add 1 white rune to your rune pool.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 white rune per turn
  },
  // Rune Generators - Dual Color
  {
    id: 'rw-artifact-dual-generator',
    name: 'Legion Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 red rune and 1 white rune to your rune pool.',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 runes (1R + 1W) per turn
  },
  // Rune Generators - Flexible Either/Or
  {
    id: 'rw-artifact-flexible-generator',
    name: 'Adaptive Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 red rune or 1 white rune to your rune pool (your choice).',
    cardType: 'artifact',
    colors: ['red', 'white'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 rune (choice of R or W) per turn
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
  {
    id: 'white-artifact-frontline-aura',
    name: 'Frontline Aura',
    description: 'Artifact. Heroes in front of units give those units +1 attack.',
    cardType: 'artifact',
    colors: ['white'],
    manaCost: 3,
    effectType: 'damage_amplifier',
    effectValue: 1, // +1 attack to units in front of heroes
  },
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
  // Signature spells (converted from units)
  {
    id: 'rw-sig-commander-2',
    name: 'Charge Order',
    description: 'Commander signature - aggressive. All allies gain +2 attack this turn.',
    cardType: 'spell',
    colors: ['red', 'white'],
    manaCost: 3,
    initiative: true, // Quickcast - gives initiative
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff
      damage: 0,
    },
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
    description: 'Deal 2 damage to caster\'s adjacent enemies and give them -2 attack.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
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
    description: 'Target unit gains +3 attack this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff
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
]

// ============================================================================
// RG (Red/Green) - Beefy Aggro with Fight
// ============================================================================

export const rgHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'rg-hero-brawler',
    name: 'Wild Brawler',
    description: 'Fights with nature',
    cardType: 'hero',
    colors: ['red', 'green'],
    attack: 4,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Can fight enemy units',
    signatureCardId: 'rg-sig-brawler-1',
    equippedItems: [],
    ability: {
      name: 'Wild Fight',
      description: 'Fight target unit. If it dies, gain +1 max mana.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'damage_target', // Placeholder - would need custom effect for fight
      effectValue: 4,
    },
  },
  {
    id: 'rg-hero-ramp',
    name: 'Nature Warrior',
    description: 'Ramps into big threats',
    cardType: 'hero',
    colors: ['green'],
    attack: 4,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Gain +1 max mana',
    signatureCardId: 'rg-sig-ramp-1',
    equippedItems: [],
    ability: {
      name: 'Nature\'s Gift',
      description: 'Gain +1 max mana. Draw a card.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'draw_card',
      effectValue: 1,
    },
  },
  // RG Dopamine Hit: Activated Fight Hero
  {
    id: 'rg-hero-axe-warrior',
    name: 'Axe Warrior',
    description: '3/10. Activated (1 mana): Fight all enemy units in front of this hero and adjacent to it. (Normally buff first since only 3 attack)',
    cardType: 'hero',
    colors: ['red', 'green'],
    attack: 3,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Can fight enemy units',
    signatureCardId: 'rg-sig-axe-1',
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
]

export const rgCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'rg-sig-brawler-1',
    name: 'Fight Club',
    description: 'Brawler signature - fight spell',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 3,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rg-sig-brawler-2',
    name: 'Wild Strike',
    description: 'Brawler signature - aggressive',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 4,
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'rg-sig-ramp-1',
    name: 'Mana Bloom',
    description: 'Ramp signature - gain mana',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rg-sig-ramp-2',
    name: 'Nature\'s Gift',
    description: 'Ramp signature - big unit',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 6,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  // Generic RG cards
  {
    id: 'rg-beefy-1',
    name: 'Wild Beast',
    description: 'Beefy aggressive unit',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 4,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'rg-beefy-2',
    name: 'Raging Bear',
    description: 'Big aggressive threat. Costs 5RG.',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 5,
    consumesRunes: true, // Multicolor 5+ mana should require runes
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rg-ramp-1',
    name: 'Mana Druid',
    description: 'Ramps mana',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rg-finisher-1',
    name: 'Ancient Titan',
    description: 'Big finisher',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 8,
    attack: 8,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
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
    supportEffect: 'Spells deal +1 damage',
    signatureCardId: 'ru-sig-spellblade-1',
    equippedItems: [],
    ability: {
      name: 'Arcane Strike',
      description: 'Deal 3 damage to target unit. Draw a card.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'damage_target',
      effectValue: 3,
    },
  },
  {
    id: 'ru-hero-sorcerer',
    name: 'Battle Sorcerer',
    description: 'Spell-focused hero',
    cardType: 'hero',
    colors: ['blue'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Draw card when casting spell',
    signatureCardId: 'ru-sig-sorcerer-1',
    equippedItems: [],
    ability: {
      name: 'Arcane Bolt',
      description: 'Deal 2 damage to target unit. Draw a card.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'damage_target',
      effectValue: 2,
    },
  },
]

export const ruCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'ru-sig-spellblade-1',
    name: 'Fire Bolt',
    description: 'Spellblade signature - damage',
    cardType: 'generic',
    colors: ['red', 'blue'],
    manaCost: 3,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'ru-sig-spellblade-2',
    name: 'Arcane Strike',
    description: 'Spellblade signature - combo',
    cardType: 'generic',
    colors: ['red', 'blue'],
    manaCost: 4,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

export const ruSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'ru-sig-sorcerer-1',
    name: 'Chain Lightning',
    description: 'Sorcerer signature - AOE. Deal 3 damage to target unit and adjacent units.',
    cardType: 'spell',
    colors: ['blue'],
    consumesRunes: true, // AOE damage
    manaCost: 4,
    effect: {
      type: 'adjacent_damage',
      damage: 3,
      adjacentCount: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
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
    description: 'Deal 5 damage',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 3,
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
    description: 'Damage 3 adjacent units',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: true, // Not generic - consumes runes
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
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Draw card when unit dies',
    signatureCardId: 'rb-sig-reaper-1',
    equippedItems: [],
    ability: {
      name: 'Blood Sacrifice',
      description: 'Sacrifice a unit you control: Deal 3 damage to target unit or hero, draw a card.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'sacrifice_unit',
      effectValue: 3,
    },
  },
  {
    id: 'rb-hero-assassin',
    name: 'Shadow Assassin',
    description: 'Trades HP for advantage',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Gain gold when units die',
    signatureCardId: 'rb-sig-assassin-1',
    equippedItems: [],
    bonusVsHeroes: 4, // Assassin: deals double damage to heroes (4 base attack = 8 vs heroes)
  },
  // Black Dopamine Hit: Cross-Lane Assassin Hero
  {
    id: 'black-hero-cross-assassin',
    name: 'Cross-Lane Assassin',
    description: '4/8. Activated (1 mana): Move this hero to any battlefield. If it moves, it may fight an enemy unit there.',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Can move across battlefields',
    signatureCardId: 'black-sig-cross-assassin-1',
    equippedItems: [],
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
]

export const rbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'rb-sig-reaper-1',
    name: 'Death Strike',
    description: 'Reaper signature - kill spell',
    cardType: 'generic',
    colors: ['red', 'black'],
    manaCost: 3,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'rb-sig-reaper-2',
    name: 'Blood Draw',
    description: 'Reaper signature - card draw',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rb-sig-assassin-2',
    name: 'Dark Trade',
    description: 'Assassin signature - resource trade',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // Generic RB cards
  {
    id: 'rb-draw-1',
    name: 'Dark Insight',
    description: 'Draw 2 cards, lose 2 HP',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 3,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
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
]

export const rbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'rb-sig-assassin-1',
    name: 'Shadow Kill',
    description: 'Assassin signature - removal. Deal 4 damage to target unit.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 2,
    consumesRunes: true, // Not generic - consumes B rune
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
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
    health: 11,
    maxHealth: 11,
    currentHealth: 11,
    supportEffect: 'Allies gain +0/+2',
    signatureCardId: 'gw-sig-warden-1',
    equippedItems: [],
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
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'All your units gain +0/+2',
    signatureCardId: undefined,
    equippedItems: [],
  },
  {
    id: 'gw-hero-protector',
    name: 'Divine Protector',
    description: 'Shields allies',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Allies gain +1/+1',
    signatureCardId: 'gw-sig-protector-1',
    equippedItems: [],
    ability: {
      name: 'Divine Shield',
      description: 'Neighbors gain +3 attack this combat phase',
      manaCost: 1,
      cooldown: 1,
      effectType: 'buff_units',
      effectValue: 3, // +3 attack to neighbors
    },
  },
]

export const gwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'gw-sig-warden-1',
    name: 'Protective Aura',
    description: 'Warden signature - team buff',
    cardType: 'generic',
    colors: ['green', 'white'],
    manaCost: 3,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'gw-sig-warden-2',
    name: 'Nature\'s Shield',
    description: 'Warden signature - protection',
    cardType: 'generic',
    colors: ['green', 'white'],
    manaCost: 4,
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  // Divine Aura removed - replaced with artifact
  {
    id: 'gw-sig-protector-2',
    name: 'Guardian Aegis',
    description: 'Protector signature - protection. Adjacent units gain +1/+1. Retaliate 1 (deals 1 damage to attackers).',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    specialEffects: ['adjacent_buff', 'retaliate_1'], // Adjacent units +1/+1, retaliate 1 damage
  },
  // Generic GW cards
  // Saproling removed
  {
    id: 'white-sig-front-guardian-1',
    name: 'Frontline Standard',
    description: 'Front Guardian signature - positioning. 2/4. Units in front of this gain +1/+1.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'white-unit-positioned-warrior',
    name: 'Positioned Warrior',
    description: '2/3. If a hero is in front of this unit, this unit gains +2/+2.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 2,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'gw-token-2',
    name: 'Elf Scout',
    description: 'Token unit',
    cardType: 'generic',
    colors: ['green', 'white'],
    manaCost: 3,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  // Glorious Banner removed - replaced with artifact
  {
    id: 'gw-aura-2',
    name: 'Nature\'s Embrace',
    description: 'Aura - +0/+2 to all',
    cardType: 'generic',
    colors: ['green', 'white'],
    manaCost: 5,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
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
    attack: 4,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Gain gold when units die',
    signatureCardId: 'gb-sig-reaper-1',
    equippedItems: [],
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
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Kill spells cost -1',
    signatureCardId: 'gb-sig-assassin-1',
    equippedItems: [],
    bonusVsHeroes: 4, // Assassin: deals double damage to heroes (4 base attack = 8 vs heroes)
  },
]

export const gbCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'gb-sig-reaper-1',
    name: 'Death Bloom',
    description: 'Reaper signature - kill',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 3,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'gb-sig-assassin-1',
    name: 'Poison Strike',
    description: 'Assassin signature - kill',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 3,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'gb-sig-assassin-2',
    name: 'Assassin\'s Blade',
    description: 'Assassin signature - threat',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    attack: 5,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // Generic GB cards
  {
    id: 'gb-beefy-1',
    name: 'Rotting Giant',
    description: 'Beefy midrange threat',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 5,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'gb-beefy-2',
    name: 'Death Knight',
    description: 'Big midrange unit',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 6,
    attack: 6,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
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
    description: 'When this attacks, draw a card.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'black-midrange-void-assassin',
    name: 'Void Assassin',
    description: 'When this enters, destroy target unit with 3 or less health.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 5,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// ============================================================================
// Rune-Consuming Finishers - Payoffs for Multicolor Rune Generation
// ============================================================================

export const runeFinisherSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // High-cost finishers that consume multiple runes
  {
    id: 'rune-finisher-void-storm',
    name: 'Void Storm',
    description: 'Deal 8 damage to target unit or hero. If you control 3+ rune generators, deal 12 damage instead. Costs 5UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 8, // Scales to 12 with 3+ generators
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rune-finisher-prismatic-blast',
    name: 'Prismatic Blast',
    description: 'Deal X damage to target unit or tower, where X is the number of different colored runes you control. Costs 4 (any 2 colors).',
    cardType: 'spell',
    colors: ['blue', 'black'], // Flexible - requires any 2 colors
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 5, // Scales with color count
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rune-finisher-multicolor-wrath',
    name: 'Multicolor Wrath',
    description: 'Deal 6 damage to all enemy units. If you control heroes of 3+ different colors, destroy all enemy units instead. Costs 6 (any 3 colors).',
    cardType: 'spell',
    colors: ['blue', 'black', 'green'], // Flexible - requires any 3 colors
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'aoe_damage',
      damage: 6,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  {
    id: 'rune-finisher-rune-channel',
    name: 'Rune Channel',
    description: 'Deal 2 damage to enemy tower for each rune generator you control. Costs 3 (any color).',
    cardType: 'spell',
    colors: ['blue'], // Flexible - can be any color
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 4, // Scales with generator count
      affectsUnits: false,
      affectsHeroes: false,
    },
  },
  {
    id: 'rune-finisher-arcane-convergence',
    name: 'Arcane Convergence',
    description: 'Draw cards equal to the number of different colored runes you control. Costs 4 (any 2 colors).',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be card draw
      damage: 0,
    },
  },
  {
    id: 'rune-finisher-void-nexus',
    name: 'Void Nexus',
    description: 'Destroy target unit. Draw a card for each rune generator you control. Costs 5UB.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be destroy + draw
      damage: 0,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
]

export const runeFinisherUnits: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Units with activated abilities that consume runes
  {
    id: 'rune-finisher-rune-mage',
    name: 'Rune Mage',
    description: '3/4. Activated: Spend 2 runes of any color → Deal 3 damage to target unit or tower.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 4,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'rune-finisher-prismatic-channeler',
    name: 'Prismatic Channeler',
    description: '2/5. Activated: Spend 3 runes of any color → Draw 2 cards.',
    cardType: 'generic',
    colors: ['blue', 'black', 'green'],
    manaCost: 4,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'rune-finisher-void-architect',
    name: 'Void Architect',
    description: '4/4. When this enters, if you control 3+ rune generators, draw 3 cards.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 5,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'rune-finisher-multicolor-titan',
    name: 'Multicolor Titan',
    description: '6/6. This has +1/+1 for each different colored rune you control.',
    cardType: 'generic',
    rarity: 'uncommon',
    colors: ['blue', 'black', 'green'],
    manaCost: 6,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rune-finisher-rune-collector',
    name: 'Rune Collector',
    description: '3/3. When you add runes to your pool, draw a card.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

export const blackMidrangeSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Efficient removal (2-3 mana)
  {
    id: 'black-midrange-destroy-weak',
    name: 'Dismember',
    description: 'Destroy target unit with 3 or less health.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would be destroy
      damage: 0,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  {
    id: 'black-midrange-destroy-medium',
    name: 'Murder',
    description: 'Destroy target unit with 4 or less health.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would be destroy
      damage: 0,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  {
    id: 'black-midrange-destroy-any',
    name: 'Assassinate',
    description: 'Destroy target unit. Costs 3BB.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be destroy
      damage: 0,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  // Rune-consuming removal (3-5 mana) - Creates tension
  {
    id: 'black-midrange-destroy-premium',
    name: 'Hero\'s Downfall',
    description: 'Destroy target unit or hero. Costs 4BB.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be destroy
      damage: 0,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'black-midrange-destroy-conditional',
    name: 'Dreadbore',
    description: 'Destroy target unit. If it had 5+ health, draw a card. Costs 3BB.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be destroy + conditional draw
      damage: 0,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  // Card draw (3-4 mana)
  {
    id: 'black-midrange-draw-pain',
    name: 'Painful Truths',
    description: 'Draw 2 cards, lose 2 life.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would be card draw
      damage: 0,
    },
  },
  {
    id: 'black-midrange-draw-simple',
    name: 'Read the Bones',
    description: 'Draw 2 cards.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage', // Placeholder - would be card draw
      damage: 0,
    },
  },
  {
    id: 'black-midrange-draw-premium',
    name: 'Dark Insight',
    description: 'Draw 3 cards, lose 3 life. Costs 4BB.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be card draw
      damage: 0,
    },
  },
  // Black Dopamine Hit: Cross-Lane Mechanics
  {
    id: 'black-spell-assassinate',
    name: 'Assassinate',
    description: 'Destroy target unit or hero. You may move one of your heroes to the target\'s battlefield.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 999,
      affectsUnits: true,
      affectsHeroes: true,
      crossLane: true, // Can target across battlefields
    },
  },
  {
    id: 'black-spell-cross-murder',
    name: 'Cross-Lane Murder',
    description: 'Destroy target unit in the other battlefield.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 5,
    effect: {
      type: 'targeted_damage',
      damage: 999,
      affectsUnits: true,
      affectsHeroes: true,
      crossLane: true, // Can only target other battlefield
    },
  },
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
    attack: 3,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Gain +1 max mana each turn',
    signatureCardId: 'gu-sig-druid-1',
    equippedItems: [],
  },
  {
    id: 'gu-hero-archmage',
    name: 'Nature Archmage',
    description: 'Big spell finisher',
    cardType: 'hero',
    colors: ['blue'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Spells cost -1',
    signatureCardId: 'gu-sig-archmage-1',
    equippedItems: [],
  },
  // Special: Green hero that allows 3-color play
  {
    id: 'gu-hero-chromat',
    name: 'Chromatic Sage',
    description: 'Allows playing any color card',
    cardType: 'hero',
    colors: ['green'],
    attack: 4,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'You can play cards of any color',
    signatureCardId: 'gu-sig-chromat-1',
    equippedItems: [],
  },
]

export const guCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'gu-sig-druid-1',
    name: 'Mana Bloom',
    description: 'Druid signature - ramp',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'gu-sig-druid-2',
    name: 'Nature\'s Gift',
    description: 'Druid signature - big unit',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 7,
    attack: 7,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
  {
    id: 'gu-sig-archmage-1',
    name: 'Arcane Growth',
    description: 'Archmage signature - ramp',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'gu-sig-archmage-2',
    name: 'Greater Spell',
    description: 'Archmage signature - big spell',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 8,
    attack: 6,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'gu-sig-chromat-1',
    name: 'Prismatic Power',
    description: 'Chromatic signature - flexible',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 4,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'gu-sig-chromat-2',
    name: 'Universal Mana',
    description: 'Chromatic signature - any color',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 5,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  // Generic GU cards
  {
    id: 'gu-ramp-1',
    name: 'Mana Crystal',
    description: 'Ramps mana',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    attack: 1,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'gu-ramp-2',
    name: 'Leyline',
    description: 'Ramps mana',
    cardType: 'generic',
    colors: ['green', 'blue'],
    manaCost: 4,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'gu-finisher-1',
    name: 'Colossus',
    description: 'Big finisher',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 9,
    attack: 9,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    // Single color, so no rune requirement needed
  },
]

export const guSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
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
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Draw extra card each turn',
    signatureCardId: 'ub-sig-archmage-1',
    equippedItems: [],
  },
  {
    id: 'ub-hero-necromancer',
    name: 'Void Necromancer',
    description: 'Combo payoff. Converts black runes into tower damage.',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 11,
    maxHealth: 11,
    currentHealth: 11,
    supportEffect: 'Gain gold when units die',
    signatureCardId: 'ub-sig-necromancer-1',
    equippedItems: [],
    bonusVsHeroes: 4, // Assassin: deals double damage to heroes (4 base attack = 8 vs heroes)
    ability: {
      name: 'Soul Burn',
      description: 'Spend B runes: Deal 1 damage to enemy tower per rune spent. No cooldown.',
      manaCost: 0,
      cooldown: 0, // No cooldown - can be used repeatedly
      effectType: 'rune_to_damage',
      effectValue: 1, // 1 damage per rune
      runeCost: ['black'], // Spends 1+ black runes
    },
  },
  {
    id: 'ub-hero-nature-guardian',
    name: 'Nature Guardian',
    description: 'Resilient control hero',
    cardType: 'hero',
    colors: ['green', 'black'], // Changed from green to green/black to enable black spells
    attack: 3, // Reduced from 4
    health: 8, // Reduced from 10
    maxHealth: 8, // Reduced from 10
    currentHealth: 8, // Reduced from 10
    supportEffect: 'When an enemy unit dies, gain +1 max mana this turn',
    signatureCardId: 'ub-sig-guardian-1',
    equippedItems: [],
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
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
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
]

export const ubCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // UB Control Archetype Units (minimal units - focus on spells)
  {
    id: 'ub-control-tower-destroyer',
    name: 'Tower Destroyer',
    description: '5/7. When you use a hero ability, this can attack towers directly this turn.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 7,
    attack: 5,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
  {
    id: 'ub-control-arcane-scholar',
    name: 'Arcane Scholar',
    description: '2/3. When you use a hero ability, draw a card.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // Green cards added to UB deck (UBG)
  {
    id: 'ubg-ramp-1',
    name: 'Verdant Growth',
    description: '3/4. When this enters, gain +1 max mana.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 4,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'ubg-ramp-2',
    name: 'Nature\'s Embrace',
    description: '2/5. Adjacent units gain +0/+1.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    specialEffects: ['adjacent_buff'],
  },
  // Ethereal Scholar removed
  {
    id: 'ubg-etb-void-walker',
    name: 'Void Walker',
    description: '3/4. When this enters, stun target enemy unit for 1 turn.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 4,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    // Note: ETB effect would need implementation in deployment system
  },
  {
    id: 'ubg-etb-natures-guardian',
    name: 'Nature\'s Guardian',
    description: '4/5. When this enters, all your units gain +1/+1 until end of turn.',
    cardType: 'generic',
    colors: ['green', 'blue'],
    manaCost: 5,
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    // Note: ETB effect would need implementation in deployment system
  },
  // Bounce Units - Units that can bounce heroes (like Cloud Sprite)
  {
    id: 'ubg-bounce-void-shifter',
    name: 'Void Shifter',
    description: 'Bounce. 2/2. When a hero is deployed to this lane, you may return target hero to base.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'ubg-bounce-ethereal-guardian',
    name: 'Ethereal Guardian',
    description: 'Bounce. 1/3. When a hero is deployed to this lane, this gains +0/+2. You may return target hero to base.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 2,
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'ubg-bounce-nature-ward',
    name: 'Nature Ward',
    description: 'Bounce. 2/4. When a hero is deployed to this lane, gain 2 gold. You may return target hero to base.',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 3,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // Verdant Colossus removed - replaced with Void Cascade AOE spell
  // Ranged Units - Can attack from base/deploy zone
  {
    id: 'ub-unit-arcane-sniper',
    name: 'Arcane Sniper',
    description: 'Ranged. 1/3. Can attack from base/deploy zone, dealing 3 damage evenly to both towers.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    rangedAttack: 3,
  },
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
    description: '3/4. Cleave (damages adjacent units when attacking).',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    consumesRunes: true, // Requires G rune
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
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
  {
    id: 'blue-creep-arcane-apprentice',
    name: 'Arcane Apprentice',
    description: 'Draw a card when this dies.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 1,
    attack: 1,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'blue-creep-void-shifter',
    name: 'Void Shifter',
    description: 'When this enters, return target unit to hand.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 2,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'blue-creep-stun-mage',
    name: 'Stun Mage',
    description: 'When this enters, stun target unit.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // Black creeps
  {
    id: 'black-creep-cursed-spirit',
    name: 'Cursed Spirit',
    description: 'When this dies, opponent loses 1 life.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 1,
    attack: 2,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
  },
  {
    id: 'black-creep-assassin-initiate',
    name: 'Assassin Initiate',
    description: 'When this enters, destroy target unit with 1 or less health.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'black-creep-dark-scholar',
    name: 'Dark Scholar',
    description: 'When this enters, draw a card, lose 1 life.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // Green creeps
  {
    id: 'green-creep-mana-sprout',
    name: 'Mana Sprout',
    description: 'When this enters, gain +1 max mana.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 1,
    attack: 1,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'green-creep-nature-warden',
    name: 'Nature Warden',
    description: 'When this enters, target unit gains +1/+1.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 2,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'green-creep-druid-initiate',
    name: 'Druid Initiate',
    description: 'When this enters, gain +1 max mana.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // White creeps
  {
    id: 'white-creep-divine-helper',
    name: 'Divine Helper',
    description: 'When this enters, target unit gains +0/+1.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 1,
    attack: 1,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'white-creep-healing-ward',
    name: 'Healing Ward',
    description: 'When this enters, heal target unit for 2.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'white-creep-protective-aura',
    name: 'Protective Aura',
    description: 'When this enters, all your units gain +0/+1.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// UBG Artifacts - Persistent effects in base (U, G, B, or combinations only)
export const ubArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'ub-artifact-arcane-focus',
    name: 'Arcane Focus Artifact',
    description: 'Artifact. Your spells deal +1 additional damage.',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 5,
    effectType: 'spell_amplifier',
    effectValue: 1,
  },
  {
    id: 'ub-artifact-void-generator',
    name: 'Void Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 blue rune to your rune pool.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 blue rune per turn
  },
  {
    id: 'ub-artifact-shadow-growth',
    name: 'Shadow Growth Artifact',
    description: 'Artifact. When a unit dies, gain +1 max mana.',
    cardType: 'artifact',
    colors: ['black', 'green'],
    manaCost: 4,
    effectType: 'mana_generation',
    effectValue: 1, // +1 max mana per unit death
  },
  {
    id: 'ub-artifact-natures-revenge',
    name: 'Nature\'s Revenge Artifact',
    description: 'Artifact. When you deal damage to an enemy unit, if it dies, gain +1 max mana.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 3,
    effectType: 'mana_generation',
    effectValue: 1, // +1 max mana per kill
  },
  {
    id: 'ub-artifact-sacrificial-altar',
    name: 'Sacrificial Altar Artifact',
    description: 'Artifact. At the start of your turn, add 1 black rune to your rune pool.',
    cardType: 'artifact',
    colors: ['black'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 black rune per turn
  },
  {
    id: 'ub-artifact-divine-wrath',
    name: 'Divine Wrath Artifact',
    description: 'Artifact. Your spells deal +2 additional damage.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 5,
    effectType: 'spell_amplifier',
    effectValue: 2,
  },
  {
    id: 'ub-artifact-mana-surge',
    name: 'Mana Surge Artifact',
    description: 'Artifact. Gain +2 max mana.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 5,
    consumesRunes: true, // Requires G rune
    effectType: 'mana_generation',
    effectValue: 2, // +2 max mana
  },
  // Rune Generators - Single Color
  {
    id: 'ub-artifact-green-generator',
    name: 'Nature Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 green rune to your rune pool.',
    cardType: 'artifact',
    colors: ['green'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 green rune per turn
  },
  // Rune Generators - Dual Color
  {
    id: 'ub-artifact-ub-dual-generator',
    name: 'Void Shadow Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 blue rune and 1 black rune to your rune pool.',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 runes (1U + 1B) per turn
  },
  {
    id: 'ub-artifact-gu-dual-generator',
    name: 'Nature Arcane Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 green rune and 1 blue rune to your rune pool.',
    cardType: 'artifact',
    colors: ['green', 'blue'],
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 runes (1G + 1U) per turn
  },
  {
    id: 'ub-artifact-bg-dual-generator',
    name: 'Shadow Growth Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 black rune and 1 green rune to your rune pool.',
    cardType: 'artifact',
    colors: ['black', 'green'],
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 runes (1B + 1G) per turn
  },
  {
    id: 'ub-artifact-rb-dual-generator',
    name: 'Blood Fire Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 red rune and 1 black rune to your rune pool.',
    cardType: 'artifact',
    colors: ['red', 'black'],
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 runes (1R + 1B) per turn
  },
  {
    id: 'ub-artifact-gw-dual-generator',
    name: 'Nature Light Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 green rune and 1 white rune to your rune pool.',
    cardType: 'artifact',
    colors: ['green', 'white'],
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 2, // Generates 2 runes (1G + 1W) per turn
  },
  // Rune Generators - Flexible Either/Or
  {
    id: 'ub-artifact-ub-flexible-generator',
    name: 'Adaptive Void Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 blue rune or 1 black rune to your rune pool (your choice).',
    cardType: 'artifact',
    colors: ['blue', 'black'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 rune (choice of U or B) per turn
  },
  {
    id: 'ub-artifact-gu-flexible-generator',
    name: 'Adaptive Nature Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 green rune or 1 blue rune to your rune pool (your choice).',
    cardType: 'artifact',
    colors: ['green', 'blue'],
    manaCost: 4,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 rune (choice of G or U) per turn
  },
  // Rune Generators - Any Color (Premium)
  {
    id: 'ub-artifact-prismatic-generator',
    name: 'Prismatic Generator Artifact',
    description: 'Artifact. At the start of your turn, add 1 rune of any color to your rune pool.',
    cardType: 'artifact',
    colors: [], // Colorless - can generate any color
    manaCost: 5,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 rune of any color per turn
  },
  {
    id: 'ub-artifact-universal-mana-rock',
    name: 'Universal Mana Rock Artifact',
    description: 'Artifact. At the start of your turn, add 1 rune of any color to your rune pool.',
    cardType: 'artifact',
    colors: [], // Colorless - can generate any color
    manaCost: 6,
    effectType: 'rune_generation',
    effectValue: 1, // Generates 1 rune of any color per turn
  },
  // 3+X Artifact Cycle
  {
    id: 'blue-artifact-enhanced-creeps',
    name: 'Enhanced Creep Generator',
    description: 'Artifact. Creeps that spawn become 2/3 Mechs instead of 1/1.',
    cardType: 'artifact',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: true, // Requires U rune
    effectType: 'creep_modifier',
    effectValue: 1, // Modifies creep stats + makes them mechs
    rarity: 'uncommon',
  },
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
    description: 'Deal 5 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Requires U and B runes
    manaCost: 5,
    consumesRunes: true, // Not generic - consumes U and B runes
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
  {
    id: 'ub-sig-archmage-2',
    name: 'Arcane Sweep',
    description: 'Archmage signature - board wipe. Deal 4 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Changed from U to UB - 6 mana powerful effect should be dual color, requires U and B runes
    consumesRunes: true, // Powerful board wipe
    manaCost: 6,
    effect: {
      type: 'aoe_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
      affectsEnemyUnits: true,
    },
  },
  {
    id: 'ub-sig-necromancer-1',
    name: 'Death Ritual',
    description: 'Necromancer signature - card draw. Draw 2 cards.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for card draw
      damage: 0,
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
    id: 'spell-premium-removal',
    name: 'Void Strike',
    description: 'Destroy target unit.',
    cardType: 'spell',
    colors: ['black', 'blue'],
    manaCost: 2,
    consumesRunes: true, // Requires U and B runes
    effect: {
      type: 'targeted_damage',
      damage: 999, // High damage to ensure kill
      affectsUnits: true,
    },
    initiative: true, // Quickcast - enables double spelling
  },
  {
    id: 'spell-natures-wisdom',
    name: 'Nature\'s Wisdom',
    description: 'Draw 2 cards and gain 2 life.',
    cardType: 'spell',
    colors: ['green', 'blue'],
    manaCost: 3,
    consumesRunes: true, // Requires U and G runes
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
  // Combat Tricks and Interesting Decisions
  {
    id: 'red-spell-combat-trick',
    name: 'Battle Rage',
    description: 'Before combat: Target unit gains +3/+0 this turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 1,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for temporary buff
      damage: 0,
    },
    initiative: true,
  },
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
  {
    id: 'ub-sig-necromancer-2',
    name: 'Soul Drain',
    description: 'Necromancer signature - advantage. Deal 2 damage to target unit, draw a card.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
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
    description: 'Target hero gains invulnerable this turn. Any damage that hero would take is reflected back to the source.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 2,
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
    description: 'Deal 6 damage evenly divided to target unit and adjacent units. 0 units: 6 to tower. 1 unit: 3+3. 2 units: 2+2+2. 3 units: 2+2+2.',
    cardType: 'spell',
    colors: ['blue', 'black'],
    manaCost: 4,
    effect: {
      type: 'adjacent_damage',
      damage: 6,
      adjacentCount: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Verdant Wrath removed - Void Cascade already provides the same AOE effect (5 damage to all enemy units)
]

// ============================================================================
// RWG (Red/White/Green) - Go-Wide Beatdown + Growth
// ============================================================================

export const rwgHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'rwg-hero-wild-commander',
    name: 'Wild Commander',
    description: 'Combines RW aggression with Green growth',
    cardType: 'hero',
    colors: ['red', 'white'], // Converted from RWG to RW (2-rune max)
    attack: 4,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Allies gain +1/+1. If you control heroes of 3+ different colors, allies gain +2/+2 instead.',
    signatureCardId: 'rwg-sig-commander-1',
    equippedItems: [],
    ability: {
      name: 'Primal Rally',
      description: 'All your units gain +2/+2 this turn. If you control heroes of 3+ different colors, they gain +3/+3 instead.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'buff_units',
      effectValue: 2, // Base +2/+2, scales to +3/+3 with 3+ colors
    },
  },
  {
    id: 'rwg-hero-primal-warlord',
    name: 'Primal Warlord',
    description: 'Aggressive growth hero',
    cardType: 'hero',
    colors: ['red', 'green'],
    attack: 4,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Allies gain +1 attack. When this attacks, put a +1/+1 counter on all your units.',
    signatureCardId: 'rwg-sig-warlord-1',
    equippedItems: [],
    ability: {
      name: 'Wild Growth',
      description: 'All your units gain +2/+2 this turn. Put a +1/+1 counter on each of your units.',
      manaCost: 1,
      cooldown: 3,
      effectType: 'buff_units',
      effectValue: 2,
    },
  },
  // Rare Heroes - Double Color Requirements (Draft Dopamine Hits)
  {
    id: 'rrg-hero-wild-fury',
    name: 'Wild Fury',
    description: 'Rare. Aggressive growth hero.',
    cardType: 'hero',
    colors: ['red', 'green'], // Converted from RRG to RG (2-rune max)
    attack: 4,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Allies gain +1 attack. When this attacks, all your units gain +2/+2 until end of turn.',
    signatureCardId: 'rrg-sig-fury-1',
    equippedItems: [],
    ability: {
      name: 'Primal Rage',
      description: 'All your units gain +2/+2 this turn. Put a +1/+1 counter on each of your units.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'buff_units',
      effectValue: 2,
    },
  },
  {
    id: 'bbu-hero-void-tyrant',
    name: 'Void Tyrant',
    description: 'Rare. Control finisher hero.',
    cardType: 'hero',
    colors: ['black', 'blue'], // Converted from BBU to BU (2-rune max)
    attack: 4,
    health: 11,
    maxHealth: 11,
    currentHealth: 11,
    supportEffect: 'When an enemy unit dies, draw a card. Spells you cast deal +1 damage.',
    signatureCardId: 'bbu-sig-tyrant-1',
    equippedItems: [],
    ability: {
      name: 'Void Annihilation',
      description: 'Destroy target unit. If it had 5+ health, draw 2 cards instead.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'custom',
      effectValue: 5,
    },
  },
  {
    id: 'ggw-hero-nature-guardian',
    name: 'Nature Guardian',
    description: 'Rare. Resilient support hero.',
    cardType: 'hero',
    colors: ['green', 'white'], // Converted from GGW to GW (2-rune max)
    attack: 4,
    health: 11,
    maxHealth: 11,
    currentHealth: 11,
    supportEffect: 'Allies gain +0/+3. When a unit dies, put a +1/+1 counter on all your units.',
    signatureCardId: 'ggw-sig-guardian-1',
    equippedItems: [],
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
  // Signature cards
  {
    id: 'rwg-sig-commander-1',
    name: 'Convergence Banner',
    description: 'Wild Commander signature - team buff. All allies gain +1/+1. If you control heroes of 3+ different colors, they gain +2/+2 instead.',
    cardType: 'generic',
    colors: ['red', 'white', 'green'],
    manaCost: 4,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rwg-sig-warlord-1',
    name: 'Wild Standard',
    description: 'Primal Warlord signature - growth. All allies gain +1/+1. Put a +1/+1 counter on each of your units.',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 4,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // RWG Convergence Units
  {
    id: 'rwg-unit-wild-legionnaire',
    name: 'Wild Legionnaire',
    description: 'Legion. When this attacks, put a +1/+1 counter on it.',
    cardType: 'generic',
    colors: ['red', 'green'], // Can be cast with RG heroes
    manaCost: 3,
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
    id: 'rwg-unit-forest-giant',
    name: 'Forest Giant',
    description: 'Big dumb creature.',
    cardType: 'generic',
    colors: ['green', 'white'],
    manaCost: 6,
    attack: 6,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
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
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  {
    id: 'rwg-unit-ancient-tree',
    name: 'Ancient Tree',
    description: 'Big resilient creature.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 7,
    attack: 6,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
  },
  // RGW Finisher Units - Require multiple colors
  {
    id: 'rwg-unit-primal-titan',
    name: 'Primal Titan',
    description: '7/7. When this enters, all your units gain +2/+2 until end of turn. Costs 7RRGG.',
    cardType: 'generic',
    colors: ['red', 'red', 'green', 'green'],
    manaCost: 7,
    consumesRunes: true,
    attack: 7,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
  {
    id: 'rwg-unit-wild-colossus',
    name: 'Wild Colossus',
    description: '8/8. Trample. When this attacks, all your units gain +1/+1 until end of turn. Costs 8RRWW.',
    cardType: 'generic',
    colors: ['red', 'red', 'white', 'white'],
    manaCost: 8,
    consumesRunes: true,
    attack: 8,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  {
    id: 'rwg-unit-convergence-beast',
    name: 'Convergence Beast',
    description: '6/6. This has +1/+1 for each different colored rune you control. Costs 6RWG.',
    cardType: 'generic',
    colors: ['red', 'white', 'green'],
    manaCost: 6,
    consumesRunes: true,
    attack: 6,
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
  // Signature spells
  {
    id: 'rwg-sig-commander-2',
    name: 'Primal Charge',
    description: 'Wild Commander signature - aggressive. All allies gain +2 attack this turn and can attack immediately.',
    cardType: 'spell',
    colors: ['red', 'white', 'green'],
    manaCost: 4,
    consumesRunes: true, // Not generic - consumes R, W, and G runes
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for team buff + immediate attack
      damage: 0,
    },
  },
  // RWG Convergence Spells
  {
    id: 'rwg-spell-convergence-rally',
    name: 'Convergence Rally',
    description: 'All your units gain +2/+2 until end of turn. If you control heroes of 4 different colors, they gain +3/+3 instead.',
    cardType: 'spell',
    colors: ['red', 'white', 'green'],
    consumesRunes: true, // Powerful 3-color buff
    manaCost: 6, // 3RWG = 6 total mana
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for team buff that scales with color count
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
    id: 'rwg-spell-primal-wrath',
    name: 'Primal Wrath',
    description: 'All your units gain +4/+4 this turn. Costs 7RRGG.',
    cardType: 'spell',
    colors: ['red', 'red', 'green', 'green'],
    manaCost: 7,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff
      damage: 0,
    },
  },
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
  {
    id: 'rwg-spell-nature-triumph',
    name: 'Nature\'s Triumph',
    description: 'All your units gain +2/+2 until end of turn. Put a +2/+2 counter on each of your units. Costs 6RRGW.',
    cardType: 'spell',
    colors: ['red', 'red', 'green', 'white'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff + permanent counters
      damage: 0,
    },
  },
  {
    id: 'rwg-spell-primal-storm',
    name: 'Primal Storm',
    description: 'Deal 8 damage to target unit or hero. If you control heroes of 3+ different colors, deal 12 damage instead. Costs 5RWG.',
    cardType: 'spell',
    colors: ['red', 'white', 'green'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 8, // Scales to 12 with 3+ colors
      affectsUnits: true,
      affectsHeroes: true,
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
  {
    id: 'rwg-spell-nature-rage',
    name: 'Nature\'s Rage',
    description: 'All your units gain +2/+2 until end of turn. Put a +1/+1 counter on each of your units. Costs 4RWG.',
    cardType: 'spell',
    colors: ['red', 'white', 'green'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff + counters
      damage: 0,
    },
  },
  // Rare Hero Signature Spells - Powerful finishers for pack synergy moments
  {
    id: 'rrg-spell-primal-convergence',
    name: 'Primal Convergence',
    description: 'All your units gain +4/+4 until end of turn. Put a +2/+2 counter on each of your units. Costs 7RRG.',
    cardType: 'spell',
    colors: ['red', 'red', 'green'],
    manaCost: 7,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff + counters
      damage: 0,
    },
  },
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
  {
    id: 'ggw-spell-nature-triumph',
    name: 'Nature\'s Triumph',
    description: 'All your units gain +3/+5 until end of turn. Put a +2/+2 counter on each of your units. Costs 7GGW.',
    cardType: 'spell',
    colors: ['green', 'green', 'white'],
    manaCost: 7,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be team buff + counters
      damage: 0,
    },
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
]

// ============================================================================
// UBG (Blue/Black/Green) - Control + Resilience
// ============================================================================

export const ubgHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'ubg-hero-void-druid',
    name: 'Void Druid',
    description: 'Combines UB control with Green resilience',
    cardType: 'hero',
    colors: ['blue', 'black'], // Converted from UBG to UB (2-rune max)
    attack: 3,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'When you cast a spell, draw a card. If you control heroes of 3+ different colors, draw 2 cards instead.',
    signatureCardId: 'ubg-sig-druid-1',
    equippedItems: [],
    ability: {
      name: 'Verdant Control',
      description: 'Draw 2 cards. For each different color among your heroes, deal 1 damage to target unit.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'draw_card',
      effectValue: 2, // Base draw 2, scales damage with color count
    },
  },
  {
    id: 'ubg-hero-shadow-sage',
    name: 'Shadow Sage',
    description: 'Resilient control hero',
    cardType: 'hero',
    colors: ['black', 'green'],
    attack: 3,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'When an enemy unit dies, draw a card. This hero has +0/+1 for each different color among your heroes.',
    signatureCardId: 'ubg-sig-sage-1',
    equippedItems: [],
    bonusVsHeroes: 3, // Assassin: deals bonus damage to heroes
    ability: {
      name: 'Verdant Removal',
      description: 'Destroy target unit with 4 or less health. If it had 4+ health, draw a card.',
      manaCost: 1,
      cooldown: 3,
      effectType: 'custom', // Custom effect: conditional removal + card draw
      effectValue: 4, // Health threshold
    },
  },
]

export const ubgCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'ubg-sig-druid-2',
    name: 'Prismatic Shield',
    description: 'Void Druid signature - resilient. When this enters, draw a card. This has +0/+2 for each different color among your heroes.',
    cardType: 'generic',
    colors: ['blue', 'black'], // Updated to match hero (2-color)
    manaCost: 4,
    attack: 2,
    health: 4, // Base 4, scales with color count
    maxHealth: 4,
    currentHealth: 4,
  },
  // Shadow Growth removed - replaced with artifact
]

export const ubgSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Exorcism moved to UBR (Grixis wedge) - control finisher
  {
    id: 'ubr-spell-exorcism',
    name: 'Exorcism',
    description: 'Deal 12 total damage distributed to enemy units in front and tower. 0 units: 12 to tower. 1 unit: 6 to unit, 6 to tower. 2 units: 4 to each unit, 4 to tower. 3 units: 3 to each unit, 3 to tower.',
    cardType: 'spell',
    rarity: 'rare',
    colors: ['blue', 'black', 'red'], // Changed to UBR (Grixis) - spellcaster control finisher
    consumesRunes: true, // This spell requires and consumes UBR runes
    manaCost: 7,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for Exorcism damage distribution
      damage: 12, // Total damage, distribution handled by custom logic based on units in front
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// Void Apprentice - Spawned by Dark Archmage (not a playable card, only spawned)
export const voidApprenticeTemplate: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'> = {
  id: 'ub-spawn-void-apprentice',
  name: 'Void Apprentice',
  description: 'Spawned by Dark Archmage. At the start of each turn, deals 2 damage to the nearest enemy unit.',
  cardType: 'generic',
  colors: ['blue'],
  manaCost: 0, // Not playable, only spawned
  attack: 2,
  health: 3,
  maxHealth: 3,
  currentHealth: 3,
}

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
    attack: 4,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Allies gain +1/+1',
    signatureCardId: 'uw-sig-paladin-1',
    equippedItems: [],
  },
  {
    id: 'uw-hero-mage',
    name: 'Divine Mage',
    description: 'Control with threats',
    cardType: 'hero',
    colors: ['blue'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Draw card each turn',
    signatureCardId: 'uw-sig-mage-1',
    equippedItems: [],
  },
]

export const uwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature cards
  {
    id: 'uw-sig-paladin-1',
    name: 'Divine Shield',
    description: 'Paladin signature - protection',
    cardType: 'generic',
    colors: ['blue', 'white'],
    manaCost: 3,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'uw-sig-paladin-2',
    name: 'Arcane Blessing',
    description: 'Paladin signature - buff',
    cardType: 'generic',
    colors: ['blue', 'white'],
    manaCost: 4,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'uw-sig-mage-1',
    name: 'Divine Bolt',
    description: 'Mage signature - removal',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  // Generic UW cards
  {
    id: 'uw-threat-1',
    name: 'Celestial Guard',
    description: 'Proactive threat',
    cardType: 'generic',
    colors: ['blue', 'white'],
    manaCost: 5,
    attack: 5,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
]

export const uwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'uw-sig-mage-2',
    name: 'Arcane Protection',
    description: 'Mage signature - control. Target unit takes 1 less damage from all sources this turn.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: true, // Not generic - consumes runes
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for damage reduction
      damage: 0,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // Divine Wrath removed - replaced with artifact
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
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    signatureCardId: 'combo-sig-channeler-1',
    equippedItems: [],
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
  // Aristocrats Combo: Blood Artist - triggers on death
  {
    id: 'combo-hero-blood-artist',
    name: 'Blood Artist',
    description: 'Aristocrats. Whenever any unit dies, deals 1 damage to enemy tower.',
    cardType: 'hero',
    colors: ['black'],
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    signatureCardId: 'combo-sig-blood-artist-1',
    equippedItems: [],
    ability: {
      name: 'Blood Tithe',
      description: 'Sacrifice a unit you control: Deal 2 damage to enemy tower and gain 1 gold.',
      manaCost: 0,
      cooldown: 0,
      effectType: 'sacrifice_unit',
      effectValue: 2,
    },
  },
  // Bounce Combo: Echo Mage - benefits from redeployment
  {
    id: 'combo-hero-echo-mage',
    name: 'Echo Mage',
    description: 'Bounce. When this hero is deployed, deal 1 damage to enemy tower. Synergizes with bounce effects.',
    cardType: 'hero',
    colors: ['blue'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    signatureCardId: 'combo-sig-echo-mage-1',
    equippedItems: [],
    ability: {
      name: 'Echo Strike',
      description: 'Return this hero to your hand. Next time you deploy it, it deals double damage.',
      manaCost: 1,
      cooldown: 1,
      effectType: 'move_hero',
      effectValue: 0,
    },
  },
]

// ============================================================================
// COMBO UNITS - Enablers for the combo archetypes
// ============================================================================

export const comboCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Storm Combo pieces
  {
    id: 'combo-sig-channeler-1',
    name: 'Storm Conduit',
    description: 'Channeler signature. When you add temporary runes, add 1 additional rune of that color.',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'combo-unit-ritual-keeper',
    name: 'Ritual Keeper',
    description: 'Storm. When you cast a spell that adds runes, deal 1 damage to enemy tower.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 2,
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  // Sacrificial Altar removed - replaced with artifact
  {
    id: 'combo-unit-gravecrawler',
    name: 'Gravecrawler',
    description: 'Aristocrats. When this dies, return it to your hand at the start of next turn.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 1,
    attack: 2,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
  },
  {
    id: 'combo-unit-doomed-dissenter',
    name: 'Doomed Dissenter',
    description: 'Aristocrats. When this dies, create a 2/2 Zombie token.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 2,
    attack: 1,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  // Bounce Combo pieces
  {
    id: 'combo-sig-echo-mage-1',
    name: 'Mana Battery',
    description: 'Echo Mage signature. At the start of your turn, add UU temporarily.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 0,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'combo-unit-cloud-sprite',
    name: 'Cloud Sprite',
    description: 'Bounce. When a hero is deployed to this lane, this gains +1/+1.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 1,
    attack: 1,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
  },
  {
    id: 'combo-unit-ghostly-flicker',
    name: 'Ghostly Flicker',
    description: 'Bounce enabler. When this enters, you may return another unit to hand.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
]

// ============================================================================
// CREEP-STACKING INCENTIVE CARDS
// Cards designed to incentivize casting units on top of creeps
// These create strategic decisions about when to push damage vs. when to build value
// ============================================================================

export const creepStackingCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // ============================================================================
  // WEAKER CARDS - Short-term value, die to creeps over time
  // ============================================================================
  
  // 0/3 that dies in 3 battles to the 1/1 creep
  {
    id: 'stacking-wisp-of-wisdom',
    name: 'Wisp of Wisdom',
    description: '0/3. At the end of each turn, draw a card. Dies after taking 3 damage from creeps.',
    cardType: 'generic',
    colors: [], // Colorless - can be played in any lane
    manaCost: 2,
    attack: 0,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  
  // 0/3 that buffs hand
  {
    id: 'stacking-mana-conduit',
    name: 'Mana Conduit',
    description: '0/3. At the start of your turn, reduce the cost of the most expensive card in your hand by 1.',
    cardType: 'generic',
    colors: [],
    manaCost: 3,
    attack: 0,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  
  // 0/3 that buffs top creep
  {
    id: 'stacking-training-grounds',
    name: 'Training Grounds',
    description: '0/3. At the start of your turn, the next creep you draw gains +1/+1 permanently.',
    cardType: 'generic',
    colors: [],
    manaCost: 2,
    attack: 0,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  
  // 0/3 that buffs creatures in hand
  {
    id: 'stacking-war-drummer',
    name: 'War Drummer',
    description: '0/3. All creature cards in your hand gain +1/+1 while this is on the battlefield.',
    cardType: 'generic',
    colors: [],
    manaCost: 3,
    attack: 0,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  
  // ============================================================================
  // MEDIUM CARDS - Require 1 hero hit or direct damage to remove
  // ============================================================================
  
  // 0/5 wall that draws cards
  {
    id: 'stacking-library-wall',
    name: 'Library Wall',
    description: '0/5. At the end of each turn, draw a card. Requires hero hit or direct damage to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 4,
    attack: 0,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  
  // 0/5 that draws on damage
  {
    id: 'stacking-wounded-scholar',
    name: 'Wounded Scholar',
    description: '0/5. Whenever this takes damage, draw a creature card from your deck. Requires hero hit or direct damage to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 4,
    attack: 0,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  
  // 0/5 that steals on damage
  {
    id: 'stacking-thief-master',
    name: 'Thief Master',
    description: '0/5. Whenever this takes damage, steal a random creature from your opponent\'s deck and add it to your hand. Requires hero hit or direct damage to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 5,
    attack: 0,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  
  // 0/5 that generates value
  {
    id: 'stacking-mana-spring',
    name: 'Mana Spring',
    description: '0/5. At the start of your turn, add 1 temporary mana to your pool. Requires hero hit or direct damage to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 4,
    attack: 0,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  
  // ============================================================================
  // STRONG CARDS - Require 2 hero hits or significant direct damage/AOE
  // ============================================================================
  
  // 0/8 wall that draws cards
  {
    id: 'stacking-ancient-archive',
    name: 'Ancient Archive',
    description: '0/8. At the end of each turn, draw 2 cards. Requires 2 hero hits or significant direct damage/AOE to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 6,
    attack: 0,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  
  // 0/8 that draws on damage
  {
    id: 'stacking-arcane-reservoir',
    name: 'Arcane Reservoir',
    description: '0/8. Whenever this takes damage, draw 2 creature cards from your deck. Requires 2 hero hits or significant direct damage/AOE to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 7,
    attack: 0,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  
  // 0/8 that buffs all creatures in hand significantly
  {
    id: 'stacking-war-academy',
    name: 'War Academy',
    description: '0/8. All creature cards in your hand gain +2/+2 while this is on the battlefield. Requires 2 hero hits or significant direct damage/AOE to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 6,
    attack: 0,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  
  // 0/8 that reduces costs significantly
  {
    id: 'stacking-mana-vault',
    name: 'Mana Vault',
    description: '0/8. At the start of your turn, reduce the cost of all cards in your hand by 1. Requires 2 hero hits or significant direct damage/AOE to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 7,
    attack: 0,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
  
  // 0/8 that buffs top creeps
  {
    id: 'stacking-elite-barracks',
    name: 'Elite Barracks',
    description: '0/8. At the start of your turn, the next 2 creeps you draw gain +2/+2 permanently. Requires 2 hero hits or significant direct damage/AOE to remove.',
    cardType: 'generic',
    colors: [],
    manaCost: 6,
    attack: 0,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
  },
]

// ============================================================================
// RARE CARDS - Guild System Showcase
// ============================================================================

// 5 Mono-Color Rares

export const rareWhiteCards: (Omit<ArtifactCard, 'location' | 'owner'>)[] = [
  {
    id: 'rare-white-armory',
    name: 'Armory of the Divine',
    cardType: 'artifact',
    rarity: 'rare',
    colors: ['white'],
    manaCost: 6,
    effectType: 'equipment',
    effectValue: 0,
    equipCost: 2,
    equipmentBonuses: {
      attack: 2,
      health: 3,
      abilities: ['taunt']
    },
    description: 'Equipment. Attach to a unit. +2/+3 and Taunt. When equipped unit dies, return this to base. Re-equip for 2 mana.',
  },
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
  {
    id: 'rare-black-devourer',
    name: 'Void Devourer',
    cardType: 'generic',
    rarity: 'rare',
    colors: ['black'],
    manaCost: 5,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    evolveThreshold: 3,
    evolveBonus: {
      attack: 3,
      health: 3,
      abilities: ['When this kills a unit, draw a card']
    },
    description: '3/4. Evolve 3: If you\'ve played 3 different colors this turn, this becomes 6/7 and gains "When this kills a unit, draw a card".',
  },
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
    attack: 7,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    description: '7/5, Cleave. When deployed: Deal 3 damage to all enemy units. When this attacks a tower: Deal 2 damage to the enemy nexus.',
  },
]

export const rareGreenCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rare-green-colossus',
    name: 'Worldshaper Colossus',
    cardType: 'generic',
    rarity: 'rare',
    colors: ['green'],
    manaCost: 7,
    attack: 6,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    evolveThreshold: 2,
    evolveBonus: {
      abilities: ['Can attack the turn it\'s deployed', 'Overrun (excess damage goes to tower)']
    },
    description: '6/8. Evolve 2: If you\'ve played 2 different colors this turn, this can attack immediately and gains Overrun.',
  },
]

// 5 Guild Rares

export const rareRGCards: (Omit<ArtifactCard, 'location' | 'owner'>)[] = [
  {
    id: 'rare-rg-battlemaster',
    name: 'Savage Battlemaster',
    cardType: 'artifact',
    rarity: 'rare',
    colors: ['red', 'green'],
    manaCost: 6,
    consumesRunes: true,
    effectType: 'equipment',
    effectValue: 0,
    equipCost: 3,
    equipmentBonuses: {
      attack: 3,
      health: 2,
      abilities: ['cleave']
    },
    description: 'Equipment. +3/+2 and Cleave. When equipped unit dies, return to base. Re-equip for 3 mana. RG aggro finisher.',
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
    attack: 6,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    description: '6/4, Cleave. When deployed: Deal 2 damage to all units and all towers. Aggressive control finisher for BR.',
  },
]

// ============================================================================
// MECH HEROES (UR + W)
// ============================================================================

export const mechHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'blue-mech-hero-engineer',
    name: 'Master Engineer',
    description: 'Mech synergy hero. Mechs you control get +1/+0.',
    cardType: 'hero',
    colors: ['blue'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    signatureCardId: 'blue-mech-sig-engineer',
    equippedItems: [],
    supportEffect: 'Mechs you control get +1/+0',
    ability: {
      name: 'Salvage',
      description: 'Return target mech from your graveyard to your hand. Costs 1U, Cooldown 3.',
      manaCost: 1,
      cooldown: 3,
      effectType: 'custom',
      runeCost: ['blue'],
    },
  },
  {
    id: 'red-mech-hero-forgemaster',
    name: 'Forgemaster',
    description: 'Mech synergy hero. Mechs you control get +1/+0.',
    cardType: 'hero',
    colors: ['red'],
    attack: 5,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    signatureCardId: 'red-mech-sig-forgemaster',
    equippedItems: [],
    supportEffect: 'Mechs you control get +1/+0',
    ability: {
      name: 'Overload',
      description: 'Mechs gain +2/+0 until end of turn. Costs 1R, Cooldown 2.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'buff_units',
      runeCost: ['red'],
    },
  },
  {
    id: 'white-mech-hero-sentinel-commander',
    name: 'Sentinel Commander',
    description: 'Mech synergy hero. Mechs you control get +0/+1.',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    signatureCardId: 'white-mech-sig-commander',
    equippedItems: [],
    supportEffect: 'Mechs you control get +0/+1',
    ability: {
      name: 'Deploy Sentinel',
      description: 'Create a 1/1 Mech token. Costs 1W, Cooldown 2.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'create_unit',
      runeCost: ['white'],
      effectValue: 1, // Creates 1 token
    },
  },
]

// ============================================================================
// MECH TRIBAL (UR + W) - Cross-Archetype Synergy
// ============================================================================
// Mechs are a tribal mechanic where mechs give each other bonuses
// Primary: UR (aggro/tempo), Secondary: White (defensive)
// Splash: Limited options in other colors

// Forward declarations - actual definitions are below
export const blueMechs: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []
export const redMechs: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []
export const whiteMechs: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []
export const greenMechs: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []
export const blackMechs: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []
export const mechSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = []

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
  ...rwgHeroes,
  ...ubgHeroes,
  ...comboHeroes,
  // Mech heroes
  ...mechHeroes,
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
  ...rwgCards,
  ...ubgCards,
  ...comboCards,
  ...monoRedAggroCards,
  ...blackMidrangeCards,
  ...runeFinisherUnits,
  ...creepStackingCards,
  // Mech tribal cards
  ...blueMechs,
  ...redMechs,
  ...whiteMechs,
  ...greenMechs,
  ...blackMechs,
  ...mechSignatureCards,
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

export const runeSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Dark Ritual - Classic MTG ramp (BBB temporary)
  {
    id: 'rune-spell-dark-ritual',
    name: 'Dark Ritual',
    description: 'Add BBB (3 black runes) until end of turn. The power of darkness fuels your magic.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 1,
    consumesRunes: false, // Doesn't consume, just pays mana
    effect: {
      type: 'add_temporary_runes',
      runeColors: ['black', 'black', 'black'],
    },
    initiative: false,
  },
  // High Tide - Blue ramp (UU temporary)
  {
    id: 'rune-spell-high-tide',
    name: 'High Tide',
    description: 'Add UU (2 blue runes) until end of turn. The tides of magic rise.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 1,
    consumesRunes: false,
    effect: {
      type: 'add_temporary_runes',
      runeColors: ['blue', 'blue'],
    },
    initiative: true, // Gives initiative like cantrips
  },
  // Cabal Ritual - Black burst with condition
  {
    id: 'rune-spell-cabal-ritual',
    name: 'Cabal Ritual',
    description: 'Add BBBBB (5 black runes) until end of turn. Dark power flows through you.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'add_temporary_runes',
      runeColors: ['black', 'black', 'black', 'black', 'black'],
    },
    initiative: false,
  },
  // Seal of Fire - Permanent red rune generator
  {
    id: 'rune-spell-seal-of-fire',
    name: 'Seal of Fire',
    description: 'Create a Seal that generates R (1 red rune) at the start of each turn.',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 2,
    consumesRunes: false,
    effect: {
      type: 'create_seal',
      sealColor: 'red',
    },
    initiative: false,
  },
  // Seal of Knowledge - Permanent blue rune generator
  {
    id: 'rune-spell-seal-of-knowledge',
    name: 'Seal of Knowledge',
    description: 'Create a Seal that generates U (1 blue rune) at the start of each turn.',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: false,
    effect: {
      type: 'create_seal',
      sealColor: 'blue',
    },
    initiative: false,
  },
  // Seal of Darkness - Permanent black rune generator
  {
    id: 'rune-spell-seal-of-darkness',
    name: 'Seal of Darkness',
    description: 'Create a Seal that generates B (1 black rune) at the start of each turn.',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    consumesRunes: false,
    effect: {
      type: 'create_seal',
      sealColor: 'black',
    },
    initiative: false,
  },
  // Ritual Recursion - Returns a ritual spell to hand (combo enabler)
  {
    id: 'rune-spell-ritual-recursion',
    name: 'Ritual Recursion',
    description: 'Add BB until end of turn. Draw a card. (Represents returning a ritual)',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 2,
    consumesRunes: false,
    effect: {
      type: 'add_temporary_runes',
      runeColors: ['black', 'black'],
    },
    initiative: true,
  },
  // Green Ramp - Adds permanent rune
  {
    id: 'rune-spell-wild-growth',
    name: 'Wild Growth',
    description: 'Add G permanently to your rune pool. Nature provides.',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 2,
    consumesRunes: false,
    effect: {
      type: 'add_permanent_rune',
      runeColors: ['green'],
    },
    initiative: false,
  },
  // Chromatic Star - Any color temporary
  {
    id: 'rune-spell-chromatic-star',
    name: 'Chromatic Star',
    description: 'Add any 2 runes of your choice until end of turn.',
    cardType: 'spell',
    colors: [], // Colorless
    manaCost: 2,
    consumesRunes: false,
    effect: {
      type: 'add_temporary_runes',
      runeColors: ['red', 'blue'], // Default, would need targeting
    },
    initiative: false,
  },
]

// ============================================================================
// VARIABLE RUNE COST SPELLS - Riftbound-style (1R, 2UU, 7UUU, etc.)
// Early game spells with rune costs set you back from big plays
// ============================================================================

export const variableRuneCostSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Removed Lightning Bolt - not interesting for RW
  // 1UU - Counterspell (double blue early)
  {
    id: 'vrune-spell-counterspell',
    name: 'Arcane Denial',
    description: 'Stun target unit for 1 turn. Costs 1UU - heavy blue commitment early.',
    cardType: 'spell',
    colors: ['blue', 'blue'],
    manaCost: 1,
    consumesRunes: true,
    effect: {
      type: 'stun',
      stunDuration: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: false,
  },
  // 2BB - Doom Blade (mid-game removal)
  {
    id: 'vrune-spell-doom-blade',
    name: 'Doom Blade',
    description: 'Deal 5 damage to target non-hero unit. Costs 2BB.',
    cardType: 'spell',
    colors: ['black', 'black'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: false,
  },
  // 3RR - Flame Javelin (aggressive mid-game)
  {
    id: 'vrune-spell-flame-javelin',
    name: 'Flame Javelin',
    description: 'Deal 5 damage to target unit and any unit adjacent to it. Costs 3RR - strong but double red.',
    cardType: 'spell',
    colors: ['red', 'red'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'adjacent_damage',
      damage: 5,
      affectsHeroes: true,
      affectsUnits: true,
      adjacentCount: 1, // Hits target and 1 adjacent unit on each side
    },
    initiative: false,
  },
  // 4UUU - Mind Control (late triple blue)
  {
    id: 'vrune-spell-mind-control',
    name: 'Mind Control',
    description: 'Stun all enemy units in one lane. Costs 4UUU - massive blue investment.',
    cardType: 'spell',
    colors: ['blue', 'blue', 'blue'],
    manaCost: 4,
    consumesRunes: true,
    effect: {
      type: 'stun',
      stunDuration: 1,
      affectsUnits: true,
      affectsHeroes: false,
    },
    initiative: false,
  },
  // 5RRW - Wrath of the Legion (RW finisher)
  {
    id: 'vrune-spell-wrath-of-legion',
    name: 'Wrath of the Legion',
    description: 'All your units gain +3/+3 this turn. Costs 5RRW.',
    cardType: 'spell',
    colors: ['red', 'red', 'white'],
    manaCost: 5,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a buff
      damage: 0,
    },
    initiative: false,
  },
  // 7UUU - Necromantic Rite (late game bomb - conditional one-sided wrath)
  {
    id: 'vrune-spell-necromantic-rite',
    name: 'Necromantic Rite',
    description: 'Deal 5 damage to all enemy units. If opponent has 4+ units, destroy all enemy units instead. Costs 7UUU.',
    cardType: 'spell',
    colors: ['blue', 'blue', 'blue'],
    manaCost: 7,
    consumesRunes: true,
    effect: {
      type: 'all_units_damage',
      damage: 5,
      affectsUnits: true,
      affectsHeroes: false, // Changed: doesn't affect heroes, only units
      affectsEnemyUnits: true,
      affectsOwnUnits: false,
      // Note: Conditional destroy effect (4+ units) would need custom logic in spell resolution
    },
    initiative: false,
  },
  // 6BBB - Damnation (board wipe)
  {
    id: 'vrune-spell-damnation',
    name: 'Damnation',
    description: 'Destroy all units (not heroes). Costs 6BBB.',
    cardType: 'spell',
    colors: ['black', 'black', 'black'],
    manaCost: 6,
    consumesRunes: true,
    effect: {
      type: 'board_wipe',
      affectsUnits: true,
      affectsHeroes: false,
      affectsOwnUnits: true,
      affectsEnemyUnits: true,
    },
    initiative: false,
  },
  // 2GG - Giant Growth (green buff)
  {
    id: 'vrune-spell-giant-growth',
    name: 'Giant Growth',
    description: 'Target unit gets +4/+4 until end of turn. Costs 2GG.',
    cardType: 'spell',
    colors: ['green', 'green'],
    manaCost: 2,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a buff
      damage: 0,
    },
    initiative: true,
  },
  // 9RRGG - Time of Triumph (multicolor finisher for RGW decks)
  {
    id: 'vrune-spell-time-of-triumph',
    name: 'Time of Triumph',
    description: 'All your units gain +3/+3 and trample this turn. Draw a card for each unit you control. Costs 9RRGG.',
    cardType: 'spell',
    rarity: 'rare',
    colors: ['red', 'red', 'green', 'green'],
    manaCost: 9,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be a buff + card draw
      damage: 0,
    },
    initiative: false,
  },
]

// Mech Support Artifacts
export const mechArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  {
    id: 'ur-mech-artifact-assembly-line',
    name: 'Mech Assembly Line',
    description: 'Saga artifact. Chapter 1: Create a 1/1 Mech token each turn. Chapter 2: Mechs you control get +1/+1 for each mech you control. Chapter 3: All mechs you control gain Cleave +1 and deal 3 damage to their combat target. Destroy after Chapter 3. Costs 4UURR.',
    cardType: 'artifact',
    colors: ['blue', 'blue', 'red', 'red'], // 4UURR = 4 generic + 2 blue + 2 red runes
    manaCost: 4,
    consumesRunes: true,
    effectType: 'saga',
    effectValue: 0,
    sagaCounters: 0, // Starts at 0, increments each turn
    sagaEffects: {
      chapter1: 'Create a 1/1 Mech token each turn',
      chapter2: 'Mechs you control get +1/+1 for each mech you control',
      chapter3: 'All mechs you control gain Cleave +1 and deal 3 damage to their combat target',
    },
  },
  {
    id: 'ur-mech-artifact-power-core',
    name: 'Power Core',
    description: 'Mechs have +1/+1. Costs 3.',
    cardType: 'artifact',
    colors: ['blue', 'red'],
    manaCost: 3,
    consumesRunes: false,
    effectType: 'damage_amplifier', // Repurposed for mech stat buff
    effectValue: 1,
  },
]

// Mech Support Spells
export const mechSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'ur-mech-spell-overcharge',
    name: 'Overcharge',
    description: 'Mechs gain +3/+0 and Overwhelm until end of turn. Costs 3UR.',
    cardType: 'spell',
    colors: ['blue', 'red'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'targeted_damage', // Placeholder - would be mech buff
      damage: 0,
    },
    initiative: false,
  },
  {
    id: 'white-mech-spell-emergency-repairs',
    name: 'Emergency Repairs',
    description: 'Restore all mechs to full health. Costs 3W.',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: true,
    effect: {
      type: 'draw_and_heal', // Repurposed for mech heal
      healAmount: 999, // Full heal
    },
    initiative: false,
  },
]

export const allArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[] = [
  ...rwArtifacts,
  ...rgArtifacts,
  ...ubArtifacts,
  // Mech artifacts
  ...mechArtifacts,
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
  ...uwSpells,
  ...rwgSpells,
  ...ubgSpells,
  ...runeSpells,
  ...variableRuneCostSpells,
  ...monoRedAggroSpells,
  ...blackMidrangeSpells,
  // Mech spells
  ...mechSpells,
  ...runeFinisherSpells,
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

// Blue Mechs (8 cards) - Tempo/spell synergy  
blueMechs.push(...[
  {
    id: 'blue-mech-aether-scout',
    name: 'Aether Scout',
    description: 'Mech. Other mechs you control cost 1 less mana.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: false,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    isMech: true,
    mechSynergy: {
      costReduction: 1,
    },
  },
  {
    id: 'blue-mech-arcane-automaton',
    name: 'Arcane Automaton',
    description: 'Mech. When you cast a spell, mechs you control get +1/+0 until end of turn.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 0, // Bonus applied by spell trigger, not permanently
    },
  },
  {
    id: 'blue-mech-prototype-enforcer',
    name: 'Prototype Enforcer',
    description: 'Mech. ETB: Draw a card if you control another mech.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 5,
    consumesRunes: true, // Requires U rune
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      etbEffect: 'draw_card',
    },
  },
  {
    id: 'blue-mech-storm-engine',
    name: 'Storm Engine',
    description: 'Mech. Other mechs you control have +1/+1. Costs 6UU.',
    cardType: 'generic',
    colors: ['blue', 'blue'],
    manaCost: 6,
    consumesRunes: true, // Requires UU runes
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      attackBonus: 1,
      healthBonus: 1,
    },
  },
  {
    id: 'blue-mech-temporal-construct',
    name: 'Temporal Construct',
    description: 'Mech. Other mechs you control have +0/+1.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      healthBonus: 1,
    },
  },
  {
    id: 'blue-mech-thought-forged-sentinel',
    name: 'Thought-Forged Sentinel',
    description: 'Mech. ETB: If you control another mech, stun target enemy unit. Costs 5U.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 5,
    consumesRunes: true, // Requires U rune
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      etbEffect: 'stun_unit',
    },
  },
  {
    id: 'blue-mech-adaptive-drone',
    name: 'Adaptive Drone',
    description: 'Mech. 2/3 for 3 mana. Efficient tempo play.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: false,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 0, // No bonus, just a solid mech body
    },
  },
  {
    id: 'blue-mech-voltaic-engineer',
    name: 'Voltaic Engineer',
    description: 'Mech. Other mechs you control have +1/+0.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 1,
    },
    rarity: 'common',
  },
  // Additional Blue Mechs for prevalence
  {
    id: 'blue-mech-cogwork-sentry',
    name: 'Cogwork Sentry',
    description: 'Mech. 3/2 for 3 mana. Efficient body.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: false,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    isMech: true,
    mechSynergy: {
      attackBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'blue-mech-flux-automaton',
    name: 'Flux Automaton',
    description: 'Mech. Other mechs have +0/+1.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    consumesRunes: false,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      healthBonus: 1,
    },
    rarity: 'common',
  },
  {
    id: 'blue-mech-chrono-construct',
    name: 'Chrono Construct',
    description: 'Mech. 2/4 for 4 mana. Defensive tempo.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: false,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      healthBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'blue-mech-rift-walker',
    name: 'Rift Walker',
    description: 'Mech. Other mechs cost 1 less (max 1 reduction per turn).',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 5,
    consumesRunes: true,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      costReduction: 1,
    },
    rarity: 'uncommon',
  },
])

// Red Mechs (8 cards) - Aggro/direct damage
redMechs.push(...[
  {
    id: 'red-mech-forge-golem',
    name: 'Forge Golem',
    description: 'Mech. When this attacks, mechs you control deal 1 damage to enemy tower.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: false,
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    isMech: true,
    mechSynergy: {
      etbEffect: 'mech_tower_damage', // Custom effect: mechs deal tower damage
    },
  },
  {
    id: 'red-mech-assault-construct',
    name: 'Assault Construct',
    description: 'Mech. ETB: Deal 2 damage to target if you control another mech.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: false,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      etbEffect: 'deal_damage',
    },
  },
  {
    id: 'red-mech-siege-titan',
    name: 'Siege Titan',
    description: 'Mech. Other mechs you control have Overwhelm. Costs 5R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 5,
    consumesRunes: true, // Requires R rune
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      grantKeyword: 'overwhelm',
    },
  },
  {
    id: 'red-mech-blazing-colossus',
    name: 'Blazing Colossus',
    description: 'Mech. Mechs you control get +2/+0. Costs 7RR.',
    cardType: 'generic',
    colors: ['red', 'red'],
    manaCost: 7,
    consumesRunes: true, // Requires RR runes
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    isMech: true,
    mechSynergy: {
      attackBonus: 2,
    },
  },
  {
    id: 'red-mech-war-construct',
    name: 'War Construct',
    description: 'Mech. Other mechs you control have +1/+0.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: false,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 1,
    },
  },
  {
    id: 'red-mech-flame-forged-titan',
    name: 'Flame-Forged Titan',
    description: 'Mech. 5/5 for 6 mana. Big aggressive body.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 6,
    consumesRunes: false,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      attackBonus: 0, // No bonus, just a big body
    },
  },
  {
    id: 'red-mech-molten-juggernaut',
    name: 'Molten Juggernaut',
    description: 'Mech. ETB: Deal 1 damage to all enemy units if you control another mech. Costs 5R.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 5,
    consumesRunes: true, // Requires R rune
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      etbEffect: 'aoe_damage',
    },
  },
  {
    id: 'red-mech-inferno-engine',
    name: 'Inferno Engine',
    description: 'Mech. Other mechs you control have +0/+1.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: false,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      healthBonus: 1,
    },
    rarity: 'common',
  },
  // Additional Red Mechs for prevalence
  {
    id: 'red-mech-battle-automaton',
    name: 'Battle Automaton',
    description: 'Mech. 4/2 for 3 mana. Aggressive body.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: false,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    isMech: true,
    mechSynergy: {
      attackBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'red-mech-iron-bruiser',
    name: 'Iron Bruiser',
    description: 'Mech. Other mechs have +1/+0.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      attackBonus: 1,
    },
    rarity: 'common',
  },
  {
    id: 'red-mech-furnace-sentinel',
    name: 'Furnace Sentinel',
    description: 'Mech. 3/3 for 4 mana. Solid stats.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'red-mech-scorched-construct',
    name: 'Scorched Construct',
    description: 'Mech. ETB: Deal 1 damage to target if you control another mech.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    consumesRunes: false,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      etbEffect: 'deal_damage',
    },
    rarity: 'uncommon',
  },
])

// White Mechs (6 cards) - Defensive/protective
whiteMechs.push(...[
  {
    id: 'white-mech-guardian-sentinel',
    name: 'Guardian Sentinel',
    description: 'Mech. Other mechs you control have Shield. Costs 4W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: true, // Requires W rune
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      grantKeyword: 'shield',
    },
  },
  {
    id: 'white-mech-bastion-automaton',
    name: 'Bastion Automaton',
    description: 'Mech. ETB: Gain 2 tower armor if you control another mech. Costs 5W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    consumesRunes: true, // Requires W rune
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    isMech: true,
    mechSynergy: {
      etbEffect: 'gain_armor',
    },
  },
  {
    id: 'white-mech-aegis-protector',
    name: 'Aegis Protector',
    description: 'Mech. Mechs you control get +0/+2. Costs 6W.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 6,
    consumesRunes: true, // Requires W rune
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    isMech: true,
    mechSynergy: {
      healthBonus: 2,
    },
  },
  {
    id: 'white-mech-fortress-titan',
    name: 'Fortress Titan',
    description: 'Mech. Other mechs you control have Taunt and +1/+1. Costs 7WW.',
    cardType: 'generic',
    colors: ['white', 'white'],
    manaCost: 7,
    consumesRunes: true, // Requires WW runes
    attack: 5,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    isMech: true,
    mechSynergy: {
      attackBonus: 1,
      healthBonus: 1,
      grantKeyword: 'taunt',
    },
  },
  {
    id: 'white-mech-steel-warden',
    name: 'Steel Warden',
    description: 'Mech. Other mechs you control have +0/+1.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      healthBonus: 1,
    },
  },
  {
    id: 'white-mech-radiant-defender',
    name: 'Radiant Defender',
    description: 'Mech. 3/6 for 5 mana. Solid defensive body.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    consumesRunes: false,
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    isMech: true,
    mechSynergy: {
      healthBonus: 0, // No bonus, just a defensive body
    },
    rarity: 'common',
  },
  // Additional White Mechs for prevalence
  {
    id: 'white-mech-sanctum-guardian',
    name: 'Sanctum Guardian',
    description: 'Mech. 2/4 for 3 mana. Defensive.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    consumesRunes: false,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      healthBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'white-mech-light-bearer',
    name: 'Light Bearer',
    description: 'Mech. Other mechs have +0/+1.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: false,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      healthBonus: 1,
    },
    rarity: 'common',
  },
  {
    id: 'white-mech-divine-automaton',
    name: 'Divine Automaton',
    description: 'Mech. 3/5 for 5 mana. Solid defender.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    consumesRunes: false,
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      healthBonus: 0,
    },
    rarity: 'common',
  },
])

// Splash Mechs (2 per color - Green and Black)
greenMechs.push(...[
  {
    id: 'green-mech-nature-forged-construct',
    name: 'Nature-Forged Construct',
    description: 'Mech. ETB: Add one G rune to your pool if you control another mech. Costs 4G.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 4,
    consumesRunes: true, // Requires G rune
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      etbEffect: 'add_rune',
    },
  },
  {
    id: 'green-mech-verdant-titan',
    name: 'Verdant Titan',
    description: 'Mech. 4/5 for 5 mana. Efficient green body.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 5,
    consumesRunes: false,
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      healthBonus: 0, // No bonus, just efficient stats
    },
    rarity: 'common',
  },
  // Additional Green Mechs for prevalence
  {
    id: 'green-mech-bramble-construct',
    name: 'Bramble Construct',
    description: 'Mech. 3/5 for 5 mana. Solid green body.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 5,
    consumesRunes: false,
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    isMech: true,
    mechSynergy: {
      healthBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'green-mech-growth-engine',
    name: 'Growth Engine',
    description: 'Mech. Other mechs have +0/+1.',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 4,
    consumesRunes: false,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      healthBonus: 1,
    },
    rarity: 'uncommon',
  },
])

blackMechs.push(...[
  {
    id: 'black-mech-void-construct',
    name: 'Void Construct',
    description: 'Mech. ETB: Destroy target unit with 2 or less health if you control another mech. Costs 5B.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 5,
    consumesRunes: true, // Requires B rune
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      etbEffect: 'destroy_unit',
    },
  },
  {
    id: 'black-mech-corrupted-automaton',
    name: 'Corrupted Automaton',
    description: 'Mech. 3/4 for 4 mana. Solid black mech.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      attackBonus: 0, // No bonus, just a mech body
    },
    rarity: 'common',
  },
  // Additional Black Mechs for prevalence
  {
    id: 'black-mech-shadow-automaton',
    name: 'Shadow Automaton',
    description: 'Mech. 3/3 for 4 mana. Solid black body.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 0,
    },
    rarity: 'common',
  },
  {
    id: 'black-mech-death-engine',
    name: 'Death Engine',
    description: 'Mech. Other mechs have +1/+0.',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 5,
    consumesRunes: false,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 1,
    },
    rarity: 'uncommon',
  },
])

// Mech Signature Cards
mechSignatureCards.push(...[
  {
    id: 'blue-mech-sig-engineer',
    name: 'Experimental Prototype',
    description: 'Master Engineer signature. Mech. 3/3 for 4 mana.',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    consumesRunes: false,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    isMech: true,
    mechSynergy: {
      attackBonus: 0,
    },
  },
  {
    id: 'red-mech-sig-forgemaster',
    name: 'Forge Sentinel',
    description: 'Forgemaster signature. Mech. 4/2 for 4 mana.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    consumesRunes: false,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    isMech: true,
    mechSynergy: {
      attackBonus: 0,
    },
  },
  {
    id: 'white-mech-sig-commander',
    name: 'Guardian Construct',
    description: 'Sentinel Commander signature. Mech. 2/4 for 4 mana.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 4,
    consumesRunes: false,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    isMech: true,
    mechSynergy: {
      healthBonus: 0,
    },
  },
])

export const allBattlefields: BattlefieldDefinition[] = [
  ...archetypeBattlefields,
  ...genericBattlefields,
]



