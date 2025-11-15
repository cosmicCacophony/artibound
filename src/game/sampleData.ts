import { Hero, SignatureCard, HybridCard, GenericUnit, Card, BaseCard } from './types'

// Hero definitions (templates for the library)
export const heroTemplates: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'hero-warrior',
    name: 'Warrior',
    description: 'A fierce melee fighter',
    cardType: 'hero',
    attack: 5,
    health: 10,
    supportEffect: 'Allies gain +1 attack',
    signatureCardIds: ['sig-warrior-1', 'sig-warrior-2'],
  },
  {
    id: 'hero-mage',
    name: 'Mage',
    description: 'Master of arcane magic',
    cardType: 'hero',
    attack: 4,
    health: 6,
    supportEffect: 'Draw an extra card each turn',
    signatureCardIds: ['sig-mage-1', 'sig-mage-2'],
  },
  {
    id: 'hero-healer',
    name: 'Healer',
    description: 'Provides support and healing',
    cardType: 'hero',
    attack: 2,
    health: 8,
    supportEffect: 'Heal allies 2 HP each turn',
    signatureCardIds: ['sig-healer-1', 'sig-healer-2'],
  },
  {
    id: 'hero-archer',
    name: 'Archer',
    description: 'Long-range specialist',
    cardType: 'hero',
    attack: 6,
    health: 7,
    supportEffect: 'Range attacks ignore first defense',
    signatureCardIds: ['sig-archer-1', 'sig-archer-2'],
  },
  {
    id: 'hero-guardian',
    name: 'Guardian',
    description: 'Defensive powerhouse',
    cardType: 'hero',
    attack: 3,
    health: 12,
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
    baseBuff: 'Battlefield units gain +1 attack',
  },
  {
    id: 'hybrid-scout',
    name: 'Field Scout',
    description: 'Reconnaissance expert',
    cardType: 'hybrid',
    attack: 3,
    health: 3,
    baseBuff: 'See enemy hand size',
  },
  {
    id: 'hybrid-engineer',
    name: 'Battle Engineer',
    description: 'Repairs and upgrades',
    cardType: 'hybrid',
    attack: 2,
    health: 4,
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
  },
  {
    id: 'generic-soldier-2',
    name: 'Foot Soldier',
    description: 'Basic infantry unit',
    cardType: 'generic',
    attack: 2,
    health: 2,
  },
  {
    id: 'generic-knight-1',
    name: 'Knight',
    description: 'Armored warrior',
    cardType: 'generic',
    attack: 3,
    health: 4,
  },
  {
    id: 'generic-knight-2',
    name: 'Knight',
    description: 'Armored warrior',
    cardType: 'generic',
    attack: 3,
    health: 4,
  },
  {
    id: 'generic-spearman-1',
    name: 'Spearman',
    description: 'Defensive fighter',
    cardType: 'generic',
    attack: 1,
    health: 3,
  },
  {
    id: 'generic-spearman-2',
    name: 'Spearman',
    description: 'Defensive fighter',
    cardType: 'generic',
    attack: 1,
    health: 3,
  },
]

// Create card library (all available cards for sidebar)
export function createCardLibrary(): BaseCard[] {
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
  }

  if (template.cardType === 'hero') {
    const heroTemplate = template as unknown as Omit<Hero, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...heroTemplate,
    } as Hero
  } else if (template.cardType === 'signature') {
    const sigTemplate = template as unknown as Omit<SignatureCard, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...sigTemplate,
    } as SignatureCard
  } else if (template.cardType === 'hybrid') {
    const hybridTemplate = template as unknown as Omit<HybridCard, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType'>
    return {
      ...base,
      ...hybridTemplate,
    } as HybridCard
  } else {
    const genTemplate = template as unknown as Omit<GenericUnit, 'location' | 'owner' | 'id' | 'name' | 'description' | 'cardType' | 'stackedWith' | 'stackPower' | 'stackHealth'>
    return {
      ...base,
      ...genTemplate,
    } as GenericUnit
  }
}

// Initial game state with default heroes for both players
export function createInitialGameState(): {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  battlefieldA: { player1: Card[], player2: Card[] }
  battlefieldB: { player1: Card[], player2: Card[] }
} {
  // Give each player 2 starting heroes
  const player1Hero1 = createCardFromTemplate(heroTemplates[0], 'player1', 'hand')
  const player1Hero2 = createCardFromTemplate(heroTemplates[1], 'player1', 'hand')
  
  const player2Hero1 = createCardFromTemplate(heroTemplates[2], 'player2', 'hand')
  const player2Hero2 = createCardFromTemplate(heroTemplates[3], 'player2', 'hand')

  return {
    player1Hand: [player1Hero1, player1Hero2],
    player2Hand: [player2Hero1, player2Hero2],
    player1Base: [],
    player2Base: [],
    battlefieldA: { player1: [], player2: [] },
    battlefieldB: { player1: [], player2: [] },
  }
}
