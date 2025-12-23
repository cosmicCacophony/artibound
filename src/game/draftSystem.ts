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

// Helper: Get guild colors
function getGuildColors(archetype: Archetype): Color[] {
  switch (archetype) {
    case 'guild-rg': return ['red', 'green']
    case 'guild-wg': return ['white', 'green']
    case 'guild-wu': return ['white', 'blue']
    case 'guild-ub': return ['blue', 'black']
    case 'guild-br': return ['black', 'red']
    case 'guild-rw': return ['red', 'white']
    default: return []
  }
}

// Helper: Get wedge colors
function getWedgeColors(archetype: Archetype): Color[] {
  switch (archetype) {
    case 'wedge-rgw': return ['red', 'green', 'white']
    case 'wedge-gwu': return ['green', 'white', 'blue']
    case 'wedge-wub': return ['white', 'blue', 'black']
    case 'wedge-ubr': return ['blue', 'black', 'red']
    case 'wedge-brg': return ['black', 'red', 'green']
    default: return []
  }
}

// Helper: Check if array is subset of another
function isSubset(subset: Color[], superset: Color[]): boolean {
  return subset.every(color => superset.includes(color))
}

// Helper to check if card matches active archetypes
export function cardMatchesArchetype(card: BaseCard, activeArchetypes: Archetype[]): boolean {
  if (activeArchetypes.includes('all')) return true
  
  const cardColors = card.colors || []
  
  // If card has no colors, reject it (colorless cards don't belong to archetypes)
  if (cardColors.length === 0) return false
  
  // Check each archetype
  for (const archetype of activeArchetypes) {
    // Guild matching
    if (archetype.startsWith('guild-')) {
      const guildColors = getGuildColors(archetype)
      if (isSubset(cardColors, guildColors)) return true
    }
    
    // Wedge matching
    else if (archetype.startsWith('wedge-')) {
      const wedgeColors = getWedgeColors(archetype)
      if (isSubset(cardColors, wedgeColors)) return true
    }
    
    // Five-color: Accept any colored card
    else if (archetype === 'five-color') {
      return cardColors.length > 0
    }
    
    // Legacy archetypes (for backward compatibility)
    else if (archetype === 'rw-legion') {
      const hasRed = cardColors.includes('red')
      const hasWhite = cardColors.includes('white')
      const hasGreen = cardColors.includes('green')
      const hasBlue = cardColors.includes('blue')
      const hasBlack = cardColors.includes('black')
      
      if (!hasRed && !hasWhite) continue
      if (hasGreen || hasBlue || hasBlack) continue
      return true
    }
    else if (archetype === 'ub-control') {
      const hasBlue = cardColors.includes('blue')
      const hasBlack = cardColors.includes('black')
      const hasGreen = cardColors.includes('green')
      const hasRed = cardColors.includes('red')
      const hasWhite = cardColors.includes('white')
      
      if (!hasBlue && !hasBlack) continue
      if (hasGreen || hasRed || hasWhite) continue
      return true
    }
    else if (archetype === 'ubg-control') {
      const hasBlue = cardColors.includes('blue')
      const hasBlack = cardColors.includes('black')
      const hasGreen = cardColors.includes('green')
      const hasRed = cardColors.includes('red')
      const hasWhite = cardColors.includes('white')
      
      if (!hasBlue && !hasBlack && !hasGreen) continue
      if (hasRed || hasWhite) continue
      return true
    }
  }
  
  return false
}

// Select cards for a pack (generic, spell, multicolor - NO signature cards), filtered by archetype
// NEW: Includes rarity-based distribution (1 rare, 2-3 uncommons, rest commons)
function selectCardsForPack(activeArchetypes: Archetype[] = ['all']): BaseCard[] {
  const selected: BaseCard[] = []
  
  // Filter all cards by archetype
  const allFilteredCards = activeArchetypes.includes('all')
    ? [...allGenericCards, ...allSpellCards]
    : [...allGenericCards, ...allSpellCards].filter(card => cardMatchesArchetype(card, activeArchetypes))
  
  // Separate by rarity
  const rares = allFilteredCards.filter(c => c.rarity === 'rare')
  const uncommons = allFilteredCards.filter(c => c.rarity === 'uncommon')
  const commons = allFilteredCards.filter(c => !c.rarity || c.rarity === 'common')
  
  // Guarantee 1 rare
  if (rares.length > 0) {
    const rarePool = shuffleArray(rares)
    selected.push(rarePool[0])
  }
  
  // 2-3 uncommons
  const uncommonCount = 2 + Math.floor(Math.random() * 2) // 2 or 3
  if (uncommons.length > 0) {
    const uncommonPool = shuffleArray(uncommons)
    selected.push(...uncommonPool.slice(0, Math.min(uncommonCount, uncommons.length)))
  }
  
  // Fill rest with commons (target 15 total)
  const commonsNeeded = CARDS_PER_PACK - selected.length
  if (commons.length > 0) {
    const commonPool = shuffleArray(commons)
    selected.push(...commonPool.slice(0, Math.min(commonsNeeded, commons.length)))
  }
  
  // If we don't have enough cards, fill with whatever is available
  if (selected.length < CARDS_PER_PACK && allFilteredCards.length > selected.length) {
    const remaining = allFilteredCards.filter(c => !selected.includes(c))
    const remainingPool = shuffleArray(remaining)
    selected.push(...remainingPool.slice(0, CARDS_PER_PACK - selected.length))
  }
  
  // Final shuffle and return
  return shuffleArray(selected).slice(0, CARDS_PER_PACK)
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

// Determine if a round is a hero pick round
// Pattern: 2 normal packs, then hero pack, then normal, then hero, etc.
// Round 1-2: Normal picks
// Round 3: Hero pick
// Round 4: Normal picks
// Round 5: Hero pick
// etc.
export function isHeroPickRound(roundNumber: number): boolean {
  // After the first 2 normal packs, every 3rd round is a hero pick
  // Round 3, 6, 9, etc. are hero picks
  if (roundNumber <= 2) return false
  return (roundNumber - 2) % 2 === 1 // Round 3, 5, 7, 9... are hero picks
}

// Generate a hero-only pack (only heroes, no cards or battlefields)
export function generateHeroPack(packNumber: number, activeArchetypes: Archetype[] = ['all']): DraftPack {
  const heroes = selectHeroesForPack(packNumber, allHeroes, activeArchetypes)
  // Only include heroes in the pool
  const poolItems: DraftPoolItem[] = heroes.map(hero => ({
    id: `pack-${packNumber}-hero-${hero.id}`,
    type: 'hero' as DraftPickType,
    item: hero as Hero,
    packNumber,
  }))

  return {
    packNumber,
    heroes: heroes as Hero[],
    cards: [],
    battlefields: [],
    remainingItems: poolItems,
    picks: [],
    isComplete: false,
  }
}

// Generate a single random pack for the new round-based system
// By default, limit to RW and UBG archetypes for testing
export function generateRandomPack(roundNumber: number, activeArchetypes: Archetype[] = ['rw-legion', 'ubg-control']): DraftPack {
  if (isHeroPickRound(roundNumber)) {
    return generateHeroPack(roundNumber, activeArchetypes)
  }
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

