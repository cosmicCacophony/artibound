/**
 * Card Data - Storage-Aware Exports
 * 
 * This file exports card data with localStorage overrides applied.
 * Use these exports instead of comprehensiveCardData for runtime card access.
 * 
 * Edits saved via cardStorage will persist across app restarts.
 */

import { 
  getCardsWithOverrides, 
  getHeroesWithOverrides, 
  getSpellsWithOverrides, 
  getBattlefieldsWithOverrides 
} from './cardStorage'
import { defaultGenericHeroes } from './comprehensiveCardData'

// Export storage-aware versions that automatically apply localStorage overrides
export const allCards = getCardsWithOverrides()
export const allHeroes = getHeroesWithOverrides()
export const allSpells = getSpellsWithOverrides()
export const allBattlefields = getBattlefieldsWithOverrides()

// Re-export other needed items
export { defaultGenericHeroes } from './comprehensiveCardData'

// Export storage functions for editing cards
export {
  updateCard,
  updateHero,
  updateSpell,
  updateBattlefield,
  resetCard,
  resetHero,
  resetSpell,
  resetBattlefield,
  clearAllOverrides,
} from './cardStorage'

// Make storage functions available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).artiboundCardEditor = {
    updateCard,
    updateHero,
    updateSpell,
    updateBattlefield,
    resetCard,
    resetHero,
    resetSpell,
    resetBattlefield,
    clearAllOverrides,
    // Helper to quickly edit Fireball damage
    editFireball: (damage: number) => {
      updateSpell('ru-spell-2', {
        effect: {
          type: 'targeted_damage',
          damage,
          affectsUnits: true,
          affectsHeroes: true,
        }
      })
      console.log(`Fireball damage updated to ${damage}! Restart the app to see it persist.`)
    },
  }
  console.log('💾 Card Editor available! Use window.artiboundCardEditor in console.')
  console.log('   Example: window.artiboundCardEditor.editFireball(10)')
}

