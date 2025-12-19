import { ArtifactCard, ArtifactEffectType, GameState, PlayerId, Card } from './types'

/**
 * Artifact System - Handles artifact effects that persist in base
 * 
 * Artifacts provide ongoing effects while in base, creating a resource
 * investment that survives board wipes.
 */

export interface ArtifactEffect {
  type: ArtifactEffectType
  value: number
  sourceId: string
  sourceName: string
}

/**
 * Get all active artifact effects for a player
 */
export function getArtifactEffects(player: PlayerId, gameState: GameState): ArtifactEffect[] {
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  const artifacts = playerBase.filter(card => card.cardType === 'artifact') as ArtifactCard[]
  
  return artifacts.map(artifact => ({
    type: artifact.effectType,
    value: artifact.effectValue,
    sourceId: artifact.id,
    sourceName: artifact.name,
  }))
}

/**
 * Get total effect value for a specific artifact effect type
 */
export function getArtifactEffectValue(
  player: PlayerId,
  gameState: GameState,
  effectType: ArtifactEffectType
): number {
  const effects = getArtifactEffects(player, gameState)
  return effects
    .filter(effect => effect.type === effectType)
    .reduce((sum, effect) => sum + effect.value, 0)
}

/**
 * Apply artifact effects to combat calculations
 * Returns modified attack/defense values
 */
export function applyArtifactCombatEffects(
  baseAttack: number,
  baseHealth: number,
  player: PlayerId,
  gameState: GameState
): { attack: number, health: number } {
  const damageAmplifier = getArtifactEffectValue(player, gameState, 'damage_amplifier')
  const defensiveBuff = getArtifactEffectValue(player, gameState, 'defensive_buff')
  
  return {
    attack: baseAttack + damageAmplifier,
    health: baseHealth + defensiveBuff,
  }
}

/**
 * Apply artifact effects to spell damage
 */
export function applyArtifactSpellEffects(
  baseDamage: number,
  player: PlayerId,
  gameState: GameState
): number {
  const spellAmplifier = getArtifactEffectValue(player, gameState, 'spell_amplifier')
  return baseDamage + spellAmplifier
}

