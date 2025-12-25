# Card Changes - Session 2

**Date:** 2025-12-25  
**Focus:** Remove outdated mechanics, add new archetype synergies

## Summary

Implemented comprehensive card changes based on playtesting feedback:
- Removed 25 outdated/weak cards
- Added 10 new synergy cards
- Fixed card type issues
- Added rune costs to key spells

---

## Changes by Category

### 1. Removed Outdated Mechanics

**Cards Removed:**
- **Frontline Aura** (artifact) - Outdated positional mechanic
- **Arcane Reservoir** (0/8) - 0/X creatures no longer relevant
- **All 0/X Creatures** (~14 cards) - Designed for creep-stacking, now obsolete

**Rationale:** With the removal of auto-spawning creeps, 0/X creatures that were designed to sit behind creeps and generate value are no longer relevant to the game.

---

### 2. Fixed Card Type Issues

**Death Strike (RB Signature)**
- **Before:** Creature with 4/2 stats
- **After:** Spell - "Kill target unit with 3 or less health"
- **Rationale:** This was always meant to be a kill spell, not a creature

**Arcane Scholar (UB)**
- **Before:** Creature 2/3 - "When you use hero ability, draw a card"
- **After:** Spell - "Draw 2 cards. 3UB."
- **Rationale:** Simplified to direct card draw spell with rune cost

---

### 3. Added Rune Costs to Spells

**Purpose:** Make important spells feel more earned, increase rune artifact value

**Changes:**
- **Arcane Scholar:** Now costs 3UB (was 3UBG generic)
- **Whirling Death:** Now costs 2R (was 2 generic)
- **Power Core:** Now costs 3UR (was 3 generic)

**Impact:** Players need to draft/play rune-generating heroes or artifacts to access these powerful effects.

---

### 4. Removed Weak Red Creeps

**Removed (8 cards):**
- Goblin Scout (1 mana)
- Fire Striker (2 mana)
- Battle Hound (2 mana)
- Goblin Raider (1 mana)
- Swift Warrior (2 mana)
- Tower Striker (2 mana)
- Berserker Charge (3 mana)
- Tower Bomber (3 mana)

**Kept (4 cards):**
- Raging Warrior (3R - 4/2)
- Tower Raider (3R - 3/3, ETB 2 tower damage)
- Fury Striker (3R - 3/3, AOE 1 damage on attack)
- Berserker (3R - 4/2, 2 tower damage on attack)

**Rationale:** Too many generic red filler units. Kept only the most interesting/powerful ones, all now require RR rune cost.

---

### 5. Removed Temporary Buffs

**Battle Rage (3 instances removed):**
- red-spell-grant-cleave (2 mana - cleave this turn)
- red-aggro-rage (2 mana - +2/+2 this turn)
- red-spell-combat-trick (1 mana - +3/+0 this turn)

**Fighting Words (Changed):**
- **Before:** "Target unit gains +3 attack this turn"
- **After:** "Target unit gains +3 attack permanently"
- **Rationale:** Permanent buffs create more interesting strategic decisions and work better with hero-centric gameplay

---

### 6. Added GW Permanent Hero Buff Spells

**New Cards (4):**

1. **Balanced Growth** (3GW)
   - Target hero gains +2/+2 permanently
   - Early-game hero investment

2. **Offensive Blessing** (4GW)
   - Target hero gains +4/+0 permanently
   - Push aggro hero over the edge

3. **Defensive Blessing** (4GW)
   - Target hero gains +0/+4 permanently
   - Make tanky heroes even tankier

4. **Berserker's Blessing** (6GGW)
   - Target hero gains +5/+0 and Quickstrike permanently
   - Late-game finisher, turn hero into killing machine

**Design Intent:**
- Support GW "hero buff" strategy
- Permanent effects create long-term value
- Expensive rune costs (GGW) make these feel earned
- Quickstrike on the 6-mana version is a dopamine hit

---

### 7. Added UB Draw Synergy Creatures

**New Cards (3):**

1. **Arcane Adept** (4UB - 3/4)
   - "If you drew 2+ cards this turn, this gains +2/+0 until end of turn"
   - Becomes 5/4 attacker if you're drawing cards

2. **Knowledge Hunter** (5UUB - 4/5)
   - "If you drew 2+ cards this turn, this can attack twice this turn"
   - Huge payoff for draw synergy

3. **Void Scholar** (3UB - 2/3)
   - "If you drew 2+ cards this turn, this costs 2 less to play"
   - Tempo play, can be 1 mana if condition met

**Design Intent:**
- Reward UB control for drawing multiple cards per turn
- Synergizes with Arcane Scholar spell (draw 2)
- Creates mini-combo potential
- Makes card draw feel more impactful

---

### 8. Added RG Mighty Units Synergy

**New Cards (3):**

1. **Mighty Chieftain** (5RG - 5/6)
   - "If you control a unit with 5+ attack, this gains +2/+0 and can attack twice"
   - Becomes 7/6 double-attacker with right board state

2. **Warlord of the Wilds** (4RG - 4/5)
   - "When you play a unit with 5+ attack, draw a card"
   - Card advantage for going big

3. **Herald of Giants** (3RG - 3/4)
   - "Units with 5+ attack you play cost 1 less"
   - Ramp enabler for big creatures

**Design Intent:**
- Support RG "big creatures" strategy
- 5+ attack threshold is achievable (many 5/5, 6/6, 6/7 units)
- Creates "going big" synergy
- Distinct from RW go-wide strategy

---

## Implementation Notes

### Rune Costs
All new archetype cards use strict rune costs:
- **GW:** GGW, GW patterns
- **UB:** UB, UUB patterns
- **RG:** RG, RRG patterns

This ensures players need to commit to these color combinations and draft/play rune-generating cards.

### Balance Considerations
- GW hero buffs are permanent but expensive (3-6 mana)
- UB draw synergy requires 2+ cards drawn (not just 1)
- RG mighty units require 5+ attack (not 4+), threshold is achievable but not trivial

---

## Next Steps

1. **Playtest new archetypes:**
   - Draft GW and test hero buff strategy
   - Draft UB and test draw synergy
   - Draft RG and test mighty units synergy

2. **Validate removed cards:**
   - Ensure no broken references
   - Check that draft pools still feel good

3. **Monitor for issues:**
   - Are rune costs too strict?
   - Are synergies compelling enough?
   - Do archetypes feel distinct?

---

## Technical Changes

**Files Modified:**
- `src/game/comprehensiveCardData.ts` (~25 removals, 10 additions, multiple type fixes)

**No Linter Errors:** All changes compile cleanly

**Card Count:**
- Before: ~850 cards
- After: ~835 cards
- Net change: -15 cards (cleaner, more focused)

