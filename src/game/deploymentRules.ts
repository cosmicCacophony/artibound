import { Card, PlayerId } from './types'

export type Turn1DeploymentPhase =
  | 'p1_lane1'
  | 'p2_lane1'
  | 'p2_lane2'
  | 'p1_lane2'
  | 'complete'

export type BattlefieldId = 'battlefieldA' | 'battlefieldB'

type Turn1DeploymentRule = {
  requiredPlayer: PlayerId
  requiredBattlefield: BattlefieldId
  nextPhaseOnDeploy: Turn1DeploymentPhase
  canPass: boolean
  nextPhaseOnPass?: Turn1DeploymentPhase
}

const TURN1_RULES: Record<Turn1DeploymentPhase, Turn1DeploymentRule | null> = {
  p1_lane1: {
    requiredPlayer: 'player1',
    requiredBattlefield: 'battlefieldA',
    nextPhaseOnDeploy: 'p2_lane1',
    canPass: false,
  },
  p2_lane1: {
    requiredPlayer: 'player2',
    requiredBattlefield: 'battlefieldA',
    nextPhaseOnDeploy: 'p2_lane2',
    canPass: true,
    nextPhaseOnPass: 'p2_lane2',
  },
  p2_lane2: {
    requiredPlayer: 'player2',
    requiredBattlefield: 'battlefieldB',
    nextPhaseOnDeploy: 'p1_lane2',
    canPass: false,
  },
  p1_lane2: {
    requiredPlayer: 'player1',
    requiredBattlefield: 'battlefieldB',
    nextPhaseOnDeploy: 'complete',
    canPass: true,
    nextPhaseOnPass: 'complete',
  },
  complete: null,
}

export const getActivePlayerForTurn1Phase = (phase: Turn1DeploymentPhase): PlayerId => {
  return phase === 'p2_lane1' || phase === 'p2_lane2' ? 'player2' : 'player1'
}

export const validateTurn1Deployment = (
  phase: Turn1DeploymentPhase,
  player: PlayerId,
  battlefield: BattlefieldId
): { ok: boolean; error?: string; nextPhase?: Turn1DeploymentPhase } => {
  const rule = TURN1_RULES[phase]
  if (!rule) {
    return { ok: false, error: 'Turn 1 deployment is complete.' }
  }

  if (player !== rule.requiredPlayer) {
    if (phase === 'p1_lane1') {
      return { ok: false, error: 'Player 1 must deploy first hero to lane 1 (Battlefield A)' }
    }
    if (phase === 'p2_lane1') {
      return { ok: false, error: 'Player 2 can counter-deploy to lane 1 or pass' }
    }
    if (phase === 'p2_lane2') {
      return { ok: false, error: 'Player 2 must deploy hero to lane 2 (Battlefield B)' }
    }
    if (phase === 'p1_lane2') {
      return { ok: false, error: 'Player 1 can counter-deploy to lane 2 or pass' }
    }
  }

  if (battlefield !== rule.requiredBattlefield) {
    if (phase === 'p1_lane1') {
      return { ok: false, error: 'Player 1 must deploy to lane 1 (Battlefield A) first' }
    }
    if (phase === 'p2_lane1') {
      return { ok: false, error: 'Player 2 can only counter-deploy to lane 1 (Battlefield A) or pass' }
    }
    if (phase === 'p2_lane2') {
      return { ok: false, error: 'Player 2 must deploy to lane 2 (Battlefield B)' }
    }
    if (phase === 'p1_lane2') {
      return { ok: false, error: 'Player 1 can only counter-deploy to lane 2 (Battlefield B) or pass' }
    }
  }

  return { ok: true, nextPhase: rule.nextPhaseOnDeploy }
}

export const getTurn1PhaseAfterPass = (
  phase: Turn1DeploymentPhase,
  player: PlayerId
): { nextPhase: Turn1DeploymentPhase; nextActivePlayer: PlayerId } | null => {
  const rule = TURN1_RULES[phase]
  if (!rule || !rule.canPass || rule.requiredPlayer !== player || !rule.nextPhaseOnPass) {
    return null
  }

  return {
    nextPhase: rule.nextPhaseOnPass,
    nextActivePlayer: getActivePlayerForTurn1Phase(rule.nextPhaseOnPass),
  }
}

export const shouldEndDeployPhase = ({
  turn,
  p1HeroesDeployed,
  p2HeroesDeployed,
  p1HasDeployHeroes,
  p2HasDeployHeroes,
}: {
  turn: number
  p1HeroesDeployed: number
  p2HeroesDeployed: number
  p1HasDeployHeroes: boolean
  p2HasDeployHeroes: boolean
}): boolean => {
  if (turn === 2) {
    return (p1HeroesDeployed >= 1 || !p1HasDeployHeroes)
      && (p2HeroesDeployed >= 1 || !p2HasDeployHeroes)
  }

  if (turn >= 3) {
    return !p1HasDeployHeroes && !p2HasDeployHeroes
  }

  return false
}

export const normalizeTurnNumber = (turn: number | string): number => {
  const parsed = Number(turn)
  return Number.isNaN(parsed) ? 0 : parsed
}

export const calculateNextTurn = (
  currentTurn: number | string,
  currentPlayer: PlayerId
): { nextTurn: number; nextPlayer: PlayerId; shouldIncrementTurn: boolean } => {
  const normalized = normalizeTurnNumber(currentTurn)
  const nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1'
  const shouldIncrementTurn = nextPlayer === 'player1'
  return {
    nextTurn: normalized + (shouldIncrementTurn ? 1 : 0),
    nextPlayer,
    shouldIncrementTurn,
  }
}

export const hasDeployableHero = (
  base: Card[],
  deployZone: Card[],
  cooldowns: Record<string, number>
): boolean => {
  const baseHeroesReady = base.some(card => card.cardType === 'hero' && (cooldowns[card.id] || 0) === 0)
  const deployHeroesReady = deployZone.some(card => card.cardType === 'hero')
  return baseHeroesReady || deployHeroesReady
}

export const canDeployHeroThisTurn = (
  turn: number | string,
  heroesDeployed: number
): boolean => {
  const normalized = normalizeTurnNumber(turn)
  if (normalized === 2) {
    return heroesDeployed < 1
  }
  return true
}
