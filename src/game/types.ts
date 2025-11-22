export type Location = 'base' | 'battlefieldA' | 'battlefieldB' | 'hand'
export type CardType = 'hero' | 'signature' | 'hybrid' | 'generic'
export type PlayerId = 'player1' | 'player2'

// Color System Types
export type Color = 'red' | 'blue' | 'white' | 'black' | 'green'
export type ColorCombo = Color | `${Color}${Color}` | `${Color}${Color}${Color}` // Single, dual, or triple color

// Maximum colors allowed per deck
export const MAX_COLORS_PER_DECK = 3

export interface BaseCard {
  id: string
  name: string
  description: string
  cardType: CardType
  manaCost?: number // Cost to play this card
  colors?: Color[] // Colors required to play this card (empty = colorless)
}

export interface Item {
  id: string
  name: string
  description: string
  cost: number
  tier: 1 | 2
  hpBonus?: number
  attackBonus?: number
  goldPerTurn?: number
}

export type TurnPhase = 'play' | 'combatA' | 'adjust' | 'combatB'

export interface GameMetadata {
  currentTurn: number
  activePlayer: PlayerId
  currentPhase: TurnPhase
  player1Gold: number
  player2Gold: number
  player1Mana: number // Current mana
  player2Mana: number
  player1MaxMana: number // Maximum mana (increases by 1 per turn)
  player2MaxMana: number
  player1NexusHP: number
  player2NexusHP: number
  towerA_HP: number
  towerB_HP: number
  player1Tier: 1 | 2
  player2Tier: 1 | 2
}

export interface Hero extends BaseCard {
  cardType: 'hero'
  colors: Color[] // Hero's color(s) - single color for monocolor heroes
  attack: number
  health: number
  maxHealth: number // Track max health for restoration
  currentHealth: number // Track current health for combat
  supportEffect?: string
  location: Location
  owner: PlayerId
  slot?: number // Slot position 1-5 on battlefield
  equippedItems?: string[] // Array of item IDs
  signatureCardIds?: string[] // IDs of signature cards that synergize with this hero
}

export interface SignatureCard extends BaseCard {
  cardType: 'signature'
  heroName: string // Which hero this card belongs to
  attack: number
  health: number
  maxHealth: number
  currentHealth: number
  location: Location
  owner: PlayerId
  slot?: number
  effect?: string // Special effect when played
}

export interface HybridCard extends BaseCard {
  cardType: 'hybrid'
  attack: number
  health: number
  maxHealth: number
  currentHealth: number
  baseBuff?: string // Effect when in base
  location: Location
  owner: PlayerId
  slot?: number
}

export interface GenericUnit extends BaseCard {
  cardType: 'generic'
  attack: number
  health: number
  maxHealth: number
  currentHealth: number
  location: Location
  owner: PlayerId
  slot?: number
  stackedWith?: string // ID of generic unit this is stacked with (if any)
  stackPower?: number // Combined power if stacked
  stackHealth?: number // Combined health if stacked
}

export type Card = Hero | SignatureCard | HybridCard | GenericUnit

export interface Battlefield {
  player1: Card[]
  player2: Card[]
}

export interface BattlefieldDefinition {
  id: string
  name: string
  description: string
  colors: Color[] // Battlefield's color(s)
  staticAbility: string // Description of the static ability
  staticAbilityId: string // Identifier for the ability type (e.g., 'same-color-buff', 'gold-on-kill')
}

// Draft System Types
export type DraftPickType = 'hero' | 'battlefield'

export interface DraftState {
  currentPicker: PlayerId
  pickNumber: number // Overall pick number in the draft
  player1Picks: (Hero | BattlefieldDefinition)[]
  player2Picks: (Hero | BattlefieldDefinition)[]
  availableHeroes: Hero[] // Pool of heroes available to draft
  availableBattlefields: BattlefieldDefinition[] // Pool of battlefields available to draft
  isComplete: boolean
}

export interface DraftPick {
  pickNumber: number
  player: PlayerId
  pickType: DraftPickType
  pick: Hero | BattlefieldDefinition
}

export interface GameState {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  battlefieldA: Battlefield
  battlefieldB: Battlefield
  cardLibrary: BaseCard[] // All available cards in the library (for sidebar)
  metadata: GameMetadata
  // Draft system (to be implemented)
  draftState?: DraftState
  player1DraftedHeroes?: Hero[]
  player2DraftedHeroes?: Hero[]
  player1Battlefields?: BattlefieldDefinition[]
  player2Battlefields?: BattlefieldDefinition[]
}

export const BATTLEFIELD_SLOT_LIMIT = 5
export const TOWER_HP = 20
export const NEXUS_HP = 30
export const STARTING_GOLD = 5

// Draft System Constants
export const HEROES_PER_PLAYER = 4
export const BATTLEFIELDS_PER_PLAYER = 2
export const SIGNATURE_CARDS_PER_HERO = 2
