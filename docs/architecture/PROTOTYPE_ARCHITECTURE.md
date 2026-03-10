# Artibound Prototype Architecture

> **Status:** Active  
> **Scope:** Runeprototype game mode — client-side only  
> **Focus:** Current architecture for the RB vs GW prototype

---

## Overview

Artibound is a two-player hero card game prototype built with React and TypeScript. The architecture emphasizes **separation of concerns** between game logic and UI, **centralized state** via React Context, and **phase-driven flow** orchestrated by a state machine.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript |
| **Build** | Vite 5.x with HMR |
| **Styling** | Inline styles (React `CSSProperties`) |
| **State** | React Context + hooks (`useState`, `useEffect`, `useCallback`) |
| **Backend** | None — purely client-side prototype |

---

## Directory Structure

### `/src/game/` — Game Logic (separated from UI)

| File | Purpose |
|------|---------|
| **`types.ts`** | All TypeScript types/interfaces. Single source of truth: `Card`, `Hero`, `GenericUnit`, `SpellCard`, `GameState`, `GameMetadata`, `FormationTag`, `RuneScalingTier`, `TurnPhase`, etc. |
| **`runePrototypeData.ts`** | **Active prototype data.** RB and GW heroes, units, spells. Rune scaling helpers: `meetsRuneRequirement`, `getActiveRuneScalingTier`, `applyRuneScalingToUnit`, `applyRuneScalingToSpell`. Factory: `createRunePrototypeGameState()`. |
| **`turnStateMachine.ts`** | Phase transition logic. `getNextPhase(currentPhase, action, isRunePrototype)` returns next valid phase. |
| **`combatSystem.ts`** | Autobattler combat resolution using `FormationTag`. Handles frontline priority, ranged targeting, assassin tower strikes. |
| **`colorSystem.ts`** | Color identity utilities. |
| **`runeSystem.ts`** | Rune pool/seal management utilities. |
| **`battlefieldEffects.ts`** | Battlefield static ability implementations. |
| **`archetypeUtils.ts`** | Archetype classification helpers. |

### `/src/components/` — React UI Components

| File | Purpose |
|------|---------|
| **`Board.tsx`** | Main game board orchestrator. Manages deploy phase state machine (`idle` → `p1_choosing` → `p2_choosing` → `done`), modal rendering priority, resource/play phase transitions. Central coordination point. |
| **`PlayerArea.tsx`** | Player hand display, mana/nexus HP info, lane rune indicators. Renders cards using `HeroCard`. Passes `laneRunes` for tooltip display. |
| **`BattlefieldView.tsx`** | Single lane display. Shows both players' units, tower HP, lane runes. Handles drag-and-drop deployment, spell targeting, ability targeting. |
| **`HeroCard.tsx`** | Universal card renderer. Handles hero, generic, spell, item. Shows stats, formation tags, abilities, stun/death overlays, rune scaling indicators with hover tooltip. |
| **`RuneScalingPreview.tsx`** | Hover tooltip showing rune scaling tiers for a card, with lane-specific active tier highlighting. |
| **`LaneRuneDisplay.tsx`** | Small colored rune dot display for lane rune state. |
| **`ResourceChoiceModal.tsx`** | Modal for per-lane rune/mana choice. Shows available rune colors from lane heroes. |
| **`HeroDeployModal.tsx`** | Turn 2 modal for choosing lane to deploy secondary hero. |
| **`CombatSummaryModal.tsx`** | Post-combat results display. |
| **`GameHeader.tsx`** | Top bar: turn/phase info, Next Turn, Force Combat, Restart. |

### `/src/context/` — State Management

| File | Purpose |
|------|---------|
| **`GameContext.tsx`** | React Context provider. Holds game state (`GameState`), UI state (`selectedCard`, `draggedCard`, `pendingAbility`), combat summary data. Exposes `initializeRunePrototype()`, `setGameState`, `getLaneCapacity`. Single source of truth for runtime state. |

### `/src/hooks/` — Custom Hooks (game logic bridges)

| File | Purpose |
|------|---------|
| **`useDeployment.ts`** | Card deployment (hand → battlefield), spell casting, item equipping. |
| **`useCombat.ts`** | Combat stat modification (increase/decrease attack/health). |
| **`useTurnManagement.ts`** | Turn advancement, stun toggling, pass handling, card drawing, combat resolution. |
| **`useHeroAbilities.ts`** | Hero ability activation and targeting. |

---

## Key Architectural Patterns

### 1. Separation of Concerns

Game logic lives in `/src/game/` and is independent of React. Types, data, and state machines do not import UI. Components and hooks consume game modules as pure logic.

```
src/game/          ← Types, data, rules, combat
src/hooks/         ← Bridges logic to React
src/components/    ← UI only
```

### 2. Centralized State via Context

`GameContext` holds the full game state tree. Components read via `useGameContext()` and update via `setGameState(prev => ...)` for immutability.

### 3. Phase-Driven State Machine

`turnStateMachine.ts` defines valid phase transitions:

| From | Action | To |
|------|--------|-----|
| `deploy` | `END_DEPLOY` | `resource` (prototype only) |
| `resource` | `RESOURCE_COMPLETE` | `play` |
| `play` | `COMBAT_RESOLVED` | `deploy` |
| `*` | `TURN_SKIP` | `deploy` |

`Board.tsx` and `useTurnManagement` trigger phase advances when conditions are met.

### 4. Prototype vs Legacy Split

The prototype uses **`runePrototypeData.ts`** as its data source. `metadata.isRunePrototype` controls code paths. Legacy systems (comprehensive card data, roguelike draft, etc.) exist but are not used in the current flow.

### 5. Factory Pattern for Game State

`createRunePrototypeGameState()` builds the initial game state:

- Hero placement
- Deck shuffling
- Metadata initialization

### 6. Custom Hooks as Logic Bridges

Hooks encapsulate game actions so components stay focused on rendering:

- `useDeployment` — deployment, spells, items
- `useTurnManagement` — phases, combat, passes, draws
- `useHeroAbilities` — ability activation and targeting

### 7. Card Component Polymorphism

`HeroCard.tsx` renders all card types with conditional sections based on `card.cardType`. Props control combat controls, abilities, and drag-and-drop.

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GameContext (State)                               │
│  gameState, selectedCardId, draggedCardId, pendingAbility, combatSummary  │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Board.tsx     │         │ useDeployment    │         │ useTurnMgmt     │
│ Orchestrator  │         │ useCombat        │         │ useHeroAbilities│
│ - Phase UI    │         │ - Hand → Field   │         │ - Phase advance │
│ - Modals      │         │ - Spells, items  │         │ - Combat resolve│
└───────┬───────┘         └────────┬────────┘         └────────┬────────┘
        │                          │                           │
        │    ┌─────────────────────┴───────────────────────────┘
        │    │ setGameState(prev => ...)
        ▼    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PlayerArea │ BattlefieldView │ HeroCard │ GameHeader │ Modals            │
│ Read state via useGameContext() │ Call hook handlers for actions        │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Game Logic (read-only for UI)                                            │
│ turnStateMachine │ combatSystem │ runePrototypeData │ colorSystem │ etc.  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flow Summary

1. **User action** (e.g., deploy card, cast spell, pass turn) → handler in hook or component.
2. **Handler** calls `setGameState(prev => newState)` with updated state.
3. **GameContext** re-renders consumers with new state.
4. **Components** re-render. Modals and buttons reflect current phase and state.
5. **Phase transitions** are driven by `Board.tsx` and `useTurnManagement`, using `getNextPhase()` for validation.

### Combat Flow

Combat does not use separate `combatA`/`adjust`/`combatB` phases. It runs when both players pass during `play` phase:

1. `handleNextPhase` (in `useTurnManagement`) detects `play` + both passed.
2. `resolveSimultaneousCombat()` runs for lane A, then lane B.
3. Tower HP, unit deaths, and hero cooldowns are updated.
4. Phase moves to `deploy` via `COMBAT_RESOLVED`.
5. `CombatSummaryModal` shows results if enabled.

---

## Legacy Code (Not Active in Prototype)

| Location | Purpose | Status |
|----------|---------|--------|
| `comprehensiveCardData.ts` | Full card library for draft mode | Legacy; not loaded in prototype |
| `sampleData.ts` | Sample items and data | Legacy; referenced by some hooks |
| `cardData.ts` | Card storage/editor utilities | Legacy |
| `evolveSystem.ts`, `spellcasterSystem.ts`, `artifactSystem.ts` | Subsystems | Legacy |
| `roguelikeTypes.ts`, `roguelikeDraft.ts`, `bossData.ts`, `draftStorage.ts` | Roguelike draft mode | Legacy |
| `CardBrowserView`, `CardEditorModal`, `CardLibraryView`, etc. | Card/library UI | Legacy components |

---

## Related Documents

- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) — Broader technical design
- [ARCHITECTURE.md](./ARCHITECTURE.md) — High-level architecture overview
- [CARD_CREATION_GUIDELINES.md](./CARD_CREATION_GUIDELINES.md) — Card data standards
