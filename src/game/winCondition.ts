import { GameMetadata, PlayerId, TOWER_HP } from './types'

const TURN_LIMIT = 8

export interface WinCheckResult {
  gameOver: boolean
  winner: PlayerId | null
  winReason: 'towers_destroyed' | 'turn_limit' | null
}

/**
 * Check if either player has won by destroying both enemy towers.
 * Also checks the turn limit -- if reached, the player who dealt
 * the most total tower damage wins.
 */
export function checkWinCondition(metadata: GameMetadata): WinCheckResult {
  const p1TowerA = metadata.towerA_player1_HP
  const p1TowerB = metadata.towerB_player1_HP
  const p2TowerA = metadata.towerA_player2_HP
  const p2TowerB = metadata.towerB_player2_HP

  const bothP1TowersDead = p1TowerA <= 0 && p1TowerB <= 0
  const bothP2TowersDead = p2TowerA <= 0 && p2TowerB <= 0

  if (bothP1TowersDead && bothP2TowersDead) {
    const dmg = metadata.totalTowerDamageDealt || { player1: 0, player2: 0 }
    return {
      gameOver: true,
      winner: dmg.player1 >= dmg.player2 ? 'player1' : 'player2',
      winReason: 'towers_destroyed',
    }
  }

  if (bothP2TowersDead) {
    return { gameOver: true, winner: 'player1', winReason: 'towers_destroyed' }
  }

  if (bothP1TowersDead) {
    return { gameOver: true, winner: 'player2', winReason: 'towers_destroyed' }
  }

  if (metadata.currentTurn > TURN_LIMIT) {
    const dmg = metadata.totalTowerDamageDealt || { player1: 0, player2: 0 }
    const winner: PlayerId = dmg.player1 > dmg.player2
      ? 'player1'
      : dmg.player2 > dmg.player1
        ? 'player2'
        : 'player1'
    return { gameOver: true, winner, winReason: 'turn_limit' }
  }

  return { gameOver: false, winner: null, winReason: null }
}

/**
 * Compute how much total tower damage was dealt this combat round.
 * Used to accumulate totalTowerDamageDealt in metadata.
 */
export function computeTowerDamageDealt(
  before: { towerA_player1: number; towerA_player2: number; towerB_player1: number; towerB_player2: number },
  after: { towerA_player1: number; towerA_player2: number; towerB_player1: number; towerB_player2: number }
): { player1: number; player2: number } {
  // P1 deals damage to P2's towers, P2 deals damage to P1's towers
  const p1Dealt = Math.max(0, before.towerA_player2 - after.towerA_player2)
    + Math.max(0, before.towerB_player2 - after.towerB_player2)
  const p2Dealt = Math.max(0, before.towerA_player1 - after.towerA_player1)
    + Math.max(0, before.towerB_player1 - after.towerB_player1)

  return { player1: p1Dealt, player2: p2Dealt }
}

export const MAX_TURNS = TURN_LIMIT
