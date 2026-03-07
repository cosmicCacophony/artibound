import { Hero, GenericUnit, SpellCard, Card, GameMetadata, RunePool, RuneColor, RuneScalingTier, TOWER_HP, NEXUS_HP, STARTING_GOLD } from './types'

// ============================================================================
// BR DECK — Aggressive / Removal
// Heroes: 2 Red, 2 Black — all with simple passive lane bonuses
// ============================================================================

export const brPrototypeHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'proto-br-flame-captain',
    name: 'Flame Captain',
    description: 'Lane creatures get +1 attack when attacking.',
    cardType: 'hero',
    colors: ['red'],
    attack: 4,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Lane creatures get +1 attack',
    equippedItems: [],
  },
  {
    id: 'proto-br-ember-tactician',
    name: 'Ember Tactician',
    description: 'First spell in this lane each turn costs 1 less mana.',
    cardType: 'hero',
    colors: ['red'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'First spell costs 1 less',
    equippedItems: [],
  },
  {
    id: 'proto-br-blood-broker',
    name: 'Blood Broker',
    description: 'When a creature dies in this lane, heal your tower 1.',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: 'Creature death heals tower 1',
    equippedItems: [],
  },
  {
    id: 'proto-br-grave-raider',
    name: 'Grave Raider',
    description: 'Creatures in this lane get +1 attack if lane has 2+ runes.',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: '+1 attack if 2+ lane runes',
    equippedItems: [],
  },
]

// BR Cards — 4 types, designed around R/RR/RRB/RRR thresholds
export const brPrototypeCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'proto-br-berserker',
    name: 'Berserker',
    description: '2/2. Scales: R→3/2, RR→4/2, RRB→5/3.',
    cardType: 'generic',
    colors: [],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    runeScaling: [
      { runeRequirement: ['red'], attackBonus: 1, description: '3/2' },
      { runeRequirement: ['red', 'red'], attackBonus: 2, description: '4/2' },
      { runeRequirement: ['red', 'red', 'black'], attackBonus: 3, healthBonus: 1, description: '5/3' },
    ],
  },
  {
    id: 'proto-br-ragebound',
    name: 'Ragebound',
    description: '1/1. Cheap aggro. Scales: R→2/1, RR→3/2, RRR→4/3.',
    cardType: 'generic',
    colors: [],
    manaCost: 1,
    attack: 1,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    runeScaling: [
      { runeRequirement: ['red'], attackBonus: 1, description: '2/1' },
      { runeRequirement: ['red', 'red'], attackBonus: 2, healthBonus: 1, description: '3/2' },
      { runeRequirement: ['red', 'red', 'red'], attackBonus: 3, healthBonus: 2, description: '4/3' },
    ],
  },
]

export const brPrototypeSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'proto-br-blood-bolt',
    name: 'Blood Bolt',
    description: 'Deal 2 damage. Scales: RR→4, RRB→5+draw, RRR→8.',
    cardType: 'spell',
    colors: [],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 2,
      affectsUnits: true,
      affectsHeroes: true,
    },
    runeScaling: [
      { runeRequirement: ['red', 'red'], damageBonus: 2, description: 'Deal 4 damage' },
      { runeRequirement: ['red', 'red', 'black'], damageBonus: 3, drawCards: 1, description: 'Deal 5 damage, draw 1' },
      { runeRequirement: ['red', 'red', 'red'], damageBonus: 6, description: 'Deal 8 damage' },
    ],
  },
  {
    id: 'proto-br-scorch',
    name: 'Scorch',
    description: 'Deal 1 damage. Scales: R→2, RR→3+tower, RRB→5.',
    cardType: 'spell',
    colors: [],
    manaCost: 1,
    effect: {
      type: 'targeted_damage',
      damage: 1,
      affectsUnits: true,
      affectsHeroes: true,
    },
    runeScaling: [
      { runeRequirement: ['red'], damageBonus: 1, description: 'Deal 2 damage' },
      { runeRequirement: ['red', 'red'], damageBonus: 2, healTower: -1, description: 'Deal 3 damage, 1 to tower' },
      { runeRequirement: ['red', 'red', 'black'], damageBonus: 4, description: 'Deal 5 damage' },
    ],
  },
]

// ============================================================================
// GWu DECK — Control / Scaling
// Heroes: 2 Green, 1 White, 1 Blue — simple passive lane bonuses
// ============================================================================

export const gwuPrototypeHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  {
    id: 'proto-gwu-rune-druid',
    name: 'Rune Druid',
    description: 'If this lane has 2+ runes, creatures gain +1/+1.',
    cardType: 'hero',
    colors: ['green'],
    attack: 2,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    supportEffect: '+1/+1 if 2+ lane runes',
    equippedItems: [],
  },
  {
    id: 'proto-gwu-ancient-warden',
    name: 'Ancient Warden',
    description: 'Creatures played in this lane enter with +1 health.',
    cardType: 'hero',
    colors: ['green'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    supportEffect: 'Creatures enter with +1 health',
    equippedItems: [],
  },
  {
    id: 'proto-gwu-shield-marshal',
    name: 'Shield Marshal',
    description: 'Once per turn, prevent 1 damage to a creature in this lane.',
    cardType: 'hero',
    colors: ['white'],
    attack: 2,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    supportEffect: 'Prevent 1 damage/turn',
    equippedItems: [],
  },
  {
    id: 'proto-gwu-archmage-tides',
    name: 'Archmage of the Tides',
    description: 'If this lane has 3 runes, spells cast here draw 1 card.',
    cardType: 'hero',
    colors: ['blue'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    supportEffect: 'Spells draw 1 at 3 runes',
    equippedItems: [],
  },
]

// GWu Cards — 4 types, designed around G/GW/GGW/GWU thresholds
export const gwuPrototypeCards: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'proto-gwu-guardian',
    name: 'Guardian',
    description: '2/3. Scales: G→3/3, GW→3/4, GGW→4/5.',
    cardType: 'generic',
    colors: [],
    manaCost: 2,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    runeScaling: [
      { runeRequirement: ['green'], attackBonus: 1, description: '3/3' },
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, description: '3/4' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 2, description: '4/5' },
    ],
  },
  {
    id: 'proto-gwu-ancient-hydra',
    name: 'Ancient Hydra',
    description: '3/3. Finisher. Scales: GW→4/4, GGW→5/6, GWU→8/8.',
    cardType: 'generic',
    colors: [],
    manaCost: 4,
    attack: 3,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    runeScaling: [
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, description: '4/4' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 3, description: '5/6' },
      { runeRequirement: ['green', 'white', 'blue'], attackBonus: 5, healthBonus: 5, description: '8/8 finisher' },
    ],
  },
]

export const gwuPrototypeSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'proto-gwu-growth',
    name: 'Growth',
    description: 'Target +1/+1. Scales: G→+2/+2, GW→draw 1, GGW→all +2/+2.',
    cardType: 'spell',
    colors: [],
    manaCost: 2,
    effect: {
      type: 'targeted_damage',
      damage: 0,
      affectsUnits: true,
    },
    runeScaling: [
      { runeRequirement: ['green'], attackBonus: 1, healthBonus: 1, description: '+2/+2 to target' },
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, drawCards: 1, description: '+2/+2 + draw 1' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 2, description: 'All allies +2/+2' },
    ],
  },
  {
    id: 'proto-gwu-tidecall',
    name: 'Tidecall',
    description: 'Draw 1 card. Scales: G→draw 2, GW→draw 2+heal 2, GWU→draw 3+heal 4.',
    cardType: 'spell',
    colors: [],
    manaCost: 2,
    effect: {
      type: 'draw_and_heal',
      damage: 0,
      drawCount: 1,
    },
    runeScaling: [
      { runeRequirement: ['green'], drawCards: 1, description: 'Draw 2 total' },
      { runeRequirement: ['green', 'white'], drawCards: 1, healTower: 2, description: 'Draw 2, heal tower 2' },
      { runeRequirement: ['green', 'white', 'blue'], drawCards: 2, healTower: 4, description: 'Draw 3, heal tower 4' },
    ],
  },
]

// ============================================================================
// RUNE SCALING HELPERS
// ============================================================================

/**
 * Count runes in a lane by color.
 * Returns a map of color -> count.
 */
export function countRunesByColor(laneRunes: RuneColor[]): Record<RuneColor, number> {
  const counts: Record<string, number> = { red: 0, blue: 0, white: 0, black: 0, green: 0 }
  for (const rune of laneRunes) {
    counts[rune] = (counts[rune] || 0) + 1
  }
  return counts as Record<RuneColor, number>
}

/**
 * Check if a rune requirement is met by the lane's runes.
 * E.g., requirement ['red','red','black'] needs at least 2 red + 1 black.
 */
export function meetsRuneRequirement(laneRunes: RuneColor[], requirement: RuneColor[]): boolean {
  const available = countRunesByColor(laneRunes)
  const needed = countRunesByColor(requirement)
  for (const color of Object.keys(needed) as RuneColor[]) {
    if ((needed[color] || 0) > (available[color] || 0)) return false
  }
  return true
}

/**
 * Get the highest matching rune scaling tier for a card given the lane runes.
 * Returns the tier index (0-based) or -1 if no tier is met.
 * Tiers are checked from highest (last) to lowest (first).
 */
export function getActiveRuneScalingTier(
  runeScaling: RuneScalingTier[] | undefined,
  laneRunes: RuneColor[]
): number {
  if (!runeScaling || runeScaling.length === 0) return -1
  for (let i = runeScaling.length - 1; i >= 0; i--) {
    if (meetsRuneRequirement(laneRunes, runeScaling[i].runeRequirement)) return i
  }
  return -1
}

/**
 * Apply rune scaling to a unit card — returns modified attack/health.
 */
export function applyRuneScalingToUnit(
  card: { attack: number, health: number, maxHealth: number, currentHealth: number, runeScaling?: RuneScalingTier[] },
  laneRunes: RuneColor[]
): { attack: number, health: number, maxHealth: number, currentHealth: number, activeScalingDescription?: string } {
  const tierIndex = getActiveRuneScalingTier(card.runeScaling, laneRunes)
  if (tierIndex < 0) {
    return { attack: card.attack, health: card.health, maxHealth: card.maxHealth, currentHealth: card.currentHealth }
  }
  const tier = card.runeScaling![tierIndex]
  return {
    attack: card.attack + (tier.attackBonus || 0),
    health: card.health + (tier.healthBonus || 0),
    maxHealth: card.maxHealth + (tier.healthBonus || 0),
    currentHealth: card.currentHealth + (tier.healthBonus || 0),
    activeScalingDescription: tier.description,
  }
}

/**
 * Apply rune scaling to a spell — returns modified damage + bonus effects.
 */
export function applyRuneScalingToSpell(
  card: { effect: { damage?: number }, runeScaling?: RuneScalingTier[] },
  laneRunes: RuneColor[]
): { damage: number, drawCards: number, healTower: number, activeScalingDescription?: string } {
  const baseDamage = card.effect.damage || 0
  const tierIndex = getActiveRuneScalingTier(card.runeScaling, laneRunes)
  if (tierIndex < 0) {
    return { damage: baseDamage, drawCards: 0, healTower: 0 }
  }
  const tier = card.runeScaling![tierIndex]
  return {
    damage: baseDamage + (tier.damageBonus || 0),
    drawCards: tier.drawCards || 0,
    healTower: tier.healTower || 0,
    activeScalingDescription: tier.description,
  }
}

// ============================================================================
// PROTOTYPE GAME STATE CREATION
// ============================================================================

function createPrototypeHero(
  template: Omit<Hero, 'location' | 'owner'>,
  owner: 'player1' | 'player2',
  location: 'deployZone' | 'base',
  index: number
): Hero {
  return {
    ...template,
    id: `${template.id}-${owner}-${index}`,
    location,
    owner,
  }
}

function createPrototypeUnit(
  template: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>,
  owner: 'player1' | 'player2',
  location: 'hand' | 'base',
  copyIndex: number
): GenericUnit {
  return {
    ...template,
    id: `${template.id}-${owner}-copy${copyIndex}-${Date.now()}`,
    location,
    owner,
    stackedWith: undefined,
    stackPower: undefined,
    stackHealth: undefined,
  }
}

function createPrototypeSpell(
  template: Omit<SpellCard, 'location' | 'owner'>,
  owner: 'player1' | 'player2',
  location: 'hand' | 'base',
  copyIndex: number
): SpellCard {
  return {
    ...template,
    id: `${template.id}-${owner}-copy${copyIndex}-${Date.now()}`,
    location,
    owner,
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Create a simplified rune prototype game state.
 * P1 = BR deck (aggressive), P2 = GWu deck (control/scaling).
 * 4 heroes each, 4 card types × 4 copies = 16 cards each.
 * No AI, no boss, hotseat mode.
 */
export function createRunePrototypeGameState(): {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  player1DeployZone: Card[]
  player2DeployZone: Card[]
  battlefieldA: { player1: Card[], player2: Card[] }
  battlefieldB: { player1: Card[], player2: Card[] }
  metadata: GameMetadata
  player1Library: Card[]
  player2Library: Card[]
} {
  // Heroes: all start in deployZone
  const player1Heroes = brPrototypeHeroes.map((h, i) =>
    createPrototypeHero(h, 'player1', 'deployZone', i)
  )
  const player2Heroes = gwuPrototypeHeroes.map((h, i) =>
    createPrototypeHero(h, 'player2', 'deployZone', i)
  )

  // Build decks: 4 copies of each card type
  const buildDeck = (
    units: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[],
    spells: Omit<SpellCard, 'location' | 'owner'>[],
    owner: 'player1' | 'player2'
  ): Card[] => {
    const cards: Card[] = []
    for (const unit of units) {
      for (let copy = 0; copy < 4; copy++) {
        cards.push(createPrototypeUnit(unit, owner, 'hand', copy))
      }
    }
    for (const spell of spells) {
      for (let copy = 0; copy < 4; copy++) {
        cards.push(createPrototypeSpell(spell, owner, 'hand', copy))
      }
    }
    return shuffleArray(cards)
  }

  const p1Deck = buildDeck(brPrototypeCards, brPrototypeSpells, 'player1')
  const p2Deck = buildDeck(gwuPrototypeCards, gwuPrototypeSpells, 'player2')

  // Starting hand = first 4, rest go to library (drawn later)
  const STARTING_HAND_SIZE = 4
  const player1Hand = p1Deck.slice(0, STARTING_HAND_SIZE)
  const player1Library = p1Deck.slice(STARTING_HAND_SIZE).map(c => ({ ...c, location: 'base' as const }))
  const player2Hand = p2Deck.slice(0, STARTING_HAND_SIZE)
  const player2Library = p2Deck.slice(STARTING_HAND_SIZE).map(c => ({ ...c, location: 'base' as const }))

  const emptyRunePool: RunePool = { runes: [], temporaryRunes: [] }

  const metadata: GameMetadata = {
    currentTurn: 1,
    activePlayer: 'player1',
    currentPhase: 'play',
    player1Gold: STARTING_GOLD,
    player2Gold: STARTING_GOLD,
    player1Mana: 2,
    player2Mana: 2,
    player1MaxMana: 2,
    player2MaxMana: 2,
    player1NexusHP: NEXUS_HP,
    player2NexusHP: NEXUS_HP,
    towerA_player1_HP: TOWER_HP,
    towerA_player2_HP: TOWER_HP,
    towerB_player1_HP: TOWER_HP,
    towerB_player2_HP: TOWER_HP,
    towerA_player1_Armor: 0,
    towerA_player2_Armor: 0,
    towerB_player1_Armor: 0,
    towerB_player2_Armor: 0,
    laneMomentum: {
      battlefieldA: { player1: 0, player2: 0 },
      battlefieldB: { player1: 0, player2: 0 },
    },
    player1Tier: 1,
    player2Tier: 1,
    deathCooldowns: {},
    player1MovedToBase: false,
    player2MovedToBase: false,
    player1HeroesDeployedThisTurn: 0,
    player2HeroesDeployedThisTurn: 0,
    playedSpells: {},
    player1BattlefieldBuffs: [],
    player2BattlefieldBuffs: [],
    battlefieldDeathCounters: {},
    actionPlayer: 'player1',
    initiativePlayer: 'player1',
    heroAbilityCooldowns: {},
    player1Passed: false,
    player2Passed: false,
    stunnedHeroes: {},
    barrierUnits: {},
    cursedUnits: {},
    turn1DeploymentPhase: 'p1_lane1',
    player1RunePool: emptyRunePool,
    player2RunePool: emptyRunePool,
    player1Seals: [],
    player2Seals: [],
    player1SpellsCastThisTurn: 0,
    player2SpellsCastThisTurn: 0,
    player1ColorsPlayedThisTurn: [],
    player2ColorsPlayedThisTurn: [],
    player1CardTypesPlayedThisTurn: [],
    player2CardTypesPlayedThisTurn: [],
    heroCounters: {},
    laneRunes: {
      battlefieldA: { player1: [], player2: [] },
      battlefieldB: { player1: [], player2: [] },
    },
    resourceChoicesMade: { player1: false, player2: false },
    isRunePrototype: true,
  }

  return {
    player1Hand,
    player2Hand,
    player1Base: [],
    player2Base: [],
    player1DeployZone: [...player1Heroes],
    player2DeployZone: [...player2Heroes],
    battlefieldA: { player1: [], player2: [] },
    battlefieldB: { player1: [], player2: [] },
    metadata,
    player1Library,
    player2Library,
  }
}
