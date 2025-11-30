import { Hero, SignatureCard, HybridCard, GenericUnit, Card, BaseCard, Item, GameMetadata, TOWER_HP, NEXUS_HP, STARTING_GOLD, BattlefieldDefinition, SpellCard, SpellEffect, BattlefieldBuff, BattlefieldId, BattlefieldBuffEffectType } from './types'
import { allCards, allSpells } from './cardData'

// Item definitions
export const tier1Items: Item[] = [
  // Basic items
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
  // Artifact Foundry items - Simple stat boosts
  {
    id: 'item-broadsword',
    name: 'Broadsword',
    description: '+6 Attack',
    cost: 15,
    tier: 2,
    attackBonus: 6,
  },
  {
    id: 'item-ring-tarrasque',
    name: 'Ring of Tarrasque',
    description: '+3 Attack, +3 HP, Regeneration',
    cost: 12,
    tier: 2,
    attackBonus: 3,
    hpBonus: 3,
    specialEffects: ['regeneration'],
  },
  {
    id: 'item-stonehall-cloak',
    name: 'Stonehall Cloak',
    description: '+3 HP, Increase max HP by 1',
    cost: 8,
    tier: 1,
    hpBonus: 3,
  },
  {
    id: 'item-red-mist-maul',
    name: 'Red Mist Maul',
    description: '+2 Attack, +3 HP, Siege',
    cost: 10,
    tier: 1,
    attackBonus: 2,
    hpBonus: 3,
    specialEffects: ['siege'],
  },
  {
    id: 'item-blade-vigil',
    name: 'Blade of the Vigil',
    description: '+5 Attack, Cleave',
    cost: 12,
    tier: 2,
    attackBonus: 5,
    specialEffects: ['cleave'],
  },
  {
    id: 'item-barbed-mail',
    name: 'Barbed Mail',
    description: '+1 Attack, +2 HP, Retaliate, Taunt',
    cost: 7,
    tier: 1,
    attackBonus: 1,
    hpBonus: 2,
    specialEffects: ['retaliate', 'taunt'],
  },
  {
    id: 'item-demagicking-maul',
    name: 'Demagicking Maul',
    description: '+2 Attack. When equipped hero deals damage to a tower, dispel a random tower enchantment.',
    cost: 9,
    tier: 1,
    attackBonus: 2,
  },
  // Artifact Foundry items - With activated abilities (description only for now)
  {
    id: 'item-blink-dagger',
    name: 'Blink Dagger',
    description: '+2 HP. Activated: Move this hero to a slot in an adjacent lane.',
    cost: 6,
    tier: 1,
    hpBonus: 2,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Move this hero to a slot in an adjacent lane.',
  },
  {
    id: 'item-phase-boots',
    name: 'Phase Boots',
    description: '+3 HP. Activated: Swap this hero to another slot.',
    cost: 7,
    tier: 1,
    hpBonus: 3,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Swap this hero to another slot.',
  },
  {
    id: 'item-keenfolk-musket',
    name: 'Keenfolk Musket',
    description: '+2 Attack. Activated: Deal 2 damage to a unit.',
    cost: 5,
    tier: 1,
    attackBonus: 2,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Deal 2 damage to a unit.',
  },
  {
    id: 'item-assassins-veil',
    name: "Assassin's Veil",
    description: '+3 HP. Activated: Choose a combat target for equipped hero.',
    cost: 6,
    tier: 1,
    hpBonus: 3,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Choose a combat target for equipped hero.',
  },
  {
    id: 'item-helm-dominator',
    name: 'Helm of the Dominator',
    description: '+2 Attack. Activated: Steal an enemy unit.',
    cost: 10,
    tier: 2,
    attackBonus: 2,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Steal an enemy unit.',
  },
  {
    id: 'item-bracers-sacrifice',
    name: 'Bracers of Sacrifice',
    description: '+1 Attack, +2 HP. Activated: Slay this hero and deal 4 damage to adjacent enemies.',
    cost: 8,
    tier: 1,
    attackBonus: 1,
    hpBonus: 2,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Slay this hero and deal 4 damage to adjacent enemies.',
  },
  {
    id: 'item-golden-ticket',
    name: 'Golden Ticket',
    description: 'Get a random item at your shop level. It costs 0 Mana.',
    cost: 12,
    tier: 2,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'Get a random item at your shop level. It costs 0 Mana.',
  },
  // Counterplay Items - Anti-Creep
  {
    id: 'item-cleave-axe',
    name: 'Cleave Axe',
    description: '+3 Attack, +2 HP. Cleave (damages adjacent units).',
    cost: 10,
    tier: 1,
    attackBonus: 3,
    hpBonus: 2,
    specialEffects: ['cleave'],
  },
  {
    id: 'item-chainmail',
    name: 'Chainmail',
    description: '+1 Attack, +4 HP. Retaliate (deals damage back when attacked).',
    cost: 8,
    tier: 1,
    attackBonus: 1,
    hpBonus: 4,
    specialEffects: ['retaliate'],
  },
  {
    id: 'item-siege-engine',
    name: 'Siege Engine',
    description: '+2 Attack, +3 HP. Siege (can attack towers directly).',
    cost: 12,
    tier: 1,
    attackBonus: 2,
    hpBonus: 3,
    specialEffects: ['siege'],
  },
  // Counterplay Items - Anti-Hero
  {
    id: 'item-mortreds-dagger',
    name: "Mortred's Dagger",
    description: '+4 Attack. When this hero attacks, deal 4 damage to target enemy hero. (Cooldown: 3 turns)',
    cost: 30,
    tier: 2,
    attackBonus: 4,
    hasActivatedAbility: true,
    activatedAbilityDescription: 'When this hero attacks, deal 4 damage to target enemy hero. (Cooldown: 3 turns)',
  },
  {
    id: 'item-executioners-blade',
    name: "Executioner's Blade",
    description: '+5 Attack. Bonus +3 damage when attacking heroes.',
    cost: 15,
    tier: 2,
    attackBonus: 5,
    specialEffects: ['bonus_vs_heroes'], // +3 damage vs heroes
  },
]

// Battlefield Buff definitions (templates - will be instantiated with playerId and battlefieldId)
export const battlefieldBuffTemplates: Omit<BattlefieldBuff, 'id' | 'battlefieldId' | 'playerId'>[] = [
  // Generic battlefield buffs
  {
    name: 'Combat Training',
    description: '+1/+1 to your units in this battlefield',
    cost: 6,
    effectType: 'combat',
    effectValue: 1,
  },
  {
    name: 'Spell Amplification',
    description: 'Your spells deal +1 damage in this battlefield',
    cost: 7,
    effectType: 'spell',
    effectValue: 1,
  },
  {
    name: 'Mana Efficiency',
    description: 'Your units cost -1 mana in this battlefield',
    cost: 8,
    effectType: 'mana',
    effectValue: 1,
  },
  {
    name: 'Tower Fortification',
    description: 'Your tower takes -1 damage in this battlefield',
    cost: 5,
    effectType: 'tower',
    effectValue: 1,
  },
  {
    name: 'Gold Mine',
    description: '+1 gold per turn when you control this battlefield',
    cost: 10,
    effectType: 'gold',
    effectValue: 1,
  },
  // RW (Red/White) Archetype Battlefield Upgrades
  {
    name: 'War Banner',
    description: 'All your units in this battlefield have +1 Attack',
    cost: 6,
    effectType: 'unit_power',
    effectValue: 1,
  },
  {
    name: 'Honor Memorial',
    description: 'When a unit dies here, add a counter. Remove 3 counters to draw a card.',
    cost: 8,
    effectType: 'death_counter',
    effectValue: 3, // Number of counters needed to draw a card
  },
  // UB (Blue/Black) Archetype Battlefield Upgrades
  {
    name: 'Arcane Focus',
    description: 'Your spells deal +1 additional damage in this battlefield',
    cost: 7,
    effectType: 'spell',
    effectValue: 1,
  },
  {
    name: 'Rapid Deployment',
    description: 'Your heroes have Quick Deploy: No cooldown when dying. They can immediately deploy from base the following turn.',
    cost: 9,
    effectType: 'quick_deploy',
    effectValue: 1,
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
    signatureCardId: 'sig-warrior-1',
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
    signatureCardId: 'sig-mage-1',
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
    signatureCardId: 'sig-healer-1',
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
    signatureCardId: 'sig-archer-1',
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
    signatureCardId: 'sig-guardian-1',
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

// Create card library - now includes all cards from comprehensive data
// Both players get access to all cards for testing and editing
export function createCardLibrary(player: 'player1' | 'player2'): (BaseCard & Partial<{ effect: SpellEffect, initiative?: boolean }>)[] {
  // Both players get all cards for comprehensive testing
  const allCardsBase: BaseCard[] = [
    ...allCards,
    ...allSpells,
  ]
  
  return allCardsBase.map(card => {
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

  // Handle spell cards - check comprehensive data first, then test deck data
  if (template.cardType === 'spell') {
    // Check if template already has spell properties (from comprehensive data)
    if ('effect' in template && template.effect) {
      return {
        ...base,
        effect: (template as any).effect,
        initiative: (template as any).initiative,
        colors: template.colors,
      } as SpellCard
    }
    // Fallback to test deck spells
    const allTestSpells = [...blackSpells, ...blueSpells, ...redWhiteSpells]
    const spellCard = allTestSpells.find(c => c.id === template.id)
    if (spellCard) {
      return {
        ...base,
        effect: spellCard.effect,
        initiative: spellCard.initiative,
        colors: spellCard.colors,
      } as SpellCard
    }
  }

  // Handle heroes - template should already have all properties
  if (template.cardType === 'hero') {
    const heroTemplate = template as unknown as Omit<Hero, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...heroTemplate,
      maxHealth: heroTemplate.maxHealth || heroTemplate.health,
      currentHealth: heroTemplate.currentHealth !== undefined ? heroTemplate.currentHealth : (heroTemplate.maxHealth || heroTemplate.health),
      equippedItems: heroTemplate.equippedItems || [],
    } as Hero
  }

  // Handle generic/signature/hybrid cards - template should already have all properties
  if (template.cardType === 'generic' || template.cardType === 'signature' || template.cardType === 'hybrid') {
    // Check if template has unit properties (attack, health) - from comprehensive data
    if ('attack' in template && 'health' in template) {
      const { id, name, description, cardType, manaCost, ...stats } = template as any
      if (template.cardType === 'signature') {
        return {
          ...base,
          ...stats,
          colors: template.colors,
        } as SignatureCard
      } else if (template.cardType === 'hybrid') {
        return {
          ...base,
          ...stats,
          colors: template.colors,
        } as HybridCard
      } else {
        return {
          ...base,
          ...stats,
          colors: template.colors,
        } as GenericUnit
      }
    }
    
    // Fallback to test deck cards (for backwards compatibility)
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
  }

  // Final fallback - use template directly with type-specific handling
  if (template.cardType === 'signature') {
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
    // Generic unit - template should have attack/health
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
    signatureCardId: 'rw-sig-warrior-1',
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
    signatureCardId: 'rw-sig-berserker-1',
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
    signatureCardId: 'rw-sig-champion-1',
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
    signatureCardId: 'rw-sig-paladin-1',
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
    signatureCardId: 'ub-sig-mage-1',
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
    signatureCardId: 'ub-sig-sorcerer-1',
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
    signatureCardId: 'ub-sig-archmage-1',
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
    signatureCardId: 'ub-sig-necromancer-1',
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
  player1Battlefields?: BattlefieldDefinition[]
  player2Battlefields?: BattlefieldDefinition[]
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
    towerA_player1_HP: TOWER_HP,
    towerA_player2_HP: TOWER_HP,
    towerB_player1_HP: TOWER_HP,
    towerB_player2_HP: TOWER_HP,
    player1Tier: 1,
    player2Tier: 1,
    deathCooldowns: {}, // Track hero death cooldowns - Record<cardId, counter> (starts at 2, decreases by 1 each turn)
    player1MovedToBase: false, // Track if player 1 moved a hero to base this turn
    player2MovedToBase: false, // Track if player 2 moved a hero to base this turn
    playedSpells: {}, // Track cards that have been played (for toggle X overlay) - Record<cardId, true> (works for any card type)
    player1BattlefieldBuffs: [], // Permanent battlefield upgrades for player 1
    player2BattlefieldBuffs: [], // Permanent battlefield upgrades for player 2
    battlefieldDeathCounters: {}, // Track death counters for RW-bf2 (death counter -> draw card) - Record<"player-battlefield", count>
    initiativePlayer: 'player1', // Player 1 starts with initiative
    heroAbilityCooldowns: {}, // Track hero ability cooldowns - Record<heroId, turnLastUsed>
    player1Passed: false, // Track if player 1 has passed this turn
    player2Passed: false, // Track if player 2 has passed this turn
    turn1DeploymentPhase: 'initial', // Turn 1 deployment phase: initial -> playerB -> secret -> complete
  }

  // Hardcoded battlefields for RW vs UB testing
  // RW (Player 1): Training Grounds + War Camp
  const player1Battlefields: BattlefieldDefinition[] = [
    {
      id: 'battlefield-rw-wide',
      name: 'Training Grounds',
      description: 'RW battlefield - supports go wide',
      colors: ['red', 'white'],
      staticAbility: 'You can deploy 5 units instead of 4',
      staticAbilityId: 'sixth-slot',
    },
    {
      id: 'battlefield-rw-war-camp',
      name: 'War Camp',
      description: 'RW battlefield - aggressive combat',
      colors: ['red', 'white'],
      staticAbility: 'All your units have +1/+0',
      staticAbilityId: 'unit-power-buff',
    },
  ]

  // UB (Player 2): Arcane Nexus + Shadow Library
  const player2Battlefields: BattlefieldDefinition[] = [
    {
      id: 'battlefield-ru-spells',
      name: 'Arcane Nexus',
      description: 'RU battlefield - spell focus',
      colors: ['red', 'blue'],
      staticAbility: 'Your spells deal +1 damage',
      staticAbilityId: 'spell-damage-buff',
    },
    {
      id: 'battlefield-ub-shadow-library',
      name: 'Shadow Library',
      description: 'UB battlefield - spell card advantage',
      colors: ['blue', 'black'],
      staticAbility: 'When you cast a spell, draw a card',
      staticAbilityId: 'spell-draw',
    },
  ]

  return {
    player1Hand: player1Hand,
    player2Hand: player2Hand,
    player1Base: [...player1ReadyToDeploy, ...player1RemainingHeroes], // All 4 heroes in base (first 2 ready to deploy on turn 1)
    player2Base: [...player2ReadyToDeploy, ...player2RemainingHeroes], // All 4 heroes in base (first 2 ready to deploy on turn 1)
    battlefieldA: { player1: [], player2: [] },
    battlefieldB: { player1: [], player2: [] },
    metadata,
    player1Battlefields,
    player2Battlefields,
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

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Create game state from draft selections
export function createGameStateFromDraft(
  player1Selection: { heroes: Hero[], cards: BaseCard[], battlefield: BattlefieldDefinition },
  player2Selection: { heroes: Hero[], cards: BaseCard[], battlefield: BattlefieldDefinition }
): {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  battlefieldA: { player1: Card[], player2: Card[] }
  battlefieldB: { player1: Card[], player2: Card[] }
  cardLibrary: BaseCard[]
  player1Library: BaseCard[]
  player2Library: BaseCard[]
  metadata: GameMetadata
  player1Battlefields?: BattlefieldDefinition[]
  player2Battlefields?: BattlefieldDefinition[]
} {
  // Create heroes in base for each player (all 4 heroes)
  const player1Heroes = player1Selection.heroes.map(hero => {
    return createCardFromTemplate(hero, 'player1', 'base') as Hero
  })
  const player2Heroes = player2Selection.heroes.map(hero => {
    return createCardFromTemplate(hero, 'player2', 'base') as Hero
  })

  // Shuffle cards and select 4 random cards for each hand
  const player1ShuffledCards = shuffleArray([...player1Selection.cards])
  const player2ShuffledCards = shuffleArray([...player2Selection.cards])
  
  const player1HandCards = player1ShuffledCards.slice(0, 4)
  const player1LibraryCards = player1ShuffledCards.slice(4)
  
  const player2HandCards = player2ShuffledCards.slice(0, 4)
  const player2LibraryCards = player2ShuffledCards.slice(4)

  // Create card instances for hands
  const player1Hand = player1HandCards.map(card => 
    createCardFromTemplate(card, 'player1', 'hand')
  )
  const player2Hand = player2HandCards.map(card => 
    createCardFromTemplate(card, 'player2', 'hand')
  )

  // Initialize metadata
  const metadata: GameMetadata = {
    currentTurn: 1,
    activePlayer: 'player1',
    currentPhase: 'play',
    player1Gold: STARTING_GOLD,
    player2Gold: STARTING_GOLD,
    player1Mana: 3, // Starting mana
    player2Mana: 3,
    player1MaxMana: 3, // Starting max mana
    player2MaxMana: 3,
    player1NexusHP: NEXUS_HP,
    player2NexusHP: NEXUS_HP,
    towerA_player1_HP: TOWER_HP,
    towerA_player2_HP: TOWER_HP,
    towerB_player1_HP: TOWER_HP,
    towerB_player2_HP: TOWER_HP,
    player1Tier: 1,
    player2Tier: 1,
    deathCooldowns: {},
    player1MovedToBase: false,
    player2MovedToBase: false,
    playedSpells: {},
    player1BattlefieldBuffs: [],
    player2BattlefieldBuffs: [],
    battlefieldDeathCounters: {}, // Track death counters for RW-bf2 (death counter -> draw card) - Record<"player-battlefield", count>
    initiativePlayer: 'player1', // Player 1 starts with initiative
    heroAbilityCooldowns: {}, // Track hero ability cooldowns - Record<heroId, turnLastUsed>
    player1Passed: false, // Track if player 1 has passed this turn
    player2Passed: false, // Track if player 2 has passed this turn
    turn1DeploymentPhase: 'initial', // Turn 1 deployment phase: initial -> playerB -> secret -> complete
  }

  // Helper to detect archetype from heroes
  const detectArchetype = (heroes: Hero[]): 'rw-legion' | 'ub-control' | 'ubg-control' => {
    if (heroes.length === 0) return 'rw-legion' // Default
    
    // Count colors across all heroes
    const allColors = new Set<string>()
    heroes.forEach(h => {
      (h.colors || []).forEach(c => allColors.add(c))
    })
    
    const hasRed = allColors.has('red')
    const hasWhite = allColors.has('white')
    const hasBlue = allColors.has('blue')
    const hasBlack = allColors.has('black')
    const hasGreen = allColors.has('green')
    
    // RW: has red or white, but NOT green, blue, or black
    const isRW = (hasRed || hasWhite) && !hasGreen && !hasBlue && !hasBlack
    
    // UB: has blue or black, but NOT green, red, or white
    const isUB = (hasBlue || hasBlack) && !hasGreen && !hasRed && !hasWhite
    
    // UBG: has blue, black, or green, but NOT red or white
    const isUBG = (hasBlue || hasBlack || hasGreen) && !hasRed && !hasWhite
    
    if (isRW) return 'rw-legion'
    if (isUBG) return 'ubg-control'
    if (isUB) return 'ub-control'
    
    // Fallback: check first hero
    const firstHeroColors = heroes[0]?.colors || []
    if (firstHeroColors.includes('red') || firstHeroColors.includes('white')) {
      return 'rw-legion'
    }
    if (firstHeroColors.includes('green')) {
      return 'ubg-control'
    }
    return 'ub-control'
  }

  // Detect archetypes
  const player1Archetype = detectArchetype(player1Selection.heroes)
  const player2Archetype = detectArchetype(player2Selection.heroes)

  // RW Battlefields
  const rwBattlefields: BattlefieldDefinition[] = [
    {
      id: 'battlefield-rw-wide',
      name: 'Training Grounds',
      description: 'RW battlefield - supports go wide',
      colors: ['red', 'white'],
      staticAbility: 'You can deploy 5 units instead of 4',
      staticAbilityId: 'sixth-slot',
    },
    {
      id: 'battlefield-rw-war-camp',
      name: 'War Camp',
      description: 'RW battlefield - aggressive combat',
      colors: ['red', 'white'],
      staticAbility: 'All your units have +1/+0',
      staticAbilityId: 'unit-power-buff',
    },
  ]

  // UB Battlefields (also used for UBG)
  const ubBattlefields: BattlefieldDefinition[] = [
    {
      id: 'battlefield-ru-spells',
      name: 'Arcane Nexus',
      description: 'RU battlefield - spell focus',
      colors: ['red', 'blue'],
      staticAbility: 'Your spells deal +1 damage',
      staticAbilityId: 'spell-damage-buff',
    },
    {
      id: 'battlefield-ub-shadow-library',
      name: 'Shadow Library',
      description: 'UB battlefield - spell card advantage',
      colors: ['blue', 'black'],
      staticAbility: 'When you cast a spell, draw a card',
      staticAbilityId: 'spell-draw',
    },
  ]

  // Always assign hardcoded battlefields based on detected archetype
  // RW always gets Training Grounds + War Camp (2 battlefields)
  // UB/UBG always gets Arcane Nexus + Shadow Library (2 battlefields)
  const player1Battlefields = player1Archetype === 'rw-legion' ? rwBattlefields : ubBattlefields
  const player2Battlefields = player2Archetype === 'rw-legion' ? rwBattlefields : ubBattlefields

  return {
    player1Hand,
    player2Hand,
    player1Base: player1Heroes,
    player2Base: player2Heroes,
    battlefieldA: { player1: [], player2: [] },
    battlefieldB: { player1: [], player2: [] },
    cardLibrary: [], // Card library is managed separately via player1SidebarCards/player2SidebarCards
    player1Library: player1LibraryCards,
    player2Library: player2LibraryCards,
    metadata,
    player1Battlefields,
    player2Battlefields,
  }
}
