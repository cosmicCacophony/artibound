# Artibound - Development Documentation

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Architecture  
> **Notes:** Living document - update existing sections rather than creating new files

This file documents major architectural decisions, design learnings, implementation notes, and future plans. Update existing sections rather than creating new files.

## Architecture Decisions

### Initial Decisions (Current)
- **Game Logic Separation**: All game logic resides in `/src/game` directory, separated from UI components
- **Type Safety**: Strict TypeScript types for all game entities (Card, Hero, Battlefield, etc.)
- **Component-Based UI**: React functional components with hooks for state management
- **Mana System**: Start with 3 mana, gain +1 per turn, cap at 10
- **Turn Phases**: Play → Combat A → Adjust → Combat B structure for strategic depth
- **Color System**: Planned - 5 colors (Red, Blue, White, Black, Green), max 3 colors per deck

### Future Architecture Considerations
- **Draft System**: Will need dedicated draft state management and UI component
- **Battlefield Abilities**: Static abilities that affect gameplay need effect system
- **Color Constraints**: Cards only playable in lanes with matching color heroes (like Artifact)
- **Deck Building**: Signature cards guaranteed per hero (2 each), rest random with color-based rules

## Design Learnings

### What Works Well
- *To be populated as we test and iterate*

## Design Issues

### Problems to Address
- *To be populated as issues arise*

## Implementation Notes

### What Went Well
- **Mana System**: Clean separation of current/max mana in metadata
- **Turn Phases**: Phased turn structure adds strategic depth
- **Player Sidebars**: Separate card libraries per player with color coding (red/blue) improves visual clarity

### Challenges & Solutions
- *To be documented as they arise*

## Future Features

### Planned Features (In Priority Order)

1. **Color System Implementation**
   - 5-color system with deck building constraints
   - Max 3 colors per deck
   - Color-based playability rules (cards only playable in lanes with matching heroes)
   - Color-based buff restrictions

2. **Draft System**
   - Turn-based draft: P1-hero, P2-hero-hero, P1-hero-hero, P2-hero-battlefield, P1-hero-battlefield...
   - Continue until each player has 4 heroes and 2 battlefields
   - Battlefield static abilities influence draft picks
   - Full draft state management and UI
   - **Draft UI Architecture Plan**:
     - Component: `DraftPhase.tsx` - Full-screen modal/phase that shows available picks
     - Display available heroes and battlefields in pickable format
     - Show current draft picks for both players
     - Handle alternating pick turns with proper validation
     - Transition to game phase once draft is complete
     - Integrate with game state to load drafted heroes/battlefields

3. **Battlefield Static Abilities**
   - Red/White: "+1/+0 to all units if you control 3 units of the same color in this lane"
   - Blue/Black: "Gain extra gold for killing units in this lane"
   - Effect system to apply battlefield abilities

4. **Test Decks**
   - Warrior (3 Red heroes + 1 White hero) with RW battlefield
   - Mage (3 Blue heroes + 1 Black hero) with UB battlefield
   - Multicolor cards (RW and UB) stronger than average

5. **Multicolor Card System**
   - 2 colors: Get 2 multicolor cards (stronger than average)
   - 3 colors: Get 1 hybrid of each pair + 1 triple-color card
   - Color combination benefits

6. **PVE Mode** (Long-term)
   - AI opponent with more powerful cards to compensate for weaker decision-making
   - PVP-first for simplicity, PVE later

## Change Log

### 2024-12-XX - Combat System & Spell Cards
- Implemented hybrid positional combat system (positional with player choice)
- Added spell card types and examples (black damage, blue control/AOE)
- Added manual slot positioning (1-5 slots per battlefield)
- Made battlefield cards smaller (scale 0.85) to fit 5 positions
- Created playtesting template (PLAYTESTING.md) for systematic testing

### 2024-12-XX - Initial Development Documentation
- Created DEVELOPMENT.md structure
- Documented current architecture decisions
- Outlined future feature roadmap
- Added color system types and validation logic
- Created battlefield definitions with static abilities
- Implemented test decks: Warrior (3R+1W) and Mage (3B+1Bk)
- Added multicolor cards (RW and UB) for testing
- Designed draft system type structure (UI implementation deferred)
