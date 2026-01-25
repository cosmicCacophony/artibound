import { describe, it, expect } from 'vitest'
import type { Location, Hero } from './types'
import {
  calculateNextTurn,
  canDeployHeroThisTurn,
  getActivePlayerForTurn1Phase,
  getTurn1PhaseAfterPass,
  hasDeployableHero,
  normalizeTurnNumber,
  shouldEndDeployPhase,
  validateTurn1Deployment,
} from './deploymentRules'

const createHero = (id: string, location: Location): Hero => ({
  id,
  name: 'Test Hero',
  description: 'Test hero',
  cardType: 'hero',
  colors: ['red'],
  attack: 1,
  health: 1,
  maxHealth: 1,
  currentHealth: 1,
  location,
  owner: 'player1',
  equippedItems: [],
})

describe('deploymentRules', () => {
  describe('validateTurn1Deployment', () => {
    it('allows player 1 to deploy lane 1 first', () => {
      const result = validateTurn1Deployment('p1_lane1', 'player1', 'battlefieldA')
      expect(result.ok).toBe(true)
      expect(result.nextPhase).toBe('p2_lane1')
    })

    it('blocks wrong player on p1_lane1', () => {
      const result = validateTurn1Deployment('p1_lane1', 'player2', 'battlefieldA')
      expect(result.ok).toBe(false)
      expect(result.error).toContain('Player 1 must deploy first hero')
    })

    it('blocks wrong battlefield on p2_lane2', () => {
      const result = validateTurn1Deployment('p2_lane2', 'player2', 'battlefieldA')
      expect(result.ok).toBe(false)
      expect(result.error).toContain('lane 2')
    })

    it('allows player 2 to deploy lane 1 and advance', () => {
      const result = validateTurn1Deployment('p2_lane1', 'player2', 'battlefieldA')
      expect(result.ok).toBe(true)
      expect(result.nextPhase).toBe('p2_lane2')
    })

    it('rejects deployments after complete', () => {
      const result = validateTurn1Deployment('complete', 'player1', 'battlefieldA')
      expect(result.ok).toBe(false)
      expect(result.error).toContain('complete')
    })
  })

  describe('getTurn1PhaseAfterPass', () => {
    it('allows player 2 to pass counter-deploy on lane 1', () => {
      const result = getTurn1PhaseAfterPass('p2_lane1', 'player2')
      expect(result?.nextPhase).toBe('p2_lane2')
      expect(result?.nextActivePlayer).toBe('player2')
    })

    it('allows player 1 to pass counter-deploy on lane 2', () => {
      const result = getTurn1PhaseAfterPass('p1_lane2', 'player1')
      expect(result?.nextPhase).toBe('complete')
      expect(result?.nextActivePlayer).toBe('player1')
    })

    it('rejects invalid pass attempts', () => {
      const result = getTurn1PhaseAfterPass('p2_lane1', 'player1')
      expect(result).toBeNull()
    })
  })

  describe('getActivePlayerForTurn1Phase', () => {
    it('returns player2 for p2 phases', () => {
      expect(getActivePlayerForTurn1Phase('p2_lane1')).toBe('player2')
      expect(getActivePlayerForTurn1Phase('p2_lane2')).toBe('player2')
    })

    it('returns player1 for p1 phases', () => {
      expect(getActivePlayerForTurn1Phase('p1_lane1')).toBe('player1')
      expect(getActivePlayerForTurn1Phase('p1_lane2')).toBe('player1')
      expect(getActivePlayerForTurn1Phase('complete')).toBe('player1')
    })
  })

  describe('shouldEndDeployPhase', () => {
    it('ends turn 2 when both players deploy 1 hero', () => {
      const result = shouldEndDeployPhase({
        turn: 2,
        p1HeroesDeployed: 1,
        p2HeroesDeployed: 1,
        p1HasDeployHeroes: true,
        p2HasDeployHeroes: true,
      })
      expect(result).toBe(true)
    })

    it('keeps turn 2 open if a player has not deployed', () => {
      const result = shouldEndDeployPhase({
        turn: 2,
        p1HeroesDeployed: 1,
        p2HeroesDeployed: 0,
        p1HasDeployHeroes: true,
        p2HasDeployHeroes: true,
      })
      expect(result).toBe(false)
    })

    it('ends turn 2 if a player has no heroes to deploy', () => {
      const result = shouldEndDeployPhase({
        turn: 2,
        p1HeroesDeployed: 0,
        p2HeroesDeployed: 1,
        p1HasDeployHeroes: false,
        p2HasDeployHeroes: true,
      })
      expect(result).toBe(true)
    })

    it('ends turn 3+ only when both zones are empty', () => {
      const open = shouldEndDeployPhase({
        turn: 3,
        p1HeroesDeployed: 0,
        p2HeroesDeployed: 0,
        p1HasDeployHeroes: true,
        p2HasDeployHeroes: false,
      })
      expect(open).toBe(false)

      const closed = shouldEndDeployPhase({
        turn: 4,
        p1HeroesDeployed: 0,
        p2HeroesDeployed: 0,
        p1HasDeployHeroes: false,
        p2HasDeployHeroes: false,
      })
      expect(closed).toBe(true)
    })
  })

  describe('normalizeTurnNumber', () => {
    it('coerces string turn numbers to numbers', () => {
      expect(normalizeTurnNumber('1')).toBe(1)
      expect(normalizeTurnNumber('11')).toBe(11)
    })

    it('returns 0 for invalid numbers', () => {
      expect(normalizeTurnNumber('nope')).toBe(0)
    })
  })

  describe('calculateNextTurn', () => {
    it('does not increment when switching to player2', () => {
      const result = calculateNextTurn('1', 'player1')
      expect(result.nextPlayer).toBe('player2')
      expect(result.shouldIncrementTurn).toBe(false)
      expect(result.nextTurn).toBe(1)
    })

    it('increments when switching back to player1', () => {
      const result = calculateNextTurn('1', 'player2')
      expect(result.nextPlayer).toBe('player1')
      expect(result.shouldIncrementTurn).toBe(true)
      expect(result.nextTurn).toBe(2)
    })
  })

  describe('hasDeployableHero', () => {
    it('returns true for deploy zone hero', () => {
      const result = hasDeployableHero([], [createHero('h1', 'deployZone')], {})
      expect(result).toBe(true)
    })

    it('returns true for base hero with zero cooldown', () => {
      const result = hasDeployableHero([createHero('h1', 'base')], [], { h1: 0 })
      expect(result).toBe(true)
    })

    it('returns false when hero is on cooldown', () => {
      const result = hasDeployableHero([createHero('h1', 'base')], [], { h1: 1 })
      expect(result).toBe(false)
    })
  })

  describe('canDeployHeroThisTurn', () => {
    it('allows only one deploy on turn 2', () => {
      expect(canDeployHeroThisTurn(2, 0)).toBe(true)
      expect(canDeployHeroThisTurn(2, 1)).toBe(false)
    })

    it('allows multiple deploys on turn 3+', () => {
      expect(canDeployHeroThisTurn(3, 1)).toBe(true)
      expect(canDeployHeroThisTurn(4, 2)).toBe(true)
    })
  })
})
