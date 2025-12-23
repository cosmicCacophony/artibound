import { Hero, BaseCard, Color, ArtifactCard, SpellCard, GenericUnit } from './types'
import { allHeroes, allArtifacts, allSpells, allCards } from './cardData'
import { RoguelikePack, RoguelikeDraftState, ROGUELIKE_HERO_PICK_PACKS } from './roguelikeTypes'

/**
 * Roguelike Draft System
 * 
 * Generates packs for roguelike mode:
 * - Mixed packs: Pick 2 items from 15 items (most packs)
 *   * Always contains 1 good multicolor hero (not skewed toward player colors)
 * - Hero picks: Pick 1 hero from 5 (packs 5, 10, 15, 18)
 *   * First pick: 5 single-color heroes (one of each color)
 *   * Picks 2-4: 3 single-color heroes (slightly skewed toward player colors)
 *               + 2 multicolor heroes (NOT skewed toward player colors)
 * 
 * Draft order: Normal packs first, then heroes spread throughout
 */

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Helper to get unique colors from heroes
function getPlayerColors(heroes: Omit<Hero, 'location' | 'owner'>[]): Color[] {
  const colorSet = new Set<Color>()
  heroes.forEach(hero => {
    hero.colors?.forEach(color => colorSet.add(color))
  })
  return Array.from(colorSet)
}

// Helper to check if card matches player colors (for weighting)
function cardMatchesColors(card: BaseCard, playerColors: Color[]): boolean {
  if (!card.colors || card.colors.length === 0) return false
  // Card matches if it has at least one color in common with player colors
  return card.colors.some(color => playerColors.includes(color))
}

// Helper to filter cards by color (with weighting)
function getWeightedCards<T extends BaseCard>(
  allCards: T[],
  playerColors: Color[],
  count: number
): T[] {
  if (playerColors.length === 0) {
    // No colors yet, return random cards
    return shuffleArray(allCards).slice(0, count)
  }
  
  // Separate cards into matching and non-matching
  const matching: T[] = []
  const nonMatching: T[] = []
  
  allCards.forEach(card => {
    if (cardMatchesColors(card, playerColors)) {
      matching.push(card)
    } else {
      nonMatching.push(card)
    }
  })
  
  // 70% matching, 30% random
  const matchingCount = Math.floor(count * 0.7)
  const randomCount = count - matchingCount
  
  const selected: T[] = []
  
  // Add matching cards
  if (matching.length > 0) {
    selected.push(...shuffleArray(matching).slice(0, matchingCount))
  }
  
  // Add random cards (fill remaining slots)
  const remaining = count - selected.length
  if (remaining > 0 && nonMatching.length > 0) {
    selected.push(...shuffleArray(nonMatching).slice(0, remaining))
  }
  
  // If we still need more, fill from matching
  if (selected.length < count && matching.length > selected.length) {
    const alreadySelected = new Set(selected.map(c => c.id))
    const additional = matching
      .filter(c => !alreadySelected.has(c.id))
      .slice(0, count - selected.length)
    selected.push(...additional)
  }
  
  return shuffleArray(selected).slice(0, count)
}

// Get single-color heroes (one of each color)
function getSingleColorHeroes(): Omit<Hero, 'location' | 'owner'>[] {
  const colors: Color[] = ['red', 'blue', 'white', 'black', 'green']
  const heroes: Omit<Hero, 'location' | 'owner'>[] = []
  
  colors.forEach(color => {
    // Find a single-color hero of this color
    const hero = allHeroes.find(h => 
      h.colors?.length === 1 && h.colors[0] === color
    )
    if (hero) {
      heroes.push(hero)
    }
  })
  
  // If we don't have one of each color, fill with any single-color heroes
  if (heroes.length < 5) {
    const singleColorHeroes = allHeroes.filter(h => h.colors?.length === 1)
    const missingColors = colors.filter(c => !heroes.some(h => h.colors?.includes(c)))
    
    missingColors.forEach(color => {
      const hero = singleColorHeroes.find(h => h.colors?.[0] === color)
      if (hero && !heroes.some(h => h.id === hero.id)) {
        heroes.push(hero)
      }
    })
  }
  
  return heroes.slice(0, 5)
}

// Get heroes for hero pick (picks 2-4)
// Distribution: 3 single-color heroes (slightly skewed toward player colors)
//              2 multicolor heroes (NOT skewed toward player colors)
function getHeroPickHeroes(
  playerColors: Color[],
  count: number = 5
): Omit<Hero, 'location' | 'owner'>[] {
  if (playerColors.length === 0) {
    // First pick - should be single-color only (handled separately)
    return getSingleColorHeroes()
  }
  
  // Separate heroes into single-color and multi-color
  const singleColor: Omit<Hero, 'location' | 'owner'>[] = []
  const multiColor: Omit<Hero, 'location' | 'owner'>[] = []
  
  allHeroes.forEach(hero => {
    if (hero.colors?.length === 1) {
      singleColor.push(hero)
    } else if (hero.colors && hero.colors.length > 1) {
      multiColor.push(hero)
    }
  })
  
  // Get 3 single-color heroes (slightly skewed toward player colors - 60% matching, 40% random)
  const singleColorCount = 3
  const multiColorCount = 2
  
  let selectedSingle: Omit<Hero, 'location' | 'owner'>[] = []
  if (singleColor.length > 0) {
    // Separate single-color heroes into matching and non-matching
    const matchingSingle = singleColor.filter(h => h.colors?.some(c => playerColors.includes(c)))
    const nonMatchingSingle = singleColor.filter(h => !h.colors?.some(c => playerColors.includes(c)))
    
    const matchingCount = Math.floor(singleColorCount * 0.6)
    const randomCount = singleColorCount - matchingCount
    
    selectedSingle = [
      ...shuffleArray(matchingSingle).slice(0, matchingCount),
      ...shuffleArray(nonMatchingSingle).slice(0, randomCount)
    ]
    
    // Fill remaining slots if needed
    if (selectedSingle.length < singleColorCount) {
      const remaining = shuffleArray(singleColor.filter(h => !selectedSingle.some(s => s.id === h.id)))
      selectedSingle.push(...remaining.slice(0, singleColorCount - selectedSingle.length))
    }
  }
  
  // Get 2 multicolor heroes (NOT skewed toward player colors - completely random)
  const selectedMulti = shuffleArray(multiColor).slice(0, multiColorCount)
  
  // Combine and shuffle
  const selected = [...selectedSingle, ...selectedMulti]
  return shuffleArray(selected).slice(0, count)
}

/**
 * Generate a hero pick pack (packs 1, 6, 11, 16)
 */
export function generateHeroPickPack(
  packNumber: number,
  heroPickNumber: 1 | 2 | 3 | 4,
  playerColors: Color[]
): RoguelikePack {
  let heroes: Omit<Hero, 'location' | 'owner'>[]
  
  if (heroPickNumber === 1) {
    // Pick 1: Single-color heroes only (one of each color)
    heroes = getSingleColorHeroes()
  } else {
    // Picks 2-4: Mix of single-color and 2-color heroes
    heroes = getHeroPickHeroes(playerColors, 5)
  }
  
  return {
    packNumber,
    heroes,
    artifacts: [],
    spells: [],
    units: [],
    allItems: heroes as any[], // Heroes only in hero picks
  }
}

// Helper to get good multicolor heroes for mixed packs
// Only include rare, powerful dual-color+ heroes (not weak single-color heroes)
function getGoodMulticolorHeroes(count: number): Omit<Hero, 'location' | 'owner'>[] {
  // Filter for multicolor heroes only (2+ colors)
  const multiColorHeroes = allHeroes.filter(h => h.colors && h.colors.length >= 2)
  
  // Return random selection from multicolor heroes
  return shuffleArray(multiColorHeroes).slice(0, count)
}

/**
 * Generate a mixed pack (all other packs)
 * Always generates exactly 15 cards total
 * 
 * Heroes in mixed packs: Only rare, good dual-color heroes (not weaker single-color heroes)
 * Distribution: At least 1 multicolor hero guaranteed per pack
 */
export function generateMixedPack(
  packNumber: number,
  playerColors: Color[]
): RoguelikePack {
  // Pack contents: Always 15 cards total
  // Distribution: 1 multicolor hero (guaranteed), 4 artifacts, 4 spells, 6 units
  const heroCount = 1  // Changed from 2 to 1, always multicolor
  const artifactCount = 4
  const spellCount = 4
  const unitCount = 6  // Increased from 5 to 6 to maintain 15 total
  
  // Get 1 good multicolor hero (not skewed toward player colors)
  const heroes = getGoodMulticolorHeroes(heroCount)
  const artifacts = getWeightedCards(allArtifacts, playerColors, artifactCount)
  const spells = getWeightedCards(allSpells, playerColors, spellCount)
  const units = getWeightedCards(allCards, playerColors, unitCount)
  
  // Flatten all items for easy picking
  const allItems: any[] = [
    ...heroes,
    ...artifacts,
    ...spells,
    ...units,
  ]
  
  return {
    packNumber,
    heroes,
    artifacts,
    spells,
    units,
    allItems: shuffleArray(allItems), // Shuffle so order isn't predictable
  }
}

/**
 * Generate a pack based on pack number and draft state
 */
export function generatePack(
  packNumber: number,
  playerColors: Color[],
  draftedHeroes: Omit<Hero, 'location' | 'owner'>[]
): RoguelikePack {
  const isHeroPick = ROGUELIKE_HERO_PICK_PACKS.includes(packNumber)
  
  if (isHeroPick) {
    // Determine which hero pick this is (1, 2, 3, or 4)
    const heroPickNumber = ROGUELIKE_HERO_PICK_PACKS.indexOf(packNumber) + 1 as 1 | 2 | 3 | 4
    return generateHeroPickPack(packNumber, heroPickNumber, playerColors)
  } else {
    return generateMixedPack(packNumber, playerColors)
  }
}

/**
 * Check if draft is complete
 */
export function isDraftComplete(state: RoguelikeDraftState): boolean {
  const totalCards = 
    state.draftedArtifacts.length +
    state.draftedSpells.length +
    state.draftedUnits.length
  
  return (
    state.draftedHeroes.length >= 4 &&
    totalCards >= 20
  )
}

/**
 * Get player colors from drafted heroes
 */
export function updatePlayerColors(heroes: Omit<Hero, 'location' | 'owner'>[]): Color[] {
  return getPlayerColors(heroes)
}



