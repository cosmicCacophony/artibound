import { Hero, GenericUnit, SpellCard, Card, GameMetadata, RuneColor, RuneScalingTier, TOWER_HP, NEXUS_HP, STARTING_GOLD } from './types'

// ============================================================================
// RB DECK — Aggressive / Burn
// Heroes: 2 Red (primary, pre-deployed) + 2 Black (secondary, deployed turns 2-3)
// Cards: 4 units (one per formation tag) + 1 removal spell
// ============================================================================

export const rbHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Primary heroes (pre-deployed turn 1)
  {
    id: 'proto-rb-flame-captain',
    name: 'Flame Captain',
    description: 'Red hero. Lane creatures deal +1 damage.',
    cardType: 'hero',
    colors: ['red'],
    attack: 4,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    formationTag: 'frontline',
  },
  {
    id: 'proto-rb-ember-tactician',
    name: 'Ember Tactician',
    description: 'Red hero. First spell each turn costs 1 less.',
    cardType: 'hero',
    colors: ['red'],
    attack: 3,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    equippedItems: [],
  },
  // Secondary heroes (deployed turns 2-3)
  {
    id: 'proto-rb-blood-broker',
    name: 'Blood Broker',
    description: 'Black hero. When a friendly creature dies, deal 1 to enemy tower.',
    cardType: 'hero',
    colors: ['black'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    equippedItems: [],
  },
  {
    id: 'proto-rb-grave-raider',
    name: 'Grave Raider',
    description: 'Black hero. Creatures get +1 attack if lane has 2+ runes.',
    cardType: 'hero',
    colors: ['black'],
    attack: 4,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    equippedItems: [],
    formationTag: 'ranged',
  },
]

export const rbUnits: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'proto-rb-ironclad',
    name: 'Ironclad Berserker',
    description: 'Frontline. Forces enemies to attack it first.',
    cardType: 'generic',
    colors: [],
    manaCost: 2,
    attack: 3,
    health: 4,
    maxHealth: 4,
    currentHealth: 4,
    formationTag: 'frontline',
    runeScaling: [
      { runeRequirement: ['red'], attackBonus: 1, description: '4/4' },
      { runeRequirement: ['red', 'red'], attackBonus: 2, healthBonus: 1, description: '5/5' },
      { runeRequirement: ['red', 'red', 'black'], attackBonus: 3, healthBonus: 1, description: '6/5' },
    ],
  },
  {
    id: 'proto-rb-ember-archer',
    name: 'Ember Archer',
    description: 'Ranged. Shoots over frontline to hit backline targets.',
    cardType: 'generic',
    colors: [],
    manaCost: 2,
    attack: 2,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    formationTag: 'ranged',
    runeScaling: [
      { runeRequirement: ['red'], attackBonus: 1, description: '3/2' },
      { runeRequirement: ['red', 'black'], attackBonus: 2, healthBonus: 1, description: '4/3' },
      { runeRequirement: ['red', 'red', 'black'], attackBonus: 3, healthBonus: 1, description: '5/3' },
    ],
  },
  {
    id: 'proto-rb-shadow-blade',
    name: 'Shadow Blade',
    description: 'Assassin. Bypasses all units to strike the tower directly.',
    cardType: 'generic',
    colors: [],
    manaCost: 3,
    attack: 4,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    formationTag: 'assassin',
    runeScaling: [
      { runeRequirement: ['black'], attackBonus: 1, description: '5/1' },
      { runeRequirement: ['red', 'black'], attackBonus: 1, healthBonus: 1, description: '5/2' },
      { runeRequirement: ['red', 'red', 'black'], attackBonus: 3, healthBonus: 1, description: '7/2' },
    ],
  },
  {
    id: 'proto-rb-scorch-imp',
    name: 'Scorch Imp',
    description: 'Cheap aggro unit. Attacks any enemy, must hit frontline first.',
    cardType: 'generic',
    colors: [],
    manaCost: 1,
    attack: 1,
    health: 2,
    maxHealth: 2,
    currentHealth: 2,
    runeScaling: [
      { runeRequirement: ['red'], attackBonus: 1, description: '2/2' },
      { runeRequirement: ['red', 'red'], attackBonus: 2, healthBonus: 1, description: '3/3' },
      { runeRequirement: ['red', 'red', 'red'], attackBonus: 3, healthBonus: 1, description: '4/3' },
    ],
  },
]

export const rbSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'proto-rb-scorching-bolt',
    name: 'Scorching Bolt',
    description: 'Deal 2 damage to a unit. Scales with red/black runes.',
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
      { runeRequirement: ['red'], damageBonus: 1, description: 'Deal 3 damage' },
      { runeRequirement: ['red', 'red'], damageBonus: 2, description: 'Deal 4 damage' },
      { runeRequirement: ['red', 'red', 'black'], damageBonus: 4, description: 'Deal 6 damage' },
    ],
  },
]

// ============================================================================
// GW DECK — Control / Scaling
// Heroes: 2 Green (primary, pre-deployed) + 2 White (secondary, deployed turns 2-3)
// Cards: 4 units (one per formation tag) + 1 buff spell
// ============================================================================

export const gwHeroes: Omit<Hero, 'location' | 'owner'>[] = [
  // Primary heroes (pre-deployed turn 1)
  {
    id: 'proto-gw-rune-druid',
    name: 'Rune Druid',
    description: 'Green hero. Creatures gain +1/+1 if lane has 2+ runes.',
    cardType: 'hero',
    colors: ['green'],
    attack: 2,
    health: 8,
    maxHealth: 8,
    currentHealth: 8,
    equippedItems: [],
    formationTag: 'frontline',
  },
  {
    id: 'proto-gw-ancient-warden',
    name: 'Ancient Warden',
    description: 'Green hero. Creatures played here enter with +1 health.',
    cardType: 'hero',
    colors: ['green'],
    attack: 3,
    health: 7,
    maxHealth: 7,
    currentHealth: 7,
    equippedItems: [],
  },
  // Secondary heroes (deployed turns 2-3)
  {
    id: 'proto-gw-shield-marshal',
    name: 'Shield Marshal',
    description: 'White hero. Prevents 1 damage per turn to a friendly creature.',
    cardType: 'hero',
    colors: ['white'],
    attack: 2,
    health: 9,
    maxHealth: 9,
    currentHealth: 9,
    equippedItems: [],
  },
  {
    id: 'proto-gw-sunward-knight',
    name: 'Sunward Knight',
    description: 'White hero. Frontline guardian that protects the lane.',
    cardType: 'hero',
    colors: ['white'],
    attack: 3,
    health: 6,
    maxHealth: 6,
    currentHealth: 6,
    equippedItems: [],
    formationTag: 'frontline',
  },
]

export const gwUnits: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[] = [
  {
    id: 'proto-gw-ancient-guardian',
    name: 'Ancient Guardian',
    description: 'Frontline. Wall of health that forces enemies to attack it.',
    cardType: 'generic',
    colors: [],
    manaCost: 2,
    attack: 1,
    health: 5,
    maxHealth: 5,
    currentHealth: 5,
    formationTag: 'frontline',
    runeScaling: [
      { runeRequirement: ['green'], attackBonus: 1, description: '2/5' },
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, description: '2/6' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 3, description: '3/8' },
    ],
  },
  {
    id: 'proto-gw-tideweaver',
    name: 'Tideweaver',
    description: 'Ranged. Shoots over frontline to pick off backline threats.',
    cardType: 'generic',
    colors: [],
    manaCost: 3,
    attack: 2,
    health: 3,
    maxHealth: 3,
    currentHealth: 3,
    formationTag: 'ranged',
    runeScaling: [
      { runeRequirement: ['green'], attackBonus: 1, description: '3/3' },
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, description: '3/4' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 2, description: '4/5' },
    ],
  },
  {
    id: 'proto-gw-vine-stalker',
    name: 'Vine Stalker',
    description: 'Assassin. Slips past all units to strike the tower directly.',
    cardType: 'generic',
    colors: [],
    manaCost: 3,
    attack: 3,
    health: 1,
    maxHealth: 1,
    currentHealth: 1,
    formationTag: 'assassin',
    runeScaling: [
      { runeRequirement: ['green'], attackBonus: 1, description: '4/1' },
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, description: '4/2' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 2, description: '5/3' },
    ],
  },
  {
    id: 'proto-gw-grove-sentinel',
    name: 'Grove Sentinel',
    description: 'Balanced defender. Attacks any enemy, must hit frontline first.',
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
]

export const gwSpells: Omit<SpellCard, 'location' | 'owner'>[] = [
  {
    id: 'proto-gw-natures-blessing',
    name: "Nature's Blessing",
    description: 'Give a friendly unit +1/+2. Scales with green/white runes.',
    cardType: 'spell',
    colors: [],
    manaCost: 2,
    effect: {
      type: 'buff',
      damage: 0,
      attackBuff: 1,
      healthBuff: 2,
      affectsUnits: true,
    },
    runeScaling: [
      { runeRequirement: ['green'], attackBonus: 1, description: '+2/+2' },
      { runeRequirement: ['green', 'white'], attackBonus: 1, healthBonus: 1, drawCards: 1, description: '+2/+3, draw 1' },
      { runeRequirement: ['green', 'green', 'white'], attackBonus: 2, healthBonus: 2, drawCards: 1, description: '+3/+4, draw 1' },
    ],
  },
]

// ============================================================================
// RUNE SCALING HELPERS
// ============================================================================

export function countRunesByColor(laneRunes: RuneColor[]): Record<RuneColor, number> {
  const counts: Record<string, number> = { red: 0, blue: 0, white: 0, black: 0, green: 0 }
  for (const rune of laneRunes) {
    counts[rune] = (counts[rune] || 0) + 1
  }
  return counts as Record<RuneColor, number>
}

export function meetsRuneRequirement(laneRunes: RuneColor[], requirement: RuneColor[]): boolean {
  const available = countRunesByColor(laneRunes)
  const needed = countRunesByColor(requirement)
  for (const color of Object.keys(needed) as RuneColor[]) {
    if ((needed[color] || 0) > (available[color] || 0)) return false
  }
  return true
}

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

const COPIES_PER_CARD = 3

function createHero(
  template: Omit<Hero, 'location' | 'owner'>,
  owner: 'player1' | 'player2',
  location: 'battlefieldA' | 'battlefieldB' | 'deployZone',
  index: number
): Hero {
  return {
    ...template,
    id: `${template.id}-${owner}-${index}`,
    location,
    owner,
  }
}

function createUnit(
  template: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>,
  owner: 'player1' | 'player2',
  copyIndex: number
): GenericUnit {
  return {
    ...template,
    id: `${template.id}-${owner}-copy${copyIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    location: 'hand',
    owner,
    stackedWith: undefined,
    stackPower: undefined,
    stackHealth: undefined,
  }
}

function createSpell(
  template: Omit<SpellCard, 'location' | 'owner'>,
  owner: 'player1' | 'player2',
  copyIndex: number
): SpellCard {
  return {
    ...template,
    id: `${template.id}-${owner}-copy${copyIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    location: 'hand',
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
 * Create the prototype game state.
 * P1 = RB (aggressive), P2 = GW (control).
 * 
 * Hero deployment cadence:
 *   Turn 1: Primary heroes pre-deployed (hero[0] -> Lane A, hero[1] -> Lane B)
 *   Turn 2: Player chooses which lane to deploy hero[2] (secondary color)
 *   Turn 3: hero[3] auto-deploys to the other lane
 * 
 * Each deck: 5 card designs x 3 copies = 15 cards.
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
  // Primary heroes pre-deployed to lanes
  const p1HeroA = createHero(rbHeroes[0], 'player1', 'battlefieldA', 0)
  const p1HeroB = createHero(rbHeroes[1], 'player1', 'battlefieldB', 1)
  // Secondary heroes wait in deploy zone
  const p1Hero2 = createHero(rbHeroes[2], 'player1', 'deployZone', 2)
  const p1Hero3 = createHero(rbHeroes[3], 'player1', 'deployZone', 3)

  const p2HeroA = createHero(gwHeroes[0], 'player2', 'battlefieldA', 0)
  const p2HeroB = createHero(gwHeroes[1], 'player2', 'battlefieldB', 1)
  const p2Hero2 = createHero(gwHeroes[2], 'player2', 'deployZone', 2)
  const p2Hero3 = createHero(gwHeroes[3], 'player2', 'deployZone', 3)

  // Build decks
  const buildDeck = (
    units: Omit<GenericUnit, 'location' | 'owner' | 'stackedWith' | 'stackPower' | 'stackHealth'>[],
    spells: Omit<SpellCard, 'location' | 'owner'>[],
    owner: 'player1' | 'player2'
  ): Card[] => {
    const cards: Card[] = []
    for (const unit of units) {
      for (let copy = 0; copy < COPIES_PER_CARD; copy++) {
        cards.push(createUnit(unit, owner, copy))
      }
    }
    for (const spell of spells) {
      for (let copy = 0; copy < COPIES_PER_CARD; copy++) {
        cards.push(createSpell(spell, owner, copy))
      }
    }
    return shuffleArray(cards)
  }

  const p1Deck = buildDeck(rbUnits, rbSpells, 'player1')
  const p2Deck = buildDeck(gwUnits, gwSpells, 'player2')

  const STARTING_HAND_SIZE = 4
  const player1Hand = p1Deck.slice(0, STARTING_HAND_SIZE)
  const player1Library = p1Deck.slice(STARTING_HAND_SIZE).map(c => ({ ...c, location: 'base' as const }))
  const player2Hand = p2Deck.slice(0, STARTING_HAND_SIZE)
  const player2Library = p2Deck.slice(STARTING_HAND_SIZE).map(c => ({ ...c, location: 'base' as const }))

  const metadata: GameMetadata = {
    currentTurn: 1,
    activePlayer: 'player1',
    currentPhase: 'resource',
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
    player1DeployZone: [p1Hero2, p1Hero3],
    player2DeployZone: [p2Hero2, p2Hero3],
    battlefieldA: { player1: [p1HeroA], player2: [p2HeroA] },
    battlefieldB: { player1: [p1HeroB], player2: [p2HeroB] },
    metadata,
    player1Library,
    player2Library,
  }
}
