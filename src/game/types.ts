export type Location = 'base' | 'battlefieldA' | 'battlefieldB' | 'hand'
export type CardType = 'hero' | 'signature' | 'hybrid' | 'generic'
export type PlayerId = 'player1' | 'player2'

export interface BaseCard {
  id: string
  name: string
  description: string
  cardType: CardType
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

export interface GameMetadata {
  currentTurn: number
  activePlayer: PlayerId
  player1Gold: number
  player2Gold: number
  player1NexusHP: number
  player2NexusHP: number
  towerA_HP: number
  towerB_HP: number
  player1Tier: 1 | 2
  player2Tier: 1 | 2
}

export interface Hero extends BaseCard {
  cardType: 'hero'
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

export interface GameState {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  battlefieldA: Battlefield
  battlefieldB: Battlefield
  cardLibrary: BaseCard[] // All available cards in the library (for sidebar)
  metadata: GameMetadata
}

export const BATTLEFIELD_SLOT_LIMIT = 5
export const TOWER_HP = 20
export const NEXUS_HP = 30
export const STARTING_GOLD = 5
