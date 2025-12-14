# Artibound - Technical Architecture Documentation

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Category:** Architecture  
> **Focus:** Technical implementation details and design decisions

## Overview

Artibound is a React + TypeScript card game application built with a focus on:
- **Type safety** through comprehensive TypeScript usage
- **Separation of concerns** between UI, state management, and game logic
- **Maintainability** through modular architecture and clear boundaries
- **Extensibility** for adding new game mechanics and features

## Technology Stack

- **Runtime:** React 18.2.0 with TypeScript 5.2.2
- **Build Tool:** Vite 5.0.8
- **State Management:** React Context API + Custom Hooks pattern
- **Storage:** localStorage for game state persistence and card overrides
- **No External State Libraries:** Intentionally avoiding Redux/Zustand for simplicity

## Architecture Pattern

### Context API + Custom Hooks Pattern

The application uses a **hybrid approach** combining:
1. **React Context API** (`GameContext`) for global state
2. **Custom Hooks** for domain-specific logic encapsulation
3. **Pure game logic modules** for business rules

This pattern was chosen over Redux/Zustand because:
- **Lower complexity** - No need for actions/reducers/middleware
- **Better TypeScript integration** - Direct type inference from context
- **Sufficient for current scope** - Game state is manageable without complex state management
- **Easier to understand** - Standard React patterns

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI Components Layer                    │
│  (Board, BattlefieldView, HeroCard, PlayerArea, etc.)    │
└────────────────────┬──────────────────────────────────────┘
                     │
                     │ Uses
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Custom Hooks Layer                      │
│  (useDeployment, useCombat, useTurnManagement, etc.)    │
└────────────────────┬──────────────────────────────────────┘
                     │
                     │ Uses
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Context Layer                           │
│              (GameContext.tsx)                           │
│  - Centralized state management                          │
│  - State setters and getters                             │
│  - Computed values                                       │
└────────────────────┬──────────────────────────────────────┘
                     │
                     │ Uses
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Game Logic Layer                          │
│  (combatSystem, draftSystem, colorSystem, etc.)          │
│  - Pure functions                                        │
│  - No side effects                                       │
│  - Business rules                                        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     │ Uses
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                              │
│  (comprehensiveCardData, types, cardStorage)             │
│  - Type definitions                                      │
│  - Card templates                                        │
│  - Data persistence                                      │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── components/          # React UI components
│   ├── Board.tsx        # Main game container (orchestrates UI)
│   ├── BattlefieldView.tsx
│   ├── HeroCard.tsx
│   ├── PlayerArea.tsx
│   └── ...              # Other UI components
│
├── context/             # React Context providers
│   └── GameContext.tsx  # Global game state context
│
├── hooks/               # Custom React hooks (domain logic)
│   ├── useDeployment.ts      # Card deployment logic
│   ├── useCombat.ts          # Combat resolution logic
│   ├── useTurnManagement.ts  # Turn/phase progression
│   ├── useDraft.ts           # Draft system logic
│   ├── useItemShop.ts        # Item shop interactions
│   └── ...                   # Other domain hooks
│
├── game/                # Pure game logic (no React)
│   ├── types.ts              # TypeScript type definitions
│   ├── comprehensiveCardData.ts  # All card templates
│   ├── cardData.ts            # Storage-aware card exports
│   ├── cardStorage.ts         # localStorage persistence layer
│   ├── combatSystem.ts        # Combat resolution algorithms
│   ├── draftSystem.ts         # Draft pack generation & matching
│   ├── colorSystem.ts         # Color validation logic
│   ├── battlefieldEffects.ts  # Battlefield static abilities
│   ├── draftData.ts           # Draft-specific data
│   └── sampleData.ts          # Legacy data (being phased out)
│
├── App.tsx              # Root component (view routing)
├── main.tsx             # Application entry point
└── vite-env.d.ts        # Vite type definitions
```

## State Management Architecture

### GameContext Design

**Location:** `src/context/GameContext.tsx`

The `GameContext` serves as the **single source of truth** for all game state. It provides:

1. **Core Game State**
   - `gameState: GameState` - Complete game state (hands, bases, battlefields, metadata)
   - `setGameState` - Immutable state updater

2. **UI State**
   - `selectedCardId` - Currently selected card for actions
   - `itemShopPlayer` - Which player's shop is open
   - `combatTargetsA/B` - Combat target assignments per battlefield
   - Modal visibility states

3. **Card Library State**
   - `player1SidebarCards` / `player2SidebarCards` - Card library for each player
   - `archivedCards` - Archived card templates

4. **Computed Values**
   - `selectedCard` - Derived from `selectedCardId` and `gameState`
   - `metadata` - Shorthand for `gameState.metadata`
   - `activePlayer` - Shorthand for `metadata.activePlayer`

5. **Helper Functions**
   - `getAvailableSlots()` - Calculate available battlefield slots
   - `initializeGameFromDraft()` - Initialize game from draft selections
   - `initializeRandomGame()` - Quick game setup for testing

### State Update Pattern

All state updates follow **immutable update patterns**:

```typescript
setGameState(prev => ({
  ...prev,
  battlefieldA: {
    ...prev.battlefieldA,
    player1: [...prev.battlefieldA.player1, newCard]
  },
  metadata: {
    ...prev.metadata,
    player1Mana: prev.metadata.player1Mana - cardCost
  }
}))
```

**Rationale:**
- Prevents accidental mutations
- Enables React's efficient re-rendering
- Makes state changes explicit and traceable
- Easier to implement undo/redo (future feature)

### GameState Structure

```typescript
interface GameState {
  // Player hands (cards available to play)
  player1Hand: Card[]
  player2Hand: Card[]
  
  // Player bases (heroes waiting to deploy)
  player1Base: Card[]
  player2Base: Card[]
  
  // Battlefields (active game board)
  battlefieldA: Battlefield  // { player1: Card[], player2: Card[] }
  battlefieldB: Battlefield
  
  // Card library (for sidebar/card editor)
  cardLibrary: BaseCard[]
  
  // Game metadata (turn, phase, resources, etc.)
  metadata: GameMetadata
}
```

### GameMetadata Structure

```typescript
interface GameMetadata {
  // Turn/Phase Management
  currentTurn: number
  activePlayer: PlayerId
  currentPhase: TurnPhase  // 'play' | 'combatA' | 'adjust' | 'combatB'
  
  // Resources
  player1Mana: number
  player2Mana: number
  player1MaxMana: number  // Increases by 1 per turn, capped at 10
  player2MaxMana: number
  player1Gold: number
  player2Gold: number
  
  // Health Tracking
  player1NexusHP: number
  player2NexusHP: number
  towerA_player1_HP: number
  towerA_player2_HP: number
  towerB_player1_HP: number
  towerB_player2_HP: number
  
  // Cooldowns & State
  deathCooldowns: Record<string, number>  // Hero death cooldowns
  heroAbilityCooldowns: Record<string, number>  // Ability cooldowns
  playedSpells: Record<string, boolean>  // Track played cards
  
  // Action/Initiative System
  actionPlayer: PlayerId | null  // Who can act right now
  initiativePlayer: PlayerId | null  // Who has initiative (acts first next turn)
  
  // Battlefield Upgrades
  player1BattlefieldBuffs: BattlefieldBuff[]
  player2BattlefieldBuffs: BattlefieldBuff[]
  
  // Turn 1 Deployment
  turn1DeploymentPhase?: 'p1_lane1' | 'p2_lane1' | 'p2_lane2' | 'p1_lane2' | 'complete'
}
```

**Design Decision:** Using `Record<string, T>` instead of `Map<string, T>` for JSON serialization compatibility with localStorage.

## Custom Hooks Pattern

### Purpose

Custom hooks encapsulate **domain-specific logic** while maintaining React's declarative paradigm. Each hook handles a specific game system.

### Hook Responsibilities

#### `useDeployment.ts`
- **Purpose:** Card deployment from hand/base to battlefield
- **Responsibilities:**
  - Validate deployment (mana, slots, color requirements)
  - Handle turn 1 counter-deployment sequence
  - Manage slot assignment
  - Update game state immutably
- **Returns:** Deployment handler functions

#### `useCombat.ts`
- **Purpose:** Combat phase logic
- **Responsibilities:**
  - Target selection and validation
  - Combat resolution orchestration
  - Combat summary generation
- **Returns:** Combat handler functions

#### `useTurnManagement.ts`
- **Purpose:** Turn and phase progression
- **Responsibilities:**
  - Phase transitions (play → combatA → adjust → combatB)
  - Turn advancement
  - Mana/gold regeneration
  - Death cooldown management
  - Dark Archmage spawn logic (start of turn effects)
- **Returns:** Phase/turn handler functions

#### `useDraft.ts`
- **Purpose:** Draft system logic
- **Responsibilities:**
  - Pack generation
  - Pick tracking
  - Archetype matching
  - Final deck construction
- **Returns:** Draft state and handlers

#### `useItemShop.ts`
- **Purpose:** Item shop interactions
- **Responsibilities:**
  - Shop item generation
  - Item purchase validation
  - Item equipping logic
- **Returns:** Shop handlers

**Design Decision:** Hooks are **stateless** - they read from and write to `GameContext`, not local state. This ensures single source of truth.

## Game Logic Layer

### Pure Functions Principle

All game logic modules are **pure functions** with no side effects:

```typescript
// ✅ Good: Pure function
export function resolveCombat(
  battlefield: Battlefield,
  combatActions: Map<string, AttackTarget>
): CombatResult {
  // No side effects, returns new state
}

// ❌ Bad: Would have side effects
export function resolveCombat() {
  setGameState(...)  // Side effect!
}
```

**Benefits:**
- **Testable** - Easy to unit test with predictable inputs/outputs
- **Predictable** - Same inputs always produce same outputs
- **Composable** - Functions can be combined easily
- **Debuggable** - No hidden state changes

### Module Organization

#### `combatSystem.ts`
- **Purpose:** Combat resolution algorithms
- **Key Functions:**
  - `getDefaultTarget()` - Positional targeting logic
  - `resolveAttack()` - Single attack resolution
  - `resolveSimultaneousCombat()` - Full battlefield combat
- **Dependencies:** `types.ts` only

#### `draftSystem.ts`
- **Purpose:** Draft pack generation and archetype matching
- **Key Functions:**
  - `cardMatchesArchetype()` - Filter cards by archetype
  - `heroMatchesArchetype()` - Filter heroes by archetype
  - `selectCardsForPack()` - Generate draft packs
- **Dependencies:** `types.ts`, `comprehensiveCardData.ts`, `draftData.ts`

#### `colorSystem.ts`
- **Purpose:** Color validation and deck building rules
- **Key Functions:**
  - `validateDeckColors()` - Enforce color limits
  - `canPlayCardInLane()` - Check color requirements
- **Dependencies:** `types.ts` only

#### `battlefieldEffects.ts`
- **Purpose:** Battlefield static ability application
- **Key Functions:**
  - `applyBattlefieldEffect()` - Apply static bonuses
  - `calculateGoldOnKillBonus()` - Gold reward calculation
- **Dependencies:** `types.ts`, `colorSystem.ts`

## Type System Design

### Type Hierarchy

```typescript
// Base type (all cards share this)
interface BaseCard {
  id: string
  name: string
  description: string
  cardType: CardType
  manaCost?: number
  colors?: Color[]
}

// Specific card types extend BaseCard
interface Hero extends BaseCard {
  cardType: 'hero'
  attack: number
  health: number
  // ... hero-specific fields
}

interface GenericUnit extends BaseCard {
  cardType: 'generic'
  attack: number
  health: number
  // ... unit-specific fields
}

// Union type for runtime card instances
type Card = Hero | SignatureCard | HybridCard | GenericUnit | SpellCard | ItemCard
```

### Type Safety Decisions

1. **Discriminated Unions**

   **What are Discriminated Unions?**
   
   A discriminated union is a TypeScript pattern where multiple types share a common property (the "discriminator") with literal values. TypeScript uses this property to narrow the type at compile-time.

   **Implementation in Artibound:**
   
   All card types share the `cardType` property, but each has a unique literal value:
   
   ```typescript
   interface Hero extends BaseCard {
     cardType: 'hero'  // ← Discriminator value
     attack: number
     health: number
     ability?: HeroAbility
     // ... hero-specific fields
   }
   
   interface SpellCard extends BaseCard {
     cardType: 'spell'  // ← Different discriminator value
     effect: SpellEffect
     initiative?: boolean
     // ... spell-specific fields (NO attack/health)
   }
   
   interface GenericUnit extends BaseCard {
     cardType: 'generic'  // ← Another discriminator value
     attack: number
     health: number
     stackedWith?: string
     // ... unit-specific fields
   }
   
   // Union type - TypeScript knows these are mutually exclusive
   type Card = Hero | SignatureCard | HybridCard | GenericUnit | SpellCard | ItemCard
   ```

   **How Type Narrowing Works:**
   
   When you check the `cardType` property, TypeScript automatically narrows the type to the specific interface:

   ```typescript
   function processCard(card: Card) {
     // ❌ Error: Property 'attack' does not exist on type 'Card'
     // TypeScript doesn't know which card type this is yet
     console.log(card.attack)  // ERROR!
     
     // ✅ Type narrowing: Check the discriminator
     if (card.cardType === 'hero') {
       // TypeScript now knows: card is Hero
       // All Hero properties are available
       console.log(card.attack)      // ✅ OK - Hero has attack
       console.log(card.health)      // ✅ OK - Hero has health
       console.log(card.ability)     // ✅ OK - Hero has ability
       console.log(card.effect)      // ❌ ERROR - Hero doesn't have effect
     }
     
     if (card.cardType === 'spell') {
       // TypeScript now knows: card is SpellCard
       console.log(card.effect)      // ✅ OK - SpellCard has effect
       console.log(card.initiative)  // ✅ OK - SpellCard has initiative
       console.log(card.attack)      // ❌ ERROR - SpellCard doesn't have attack
     }
   }
   ```

   **Real Examples from the Codebase:**

   **Example 1: Combat System - Checking Card Type**
   
   ```typescript
   // From combatSystem.ts
   function getAttackPower(unit: Card, targetIsHero: boolean = false): number {
     let baseAttack = 0
     
     // Type narrowing: Check if it's a generic unit with stacking
     if (unit.cardType === 'generic' && 'stackPower' in unit && unit.stackPower !== undefined) {
       // TypeScript knows: unit is GenericUnit
       baseAttack = unit.stackPower  // ✅ OK - GenericUnit has stackPower
     } else if ('attack' in unit) {
       // TypeScript knows: unit is Hero | GenericUnit | SignatureCard | HybridCard
       // (all have 'attack' property)
       baseAttack = unit.attack  // ✅ OK
     }
     
     // Type narrowing: Check if it's a hero with bonus damage
     if (targetIsHero && unit.cardType === 'hero' && 'bonusVsHeroes' in unit && unit.bonusVsHeroes) {
       // TypeScript knows: unit is Hero
       return baseAttack + unit.bonusVsHeroes  // ✅ OK - Hero has bonusVsHeroes
     }
     
     return baseAttack
   }
   ```

   **Example 2: Deployment Logic - Handling Different Card Types**
   
   ```typescript
   // From useDeployment.ts
   function handleDeploy(card: Card, location: Location) {
     // Type narrowing: Different logic for heroes vs other cards
     if (card.cardType === 'hero') {
       // TypeScript knows: card is Hero
       const cooldownCounter = metadata.deathCooldowns[card.id]
       if (cooldownCounter !== undefined && cooldownCounter > 0) {
         alert(`Hero is on cooldown!`)  // ✅ Only heroes have death cooldowns
       }
       
       // ✅ Can access hero-specific properties
       const heroAbility = card.ability
       const equippedItems = card.equippedItems
     }
     
     // Type narrowing: Spells have different validation
     if (card.cardType === 'spell') {
       // TypeScript knows: card is SpellCard
       const spellEffect = card.effect  // ✅ OK - SpellCard has effect
       // ❌ card.attack would be an error here
     }
     
     // Type narrowing: Generic units can stack
     if (card.cardType === 'generic') {
       // TypeScript knows: card is GenericUnit
       const stackable = card.stackedWith  // ✅ OK - GenericUnit has stackedWith
       const stackPower = card.stackPower   // ✅ OK - GenericUnit has stackPower
     }
   }
   ```

   **Example 3: Turn Management - Different Death Rewards**
   
   ```typescript
   // From useTurnManagement.ts
   function handleCardDeath(card: Card) {
     // Type narrowing: Different gold rewards for heroes vs units
     if (card.cardType === 'hero') {
       // TypeScript knows: card is Hero
       // Heroes give 5 gold when killed
       const goldReward = 5
       // ✅ Can access hero-specific properties
       const heroName = card.name
       const heroAbility = card.ability
     } else if (card.cardType === 'generic') {
       // TypeScript knows: card is GenericUnit
       // Units give 2 gold when killed
       const goldReward = 2
       // ✅ Can access unit-specific properties
       const unitAttack = card.attack
       const isStacked = card.stackedWith !== undefined
     }
     // Note: Spells don't die, so they're not handled here
   }
   ```

   **Example 4: Card Creation - Type-Specific Instantiation**
   
   ```typescript
   // From sampleData.ts
   function createCardFromTemplate(template: BaseCard, owner: PlayerId): Card {
     // Type narrowing: Different instantiation logic per card type
     if (template.cardType === 'hero') {
       // TypeScript knows: template is Omit<Hero, 'location' | 'owner'>
       return {
         ...template,
         location: 'base',
         owner: owner,
         // ✅ All Hero properties are available
         attack: template.attack,
         health: template.health,
         ability: template.ability,
       } as Hero
     }
     
     if (template.cardType === 'spell') {
       // TypeScript knows: template is Omit<SpellCard, 'location' | 'owner'>
       return {
         ...template,
         location: 'hand',
         owner: owner,
         // ✅ All SpellCard properties are available
         effect: template.effect,
         initiative: template.initiative,
       } as SpellCard
     }
     
     // ... similar for other card types
   }
   ```

   **Benefits of Discriminated Unions:**

   1. **Compile-Time Safety**
      - TypeScript catches errors before runtime
      - Prevents accessing properties that don't exist on a card type
      - Example: Trying to access `card.attack` on a `SpellCard` is a compile error

   2. **IntelliSense Support**
      - IDE autocomplete shows only valid properties after type narrowing
      - Reduces typos and incorrect property access
      - Example: After `if (card.cardType === 'hero')`, IDE suggests `ability`, `equippedItems`, etc.

   3. **Refactoring Safety**
      - If you change a card type's properties, TypeScript finds all affected code
      - Example: Removing `attack` from `Hero` would show errors everywhere it's accessed

   4. **Self-Documenting Code**
      - The type narrowing makes it clear which card type you're working with
      - Example: `if (card.cardType === 'hero')` immediately tells you the code block handles heroes

   **Without Discriminated Unions (What We'd Have to Do):**

   ```typescript
   // ❌ Bad: Type assertions everywhere (unsafe)
   function processCard(card: Card) {
     if ((card as any).attack) {  // Unsafe type assertion
       console.log((card as Hero).attack)  // Could be wrong!
     }
   }
   
   // ❌ Bad: Property checks (verbose, error-prone)
   function processCard(card: Card) {
     if ('attack' in card && 'ability' in card) {
       // Is this a Hero? Or GenericUnit? Or SignatureCard?
       // All have 'attack', but only Hero has 'ability'
       // But what if we add ability to another type later?
     }
   }
   
   // ✅ Good: Discriminated union (safe, clear, type-safe)
   function processCard(card: Card) {
     if (card.cardType === 'hero') {
       // TypeScript guarantees: card is Hero
       console.log(card.attack)   // ✅ Type-safe
       console.log(card.ability)  // ✅ Type-safe
     }
   }
   ```

   **Common Patterns with Discriminated Unions:**

   ```typescript
   // Pattern 1: If/else chain
   if (card.cardType === 'hero') {
     // Handle hero
   } else if (card.cardType === 'spell') {
     // Handle spell
   } else if (card.cardType === 'generic') {
     // Handle generic unit
   }
   
   // Pattern 2: Switch statement
   switch (card.cardType) {
     case 'hero':
       // TypeScript knows: card is Hero
       return handleHero(card)
     case 'spell':
       // TypeScript knows: card is SpellCard
       return handleSpell(card)
     case 'generic':
       // TypeScript knows: card is GenericUnit
       return handleGeneric(card)
   }
   
   // Pattern 3: Type guard function
   function isHero(card: Card): card is Hero {
     return card.cardType === 'hero'
   }
   
   if (isHero(card)) {
     // TypeScript knows: card is Hero
     console.log(card.ability)
   }
   ```

   **Key Takeaway:**
   
   Discriminated unions provide **compile-time type safety** without runtime overhead. The `cardType` property acts as a "tag" that TypeScript uses to narrow types, preventing entire classes of bugs (like accessing `attack` on a spell or `effect` on a hero) before the code even runs.

2. **Template vs Instance Types**
   - Templates: `Omit<Hero, 'location' | 'owner'>` (no runtime state)
   - Instances: `Hero` (includes location, owner, slot)
   - Clear separation between data definitions and game state

3. **Strict TypeScript Configuration**
   ```json
   {
     "strict": true,
     "noUnusedLocals": true,
     "noUnusedParameters": true,
     "noFallthroughCasesInSwitch": true
   }
   ```
   - Catches errors at compile time
   - Enforces code quality

## Data Persistence

### Card Storage System

**Location:** `src/game/cardStorage.ts`

**Purpose:** Allow runtime card editing with localStorage persistence.

**Architecture:**
```
comprehensiveCardData.ts (source of truth)
    ↓
cardStorage.ts (applies localStorage overrides)
    ↓
cardData.ts (exports storage-aware versions)
    ↓
GameContext (uses in runtime)
```

**Implementation:**
- Default cards defined in `comprehensiveCardData.ts`
- Overrides stored in localStorage with keys:
  - `artibound_edited_cards`
  - `artibound_edited_heroes`
  - `artibound_edited_spells`
- `getCardsWithOverrides()` merges defaults with overrides
- Changes persist across app restarts

**Design Decision:** Two-layer system (comprehensive + storage) allows:
- Source control for default cards
- Runtime customization without code changes
- Easy reset to defaults

### Game State Persistence

**Location:** `src/hooks/useGamePersistence.ts`

**Purpose:** Save/load game states for testing and debugging.

**Implementation:**
- Exports game state to localStorage with timestamp keys
- Imports saved states back into game
- Used primarily for development/testing

## Component Architecture

### Component Hierarchy

```
App.tsx
└── GameProvider (Context)
    └── AppContent
        ├── DraftView (draft mode)
        └── Board (game mode)
            ├── GameHeader
            ├── PlayerArea (player2)
            ├── BattlefieldView (A)
            ├── BattlefieldView (B)
            ├── PlayerArea (player1)
            ├── CardLibrarySidebar (left)
            ├── ItemShopModal
            ├── CardLibraryView
            └── CombatSummaryModal
```

### Component Design Principles

1. **Presentational Components**
   - `HeroCard.tsx` - Pure presentation, receives props
   - `BattlefieldView.tsx` - Renders battlefield state
   - No business logic, only UI rendering

2. **Container Components**
   - `Board.tsx` - Orchestrates UI, delegates to hooks
   - `PlayerArea.tsx` - Manages player-specific UI state
   - Minimal logic, mostly composition

3. **Smart Components**
   - Components that use hooks and context
   - Handle user interactions
   - Update state through context

## Data Flow Patterns

### Unidirectional Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook Function
    ↓
Context State Update (setGameState)
    ↓
Game Logic Validation (if needed)
    ↓
Immutable State Update
    ↓
Context Re-render
    ↓
Component Re-render
```

### Example: Deploying a Card

```
1. User clicks card in hand (HeroCard.tsx)
   → Sets selectedCardId in context

2. User clicks battlefield slot (BattlefieldView.tsx)
   → Calls handleDeploy from useDeployment hook

3. useDeployment hook:
   - Validates deployment (mana, slots, colors)
   - Creates card instance with location/slot
   - Calls setGameState with immutable update

4. GameContext updates
   → All components re-render with new state

5. UI reflects new state
   → Card appears on battlefield
```

## Design Patterns Used

### 1. Template Method Pattern
- Card templates defined in `comprehensiveCardData.ts`
- Instantiated with `createCardFromTemplate()`
- Allows easy card library expansion

### 2. Strategy Pattern
- Different combat resolution strategies
- Different archetype matching strategies
- Encapsulated in pure functions

### 3. Observer Pattern (React's built-in)
- Components observe context state
- Automatic re-renders on state changes
- No manual subscription management needed

### 4. Factory Pattern
- `createCardFromTemplate()` - Card instantiation
- `createInitialGameState()` - Game state initialization
- `createGameStateFromDraft()` - Draft-to-game conversion

### 5. Repository Pattern (Card Storage)
- `cardStorage.ts` abstracts data access
- Hides localStorage implementation details
- Provides clean API for card retrieval

## Module Dependencies

### Dependency Graph

```
components/
  └── All components depend on:
      └── context/GameContext.tsx
          └── game/types.ts
          └── game/sampleData.ts (legacy)
          └── game/cardData.ts
          └── game/draftSystem.ts

hooks/
  └── All hooks depend on:
      └── context/GameContext.tsx
          └── (same as above)

game/
  ├── types.ts (no dependencies - base types)
  ├── comprehensiveCardData.ts
  │   └── types.ts
  ├── cardStorage.ts
  │   └── comprehensiveCardData.ts
  │   └── types.ts
  ├── cardData.ts
  │   └── cardStorage.ts
  ├── combatSystem.ts
  │   └── types.ts
  ├── draftSystem.ts
  │   ├── types.ts
  │   ├── comprehensiveCardData.ts
  │   └── draftData.ts
  ├── colorSystem.ts
  │   └── types.ts
  └── battlefieldEffects.ts
      ├── types.ts
      └── colorSystem.ts
```

**Key Principle:** No circular dependencies. `types.ts` has no dependencies and serves as the foundation.

## Technical Decisions & Rationale

### 1. Why Context API instead of Redux?

**Decision:** Use React Context API + Custom Hooks

**Rationale:**
- **Simplicity** - No actions, reducers, middleware to learn
- **TypeScript** - Better type inference with Context
- **Scope** - Game state is manageable without complex state management
- **Team familiarity** - Standard React patterns
- **Future flexibility** - Can migrate to Redux/Zustand if needed

**Trade-offs:**
- Less tooling (no Redux DevTools)
- Potential performance issues with large state (not a concern yet)
- No middleware for side effects (using hooks instead)

### 2. Why Custom Hooks instead of Logic in Components?

**Decision:** Extract domain logic into custom hooks

**Rationale:**
- **Separation of concerns** - UI components stay focused on rendering
- **Reusability** - Logic can be shared across components
- **Testability** - Hooks can be tested independently
- **Readability** - Components are cleaner and easier to understand

**Example:**
```typescript
// ❌ Bad: Logic in component
function Board() {
  const handleDeploy = () => {
    // 50 lines of deployment logic here
  }
}

// ✅ Good: Logic in hook
function Board() {
  const { handleDeploy } = useDeployment()
}
```

### 3. Why Pure Functions for Game Logic?

**Decision:** All game logic in pure functions (no side effects)

**Rationale:**
- **Testability** - Easy to unit test with predictable inputs/outputs
- **Predictability** - Same inputs always produce same outputs
- **Debugging** - No hidden state changes
- **Composability** - Functions can be combined easily

**Example:**
```typescript
// ✅ Good: Pure function
export function resolveCombat(battlefield: Battlefield): CombatResult {
  // No side effects, returns new state
}

// ❌ Bad: Would have side effects
export function resolveCombat() {
  setGameState(...)  // Side effect!
}
```

### 4. Why Two-Layer Card System (comprehensive + storage)?

**Decision:** Separate `comprehensiveCardData.ts` and `cardStorage.ts`

**Rationale:**
- **Source control** - Default cards in version control
- **Runtime customization** - Edit cards without code changes
- **Reset capability** - Easy to revert to defaults
- **Development workflow** - Test card changes without rebuilding

### 5. Why Record instead of Map for Metadata?

**Decision:** Use `Record<string, T>` instead of `Map<string, T>`

**Rationale:**
- **JSON serialization** - Records serialize to JSON, Maps don't
- **localStorage compatibility** - Can store Records directly
- **TypeScript support** - Better type inference with Records
- **Simplicity** - No need for Map iteration patterns

**Trade-off:**
- Slightly less performant for large datasets (not a concern)

### 6. Why Template Types (Omit pattern)?

**Decision:** Card templates use `Omit<Card, 'location' | 'owner'>`

**Rationale:**
- **Type safety** - Prevents accidentally including runtime state in templates
- **Clear intent** - Makes it obvious what fields are excluded
- **Compile-time checks** - TypeScript catches template misuse

**Example:**
```typescript
// Template (no runtime state)
export const heroTemplate: Omit<Hero, 'location' | 'owner'> = {
  id: 'hero-1',
  // ... no location or owner
}

// Instance (has runtime state)
const heroInstance: Hero = {
  ...heroTemplate,
  location: 'battlefieldA',
  owner: 'player1'
}
```

## Performance Considerations

### Current Optimizations

1. **Immutable Updates**
   - React can efficiently determine what changed
   - Enables React.memo optimizations (future)

2. **Computed Values in Context**
   - `selectedCard` computed once, not in every component
   - Reduces redundant calculations

3. **Pure Game Logic**
   - No unnecessary re-computations
   - Functions are memoizable (future)

### Potential Optimizations (Future)

1. **React.memo** for expensive components
2. **useMemo** for expensive computations
3. **Code splitting** for draft system (lazy load)
4. **Virtualization** for large card lists

## Testing Strategy

### Current State
- No automated tests (manual testing only)
- Game state export/import for debugging

### Recommended Testing Approach

1. **Unit Tests** (Priority)
   - Game logic modules (`combatSystem.ts`, `draftSystem.ts`)
   - Pure functions are easy to test
   - Use Jest + TypeScript

2. **Integration Tests** (Future)
   - Hook behavior (`useDeployment`, `useCombat`)
   - State updates through context

3. **E2E Tests** (Future)
   - Full game flows
   - Use Playwright or Cypress

## Build & Development

### Build Configuration

**Vite Configuration:**
- Fast HMR (Hot Module Replacement)
- React Fast Refresh
- TypeScript compilation
- No bundling optimizations needed for dev

### Development Workflow

1. **Local Development**
   - `npm run dev` - Start dev server
   - HMR updates on file changes
   - TypeScript errors shown in browser

2. **Card Editing**
   - Edit cards in UI (CardEditorModal)
   - Changes persist to localStorage
   - No rebuild needed

3. **Game State Debugging**
   - Export game state to localStorage
   - Import saved states
   - Test specific game scenarios

## Known Limitations & Future Improvements

### Current Limitations

1. **No Undo/Redo**
   - State is immutable, but no history tracking
   - Could add with state history array

2. **Large Component Files**
   - Some components are large (could be split)
   - Not a problem yet, but could improve maintainability

3. **No Error Boundaries**
   - Errors could crash entire app
   - Should add React error boundaries

4. **No Loading States**
   - No async operations yet, but will need for future features

### Future Improvements

1. **State Management Migration**
   - If state becomes complex, consider Zustand
   - Keep same patterns, just different implementation

2. **Component Splitting**
   - Break large components into smaller ones
   - Improve maintainability

3. **Performance Optimizations**
   - Add React.memo where needed
   - Memoize expensive computations

4. **Testing Infrastructure**
   - Add Jest for unit tests
   - Add Playwright for E2E tests

## Summary

The architecture prioritizes:
- **Type safety** through comprehensive TypeScript usage
- **Maintainability** through clear separation of concerns
- **Simplicity** through standard React patterns
- **Extensibility** through modular design

The Context API + Custom Hooks pattern provides sufficient state management for the current scope while remaining flexible for future growth.

