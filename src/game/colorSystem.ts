import { Color, ColorCombo, MAX_COLORS_PER_DECK, Hero, Card, BaseCard } from './types'

/**
 * Color System - Handles deck building rules and color constraints
 * 
 * Key Rules:
 * - Max 3 colors per deck
 * - Cards only playable in lanes with matching color heroes (like Artifact)
 * - Buffs/effects can be color-restricted
 * - Multicolor cards require heroes of ALL their colors in the lane
 */

/**
 * Get all unique colors from a list of cards
 */
export function getUniqueColors(cards: BaseCard[]): Color[] {
  const colorSet = new Set<Color>()
  
  for (const card of cards) {
    if (card.colors) {
      for (const color of card.colors) {
        colorSet.add(color)
      }
    }
  }
  
  return Array.from(colorSet).sort()
}

/**
 * Get all unique colors from a list of heroes (for draft validation)
 */
export function getColorsFromHeroes(heroes: Hero[]): Color[] {
  return getUniqueColors(heroes)
}

/**
 * Validate that a deck (heroes) has no more than MAX_COLORS_PER_DECK colors
 */
export function validateDeckColors(heroes: Hero[]): { valid: boolean; colors: Color[]; message?: string } {
  const colors = getColorsFromHeroes(heroes)
  
  if (colors.length > MAX_COLORS_PER_DECK) {
    return {
      valid: false,
      colors,
      message: `Deck has ${colors.length} colors. Maximum allowed is ${MAX_COLORS_PER_DECK}.`
    }
  }
  
  return { valid: true, colors }
}

/**
 * Check if a card can be played in a specific lane
 * A card can be played if there's a hero of each required color in that lane
 */
export function canPlayCardInLane(card: BaseCard, laneHeroes: Hero[]): boolean {
  // Colorless cards can always be played
  if (!card.colors || card.colors.length === 0) {
    return true
  }
  
  // Get all colors present in the lane
  const laneColors = new Set<Color>()
  for (const hero of laneHeroes) {
    if (hero.colors) {
      for (const color of hero.colors) {
        laneColors.add(color)
      }
    }
  }
  
  // Check if lane has ALL required colors for the card
  for (const requiredColor of card.colors) {
    if (!laneColors.has(requiredColor)) {
      return false
    }
  }
  
  return true
}

/**
 * Get multicolor card bonus based on deck colors
 * - 2 colors: 2 multicolor cards
 * - 3 colors: 1 hybrid of each pair + 1 triple-color card
 */
export function getMulticolorBonus(deckColors: Color[]): {
  dualColorCards: number
  tripleColorCard: number
} {
  if (deckColors.length === 2) {
    return {
      dualColorCards: 2,
      tripleColorCard: 0
    }
  }
  
  if (deckColors.length === 3) {
    return {
      dualColorCards: 0, // Actually 3 pairs, but we'll handle this separately
      tripleColorCard: 1
    }
  }
  
  // Monocolor or invalid
  return {
    dualColorCards: 0,
    tripleColorCard: 0
  }
}

/**
 * Generate all color pairs from a 3-color deck
 * Returns all possible 2-color combinations
 */
export function getColorPairs(colors: Color[]): Color[][] {
  if (colors.length < 2) return []
  
  const pairs: Color[][] = []
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      pairs.push([colors[i], colors[j]])
    }
  }
  
  return pairs
}

/**
 * Get all units of a specific color(s) in a lane
 */
export function getUnitsByColor(cards: Card[], colors: Color[]): Card[] {
  const colorSet = new Set(colors)
  
  return cards.filter(card => {
    if (!card.colors || card.colors.length === 0) return false
    // Check if card has at least one matching color
    return card.colors.some(color => colorSet.has(color))
  })
}

/**
 * Count units of a specific color in a lane
 */
export function countUnitsByColor(cards: Card[], color: Color): number {
  return getUnitsByColor(cards, [color]).length
}

/**
 * Check if player controls N units of the same color in a lane
 * Used for battlefield abilities like "+1/+0 if you control 3 of same color"
 */
export function hasNUnitsOfSameColor(cards: Card[], n: number): boolean {
  const colorCounts = new Map<Color, number>()
  
  for (const card of cards) {
    if (card.colors && card.colors.length > 0) {
      for (const color of card.colors) {
        colorCounts.set(color, (colorCounts.get(color) || 0) + 1)
      }
    }
  }
  
  // Check if any color has at least N units
  for (const count of colorCounts.values()) {
    if (count >= n) {
      return true
    }
  }
  
  return false
}

