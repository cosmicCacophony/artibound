import { Hero, BattlefieldDefinition, BaseCard, Color } from './types'

// Default Heroes (used if player doesn't draft 4 heroes)
// Passable defaults (like Artifact's black/green)
export const defaultHeroes: {
  passable: Omit<Hero, 'location' | 'owner'>[]
  disappointing: Omit<Hero, 'location' | 'owner'>[]
} = {
  passable: [
    {
      id: 'default-green-ranger',
      name: 'Green Ranger',
      description: 'Adequate scout and tracker',
      cardType: 'hero',
      colors: ['green'],
      attack: 6,
      health: 7,
      maxHealth: 7,
      currentHealth: 7,
      supportEffect: 'Basic range support',
      signatureCardIds: [],
      equippedItems: [],
    },
    {
      id: 'default-black-guard',
      name: 'Black Guard',
      description: 'Stalwart defender',
      cardType: 'hero',
      colors: ['black'],
      attack: 3,
      health: 12,
      maxHealth: 12,
      currentHealth: 12,
      supportEffect: 'Basic defensive support',
      signatureCardIds: [],
      equippedItems: [],
    },
  ],
  disappointing: [
    {
      id: 'default-blue-apprentice',
      name: 'Blue Apprentice',
      description: 'Inexperienced mage',
      cardType: 'hero',
      colors: ['blue'],
      attack: 3,
      health: 5,
      maxHealth: 5,
      currentHealth: 5,
      supportEffect: 'Weak magical support',
      signatureCardIds: [],
      equippedItems: [],
    },
    {
      id: 'default-red-recruit',
      name: 'Red Recruit',
      description: 'Raw fighter',
      cardType: 'hero',
      colors: ['red'],
      attack: 4,
      health: 6,
      maxHealth: 6,
      currentHealth: 6,
      supportEffect: 'Basic combat support',
      signatureCardIds: [],
      equippedItems: [],
    },
  ],
}

// Default Battlefield (used if player doesn't draft a battlefield)
export const defaultBattlefield: BattlefieldDefinition = {
  id: 'default-neutral-ground',
  name: 'Neutral Ground',
  description: 'A basic battlefield with no special properties',
  colors: [],
  staticAbility: 'No special ability',
  staticAbilityId: 'none',
}

// Draftable Heroes Pool
// These are stronger than defaults and can appear in draft packs
// Heroes are archetype-specific (e.g., RG hero strong in RG, weak in GB)
export const draftableHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Red Heroes
  {
    id: 'draft-red-warrior',
    name: 'Red Warrior',
    description: 'Fierce melee fighter - strong in RW aggro',
    cardType: 'hero',
    colors: ['red'],
    attack: 5,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Allies gain +1 attack',
    signatureCardIds: ['rw-sig-warrior-1', 'rw-sig-warrior-2'],
    equippedItems: [],
  },
  {
    id: 'draft-red-berserker',
    name: 'Red Berserker',
    description: 'Aggressive fighter - strong in RG aggro',
    cardType: 'hero',
    colors: ['red'],
    attack: 6,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Gain +1 attack for each enemy unit',
    signatureCardIds: ['rw-sig-berserker-1', 'rw-sig-berserker-2'],
    equippedItems: [],
  },
  // Blue Heroes
  {
    id: 'draft-blue-mage',
    name: 'Blue Mage',
    description: 'Master of arcane magic - strong in UB control',
    cardType: 'hero',
    colors: ['blue'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Draw an extra card each turn',
    signatureCardIds: ['ub-sig-mage-1', 'ub-sig-mage-2'],
    equippedItems: [],
  },
  {
    id: 'draft-blue-sorcerer',
    name: 'Blue Sorcerer',
    description: 'Powerful spellcaster - strong in UR spells',
    cardType: 'hero',
    colors: ['blue'],
    attack: 5,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Spells cost -1 mana',
    signatureCardIds: ['ub-sig-sorcerer-1', 'ub-sig-sorcerer-2'],
    equippedItems: [],
  },
  // White Heroes
  {
    id: 'draft-white-paladin',
    name: 'White Paladin',
    description: 'Divine protector - strong in RW aggro',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 11,
    maxHealth: 11,
    currentHealth: 11,
    supportEffect: 'Heal allies 1 HP each turn',
    signatureCardIds: ['rw-sig-paladin-1', 'rw-sig-paladin-2'],
    equippedItems: [],
  },
  {
    id: 'draft-white-cleric',
    name: 'White Cleric',
    description: 'Support specialist - strong in WG midrange',
    cardType: 'hero',
    colors: ['white'],
    attack: 2,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Allies gain +1 health',
    signatureCardIds: [],
    equippedItems: [],
  },
  // Black Heroes
  {
    id: 'draft-black-necromancer',
    name: 'Black Necromancer',
    description: 'Dark magic specialist - strong in UB control',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Gain 1 gold when units die',
    signatureCardIds: ['ub-sig-necromancer-1', 'ub-sig-necromancer-2'],
    equippedItems: [],
  },
  {
    id: 'draft-black-assassin',
    name: 'Black Assassin',
    description: 'Stealthy killer - strong in BG control',
    cardType: 'hero',
    colors: ['black'],
    attack: 5,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Deal 1 damage when units die',
    signatureCardIds: [],
    equippedItems: [],
  },
  // Green Heroes
  {
    id: 'draft-green-ranger',
    name: 'Green Ranger',
    description: 'Nature warrior - strong in RG aggro',
    cardType: 'hero',
    colors: ['green'],
    attack: 6,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Range attacks ignore first defense',
    signatureCardIds: [],
    equippedItems: [],
  },
  {
    id: 'draft-green-druid',
    name: 'Green Druid',
    description: 'Nature mage - strong in UG ramp',
    cardType: 'hero',
    colors: ['green'],
    attack: 3,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Gain +1 max mana each turn',
    signatureCardIds: [],
    equippedItems: [],
  },
]

// Additional Battlefields for Draft
export const additionalBattlefields: BattlefieldDefinition[] = [
  {
    id: 'battlefield-ug-ramp',
    name: 'Mana Grove',
    description: 'Green/Blue battlefield',
    colors: ['green', 'blue'],
    staticAbility: 'Gain +1 max mana each turn',
    staticAbilityId: 'mana-ramp',
  },
  {
    id: 'battlefield-ur-spells',
    name: 'Arcane Nexus',
    description: 'Red/Blue battlefield',
    colors: ['red', 'blue'],
    staticAbility: 'Spells deal +1 damage',
    staticAbilityId: 'spell-damage-buff',
  },
  {
    id: 'battlefield-wg-midrange',
    name: 'Temple Grounds',
    description: 'White/Green battlefield',
    colors: ['white', 'green'],
    staticAbility: 'Units gain +0/+1 when played',
    staticAbilityId: 'unit-health-buff',
  },
  {
    id: 'battlefield-bg-control',
    name: 'Graveyard',
    description: 'Black/Green battlefield',
    colors: ['black', 'green'],
    staticAbility: 'Gain 2 gold when units die',
    staticAbilityId: 'death-gold-bonus',
  },
]

// Helper to get all available heroes for draft (draftable + defaults for fallback)
export function getAllDraftHeroes(): Omit<Hero, 'location' | 'owner'>[] {
  return [...draftableHeroes, ...defaultHeroes.passable, ...defaultHeroes.disappointing]
}

// Helper to get all available battlefields for draft
export function getAllDraftBattlefields(): BattlefieldDefinition[] {
  return [
    {
      id: 'battlefield-rw-same-color-buff',
      name: 'Unity Plaza',
      description: 'Red/White battlefield',
      colors: ['red', 'white'],
      staticAbility: '+1/+0 to all units if you control 3 units of the same color in this lane',
      staticAbilityId: 'same-color-buff',
    },
    {
      id: 'battlefield-ub-gold-on-kill',
      name: 'Shadow Market',
      description: 'Blue/Black battlefield',
      colors: ['blue', 'black'],
      staticAbility: 'Gain extra gold for killing units in this lane',
      staticAbilityId: 'gold-on-kill',
    },
    ...additionalBattlefields,
  ]
}

