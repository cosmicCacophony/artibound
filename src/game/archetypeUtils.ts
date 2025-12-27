import { BaseCard, Hero, Archetype, Color } from './types'

/**
 * Archetype Matching Utilities
 * 
 * Shared functions for matching cards and heroes to guild archetypes.
 * Used by both random game initialization and roguelike draft.
 */

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

/**
 * Check if a card matches active archetypes
 */
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

/**
 * Check if a hero matches active archetypes
 */
export function heroMatchesArchetype(
  hero: Omit<Hero, 'location' | 'owner'>,
  activeArchetypes: Archetype[]
): boolean {
  // Heroes are just cards with colors, so use the same logic
  return cardMatchesArchetype(hero as BaseCard, activeArchetypes)
}

