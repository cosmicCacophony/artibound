import { describe, it, expect } from 'vitest'
import { getNextPhase, validateTransition, getValidActions } from './turnStateMachine'
import type { TurnPhase } from './types'

describe('turnStateMachine', () => {
  describe('getNextPhase', () => {
    it('play + COMBAT_RESOLVED -> deploy', () => {
      expect(getNextPhase('play', 'COMBAT_RESOLVED', false)).toBe('deploy')
      expect(getNextPhase('play', 'COMBAT_RESOLVED', true)).toBe('deploy')
    })

    it('deploy + END_DEPLOY -> resource (prototype)', () => {
      expect(getNextPhase('deploy', 'END_DEPLOY', true)).toBe('resource')
    })

    it('deploy + END_DEPLOY -> play (non-prototype)', () => {
      expect(getNextPhase('deploy', 'END_DEPLOY', false)).toBe('play')
    })

    it('resource + RESOURCE_COMPLETE -> play (prototype)', () => {
      expect(getNextPhase('resource', 'RESOURCE_COMPLETE', true)).toBe('play')
    })

    it('TURN_SKIP always goes to deploy', () => {
      expect(getNextPhase('play', 'TURN_SKIP', false)).toBe('deploy')
      expect(getNextPhase('deploy', 'TURN_SKIP', true)).toBe('deploy')
      expect(getNextPhase('resource', 'TURN_SKIP', true)).toBe('deploy')
    })

    it('returns current phase on invalid transition', () => {
      expect(getNextPhase('play', 'END_DEPLOY', false)).toBe('play')
      expect(getNextPhase('play', 'RESOURCE_COMPLETE', true)).toBe('play')
      expect(getNextPhase('resource', 'COMBAT_RESOLVED', true)).toBe('resource')
    })
  })

  describe('validateTransition', () => {
    it('accepts valid transitions', () => {
      expect(validateTransition('play', 'deploy', 'COMBAT_RESOLVED')).toBe(true)
      expect(validateTransition('deploy', 'resource', 'END_DEPLOY')).toBe(true)
      expect(validateTransition('deploy', 'play', 'END_DEPLOY')).toBe(true)
      expect(validateTransition('resource', 'play', 'RESOURCE_COMPLETE')).toBe(true)
    })

    it('rejects invalid transitions', () => {
      expect(validateTransition('play', 'resource', 'COMBAT_RESOLVED')).toBe(false)
      expect(validateTransition('resource', 'deploy', 'COMBAT_RESOLVED')).toBe(false)
      expect(validateTransition('deploy', 'resource', 'COMBAT_RESOLVED')).toBe(false)
    })
  })

  describe('getValidActions', () => {
    it('returns COMBAT_RESOLVED and TURN_SKIP for play phase', () => {
      const actions = getValidActions('play', true)
      expect(actions).toContain('COMBAT_RESOLVED')
      expect(actions).toContain('TURN_SKIP')
      expect(actions).not.toContain('END_DEPLOY')
    })

    it('returns END_DEPLOY and TURN_SKIP for deploy phase (prototype)', () => {
      const actions = getValidActions('deploy', true)
      expect(actions).toContain('END_DEPLOY')
      expect(actions).toContain('TURN_SKIP')
      expect(actions).not.toContain('COMBAT_RESOLVED')
    })

    it('returns RESOURCE_COMPLETE and TURN_SKIP for resource phase (prototype)', () => {
      const actions = getValidActions('resource', true)
      expect(actions).toContain('RESOURCE_COMPLETE')
      expect(actions).toContain('TURN_SKIP')
    })
  })

  describe('full turn cycle (prototype mode)', () => {
    it('walks through play -> deploy -> resource -> play', () => {
      let phase: TurnPhase = 'play'

      phase = getNextPhase(phase, 'COMBAT_RESOLVED', true)
      expect(phase).toBe('deploy')

      phase = getNextPhase(phase, 'END_DEPLOY', true)
      expect(phase).toBe('resource')

      phase = getNextPhase(phase, 'RESOURCE_COMPLETE', true)
      expect(phase).toBe('play')
    })
  })

  describe('full turn cycle (non-prototype mode)', () => {
    it('walks through play -> deploy -> play', () => {
      let phase: TurnPhase = 'play'

      phase = getNextPhase(phase, 'COMBAT_RESOLVED', false)
      expect(phase).toBe('deploy')

      phase = getNextPhase(phase, 'END_DEPLOY', false)
      expect(phase).toBe('play')
    })
  })
})
