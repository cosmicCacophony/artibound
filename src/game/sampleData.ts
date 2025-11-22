import { Hero, SignatureCard, HybridCard, GenericUnit, Card, BaseCard, Item, GameMetadata, TOWER_HP, NEXUS_HP, STARTING_GOLD, BattlefieldDefinition, SpellCard, SpellEffect } from './types'

// Item definitions
export const tier1Items: Item[] = [
  {
    id: 'item-armor',
    name: 'Armor',
    description: '+2 HP',
    cost: 5,
    tier: 1,
    hpBonus: 2,
  },
  {
    id: 'item-weapon',
    name: 'Weapon',
    description: '+2 Attack',
    cost: 5,
    tier: 1,
    attackBonus: 2,
  },
  {
    id: 'item-goldmine',
    name: 'Gold Mine',
    description: '+1 gold per turn',
    cost: 8,
    tier: 1,
    goldPerTurn: 1,
  },
]

// Hero definitions (templates for the library)
export const heroTemplates: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'hero-warrior',
    name: 'Warrior',
    description: 'A fierce melee fighter',
    cardType: 'hero',
    colors: ['red'],
    attack: 5,
    health: 10,
    maxHealth: 10,
    currentHealth: 10,
    supportEffect: 'Allies gain +1 attack',
    signatureCardIds: ['sig-warrior-1', 'sig-warrior-2'],
  },
  {
    id: 'hero-mage',
    name: 'Mage',
    description: 'Master of arcane magic',
    cardType: 'hero',
    colors: ['blue'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Draw an extra card each turn',
    signatureCardIds: ['sig-mage-1', 'sig-mage-2'],
  },
  {
    id: 'hero-healer',
    name: 'Healer',
    description: 'Provides support and healing',
    cardType: 'hero',
    colors: ['white'],
    attack: 2,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Heal allies 2 HP each turn',
    signatureCardIds: ['sig-healer-1', 'sig-healer-2'],
  },
  {
    id: 'hero-archer',
    name: 'Archer',
    description: 'Long-range specialist',
    cardType: 'hero',
    colors: ['green'],
    attack: 6,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Range attacks ignore first defense',
    signatureCardIds: ['sig-archer-1', 'sig-archer-2'],
  },
  {
    id: 'hero-guardian',
    name: 'Guardian',
    description: 'Defensive powerhouse',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 12,
    maxHealth: 12,
    currentHealth: 12,
    supportEffect: 'Allies gain +2 health',
    signatureCardIds: ['sig-guardian-1', 'sig-guardian-2'],
  },
]

// Signature card templates
export const signatureCardTemplates: Omit<SignatureCard, 'location' | 'owner'>[] = [
  // Warrior signatures
  {
    id: 'sig-warrior-1',
    name: 'Warrior\'s Blade',
    description: 'The Warrior\'s signature weapon',
    cardType: 'signature',
    heroName: 'Warrior',
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    effect: 'If Warrior is on battlefield, +2 attack',
  },
  {
    id: 'sig-warrior-2',
    name: 'Battle Cry',
    description: 'Warrior\'s rallying call',
    cardType: 'signature',
    heroName: 'Warrior',
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    effect: 'Warrior gains +1 attack for each signature card',
  },
  // Mage signatures
  {
    id: 'sig-mage-1',
    name: 'Arcane Missile',
    description: 'Basic spell from Mage\'s arsenal',
    cardType: 'signature',
    heroName: 'Mage',
    attack: 3,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    effect: 'Deal 2 damage to enemy when played',
  },
  {
    id: 'sig-mage-2',
    name: 'Mana Shield',
    description: 'Mage\'s protective barrier',
    cardType: 'signature',
    heroName: 'Mage',
    attack: 1,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    effect: 'Mage gains +3 health',
  },
  // Healer signatures
  {
    id: 'sig-healer-1',
    name: 'Healing Potion',
    description: 'Restorative brew',
    cardType: 'signature',
    heroName: 'Healer',
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    effect: 'Heal all allies 3 HP',
  },
  {
    id: 'sig-healer-2',
    name: 'Divine Light',
    description: 'Healer\'s blessing',
    cardType: 'signature',
    heroName: 'Healer',
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    effect: 'Allies gain +1 health',
  },
  // Archer signatures
  {
    id: 'sig-archer-1',
    name: 'Precise Shot',
    description: 'Archer\'s accurate arrow',
    cardType: 'signature',
    heroName: 'Archer',
    attack: 4,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    effect: 'Can attack enemy base directly',
  },
  {
    id: 'sig-archer-2',
    name: 'Swift Arrow',
    description: 'Fast and deadly',
    cardType: 'signature',
    heroName: 'Archer',
    attack: 3,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    effect: 'Archer gains +2 attack this turn',
  },
  // Guardian signatures
  {
    id: 'sig-guardian-1',
    name: 'Shield Bash',
    description: 'Guardian\'s defensive strike',
    cardType: 'signature',
    heroName: 'Guardian',
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    effect: 'Block next attack on an ally',
  },
  {
    id: 'sig-guardian-2',
    name: 'Fortress',
    description: 'Impenetrable defense',
    cardType: 'signature',
    heroName: 'Guardian',
    attack: 1,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    effect: 'Guardian gains +5 health',
  },
]

// Hybrid card templates
export const hybridCardTemplates: Omit<HybridCard, 'location' | 'owner'>[] = [
  {
    id: 'hybrid-commander',
    name: 'Battle Commander',
    description: 'Leads from the front or rear',
    cardType: 'hybrid',
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    baseBuff: 'Battlefield units gain +1 attack',
  },
  {
    id: 'hybrid-scout',
    name: 'Field Scout',
    description: 'Reconnaissance expert',
    cardType: 'hybrid',
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    baseBuff: 'See enemy hand size',
  },
  {
    id: 'hybrid-engineer',
    name: 'Battle Engineer',
    description: 'Repairs and upgrades',
    cardType: 'hybrid',
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    baseBuff: 'Repair 1 damage to all allies each turn',
  },
]

// Generic unit templates
export const genericUnitTemplates: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'generic-soldier-1',
    name: 'Foot Soldier',
    description: 'Basic infantry unit',
    cardType: 'generic',
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'generic-soldier-2',
    name: 'Foot Soldier',
    description: 'Basic infantry unit',
    cardType: 'generic',
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'generic-knight-1',
    name: 'Knight',
    description: 'Armored warrior',
    cardType: 'generic',
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'generic-knight-2',
    name: 'Knight',
    description: 'Armored warrior',
    cardType: 'generic',
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'generic-spearman-1',
    name: 'Spearman',
    description: 'Defensive fighter',
    cardType: 'generic',
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'generic-spearman-2',
    name: 'Spearman',
    description: 'Defensive fighter',
    cardType: 'generic',
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// New card templates with mana costs
// Distribution: 2 cards cost 3, 3 cards cost 4, 1 card costs 5, 1 card costs 6
// Warrior cards (Red) - Player 1
export const warriorCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'warrior-card-1',
    name: 'Berserker',
    description: 'Fierce warrior that gains attack when damaged',
    cardType: 'generic',
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'warrior-card-2',
    name: 'Rage Strike',
    description: 'Powerful melee attack',
    cardType: 'generic',
    manaCost: 3,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'warrior-card-3',
    name: 'Shield Warrior',
    description: 'Defensive fighter with high health',
    cardType: 'generic',
    manaCost: 4,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'warrior-card-4',
    name: 'Bloodthirst',
    description: 'Heals when dealing damage',
    cardType: 'generic',
    manaCost: 4,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'warrior-card-5',
    name: 'Battle Cry',
    description: 'Buffs all friendly units',
    cardType: 'generic',
    manaCost: 4,
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'warrior-card-6',
    name: 'Executioner',
    description: 'Deals extra damage to low health enemies',
    cardType: 'generic',
    manaCost: 5,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'warrior-card-7',
    name: 'Champion',
    description: 'Elite warrior with powerful abilities',
    cardType: 'generic',
    manaCost: 6,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
]

// Mage cards (Blue) - Player 2
export const mageCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'mage-card-1',
    name: 'Fire Bolt',
    description: 'Quick spell attack',
    cardType: 'generic',
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'mage-card-2',
    name: 'Arcane Shield',
    description: 'Protective magic barrier',
    cardType: 'generic',
    manaCost: 3,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'mage-card-3',
    name: 'Ice Lance',
    description: 'Freezing spell that slows enemies',
    cardType: 'generic',
    manaCost: 4,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'mage-card-4',
    name: 'Mana Surge',
    description: 'Grants bonus mana next turn',
    cardType: 'generic',
    manaCost: 4,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'mage-card-5',
    name: 'Chain Lightning',
    description: 'Bounces between multiple targets',
    cardType: 'generic',
    manaCost: 4,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'mage-card-6',
    name: 'Polymorph',
    description: 'Transforms enemy into weaker form',
    cardType: 'generic',
    manaCost: 5,
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'mage-card-7',
    name: 'Meteor Strike',
    description: 'Massive area damage spell',
    cardType: 'generic',
    manaCost: 6,
    attack: 7,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// Create card library - separate for each player
// Includes: signature cards (2 per hero) + generic aggro/control cards + multicolor cards + spells
export function createCardLibrary(player: 'player1' | 'player2'): (BaseCard & Partial<{ effect: SpellEffect, initiative?: boolean }>)[] {
  if (player === 'player1') {
    // Player 1 (RW Aggro): All signature cards + aggro generics + multicolor cards + spells
    return [
      ...rwWarriorSignatureCards,
      ...rwBerserkerSignatureCards,
      ...rwChampionSignatureCards,
      ...rwPaladinSignatureCards,
      ...rwAggroGenericCards,
      ...redWhiteMulticolorCards,
      ...redWhiteSpells,
    ].map(card => {
      const base: BaseCard & Partial<{ effect: SpellEffect, initiative?: boolean }> = {
        id: card.id,
        name: card.name,
        description: card.description,
        cardType: card.cardType,
        manaCost: card.manaCost,
        colors: card.colors,
      }
      // For spells, include the effect
      if (card.cardType === 'spell') {
        const spell = card as SpellCard
        base.effect = spell.effect
        base.initiative = spell.initiative
      }
      return base
    })
  } else {
    // Player 2 (UB Control): All signature cards + control generics + multicolor cards + spells
    return [
      ...ubMageSignatureCards,
      ...ubSorcererSignatureCards,
      ...ubArchmageSignatureCards,
      ...ubNecromancerSignatureCards,
      ...ubControlGenericCards,
      ...blueBlackMulticolorCards,
      ...blackSpells,
      ...blueSpells,
    ].map(card => {
      const base: BaseCard & Partial<{ effect: SpellEffect, initiative?: boolean }> = {
        id: card.id,
        name: card.name,
        description: card.description,
        cardType: card.cardType,
        manaCost: card.manaCost,
        colors: card.colors,
      }
      // For spells, include the effect
      if (card.cardType === 'spell') {
        const spell = card as SpellCard
        base.effect = spell.effect
        base.initiative = spell.initiative
      }
      return base
    })
  }
}

// Legacy function for backward compatibility
export function createLegacyCardLibrary(): BaseCard[] {
  return [
    ...heroTemplates,
    ...signatureCardTemplates,
    ...hybridCardTemplates,
    ...genericUnitTemplates,
  ]
}

// Helper to create a card instance from template
export function createCardFromTemplate(
  template: BaseCard,
  owner: 'player1' | 'player2',
  location: 'hand' | 'base' | 'battlefieldA' | 'battlefieldB' = 'hand'
): Card {
  const base = {
    id: `${template.id}-${owner}-${Date.now()}-${Math.random()}`,
    name: template.name,
    description: template.description,
    cardType: template.cardType,
    location,
    owner,
    manaCost: template.manaCost,
    colors: template.colors,
  }

  // Check if it's a spell card first
  if (template.cardType === 'spell') {
    const allSpells = [...blackSpells, ...blueSpells, ...redWhiteSpells]
    const spellCard = allSpells.find(c => c.id === template.id)
    if (spellCard) {
      return {
        ...base,
        effect: spellCard.effect,
        initiative: spellCard.initiative,
        colors: spellCard.colors,
      } as SpellCard
    }
  }
  
  // Check if it's a RW card (Player 1)
  if (owner === 'player1') {
    const allRWCards = [
      ...rwWarriorSignatureCards,
      ...rwBerserkerSignatureCards,
      ...rwChampionSignatureCards,
      ...rwPaladinSignatureCards,
      ...rwAggroGenericCards,
      ...redWhiteMulticolorCards,
    ]
    const rwCard = allRWCards.find(c => c.id === template.id)
    if (rwCard) {
      const { id, name, description, cardType, manaCost, ...stats } = rwCard
      return {
        ...base,
        ...stats,
        colors: rwCard.colors,
      } as GenericUnit
    }
  } else {
    // Check if it's a UB card (Player 2)
    const allUBCards = [
      ...ubMageSignatureCards,
      ...ubSorcererSignatureCards,
      ...ubArchmageSignatureCards,
      ...ubNecromancerSignatureCards,
      ...ubControlGenericCards,
      ...blueBlackMulticolorCards,
    ]
    const ubCard = allUBCards.find(c => c.id === template.id)
    if (ubCard) {
      const { id, name, description, cardType, manaCost, ...stats } = ubCard
      return {
        ...base,
        ...stats,
        colors: ubCard.colors,
      } as GenericUnit
    }
  }

  if (template.cardType === 'hero') {
    const heroTemplate = template as unknown as Omit<Hero, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...heroTemplate,
      maxHealth: heroTemplate.maxHealth || heroTemplate.health,
      currentHealth: heroTemplate.currentHealth !== undefined ? heroTemplate.currentHealth : (heroTemplate.maxHealth || heroTemplate.health),
      equippedItems: [],
    } as Hero
  } else if (template.cardType === 'signature') {
    const sigTemplate = template as unknown as Omit<SignatureCard, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...sigTemplate,
      maxHealth: sigTemplate.maxHealth || sigTemplate.health,
      currentHealth: sigTemplate.currentHealth !== undefined ? sigTemplate.currentHealth : (sigTemplate.maxHealth || sigTemplate.health),
    } as SignatureCard
  } else if (template.cardType === 'hybrid') {
    const hybridTemplate = template as unknown as Omit<HybridCard, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...hybridTemplate,
      maxHealth: hybridTemplate.maxHealth || hybridTemplate.health,
      currentHealth: hybridTemplate.currentHealth !== undefined ? hybridTemplate.currentHealth : (hybridTemplate.maxHealth || hybridTemplate.health),
    } as HybridCard
  } else if (template.cardType === 'spell') {
    const spellTemplate = template as unknown as Omit<SpellCard, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...spellTemplate,
    } as SpellCard
  } else {
    const genTemplate = template as unknown as Omit<GenericUnit, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType' | 'stackedWith' | 'stackPower' | 'stackHealth'>
    return {
      ...base,
      ...genTemplate,
      maxHealth: genTemplate.maxHealth || genTemplate.health,
      currentHealth: genTemplate.currentHealth !== undefined ? genTemplate.currentHealth : (genTemplate.maxHealth || genTemplate.health),
    } as GenericUnit
  }
}

// Battlefield Definitions
export const battlefieldDefinitions: BattlefieldDefinition[] = [
  {
    id: 'battlefield-rw-same-color-buff',
    name: 'Unity Plaza',
    description: 'Red/White battlefield',
    colors: ['red', 'white'],
    staticAbility: '+1/+0 to all units if you control 3 units of the same color in this lane',
    staticAbilityId: 'same-color-buff'
  },
  {
    id: 'battlefield-ub-gold-on-kill',
    name: 'Shadow Market',
    description: 'Blue/Black battlefield',
    colors: ['blue', 'black'],
    staticAbility: 'Gain extra gold for killing units in this lane',
    staticAbilityId: 'gold-on-kill'
  }
]

// Test Deck Heroes - Warrior (3 Red + 1 White)
// RW Aggro Deck: 2 heroes with 3-mana cards, 1 hero with 4-mana cards, 1 hero with 5-mana cards
export const warriorTestDeckHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'hero-red-warrior-1',
    name: 'Red Warrior',
    description: 'Fierce melee fighter',
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
    id: 'hero-red-warrior-2',
    name: 'Red Berserker',
    description: 'Aggressive fighter',
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
  {
    id: 'hero-red-warrior-3',
    name: 'Red Champion',
    description: 'Elite warrior',
    cardType: 'hero',
    colors: ['red'],
    attack: 4,
    health: 12,
    maxHealth: 12,
    currentHealth: 12,
    supportEffect: 'Allies gain +1 health',
    signatureCardIds: ['rw-sig-champion-1', 'rw-sig-champion-2'],
    equippedItems: [],
  },
  {
    id: 'hero-white-paladin',
    name: 'White Paladin',
    description: 'Divine protector',
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
]

// Test Deck Heroes - Mage (3 Blue + 1 Black)
// UB Control Deck: 3-mana, 4-mana, 6-mana, 8-mana heroes
export const mageTestDeckHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'hero-blue-mage-1',
    name: 'Blue Mage',
    description: 'Master of arcane magic',
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
    id: 'hero-blue-mage-2',
    name: 'Blue Sorcerer',
    description: 'Powerful spellcaster',
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
  {
    id: 'hero-blue-mage-3',
    name: 'Blue Archmage',
    description: 'Ancient magic wielder',
    cardType: 'hero',
    colors: ['blue'],
    attack: 3,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Allies gain +1 spell power',
    signatureCardIds: ['ub-sig-archmage-1', 'ub-sig-archmage-2'],
    equippedItems: [],
  },
  {
    id: 'hero-black-necromancer',
    name: 'Black Necromancer',
    description: 'Dark magic specialist',
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
]

// RW Signature Cards - Aggro Deck
// Red Warrior (3 mana cards)
export const rwWarriorSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rw-sig-warrior-1',
    name: 'Warrior\'s Rage',
    description: 'Quick aggression - Red Warrior signature',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rw-sig-warrior-2',
    name: 'Swift Strike',
    description: 'Fast attack - Red Warrior signature',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

// Red Berserker (3 mana cards)
export const rwBerserkerSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rw-sig-berserker-1',
    name: 'Berserker\'s Charge',
    description: 'Aggressive rush - Red Berserker signature',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 4,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'rw-sig-berserker-2',
    name: 'Fury Strike',
    description: 'Damage dealer - Red Berserker signature',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 5,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
]

// Red Champion (4 mana cards)
export const rwChampionSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rw-sig-champion-1',
    name: 'Champion\'s Blade',
    description: 'Elite weapon - Red Champion signature',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    attack: 5,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'rw-sig-champion-2',
    name: 'War Banner',
    description: 'Buffs allies - Red Champion signature',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 4,
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
]

// White Paladin (5 mana cards)
export const rwPaladinSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rw-sig-paladin-1',
    name: 'Divine Shield',
    description: 'Protective barrier - White Paladin signature',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
  },
  {
    id: 'rw-sig-paladin-2',
    name: 'Holy Strike',
    description: 'Divine attack - White Paladin signature',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 5,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// RW Aggro Generic Cards (creeps, damage spells)
export const rwAggroGenericCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rw-creep-1',
    name: 'Red Footman',
    description: 'Aggressive creep',
    cardType: 'generic',
    colors: ['red'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'rw-creep-2',
    name: 'White Guard',
    description: 'Defensive creep',
    cardType: 'generic',
    colors: ['white'],
    manaCost: 3,
    attack: 2,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
]

// Spell Cards - Red/White (RW)
export const redWhiteSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'rw-damage-1',
    name: 'Fireball',
    description: 'Damage spell - deals 4 damage',
    cardType: 'spell',
    colors: ['red'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: false,
  },
  {
    id: 'rw-damage-2',
    name: 'Smite',
    description: 'Divine damage spell - deals 3 damage',
    cardType: 'spell',
    colors: ['white'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: false,
  },
]

// UB Signature Cards - Control Deck
// Blue Mage (3 mana cards)
export const ubMageSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ub-sig-mage-1',
    name: 'Arcane Bolt',
    description: 'Basic spell - Blue Mage signature',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'ub-sig-mage-2',
    name: 'Mana Draw',
    description: 'Card advantage - Blue Mage signature',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// Blue Sorcerer (4 mana cards)
export const ubSorcererSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ub-sig-sorcerer-1',
    name: 'Mystic Barrier',
    description: 'Defensive spell - Blue Sorcerer signature',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    attack: 2,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'ub-sig-sorcerer-2',
    name: 'Spell Weave',
    description: 'Synergy spell - Blue Sorcerer signature',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 4,
    attack: 4,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// Blue Archmage (6 mana cards)
export const ubArchmageSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ub-sig-archmage-1',
    name: 'Arcane Sweep',
    description: 'Sweeper - destroys all units with 2 or less health - Blue Archmage signature',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 6,
    attack: 4,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
  },
  {
    id: 'ub-sig-archmage-2',
    name: 'Greater Arcana',
    description: 'Powerful spell - Blue Archmage signature',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 6,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// Black Necromancer (8 mana cards)
export const ubNecromancerSignatureCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ub-sig-necromancer-1',
    name: 'Death Ritual',
    description: 'High cost powerful effect - Black Necromancer signature',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 8,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'ub-sig-necromancer-2',
    name: 'Soul Drain',
    description: 'Massive effect - Black Necromancer signature',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 8,
    attack: 7,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// UB Control Generic Cards (ramp, card advantage, sweeper)
export const ubControlGenericCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ub-ramp-1',
    name: 'Mana Crystal',
    description: 'Ramps mana - gain +1 max mana',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 1,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'ub-ramp-2',
    name: 'Dark Ritual',
    description: 'Ramps mana - gain +1 max mana',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
  {
    id: 'ub-card-adv-1',
    name: 'Thought Scour',
    description: 'Draw cards',
    cardType: 'generic',
    colors: ['blue'],
    manaCost: 3,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
  },
  {
    id: 'ub-card-adv-2',
    name: 'Dark Insight',
    description: 'Card advantage',
    cardType: 'generic',
    colors: ['black'],
    manaCost: 4,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
  },
]

// Multicolor Cards - Red/White (RW)
export const redWhiteMulticolorCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'rw-card-1',
    name: 'Valiant Charge',
    description: 'RW multicolor - Stronger than average',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 5,
    attack: 6,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
  {
    id: 'rw-card-2',
    name: 'Divine Strike',
    description: 'RW multicolor - Powerful hybrid ability',
    cardType: 'generic',
    colors: ['red', 'white'],
    manaCost: 4,
    attack: 5,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
]

// Multicolor Cards - Blue/Black (UB)
export const blueBlackMulticolorCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'ub-card-1',
    name: 'Void Bolt',
    description: 'UB multicolor - Stronger than average',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 5,
    attack: 6,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
  },
  {
    id: 'ub-card-2',
    name: 'Dark Arcana',
    description: 'UB multicolor - Powerful hybrid ability',
    cardType: 'generic',
    colors: ['blue', 'black'],
    manaCost: 4,
    attack: 5,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
  },
]

// Spell Cards - Black (Damage spells)
export const blackSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'spell-black-1',
    name: 'Dark Bolt',
    description: 'Deal damage to target',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: false,
  },
  {
    id: 'spell-black-2',
    name: 'Shadow Strike',
    description: 'Quick damage with initiative',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 3,
    effect: {
      type: 'targeted_damage',
      damage: 3,
      affectsUnits: true,
      affectsHeroes: true,
    },
    initiative: true, // 3 damage with initiative bonus
  },
  {
    id: 'spell-black-3',
    name: 'Death Ray',
    description: 'Powerful single target damage',
    cardType: 'spell',
    colors: ['black'],
    manaCost: 4,
    effect: {
      type: 'targeted_damage',
      damage: 4,
      affectsUnits: true,
      affectsHeroes: true,
    },
  },
]

// Spell Cards - Blue (Control/AOE spells)
export const blueSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'spell-blue-1',
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
    id: 'spell-blue-2',
    name: 'Frost Wave',
    description: 'Damage all units',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 4,
    effect: {
      type: 'all_units_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: false,
    },
  },
  {
    id: 'spell-blue-3',
    name: 'Void Storm',
    description: 'Destroy all units and heroes',
    cardType: 'spell',
    colors: ['blue'],
    manaCost: 6,
    effect: {
      type: 'board_wipe',
      affectsUnits: true,
      affectsHeroes: true,
      affectsOwnUnits: true,
      affectsEnemyUnits: true,
    },
  },
]

// Helper to create hero from test deck template
function createHeroFromTestDeck(
  template: Omit<Hero, 'location' | 'owner'>,
  owner: 'player1' | 'player2',
  location: 'hand' | 'base' = 'base'
): Hero {
  return {
    ...template,
    id: `${template.id}-${owner}-${Date.now()}-${Math.random()}`,
    location,
    owner,
    equippedItems: [],
  }
}

// Initial game state with test deck heroes ready for deployment
export function createInitialGameState(): {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  battlefieldA: { player1: Card[], player2: Card[] }
  battlefieldB: { player1: Card[], player2: Card[] }
  metadata: GameMetadata
} {
  // Player 1: First 2 heroes ready to deploy on turn 1 (can move freely)
  const player1AllHeroes = warriorTestDeckHeroes.map(hero => 
    createHeroFromTestDeck(hero, 'player1', 'base')
  )
  const player1ReadyToDeploy = player1AllHeroes.slice(0, 2) // First 2 heroes in base, ready to deploy
  const player1RemainingHeroes = player1AllHeroes.slice(2) // Last 2 heroes also in base, but not deployed yet
  
  // Player 2: First 2 heroes ready to deploy on turn 1 (can move freely)
  const player2AllHeroes = mageTestDeckHeroes.map(hero => 
    createHeroFromTestDeck(hero, 'player2', 'base')
  )
  const player2ReadyToDeploy = player2AllHeroes.slice(0, 2) // First 2 heroes in base, ready to deploy
  const player2RemainingHeroes = player2AllHeroes.slice(2) // Last 2 heroes also in base, but not deployed yet

  // Create some starting cards for hands (mix of signature cards and generics)
  // Player 1: Start with 2 RW signature cards and 1 aggro generic
  const player1HandCards: BaseCard[] = [
    rwWarriorSignatureCards[0],
    rwBerserkerSignatureCards[0],
    rwAggroGenericCards[0],
  ]
  const player1Hand = player1HandCards.map(card => createCardFromTemplate({
    id: card.id,
    name: card.name,
    description: card.description,
    cardType: card.cardType,
    manaCost: card.manaCost,
    colors: card.colors,
  }, 'player1', 'hand'))

  // Player 2: Start with 2 UB signature cards and 1 control generic
  const player2HandCards: BaseCard[] = [
    ubMageSignatureCards[0],
    ubSorcererSignatureCards[0],
    ubControlGenericCards[0],
  ]
  const player2Hand = player2HandCards.map(card => createCardFromTemplate({
    id: card.id,
    name: card.name,
    description: card.description,
    cardType: card.cardType,
    manaCost: card.manaCost,
    colors: card.colors,
  }, 'player2', 'hand'))

  const metadata: GameMetadata = {
    currentTurn: 1,
    activePlayer: 'player1',
    currentPhase: 'play', // Both players can deploy during play phase on turn 1
    player1Gold: STARTING_GOLD,
    player2Gold: STARTING_GOLD,
    player1Mana: 3, // Starting mana
    player2Mana: 3,
    player1MaxMana: 3, // Starting max mana
    player2MaxMana: 3,
    player1NexusHP: NEXUS_HP,
    player2NexusHP: NEXUS_HP,
    towerA_HP: TOWER_HP,
    towerB_HP: TOWER_HP,
    player1Tier: 1,
    player2Tier: 1,
    deathCooldowns: {}, // Track cards that died (1 round cooldown) - Record<cardId, turnDied>
    player1MovedToBase: false, // Track if player 1 moved a hero to base this turn
    player2MovedToBase: false, // Track if player 2 moved a hero to base this turn
    playedSpells: {}, // Track spells that have been played (for toggle X overlay) - Record<spellId, true>
  }

  return {
    player1Hand: player1Hand,
    player2Hand: player2Hand,
    player1Base: [...player1ReadyToDeploy, ...player1RemainingHeroes], // All 4 heroes in base (first 2 ready to deploy on turn 1)
    player2Base: [...player2ReadyToDeploy, ...player2RemainingHeroes], // All 4 heroes in base (first 2 ready to deploy on turn 1)
    battlefieldA: { player1: [], player2: [] },
    battlefieldB: { player1: [], player2: [] },
    metadata,
  }
}

// Helper to get deployed heroes for turn 1 (2 per player)
export function getInitialDeployedHeroes(): {
  player1Deployed: Hero[]
  player2Deployed: Hero[]
} {
  const player1Deployed = warriorTestDeckHeroes.slice(0, 2).map(hero =>
    createHeroFromTestDeck(hero, 'player1', 'base')
  )
  const player2Deployed = mageTestDeckHeroes.slice(0, 2).map(hero =>
    createHeroFromTestDeck(hero, 'player2', 'base')
  )
  
  return { player1Deployed, player2Deployed }
}
