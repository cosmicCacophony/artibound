import { RunePool, RuneColor, Color, Hero, BaseCard } from './types'

/**
 * Simplified Rune System
 * 
 * - Runes are added one-time when you deploy a hero
 * - Runes are used for color requirements of spells/cards
 * - Mana is used for generic costs (existing system)
 * - When casting a spell, you pay mana AND consume required color runes
 */

/**
 * Create initial rune pool from heroes
 * Each hero adds runes based on their colors when deployed:
 * - Single color hero → adds 1 rune of that color
 * - Dual color hero → adds 1 rune of each color
 * - Triple color hero → adds 1 rune of each color
 */
export function createRunePool(heroes: Hero[]): RunePool {
  const runes: RuneColor[] = []
  
  for (const hero of heroes) {
    if (hero.colors) {
      for (const color of hero.colors) {
        runes.push(color as RuneColor)
      }
    }
  }
  
  return {
    runes,
  }
}

/**
 * Add runes from a deployed hero (one-time addition)
 * Called when a hero is deployed to a battlefield
 */
export function addRunesFromHero(hero: Hero, pool: RunePool): RunePool {
  const newRunes: RuneColor[] = []
  
  if (hero.colors) {
    for (const color of hero.colors) {
      newRunes.push(color as RuneColor)
    }
  }
  
  return {
    runes: [...pool.runes, ...newRunes],
  }
}

/**
 * Remove runes from pool (when hero is bounced/removed)
 * Called when a hero is removed from battlefield
 */
export function removeRunesFromHero(hero: Hero, pool: RunePool): RunePool {
  if (!hero.colors || hero.colors.length === 0) {
    return pool
  }
  
  const colorsToRemove = [...hero.colors]
  const newRunes = [...pool.runes]
  
  // Remove one rune of each color (remove first occurrence of each)
  for (const color of colorsToRemove) {
    const index = newRunes.indexOf(color as RuneColor)
    if (index !== -1) {
      newRunes.splice(index, 1)
    }
  }
  
  return {
    runes: newRunes,
  }
}

/**
 * Check if a card can be afforded (has enough mana AND required color runes)
 */
export function canAffordCard(card: BaseCard, mana: number, runePool: RunePool): boolean {
  // Check mana cost
  if (card.manaCost && card.manaCost > mana) {
    return false
  }
  
  // Check color requirements (runes)
  if (!card.colors || card.colors.length === 0) {
    return true // No color requirements
  }
  
  // Check if we have enough runes of each required color
  const availableRunes = [...runePool.runes]
  
  for (const requiredColor of card.colors) {
    const index = availableRunes.indexOf(requiredColor)
    if (index === -1) {
      return false // Missing required color rune
    }
    // Remove the rune from available pool (each color requirement consumes one rune)
    availableRunes.splice(index, 1)
  }
  
  return true
}

/**
 * Get missing runes for a card (for UI display)
 */
export function getMissingRunes(card: BaseCard, runePool: RunePool): Color[] {
  if (!card.colors || card.colors.length === 0) {
    return []
  }
  
  const availableRunes = [...runePool.runes]
  const missing: Color[] = []
  
  for (const requiredColor of card.colors) {
    const index = availableRunes.indexOf(requiredColor)
    if (index === -1) {
      missing.push(requiredColor)
    } else {
      // Remove the rune from available pool
      availableRunes.splice(index, 1)
    }
  }
  
  return missing
}

/**
 * Consume runes for a card (pay color requirements)
 * Returns the updated rune pool with required runes removed
 */
export function consumeRunesForCard(card: BaseCard, runePool: RunePool): RunePool {
  if (!card.colors || card.colors.length === 0) {
    return runePool // No color requirements, no runes consumed
  }
  
  const newRunes = [...runePool.runes]
  
  // Remove one rune of each required color
  for (const requiredColor of card.colors) {
    const index = newRunes.indexOf(requiredColor)
    if (index !== -1) {
      newRunes.splice(index, 1)
    }
  }
  
  return {
    runes: newRunes,
  }
}

/**
 * Get count of available runes by color
 */
export function getAvailableRunesByColor(pool: RunePool): Record<Color, number> {
  const counts: Record<Color, number> = {
    red: 0,
    blue: 0,
    white: 0,
    black: 0,
    green: 0,
  }
  
  pool.runes.forEach((rune) => {
    counts[rune] = (counts[rune] || 0) + 1
  })
  
  return counts
}

/**
 * Get total available runes
 */
export function getAvailableRuneCount(pool: RunePool): number {
  return pool.runes.length
}
