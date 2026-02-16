import { GameMetadata, PlayerId } from './types'

type LaneId = 'battlefieldA' | 'battlefieldB'

export interface WinCheckResult {
  winner: PlayerId | null
  reason?: 'destroy_both_towers' | 'post_tower_nexus_damage'
}

const POST_TOWER_NEXUS_DAMAGE_TO_WIN = 20

function getOpponent(player: PlayerId): PlayerId {
  return player === 'player1' ? 'player2' : 'player1'
}

function getEnemyTowerKeys(player: PlayerId): { laneA: keyof GameMetadata; laneB: keyof GameMetadata } {
  return player === 'player1'
    ? { laneA: 'towerA_player2_HP', laneB: 'towerB_player2_HP' }
    : { laneA: 'towerA_player1_HP', laneB: 'towerB_player1_HP' }
}

export function checkWinCondition(metadata: GameMetadata): WinCheckResult {
  for (const player of ['player1', 'player2'] as PlayerId[]) {
    const enemyTowerKeys = getEnemyTowerKeys(player)
    const laneTracker =
      player === 'player1'
        ? metadata.player1LaneNexusDamageAfterTower
        : metadata.player2LaneNexusDamageAfterTower

    const enemyLaneADead = (metadata[enemyTowerKeys.laneA] as number) <= 0
    const enemyLaneBDead = (metadata[enemyTowerKeys.laneB] as number) <= 0

    if (enemyLaneADead && enemyLaneBDead) {
      return { winner: player, reason: 'destroy_both_towers' }
    }

    if (laneTracker) {
      const laneAWin =
        enemyLaneADead && laneTracker.battlefieldA >= POST_TOWER_NEXUS_DAMAGE_TO_WIN
      const laneBWin =
        enemyLaneBDead && laneTracker.battlefieldB >= POST_TOWER_NEXUS_DAMAGE_TO_WIN

      if (laneAWin || laneBWin) {
        return { winner: player, reason: 'post_tower_nexus_damage' }
      }
    }
  }

  return { winner: null }
}

export function applyLaneNexusPostTowerDamage(
  metadata: GameMetadata,
  player: PlayerId,
  lane: LaneId,
  amount: number
): GameMetadata {
  if (amount <= 0) return metadata

  const key =
    player === 'player1'
      ? 'player1LaneNexusDamageAfterTower'
      : 'player2LaneNexusDamageAfterTower'

  const current = metadata[key] || { battlefieldA: 0, battlefieldB: 0 }

  return {
    ...metadata,
    [key]: {
      ...current,
      [lane]: current[lane] + amount,
    },
  }
}

export function getWinReasonLabel(reason?: WinCheckResult['reason']): string {
  if (reason === 'destroy_both_towers') {
    return 'Destroyed both enemy towers.'
  }
  if (reason === 'post_tower_nexus_damage') {
    return 'Destroyed one enemy tower and dealt 20 post-tower nexus damage in that lane.'
  }
  return 'Victory condition met.'
}
