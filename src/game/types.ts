export type Location = 'base' | 'battlefieldA' | 'battlefieldB' | 'hand'
export type CardType = 'hero' | 'signature' | 'hybrid' | 'generic'
export type PlayerId = 'player1' | 'player2'

export interface BaseCard {
  id: string
  name: string
  description: string
  cardType: CardType
}

export interface Hero extends BaseCard {
  cardType: 'hero'
  attack: number
  health: number
  supportEffect?: string
  location: Location
  owner: PlayerId
  signatureCardIds?: string[] // IDs of signature cards that synergize with this hero
}

export interface SignatureCard extends BaseCard {
  cardType: 'signature'
  heroName: string // Which hero this card belongs to
  attack: number
  health: number
  location: Location
  owner: PlayerId
  effect?: string // Special effect when played
}

export interface HybridCard extends BaseCard {
  cardType: 'hybrid'
  attack: number
  health: number
  baseBuff?: string // Effect when in base
  location: Location
  owner: PlayerId
}

export interface GenericUnit extends BaseCard {
  cardType: 'generic'
  attack: number
  health: number
  location: Location
  owner: PlayerId
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
}

export const BATTLEFIELD_SLOT_LIMIT = 5
