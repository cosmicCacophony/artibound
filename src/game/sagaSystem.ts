import { GameState, PlayerId, ArtifactCard } from './types'

/**
 * Get the combat damage bonus from Chapter 3 saga artifacts
 * Returns +3 damage if player has a saga artifact at Chapter 3
 */
export function getSagaCombatDamageBonus(
  gameState: GameState,
  player: PlayerId
): number {
  const playerBase = player === 'player1' ? gameState.player1Base : gameState.player2Base
  
  // Check for saga artifacts at Chapter 3
  const sagaArtifacts = playerBase.filter(
    card => card.cardType === 'artifact' && 
    (card as ArtifactCard).effectType === 'saga' &&
    (card as ArtifactCard).sagaCounters !== undefined &&
    (card as ArtifactCard).sagaCounters! >= 3
  ) as ArtifactCard[]
  
  // Chapter 3 saga artifacts give +3 damage to combat targets
  return sagaArtifacts.length > 0 ? 3 : 0
}


