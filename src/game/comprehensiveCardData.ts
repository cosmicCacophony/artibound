import { Hero, BaseCard, GenericUnit, SpellCard, SpellEffect, BattlefieldDefinition, Color, HeroAbility } from './types'

// ============================================================================
// RW (Red/White) - Go Wide Beatdown
// ============================================================================

export const rwHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'rw-hero-commander',
    name: 'Valiant Commander',
    description: 'Legion. Leads the charge with team buffs',
    cardType: 'hero',
    colors: ['red', 'white'],
    attack: 4,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    signatureCardId: 'rw-sig-commander-1',
    equippedItems: [],
    ability: {
      name: 'Rally',
      description: 'All your units gain +1/+1 this turn',
      manaCost: 1,
      cooldown: 2,
      effectType: 'buff_units',
      effectValue: 1, // +1/+1
    },
  },
  {
    id: 'rw-hero-captain',
    name: 'War Captain',
    description: 'Legion. Aggressive leader',
    cardType: 'hero',
    colors: ['red'],
    attack: 7,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    signatureCardId: 'rw-sig-captain-1',
    equippedItems: [],
    ability: {
      name: 'Tactical Movement',
      description: 'Move this hero up to 3 slots. Can move between battlefields.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'move_cross_battlefield',
      effectValue: 3, // Up to 3 slots
    },
  },
  {
    id: 'rw-hero-vanguard',
    name: 'Battle Vanguard',
    description: 'Mobile warrior. Can reposition to support the front lines.',
    cardType: 'hero',
    colors: ['red'],
    attack: 5,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    signatureCardId: 'rw-sig-vanguard-1',
    equippedItems: [],
    ability: {
      name: 'Tactical Reposition',
      description: 'Swap this hero to an adjacent location. If you also control a white hero, you can swap to any location.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'move_hero',
      effectValue: 1,
    },
  },
]

export const rwCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  // Signature units (physical objects that can be units)
  {
    id: 'rw-sig-commander-1',
    name: 'Rally Banner',
    description: 'Commander signature - buffs team. All allies gain +1/+1.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
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
  {
    id: 'rw-sig-vanguard-1',
    name: 'Vanguard Banner',
    description: 'Vanguard signature - mobile support. All allies gain +1 attack. When this enters, you may move a hero to an adjacent slot.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  // Legion Tribal Units (RW archetype)
  {
    id: 'rw-legion-bronze',
    name: 'Bronze Legionnaire',
    description: 'Legion. When you use a hero ability, this gains +1/+1.',
    cardType: 'generic',
    colors: ['red'], // Changed from RW to R - 2 mana should be single color
    manaCost: 2,
    attack: 2,
    health: 3, // Changed from 2 to 3 for better defensive statline
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rw-legion-herald',
    name: 'Imperial Herald',
    description: 'Legion. When you use a hero ability, all Legion units gain +1/+1 this turn.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 3,
    attack: 3, // Changed from 2 to 3 for better base stats
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rw-legion-standard',
    name: 'Legion Standard Bearer',
    description: 'Legion. When you cast a spell in this lane, put a +1/+1 counter on all Legion units.',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 3,
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rw-legion-veteran',
    name: 'Legion Veteran',
    description: 'Legion. When this enters, all Legion units gain +1 attack this turn.',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
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
]

export const rwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Signature spells (converted from units)
  {
    id: 'rw-sig-commander-2',
    name: 'Charge Order',
    description: 'Commander signature - aggressive. All allies gain +2 attack this turn.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 3,
    initiative: true, // Quickcast - gives initiative
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff
      damage: 0,
    },
  },
  {
    id: 'rw-sig-captain-1',
    name: 'War Cry',
    description: 'Captain signature - pump team. All allies gain +2 attack this turn.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 3,
    initiative: true, // Quickcast - gives initiative
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff
      damage: 0,
    },
  },
  // RW Combat Spells
  {
    id: 'rw-spell-path-valor',
    name: 'Path of Valor',
    description: 'Blocked units get +1 attack. When you cast a spell or unit in this lane, put a +1/+1 counter on all blocked units.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for counters
      damage: 0,
    },
  },
  {
    id: 'rw-spell-rally-legion',
    name: 'Rally the Legion',
    description: 'All Legion units get +2/+2 this round.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
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
    effect: {
      type: 'targeted_damage', // Placeholder - manual resolution, no game tracking
      damage: 0,
    },
  },
  {
    id: 'rw-spell-champion-challenge',
    name: 'Champion Challenge',
    description: 'Your hero initiates combat with target enemy hero. Players resolve combat manually.',
    cardType: 'spell',
    colors: ['red', 'white'], // Hero combat spell - keeps rune requirement (uncommon)
    manaCost: 3,
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
    colors: undefined, // Common spell - no rune requirement
    manaCost: 2,
    effect: {
      type: 'adjacent_damage',
      damage: 2,
      adjacentCount: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'rw-spell-unbreakable-column',
    name: 'Unbreakable Column',
    description: 'Caster and neighbors ignore incoming damage of 2 or less this turn.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for damage reduction
      damage: 0,
    },
  },
  {
    id: 'rw-spell-fighting-words',
    name: 'Fighting Words',
    description: 'Target unit gains +3 attack this turn.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for buff
      damage: 0,
    },
  },
  // RW Combat Tricks - Risky but powerful
  {
    id: 'rw-spell-soul-of-spring',
    name: 'Soul of Spring',
    description: 'Target hero gains Regeneration (heals 3 damage at end of each combat phase). Regeneration only affects combat damage - other damage sources bypass it.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for regeneration
      damage: 0,
    },
  },
  {
    id: 'rw-spell-living-armor',
    name: 'Living Armor',
    description: 'Target hero gains +0/+5 until end of turn. If it would die this turn, it survives with 1 health instead.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for temporary health and death prevention
      damage: 0,
    },
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
    attack: 6,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Can fight enemy units',
    signatureCardId: 'rg-sig-brawler-1',
    equippedItems: [],
  },
  {
    id: 'rg-hero-ramp',
    name: 'Nature Warrior',
    description: 'Ramps into big threats',
    cardType: 'hero',
    colors: ['green'],
    attack: 5,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Gain +1 max mana',
    signatureCardId: 'rg-sig-ramp-1',
    equippedItems: [],
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
    description: 'Big aggressive threat',
    cardType: 'generic',
    colors: ['red', 'green'],
    manaCost: 5,
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
    attack: 5,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Spells deal +1 damage',
    signatureCardId: 'ru-sig-spellblade-1',
    equippedItems: [],
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
    colors: undefined, // Common spell - no rune requirement
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
    attack: 6,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Draw card when unit dies',
    signatureCardId: 'rb-sig-reaper-1',
    equippedItems: [],
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
  {
    id: 'gw-sig-protector-1',
    name: 'Divine Aura',
    description: 'Protector signature - buff. Adjacent units gain +1/+1.',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 2,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    specialEffects: ['adjacent_buff'], // Adjacent units gain +1/+1
  },
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
  {
    id: 'gw-token-1',
    name: 'Saproling',
    description: 'Small token',
    cardType: 'generic',
    colors: ['green'],
    manaCost: 3,
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
  {
    id: 'gw-aura-1',
    name: 'Glorious Banner',
    description: 'Aura - +1/+1 to all',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 2,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
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
    attack: 5,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Gain gold when units die',
    signatureCardId: 'gb-sig-reaper-1',
    equippedItems: [],
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
    id: 'gb-sig-reaper-2',
    name: 'Nature\'s Wrath',
    description: 'Reaper signature - removal',
    cardType: 'generic',
    colors: ['green', 'black'],
    manaCost: 4,
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
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

export const gbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'gb-kill-1',
    name: 'Murder',
    description: 'Kill target unit',
    cardType: 'spell',
    colors: ['black'],
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
  },
]

export const guSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'gu-spell-1',
    name: 'Mana Surge',
    description: 'Gain +2 max mana',
    cardType: 'spell',
    colors: ['green'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage',
      damage: 0,
    },
  },
  {
    id: 'gu-spell-2',
    name: 'Titan\'s Wrath',
    description: 'Deal 10 damage',
    cardType: 'spell',
    colors: ['green', 'blue'],
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
    description: 'Control and card advantage',
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
      name: 'Void Strike',
      description: 'Deal 4 damage to target unit in any lane.',
      manaCost: 1,
      cooldown: 2,
      effectType: 'damage_target',
      effectValue: 4, // 4 damage
    },
  },
  {
    id: 'ub-hero-nature-guardian',
    name: 'Nature Guardian',
    description: 'Resilient control hero',
    cardType: 'hero',
    colors: ['green'],
    attack: 4,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'When an enemy unit dies, gain +1 max mana this turn',
    signatureCardId: 'ub-sig-guardian-1',
    equippedItems: [],
    ability: {
      name: 'Steal Creep',
      description: 'Take control of target enemy unit (generic only, not heroes)',
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
    signatureCardId: 'ub-sig-druid-1',
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
  // Verdant Colossus removed - replaced with Void Cascade AOE spell
]

export const ubSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Signature spells (converted from units)
  {
    id: 'ub-sig-archmage-1',
    name: 'Void Bolt',
    description: 'Archmage signature - removal. Deal 4 damage to target unit.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // UB AOE spell - replaces one direct damage spell
  {
    id: 'ub-spell-void-cascade',
    name: 'Void Cascade',
    description: 'Deal 5 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Requires U and B runes
    manaCost: 5,
    effect: {
      type: 'aoe_damage',
      damage: 5,
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
    colors: undefined, // Common spell - no rune requirement
    manaCost: 4,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for card draw
      damage: 0,
    },
  },
  {
    id: 'ub-sig-necromancer-2',
    name: 'Soul Drain',
    description: 'Necromancer signature - advantage. Deal 2 damage to target unit, draw a card.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ub-sig-guardian-1',
    name: 'Nature\'s Revenge',
    description: 'Nature Guardian signature - removal and ramp. Deal 3 damage to target unit. If it dies, gain +1 max mana.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 3,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for conditional mana ramp
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'ub-sig-druid-1',
    name: 'Nature\'s Wrath',
    description: 'Verdant Archmage signature - ramp and removal. Deal 3 damage to target unit. Gain +1 max mana.',
    cardType: 'spell',
    colors: undefined, // Common spell - no rune requirement
    manaCost: 2,
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for damage + mana ramp
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  // UB Control Archetype Spells
  {
    id: 'ub-spell-thunderstorm',
    name: 'Thunderstorm',
    description: 'Deal 3 damage to all enemy units.',
    cardType: 'spell',
    colors: ['blue', 'black'], // Requires U and B runes
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
    id: 'ub-spell-removal',
    name: 'Arcane Removal',
    description: 'Deal 6 damage to target unit or hero.',
    cardType: 'spell',
    colors: undefined, // Common removal - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common spell - no rune requirement
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
    colors: undefined, // Common AOE - no rune requirement
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
    colors: undefined, // Common AOE - no rune requirement
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
    colors: ['red', 'white', 'green'],
    attack: 5,
    health: 11,
    maxHealth: 11,
    currentHealth: 11,
    supportEffect: 'Allies gain +1/+1. If you control heroes of 4 different colors, allies gain +2/+2 instead.',
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
    attack: 6,
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
    description: 'All your units gain +1/+1. At the start of your next turn, all your units gain +1/+1 again.',
    cardType: 'generic',
    colors: ['red', 'white', 'green'],
    manaCost: 5, // 2RWG = 5 total mana
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
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
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for team buff + permanent counters
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
    colors: ['blue', 'black', 'green'],
    attack: 3,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'When you cast a spell, draw a card. If you control heroes of 4 different colors, draw 2 cards instead.',
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
    colors: ['blue', 'black', 'green'],
    manaCost: 4,
    attack: 2,
    health: 4, // Base 4, scales with color count
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'ubg-sig-sage-1',
    name: 'Shadow Growth',
    description: 'Shadow Sage signature - removal. Deal 6 damage to target unit or hero. If it had 4+ health, draw a card.',
    cardType: 'generic',
    colors: ['black', 'green'],
    manaCost: 4,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

export const ubgSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  // Only UBG spell - Exorcism (7 mana, requires all 3 colors)
  {
    id: 'ubg-spell-exorcism',
    name: 'Exorcism',
    description: 'Deal 12 total damage distributed to enemy units in front and tower. 0 units: 12 to tower. 1 unit: 6 to unit, 6 to tower. 2 units: 4 to each unit, 4 to tower. 3 units: 3 to each unit, 3 to tower.',
    cardType: 'spell',
    colors: ['blue', 'black', 'green'], // Requires all 3 colors (UBG) - consumes U, G, B runes
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
    effect: {
      type: 'targeted_damage', // Placeholder - would need custom effect for damage reduction
      damage: 0,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
  {
    id: 'uw-spell-1',
    name: 'Divine Wrath',
    description: 'Deal 4 damage',
    cardType: 'spell',
    colors: ['blue', 'white'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
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
  ...rwgHeroes,
  ...ubgHeroes,
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
    description: 'Generic battlefield',
    colors: [],
    staticAbility: 'No special ability',
    staticAbilityId: 'none',
  },
  {
    id: 'battlefield-neutral-2',
    name: 'Training Field',
    description: 'Generic battlefield',
    colors: [],
    staticAbility: 'Units gain +1 attack on first turn',
    staticAbilityId: 'first-turn-buff',
  },
  {
    id: 'battlefield-neutral-3',
    name: 'Ancient Ruins',
    description: 'Generic battlefield',
    colors: [],
    staticAbility: 'Gain 1 gold each turn',
    staticAbilityId: 'gold-per-turn',
  },
]

export const allBattlefields: BattlefieldDefinition[] = [
  ...archetypeBattlefields,
  ...genericBattlefields,
]



