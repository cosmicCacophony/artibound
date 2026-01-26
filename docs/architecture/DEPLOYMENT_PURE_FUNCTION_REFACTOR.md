# Deployment Refactor: Pure Functions

> **Created:** 2026-01-25  
> **Status:** Active  
> **Category:** Architecture  
> **Scope:** Deployment flow (turn 1 sequencing + deploy phase gating)

## Why we refactored

We wanted deployment rules to be easier to reason about, easier to test, and safer to change without breaking turn flow. The deploy phase had grown into a dense set of conditionals inside React hooks, mixing UI state updates with rule validation. That made it hard to answer simple questions like "can this hero deploy right now?" without running the full hook.

The refactor separates **pure rules** from **side effects**:
- **Pure functions** live in `src/game/deploymentRules.ts`
- **Hooks** (e.g. `useDeployment`, `useTurnManagement`) orchestrate state and UI

This lets us test the rules in isolation and keep the React code focused on state updates and user feedback.

## What changed at a high level

**Before**
- Deployment rules were embedded inside `useDeployment` / `useTurnManagement`
- UI feedback, state updates, and rule validation were tangled
- Testing required component or hook-level setups

**After**
- Rules are centralized in `src/game/deploymentRules.ts` as pure functions
- Hooks call these rules and remain responsible for state mutation + alerts
- A dedicated test file covers the rules with fast unit tests

## Module overview: `deploymentRules.ts`

This file is deliberately small and rule-focused. It exposes composable functions that do not touch React state or mutate inputs.

### Rule table: `TURN1_RULES`

Turn 1 uses an Artifact-style counter-deploy sequence with explicit phases:
- `p1_lane1` -> `p2_lane1` -> `p2_lane2` -> `p1_lane2` -> `complete`

Each phase declares:
- required player
- required battlefield
- next phase on deploy
- whether the player can pass

This data-driven table is the core reason the logic is easy to read and extend.

### Key pure functions

- `validateTurn1Deployment(phase, player, battlefield)`
  - Returns `{ ok, error?, nextPhase? }`
  - Encodes all turn 1 sequencing and error messages

- `getTurn1PhaseAfterPass(phase, player)`
  - Returns `{ nextPhase, nextActivePlayer } | null`
  - Handles legal pass actions in turn 1

- `getActivePlayerForTurn1Phase(phase)`
  - Derives the active player based on phase

- `shouldEndDeployPhase({ turn, p1HeroesDeployed, p2HeroesDeployed, p1HasDeployHeroes, p2HasDeployHeroes })`
  - Encodes the turn 2 and turn 3+ rules in one place

- `normalizeTurnNumber(turn)`
  - Safe conversion for `string | number` turn values

- `calculateNextTurn(currentTurn, currentPlayer)`
  - Returns `{ nextTurn, nextPlayer, shouldIncrementTurn }`

- `hasDeployableHero(base, deployZone, cooldowns)`
  - Detects if a player can still deploy a hero

- `canDeployHeroThisTurn(turn, heroesDeployed)`
  - Implements the "one hero on turn 2" rule

## How the hooks use the rules

The hooks are now thin orchestration layers:
- **Validation** happens first (pure functions)
- **State updates** happen second (React state setters)
- **Feedback** happens last (alerts and UI updates)

Example flow (turn 1 deploy):
1. Call `validateTurn1Deployment` to confirm the action
2. Apply the deploy + bounce logic (state updates)
3. Use `getActivePlayerForTurn1Phase` to set `metadata.activePlayer`
4. Use `shouldEndDeployPhase` to decide if phase ends

Keeping validation pure prevents subtle bugs like:
- updating state before validation
- implicit turn assumptions
- inconsistent phase transitions

## Tests: `deploymentRules.test.ts`

We added targeted unit tests for the rule module. Tests cover:
- Valid and invalid turn 1 deployment actions
- Pass rules and phase transitions
- Deploy phase end conditions
- Turn normalization and next-turn calculations
- Deploy availability logic (cooldowns + deploy zones)

These tests are fast and deterministic because they never touch React or game state objects.

## Why this approach works well

- **Isolation:** rule changes do not require React-level refactors
- **Testability:** unit tests cover all rule branches
- **Readability:** rules live in one place and read top-down
- **Extensibility:** adding phases or new constraints is localized

## Considerations and alternative approaches

We discussed other ways to structure deployment rules:

### 1) Finite state machine (FSM)
- **Pros:** explicit transitions, visualizable, great for complex phase logic
- **Cons:** heavier dependency + setup for a small rule set
- **When to use:** if deployment grows to multiple sub-phases or new actor types

### 2) Reducer with action types
- **Pros:** centralized transition logic, standard React pattern
- **Cons:** still often mixes mutation and validation without care
- **When to use:** if we move more turn logic into reducers

### 3) Keep logic inside hooks
- **Pros:** fewer files, direct state access
- **Cons:** tight coupling, hard to test, easy to regress

Given our current scope, **pure functions + hook orchestration** gives the most clarity with the least overhead.

## Future-proofing notes

If we add more deployment rules (e.g., battlefield modifiers, hero tags, or new phases), the plan is:
- Keep rule data in `deploymentRules.ts`
- Add new pure functions or extend `TURN1_RULES`
- Expand tests before wiring into hooks

This keeps the deployment system consistent with the rest of the game logic layer and maintains predictable behavior.
