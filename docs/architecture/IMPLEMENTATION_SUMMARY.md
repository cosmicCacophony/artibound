# Implementation Summary: Balance Fix for RW vs UBG

## Overview
Addressing RW overcommitment to one lane by implementing:
1. Hero death cooldown change (2 → 1)
2. New UG sweeper spell (Verdant Wrath)
3. Hero retreat mechanic (future)

## Phase 1: Starting Implementation

### 1. Hero Death Cooldown Change
**Change:** Heroes get cooldown of 1 (instead of 2) when they die
- Can redeploy next turn instead of 2 turns later
- Makes heroes more flexible
- Addresses stranded hero problem

**Files to modify:**
- `src/hooks/useCombat.ts` - Change `deathCooldowns[card.id]: 2` to `1`
- `src/components/BattlefieldView.tsx` - Change `newCooldowns[hero.id] = 2` to `1`
- `src/game/types.ts` - Update comment: "starts at 1, decreases by 1 each turn, 0 = ready"

### 2. Verdant Wrath Spell (5 mana UG)
**Card Details:**
- **Name:** Verdant Wrath
- **Cost:** 5 mana
- **Colors:** UG (Blue/Green) - **NOT UBG** (flexible deployment)
- **Effect:** Deal 5 damage to all enemy units in target battlefield
- **Type:** AOE damage spell

**Why UG instead of UBG:**
- Allows flexible hero deployment (don't need UG+B heroes together)
- Still requires setup (need UG hero or U+G heroes)
- May become UBG in future (creates draft strategy depth)

**Design Consideration - Future UBG:**
If Verdant Wrath becomes UBG in the future, it creates interesting draft incentives:
- **Safe strategy:** Pick stronger-statted black hero (survives longer, enables spell casting) + weaker signature
- **Greedy strategy:** Pick weaker-statted black hero (dies easily) + strong signature card
- **Punishment:** Aggressive decks (like RW) can kill heroes and deny spell casting on key turns
- **Strategic Depth:** Creates meaningful draft decisions around hero stats vs signature power

**Files to modify:**
- `src/game/comprehensiveCardData.ts` - Add to `ubSpells` or create `ugSpells` section
  - Use `aoe_damage` effect type
  - Set `affectsEnemyUnits: true`
  - Set colors to `['blue', 'green']`
  - Add comment noting potential future UBG requirement

## Phase 2: Future Additions (Not in Initial Implementation)

### Hero Retreat Mechanic
- Allow heroes to return to base for 1 mana (once per turn)
- Provides flexibility for repositioning
- Helps with stranded hero problem

### Additional Spells
- **Void Storm** (5 mana UB): Deal 4 damage to all enemy units, draw a card
- **Verdant Summoning** (5 mana UG): Create two 4/4 units in target battlefield

## Testing Checklist

- [ ] Hero dies, cooldown is 1 (not 2)
- [ ] Hero can redeploy next turn after dying
- [ ] Verdant Wrath appears in UBG deck
- [ ] Verdant Wrath requires UG colors (can cast with UG hero or U+G heroes)
- [ ] Verdant Wrath deals 5 damage to all enemy units in target battlefield
- [ ] RW can still win games (not overcorrected)
- [ ] UBG can handle RW overcommitment better

