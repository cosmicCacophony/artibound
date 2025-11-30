import {
  Hero,
  BaseCard,
  BattlefieldDefinition,
  DraftPack,
  DraftPoolItem,
  DraftPickType,
  Color,
  Archetype,
  CARDS_PER_PACK,
  HEROES_PER_PACK,
  BATTLEFIELDS_PER_PACK,
  DRAFT_PACKS,
} from './types'
import {
  draftableHeroes,
  getAllDraftBattlefields,
} from './draftData'
// Import storage-aware versions for runtime use
import { allHeroes, allCards, allSpells } from './cardData'
// Import specific arrays for pack generation (these are used for filtering/selection logic)
import {
  rwCards,
  rgCards,
  ruCards,
  rbCards,
  gwCards,
  gbCards,
  guCards,
  ubCards,
  uwCards,
  rwSpells,
  ruSpells,
  rbSpells,
  gbSpells,
  guSpells,
  ubSpells,
  uwSpells,
} from './comprehensiveCardData'

// All available cards for draft pool
// Signature cards are NOT in draft pool - they're auto-added when heroes are drafted
const allGenericCards: BaseCard[] = allCards.filter(card => !card.id.includes('sig-'))
const allSpellCards: BaseCard[] = allSpells
// Multicolor cards are cards with 2+ colors (excluding signature cards)
const allMulticolorCards: BaseCard[] = allGenericCards.filter(card => card.colors && card.colors.length >= 2)

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Helper to check if hero matches active archetypes
export function heroMatchesArchetype(hero: Omit<Hero, 'location' | 'owner'>, activeArchetypes: Archetype[]): boolean {
  if (activeArchetypes.includes('all')) return true
  
  const heroColors = hero.colors || []
  const hasRed = heroColors.includes('red')
  const hasWhite = heroColors.includes('white')
  const hasBlue = heroColors.includes('blue')
  const hasBlack = heroColors.includes('black')
  const hasGreen = heroColors.includes('green')
  
  // RW Legion: needs red AND/OR white (but NO green, blue, or black)
  if (activeArchetypes.includes('rw-legion')) {
    // Exclude heroes with green, blue, or black
    if (hasGreen || hasBlue || hasBlack) return false
    // Allow red+white, pure red, or pure white
    if (hasRed || hasWhite) return true
  }
  
  // UB Control: needs blue AND/OR black (but NO green, red, or white)
  if (activeArchetypes.includes('ub-control')) {
    // Exclude heroes with green, red, or white
    if (hasGreen || hasRed || hasWhite) return false
    // Allow blue+black, pure blue, or pure black
    if (hasBlue || hasBlack) return true
  }
  
  // UBG Control: needs blue, black, AND/OR green (but NO red or white)
  if (activeArchetypes.includes('ubg-control')) {
    // Exclude heroes with red or white
    if (hasRed || hasWhite) return false
    // Allow blue, black, green, or any combination
    if (hasBlue || hasBlack || hasGreen) return true
  }
  
  return false
}

// Select 3 heroes from different colors for a pack, filtered by archetype
function selectHeroesForPack(
  packNumber: number, 
  allHeroes: Omit<Hero, 'location' | 'owner'>[],
  activeArchetypes: Archetype[] = ['all']
): Omit<Hero, 'location' | 'owner'>[] {
  // Filter heroes by archetype
  const filteredHeroes = activeArchetypes.includes('all') 
    ? allHeroes 
    : allHeroes.filter(hero => heroMatchesArchetype(hero, activeArchetypes))
  
  const availableHeroes = [...filteredHeroes]
  const selected: Omit<Hero, 'location' | 'owner'>[] = []
  const usedColors = new Set<Color>()

  // Try to get heroes with different colors, but allow duplicates if needed
  while (selected.length < HEROES_PER_PACK && availableHeroes.length > 0) {
    const shuffled = shuffleArray(availableHeroes)
    // Prefer heroes with colors we haven't used yet
    const hero = shuffled.find(h => {
      const heroColor = h.colors[0] // Primary color
      return !usedColors.has(heroColor)
    }) || shuffled[0] // Fallback if all colors used

    if (hero) {
      selected.push(hero)
      hero.colors.forEach(c => usedColors.add(c))
      const index = availableHeroes.findIndex(h => h.id === hero.id)
      if (index !== -1) {
        availableHeroes.splice(index, 1)
      }
    } else {
      break
    }
  }

  return selected
}

// Helper to check if card matches active archetypes
export function cardMatchesArchetype(card: BaseCard, activeArchetypes: Archetype[]): boolean {
  if (activeArchetypes.includes('all')) return true
  
  const cardColors = card.colors || []
  const hasRed = cardColors.includes('red')
  const hasWhite = cardColors.includes('white')
  const hasBlue = cardColors.includes('blue')
  const hasBlack = cardColors.includes('black')
  const hasGreen = cardColors.includes('green')
  
  // Check if card is generic (weaker cards that work in any deck)
  // Only allow generic cards that match the archetype colors
  const isGeneric = card.id.includes('generic')
  
  // RW Legion: Only red, white, or red+white cards (NO green, blue, or black)
  if (activeArchetypes.includes('rw-legion')) {
    // Exclude any card with green, blue, or black
    if (hasGreen || hasBlue || hasBlack) return false
    
    // Allow generic cards that are red/white only
    if (isGeneric && (hasRed || hasWhite)) return true
    
    // Allow red+white cards
    if (hasRed && hasWhite) return true
    // Allow pure red cards
    if (hasRed && !hasWhite) return true
    // Allow pure white cards
    if (hasWhite && !hasRed) return true
  }
  
  // UB Control: Only blue, black, or blue+black cards (NO green, red, or white)
  if (activeArchetypes.includes('ub-control')) {
    // Exclude any card with green, red, or white
    if (hasGreen || hasRed || hasWhite) return false
    
    // Allow generic cards that are blue/black only
    if (isGeneric && (hasBlue || hasBlack)) return true
    
    // Allow blue+black cards
    if (hasBlue && hasBlack) return true
    // Allow pure blue cards
    if (hasBlue && !hasBlack) return true
    // Allow pure black cards
    if (hasBlack && !hasBlue) return true
  }
  
  // UBG Control: Only blue, black, green, or combinations (NO red or white)
  if (activeArchetypes.includes('ubg-control')) {
    // Exclude any card with red or white
    if (hasRed || hasWhite) return false
    
    // Allow generic cards that are blue/black/green
    if (isGeneric && (hasBlue || hasBlack || hasGreen)) return true
    
    // Allow any combination of blue, black, green
    if (hasBlue || hasBlack || hasGreen) return true
  }
  
  return false
}

// Select cards for a pack (generic, spell, multicolor - NO signature cards), filtered by archetype
function selectCardsForPack(activeArchetypes: Archetype[] = ['all']): BaseCard[] {
  const selected: BaseCard[] = []
  
  // Filter cards by archetype
  const filteredGenericCards = activeArchetypes.includes('all')
    ? allGenericCards
    : allGenericCards.filter(card => cardMatchesArchetype(card, activeArchetypes))
  
  const filteredSpellCards = activeArchetypes.includes('all')
    ? allSpellCards
    : allSpellCards.filter(card => cardMatchesArchetype(card, activeArchetypes))
  
  const filteredMulticolorCards = activeArchetypes.includes('all')
    ? allMulticolorCards
    : allMulticolorCards.filter(card => cardMatchesArchetype(card, activeArchetypes))
  
  // 8-10 generic units (signature cards are auto-added when heroes are drafted)
  const genericPool = shuffleArray(filteredGenericCards)
  selected.push(...genericPool.slice(0, 8 + Math.floor(Math.random() * 3)))
  
  // 3-4 spell cards
  const spellPool = shuffleArray(filteredSpellCards)
  selected.push(...spellPool.slice(0, 3 + Math.floor(Math.random() * 2)))
  
  // 1-2 multicolor cards (potential bombs)
  const multicolorCount = Math.random() > 0.4 ? 2 : 1 // 60% chance for 2, 40% for 1
  const multicolorPool = shuffleArray(filteredMulticolorCards)
  if (multicolorPool.length > 0) {
    selected.push(...multicolorPool.slice(0, multicolorCount))
  }
  
  // Trim to CARDS_PER_PACK (should be close to 15 already)
  const shuffled = shuffleArray(selected)
  return shuffled.slice(0, CARDS_PER_PACK)
}

// Select 3 battlefields for a pack
function selectBattlefieldsForPack(): BattlefieldDefinition[] {
  const allBattlefields = getAllDraftBattlefields()
  const shuffled = shuffleArray(allBattlefields)
  // Return 3 battlefields, or all available if less than 3
  return shuffled.slice(0, Math.min(BATTLEFIELDS_PER_PACK, shuffled.length))
}

// Convert items to DraftPoolItems
function createPoolItems(
  packNumber: number,
  heroes: Omit<Hero, 'location' | 'owner'>[],
  cards: BaseCard[],
  battlefields: BattlefieldDefinition[]
): DraftPoolItem[] {
  const items: DraftPoolItem[] = []

  heroes.forEach(hero => {
    items.push({
      id: `pack-${packNumber}-hero-${hero.id}`,
      type: 'hero' as DraftPickType,
      item: hero as Hero,
      packNumber,
    })
  })

  cards.forEach(card => {
    items.push({
      id: `pack-${packNumber}-card-${card.id}`,
      type: 'card' as DraftPickType,
      item: card,
      packNumber,
    })
  })

  battlefields.forEach(battlefield => {
    items.push({
      id: `pack-${packNumber}-battlefield-${battlefield.id}`,
      type: 'battlefield' as DraftPickType,
      item: battlefield,
      packNumber,
    })
  })

  return shuffleArray(items) // Shuffle so order isn't predictable
}

// Generate a single draft pack
export function generateDraftPack(packNumber: number, activeArchetypes: Archetype[] = ['all']): DraftPack {
  // Use all heroes from comprehensive data, not just draftableHeroes
  const heroes = selectHeroesForPack(packNumber, allHeroes, activeArchetypes)
  const cards = selectCardsForPack(activeArchetypes)
  const battlefields = selectBattlefieldsForPack()

  const poolItems = createPoolItems(packNumber, heroes, cards, battlefields)

  return {
    packNumber,
    heroes: heroes as Hero[], // Heroes will have location/owner added when picked
    cards,
    battlefields,
    remainingItems: poolItems,
    picks: [],
    isComplete: false,
  }
}

// Generate all draft packs
export function generateAllDraftPacks(): DraftPack[] {
  const packs: DraftPack[] = []
  for (let i = 1; i <= DRAFT_PACKS; i++) {
    packs.push(generateDraftPack(i))
  }
  return packs
}

// Generate a single random pack for the new round-based system
// By default, limit to RW and UBG archetypes for testing
export function generateRandomPack(roundNumber: number, activeArchetypes: Archetype[] = ['rw-legion', 'ubg-control']): DraftPack {
  return generateDraftPack(roundNumber, activeArchetypes)
}

// Remove a picked item from pack's remaining items
export function removeItemFromPack(
  pack: DraftPack,
  itemId: string
): DraftPack {
  return {
    ...pack,
    remainingItems: pack.remainingItems.filter(item => item.id !== itemId),
  }
}

// Check if pack is complete (all items picked or pack is done)
export function isPackComplete(pack: DraftPack): boolean {
  return pack.remainingItems.length === 0 || pack.isComplete
}

