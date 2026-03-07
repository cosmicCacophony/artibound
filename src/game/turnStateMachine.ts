import { TurnPhase } from './types'

export type PhaseAction =
  | 'COMBAT_RESOLVED'
  | 'END_DEPLOY'
  | 'RESOURCE_COMPLETE'
  | 'TURN_SKIP'

interface TransitionEntry {
  from: TurnPhase
  to: TurnPhase
  action: PhaseAction
  prototype?: boolean // undefined = any mode, true = prototype only, false = non-prototype only
}

const TRANSITIONS: TransitionEntry[] = [
  { from: 'play', to: 'deploy', action: 'COMBAT_RESOLVED' },
  { from: 'deploy', to: 'resource', action: 'END_DEPLOY', prototype: true },
  { from: 'deploy', to: 'play', action: 'END_DEPLOY', prototype: false },
  { from: 'resource', to: 'play', action: 'RESOURCE_COMPLETE', prototype: true },
  // Manual turn skip (Next Turn button) can go from any phase to deploy
  { from: 'play', to: 'deploy', action: 'TURN_SKIP' },
  { from: 'deploy', to: 'deploy', action: 'TURN_SKIP' },
  { from: 'resource', to: 'deploy', action: 'TURN_SKIP' },
]

export function getNextPhase(
  current: TurnPhase,
  action: PhaseAction,
  isPrototype: boolean
): TurnPhase {
  const match = TRANSITIONS.find(t =>
    t.from === current &&
    t.action === action &&
    (t.prototype === undefined || t.prototype === isPrototype)
  )

  if (!match) {
    console.warn(
      `[FSM] Invalid phase transition: ${current} + ${action} (prototype=${isPrototype})`,
      new Error().stack
    )
    return current
  }

  return match.to
}

export function validateTransition(
  from: TurnPhase,
  to: TurnPhase,
  action: PhaseAction
): boolean {
  const valid = TRANSITIONS.some(t =>
    t.from === from &&
    t.to === to &&
    t.action === action
  )

  if (!valid) {
    console.warn(
      `[FSM] Rejected transition: ${from} -> ${to} via ${action}`,
      new Error().stack
    )
  }

  return valid
}

export function getValidActions(current: TurnPhase, isPrototype: boolean): PhaseAction[] {
  return TRANSITIONS
    .filter(t =>
      t.from === current &&
      (t.prototype === undefined || t.prototype === isPrototype)
    )
    .map(t => t.action)
}
