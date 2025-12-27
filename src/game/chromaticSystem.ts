import { Hero, ChromaticPayoff, RuneColor } from './types'

/**
 * Chromatic Payoff System
 * 
 * Green's unique rune identity: heroes that trigger bonus effects when you
 * spend runes of colors they don't produce. This rewards multicolor drafting
 * without constraining rune usage.
 * 
 * Example: A green hero (produces G rune) gets bonus effects when you cast
 * spells that consume U, B, R, or W runes.
 */

/**
 * Check if a hero should trigger chromatic payoff
 * Returns the payoff effect if triggered, null otherwise
 */
export function checkChromaticPayoff(
  hero: Hero,
  consumedColors: RuneColor[]
): ChromaticPayoff | null {
  if (!hero.ability?.chromaticPayoff) return null
  
  const payoff = hero.ability.chromaticPayoff
  
  // Check if any consumed color matches trigger colors
  const triggeredColors = consumedColors.filter(color => 
    payoff.triggerColors.includes(color)
  )
  
  if (triggeredColors.length === 0) return null
  
  // If perRuneSpent, count how many runes triggered
  // Otherwise, just trigger once
  return {
    ...payoff,
    effectValue: payoff.perRuneSpent 
      ? payoff.effectValue * triggeredColors.length
      : payoff.effectValue
  }
}

/**
 * Get all chromatic payoffs triggered by a spell cast
 * Returns array of { hero, payoff } for all heroes that triggered
 */
export function getAllChromaticPayoffs(
  playerHeroes: Hero[],
  consumedColors: RuneColor[]
): Array<{ hero: Hero; payoff: ChromaticPayoff }> {
  const results: Array<{ hero: Hero; payoff: ChromaticPayoff }> = []
  
  for (const hero of playerHeroes) {
    const payoff = checkChromaticPayoff(hero, consumedColors)
    if (payoff) {
      results.push({ hero, payoff })
    }
  }
  
  return results
}

/**
 * Get a description of what colors would trigger a hero's chromatic payoff
 * Useful for UI tooltips
 */
export function getChromaticPayoffDescription(hero: Hero): string | null {
  if (!hero.ability?.chromaticPayoff) return null
  
  const payoff = hero.ability.chromaticPayoff
  const colors = payoff.triggerColors.map(c => c.toUpperCase()).join('/')
  
  return `Triggers on ${colors} runes: ${payoff.description}`
}


