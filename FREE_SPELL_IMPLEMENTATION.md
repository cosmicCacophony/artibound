# Free Spell Mechanic Implementation

## Summary
Successfully implemented the "free spell" mechanic inspired by Urza block cards (Treachery, Frantic Search, Snap).

## What Was Done

### 1. Type Definition
- Added `refundMana?: number` field to the `SpellCard` interface in `src/game/types.ts`
- This field specifies how much mana is refunded after casting the spell

### 2. Card Implementation
- Created 10 new free spell cards in `src/game/comprehensiveCardData.ts`:
  
**Mono-Blue (U):**
  - **Arcane Refraction** (1U): Draw 1 card, refund 1 mana
  - **Deep Study** (2U): Draw 2 cards, refund 2 mana
  - **Tactical Reposition** (2U): Swap 2 units, refund 2 mana
  - **Aether Pulse** (3U): Deal 3 AOE damage, refund 3 mana
  - **Mana Snap** (1U): Bounce unit, refund 1 mana

**Blue/Red (UR):**
  - **Bolt of Insight** (2UR): Deal 4 damage + draw 1, refund 2 mana
  - **Arcane Chain Lightning** (3UR): Deal 3 AOE damage, refund 3 mana
  - **Combat Flux** (1UR): Deal 2 damage + redirect, refund 1 mana

**Blue/Black (UB):**
  - **Dark Revelation** (2UB): Draw 2 + gain 2 mana, refund 2 (net +2 mana!)
  - **Treacherous Extraction** (3UB): Destroy unit + draw 1, refund 3 mana

### 3. Deployment Logic
- Updated `src/hooks/useDeployment.ts` to handle mana refunds
- When a spell with `refundMana` is cast, the mana is added back to the player's pool
- Refund occurs in 3 locations where spells can be deployed (lines 378-381, 481-484, 547-550)

### 4. Game Integration
- Added `freeSpells` array to the `allSpells` collection
- Removed outdated spell arrays from compilation

## Design Philosophy

These spells:
- Cost X mana + runes upfront
- Refund the X mana after casting
- Are effectively "free" in terms of mana but still require runes
- Enable spell-slinger strategies that manage rune resources
- Reward drafting rune generators for greedy spell-heavy decks

## Card Count Status
- Current total: ~389 card objects in the file
- Free spells added: 10 new cards
- Successfully compiling with no errors

## Future Improvements
- Add visual feedback for mana refund (currently TODO in code)
- Implement actual draw/bounce effects (currently using placeholders)
- Consider adding UG/UW variants if the mechanic proves fun

