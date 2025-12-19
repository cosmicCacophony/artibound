# Card Creation Guidelines

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Architecture  
> **Notes:** Critical guidelines for creating cards that work with the RW vs UBG testing framework

## Primary Testing Framework: RW vs UBG

**IMPORTANT:** All new cards should be designed for the **RW vs UBG testing framework** used in "Start Random Game".

### Archetype System

The game uses two primary archetypes for testing:
- **RW (Red/White) - Legion Aggro**: `'rw-legion'` archetype
- **UBG (Blue/Black/Green) - Control**: `'ubg-control'` archetype

### Card Color Requirements

When creating cards, they must match the archetype color requirements:

#### RW Archetype Cards
- **Allowed Colors:** `['red']`, `['white']`, `['red', 'white']`
- **Examples:**
  - `colors: ['red']` - Red-only cards
  - `colors: ['white']` - White-only cards  
  - `colors: ['red', 'white']` - Dual-color RW cards

#### UBG Archetype Cards
- **Allowed Colors:** Any combination of Blue, Black, and Green
- **Examples:**
  - `colors: ['blue']` - Blue-only cards
  - `colors: ['black']` - Black-only cards
  - `colors: ['green']` - Green-only cards
  - `colors: ['blue', 'black']` - UB dual-color
  - `colors: ['blue', 'green']` - UG dual-color
  - `colors: ['black', 'green']` - BG dual-color
  - `colors: ['blue', 'black', 'green']` - UBG triple-color

### Card Matching Logic

Cards are matched to archetypes using `cardMatchesArchetype()` in `src/game/draftSystem.ts`:

- **RW cards** must have colors that are subsets of `['red', 'white']`
- **UBG cards** must have colors that are subsets of `['blue', 'black', 'green']`
- Cards with colors outside these sets will **NOT** appear in the random game

### Artifact Guidelines

When creating artifacts:

1. **RW Artifacts** - Must use R, W, or RW colors
   - Example: `colors: ['red', 'white']` for RW artifacts
   - Example: `colors: ['red']` for red-only artifacts
   - Example: `colors: ['white']` for white-only artifacts

2. **UBG Artifacts** - Must use U, G, B, or any combination
   - Example: `colors: ['blue']` for blue-only artifacts
   - Example: `colors: ['black', 'green']` for BG artifacts
   - Example: `colors: ['blue', 'black', 'green']` for UBG artifacts

### Where Cards Are Used

- **"Start Random Game"** button uses `initializeRandomGame()` in `GameContext.tsx`
- Cards are filtered by archetype using `cardMatchesArchetype()`
- Only cards matching the player's archetype appear in their deck

### Common Mistakes to Avoid

1. ❌ **Creating GW (Green/White) artifacts** - These won't appear in RW vs UBG games
2. ❌ **Creating UW (Blue/White) artifacts** - These won't appear in RW vs UBG games  
3. ❌ **Creating cards with colors outside RW or UBG** - They won't be used in testing
4. ✅ **Always check archetype compatibility** - Use R/W for RW, U/B/G for UBG

### Testing Your Cards

After creating cards:
1. Click "Start Random Game" 
2. Verify cards appear in the correct player's deck
3. Check that RW player only gets R/W cards
4. Check that UBG player only gets U/B/G cards

### File Locations

- Card definitions: `src/game/comprehensiveCardData.ts`
- Archetype matching: `src/game/draftSystem.ts`
- Random game initialization: `src/context/GameContext.tsx`

