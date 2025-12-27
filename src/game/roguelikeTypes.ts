import { Hero, BaseCard, Color, ArtifactCard, SpellCard, GenericUnit } from './types'

/**
 * Roguelike Draft Types
 * 
 * Simplified draft system for roguelike mode:
 * - Heroes, artifacts, spells, units only
 * - No battlefields, no items
 * - 4 hero picks + 14 mixed packs = 18 packs total
 * 
 * Draft order: Normal packs first (packs 1-4), then heroes spread throughout (packs 5, 10, 15, 18)
 */

export type RoguelikeDraftItem = Hero | ArtifactCard | SpellCard | GenericUnit

export type RoguelikeDraftItemType = 'hero' | 'artifact' | 'spell' | 'unit'

export interface RoguelikePack {
  packNumber: number
  heroes: Omit<Hero, 'location' | 'owner'>[]
  artifacts: Omit<ArtifactCard, 'location' | 'owner'>[]
  spells: Omit<SpellCard, 'location' | 'owner'>[]
  units: Omit<GenericUnit, 'location' | 'owner'>[]
  allItems: RoguelikeDraftItem[] // Flattened for easy picking
}

export interface RoguelikeDraftPick {
  packNumber: number
  pickNumber: number
  item: RoguelikeDraftItem
  itemType: RoguelikeDraftItemType
}

export interface RoguelikeDraftState {
  currentPack: number // 1-18
  phase: 'heroPick' | 'mixedPack'
  heroPickNumber: 1 | 2 | 3 | 4 | null // Which hero pick we're on (1-4)
  currentPackData: RoguelikePack | null
  
  // Drafted items
  draftedHeroes: Omit<Hero, 'location' | 'owner'>[]
  draftedArtifacts: Omit<ArtifactCard, 'location' | 'owner'>[]
  draftedSpells: Omit<SpellCard, 'location' | 'owner'>[]
  draftedUnits: Omit<GenericUnit, 'location' | 'owner'>[]
  
  // Tracking
  picksRemainingThisPack: number // How many picks left in current pack (usually 2)
  totalPicks: number // Total picks made so far
  
  // Player colors (for weighting future packs)
  playerColors: Color[] // Unique colors from drafted heroes
  
  // Completion
  isComplete: boolean // Has 4 heroes and enough cards
}

// Constants
export const ROGUELIKE_HEROES_REQUIRED = 4
export const ROGUELIKE_CARDS_REQUIRED = 20 // Minimum cards (artifacts + spells + units)
export const ROGUELIKE_TOTAL_PACKS = 18
export const ROGUELIKE_HERO_PICK_PACKS = [5, 10, 15, 18] // Packs where you pick a hero (after normal packs)
export const ROGUELIKE_PICKS_PER_MIXED_PACK = 2



