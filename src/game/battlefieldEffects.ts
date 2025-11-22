import { BattlefieldDefinition, Card, Color, GameMetadata } from './types'
import { hasNUnitsOfSameColor, countUnitsByColor } from './colorSystem'

/**
 * Battlefield Effects System
 * 
 * Handles static abilities for battlefields that affect gameplay.
 * Battlefields have persistent effects that apply while units are in that lane.
 */

export type BattlefieldEffectType = 
  | 'same-color-buff' // +1/+0 if you control 3 units of same color
  | 'gold-on-kill' // Gain extra gold for killing units
  | 'none' // No effect

export interface BattlefieldEffectResult {
  attackBonus?: number
  healthBonus?: number
  goldBonus?: number
  applied: boolean
  description: string
}

/**
 * Apply battlefield effect based on the battlefield definition and current lane state
 */
export function applyBattlefieldEffect(
  battlefield: BattlefieldDefinition,
  laneCards: Card[],
  owner: 'player1' | 'player2',
  metadata: GameMetadata
): BattlefieldEffectResult {
  switch (battlefield.staticAbilityId) {
    case 'same-color-buff':
      return applySameColorBuff(laneCards)
    
    case 'gold-on-kill':
      // This is handled separately when units die
      return {
        applied: false,
        description: battlefield.staticAbility
      }
    
    default:
      return {
        applied: false,
        description: battlefield.staticAbility || 'No effect'
      }
  }
}

/**
 * Apply +1/+0 buff if player controls 3 or more units of the same color
 */
function applySameColorBuff(laneCards: Card[]): BattlefieldEffectResult {
  const hasRequirement = hasNUnitsOfSameColor(laneCards, 3)
  
  if (hasRequirement) {
    return {
      attackBonus: 1,
      healthBonus: 0,
      applied: true,
      description: '+1/+0 to all units (3 same-color requirement met)'
    }
  }
  
  return {
    applied: false,
    description: 'Requires 3 units of the same color for +1/+0 bonus'
  }
}

/**
 * Calculate gold bonus for killing a unit on a gold-on-kill battlefield
 * Returns the bonus gold amount
 */
export function calculateGoldOnKillBonus(
  battlefield: BattlefieldDefinition,
  killedUnit: Card
): number {
  if (battlefield.staticAbilityId === 'gold-on-kill') {
    // Base gold for killing, plus battlefield bonus
    // Could scale based on unit cost/stats
    const baseGold = killedUnit.cardType === 'hero' ? 5 : 2
    const bonusGold = Math.max(1, Math.floor((killedUnit.manaCost || 0) / 2))
    
    return bonusGold
  }
  
  return 0
}

/**
 * Check if a battlefield effect is currently active for a lane
 */
export function isBattlefieldEffectActive(
  battlefield: BattlefieldDefinition,
  laneCards: Card[]
): boolean {
  switch (battlefield.staticAbilityId) {
    case 'same-color-buff':
      return hasNUnitsOfSameColor(laneCards, 3)
    
    case 'gold-on-kill':
      // Always potentially active (triggers on kills)
      return true
    
    default:
      return false
  }
}

/**
 * Get a description of what the battlefield effect does
 */
export function getBattlefieldEffectDescription(battlefield: BattlefieldDefinition): string {
  return battlefield.staticAbility || 'No effect'
}

/**
 * Get the visual indicator for a battlefield effect (for UI)
 */
export function getBattlefieldEffectIndicator(
  battlefield: BattlefieldDefinition,
  laneCards: Card[]
): { active: boolean; text: string; color?: string } {
  const active = isBattlefieldEffectActive(battlefield, laneCards)
  
  switch (battlefield.staticAbilityId) {
    case 'same-color-buff':
      return {
        active,
        text: active ? '+1/+0 Active' : 'Need 3 same-color units',
        color: active ? '#4caf50' : '#ff9800'
      }
    
    case 'gold-on-kill':
      return {
        active: true,
        text: 'Extra gold on kills',
        color: '#ffd700'
      }
    
    default:
      return {
        active: false,
        text: battlefield.staticAbility || 'No effect'
      }
  }
}

