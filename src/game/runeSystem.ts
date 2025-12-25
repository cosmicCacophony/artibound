import { RunePool, RuneColor, Color, Hero, BaseCard, Seal, PlayerId } from './types'

/**
 * Rune System
 * 
 * - Permanent runes: Added when you deploy a hero, removed when hero is bounced
 * - Temporary runes: Added by spells (Dark Ritual), cleared at end of turn
 * - Seals: Permanent artifacts that generate 1 rune of their color each turn
 * - Runes are used for color requirements of spells/cards
 * - Mana is used for generic costs (existing system)
 */

/**
 * Create an empty rune pool
 */
export function createEmptyRunePool(): RunePool {
  return {
    runes: [],
    temporaryRunes: [],
  }
}

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
    temporaryRunes: [],
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
    ...pool,
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
    ...pool,
    runes: newRunes,
  }
}

/**
 * Add temporary runes (like Dark Ritual - cleared at end of turn)
 */
export function addTemporaryRunes(pool: RunePool, colors: RuneColor[]): RunePool {
  // Safety check: ensure temporaryRunes is always an array
  const safeTemporaryRunes = Array.isArray(pool.temporaryRunes) ? pool.temporaryRunes : []
  return {
    ...pool,
    temporaryRunes: [...safeTemporaryRunes, ...colors],
  }
}

/**
 * Add permanent runes (one-shot effects that permanently increase rune pool)
 */
export function addPermanentRunes(pool: RunePool, colors: RuneColor[]): RunePool {
  return {
    ...pool,
    runes: [...pool.runes, ...colors],
  }
}

/**
 * Clear temporary runes (called at end of turn)
 */
export function clearTemporaryRunes(pool: RunePool): RunePool {
  return {
    ...pool,
    temporaryRunes: [],
  }
}

/**
 * Generate runes from seals (called at start of turn)
 * Returns temporary runes that last for the turn
 */
export function generateRunesFromSeals(seals: Seal[]): RuneColor[] {
  return seals.map(seal => seal.color)
}

/**
 * Create a new seal
 */
export function createSeal(name: string, color: RuneColor, owner: PlayerId): Seal {
  return {
    id: `seal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    color,
    owner,
  }
}

/**
 * Get all available runes (permanent + temporary)
 */
export function getAllAvailableRunes(pool: RunePool): RuneColor[] {
  return [...pool.runes, ...(pool.temporaryRunes || [])]
}

/**
 * Check if a card can be afforded (has enough mana AND required color runes)
 * Now considers both permanent and temporary runes
 * 
 * Cards with consumesRunes: true require runes to be available.
 * Generic cards (consumesRunes: false/undefined) just need hero color in lane.
 * 
 * Now also considers mech cost reduction if card is a mech
 */
export function canAffordCard(card: BaseCard, mana: number, runePool: RunePool, mechCostReduction: number = 0): boolean {
  // Check mana cost (with mech reduction if applicable)
  if (card.manaCost) {
    const effectiveCost = Math.max(0, card.manaCost - mechCostReduction)
    if (effectiveCost > mana) {
      return false
    }
  }
  
  // Only check runes if card consumes them
  if (!card.consumesRunes) {
    return true
  }
  
  // Check color requirements (runes) for non-generic cards
  if (!card.colors || card.colors.length === 0) {
    return true // No color requirements
  }
  
  // Check if we have enough runes of each required color (permanent + temporary)
  const availableRunes = getAllAvailableRunes(runePool)
  
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
  
  const availableRunes = getAllAvailableRunes(runePool)
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
 * Consumes temporary runes first, then permanent runes
 * Returns the updated rune pool with required runes removed
 * 
 * Only cards with consumesRunes: true consume runes.
 * Generic cards (consumesRunes: false/undefined) just need hero color in lane.
 */
export function consumeRunesForCard(card: BaseCard, runePool: RunePool): RunePool {
  // Only consume if card has consumesRunes: true
  if (!card.consumesRunes) {
    return runePool
  }
  
  if (!card.colors || card.colors.length === 0) {
    return runePool // No color requirements, no runes consumed
  }
  
  // Safety check: ensure temporaryRunes is always an array
  const safeTemporaryRunes = Array.isArray(runePool.temporaryRunes) ? runePool.temporaryRunes : []
  const safePermanentRunes = Array.isArray(runePool.runes) ? runePool.runes : []
  
  const newTemporaryRunes = [...safeTemporaryRunes]
  const newPermanentRunes = [...safePermanentRunes]
  
  // Remove one rune of each required color (prefer temporary first)
  for (const requiredColor of card.colors) {
    // Try temporary first
    const tempIndex = newTemporaryRunes.indexOf(requiredColor)
    if (tempIndex !== -1) {
      newTemporaryRunes.splice(tempIndex, 1)
    } else {
      // Fall back to permanent
      const permIndex = newPermanentRunes.indexOf(requiredColor)
      if (permIndex !== -1) {
        newPermanentRunes.splice(permIndex, 1)
      }
    }
  }
  
  return {
    runes: newPermanentRunes,
    temporaryRunes: newTemporaryRunes,
  }
}

/**
 * Consume specific runes (for hero abilities with rune costs)
 * Consumes temporary runes first, then permanent runes
 */
export function consumeRunes(pool: RunePool, colors: RuneColor[]): RunePool {
  // Safety check: ensure arrays are always arrays
  const safeTemporaryRunes = Array.isArray(pool.temporaryRunes) ? pool.temporaryRunes : []
  const safePermanentRunes = Array.isArray(pool.runes) ? pool.runes : []
  
  const newTemporaryRunes = [...safeTemporaryRunes]
  const newPermanentRunes = [...safePermanentRunes]
  
  for (const color of colors) {
    // Try temporary first
    const tempIndex = newTemporaryRunes.indexOf(color)
    if (tempIndex !== -1) {
      newTemporaryRunes.splice(tempIndex, 1)
    } else {
      // Fall back to permanent
      const permIndex = newPermanentRunes.indexOf(color)
      if (permIndex !== -1) {
        newPermanentRunes.splice(permIndex, 1)
      }
    }
  }
  
  return {
    runes: newPermanentRunes,
    temporaryRunes: newTemporaryRunes,
  }
}

/**
 * Check if pool has enough runes of specified colors
 */
export function hasRunes(pool: RunePool, colors: RuneColor[]): boolean {
  const available = getAllAvailableRunes(pool)
  
  for (const color of colors) {
    const index = available.indexOf(color)
    if (index === -1) {
      return false
    }
    available.splice(index, 1)
  }
  
  return true
}

/**
 * Get count of available runes by color (including temporary)
 */
export function getAvailableRunesByColor(pool: RunePool): Record<Color, number> {
  const counts: Record<Color, number> = {
    red: 0,
    blue: 0,
    white: 0,
    black: 0,
    green: 0,
  }
  
  const allRunes = getAllAvailableRunes(pool)
  allRunes.forEach((rune) => {
    counts[rune] = (counts[rune] || 0) + 1
  })
  
  return counts
}

/**
 * Get total available runes (permanent + temporary)
 */
export function getAvailableRuneCount(pool: RunePool): number {
  return pool.runes.length + (pool.temporaryRunes?.length || 0)
}

/**
 * Get count of temporary runes only
 */
export function getTemporaryRuneCount(pool: RunePool): number {
  return pool.temporaryRunes?.length || 0
}
