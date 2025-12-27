# Playtest Session 1: UBG vs RW

> **Date:** 2025-12-25  
> **Matchup:** UBG (Player) vs RW Legion (Boss)  
> **Result:** Tie on turn 10 (both at 10 mana)  
> **Status:** Completed

---

## Summary

First complete playtest of the roguelike draft system. Game ended in a tie, lasted until turn 10 with both players at maximum mana. Identified several key balance and design issues.

---

## Key Findings

### 1. Rune Requirements Too Lenient ⚠️

**Issue:** Ended game with 1 blue, 5 black, 6 green runes - way too many runes for multicolor cards.

**Root Cause:** Cards didn't have strict enough rune requirements, so player could splash colors too easily without proper rune investment.

**Examples:**
- Void Cascade: Only required UB (1 blue, 1 black) → Too easy to cast
- Multicolor Wrath: Required "any 3 colors" → No real commitment
- Nature's Wisdom: Only 1U, 1G → Should cost more
- Knowledge Seeker: No rune cost → Too flexible
- Reflective Shield: No rune cost → Too generic
- Arcane Burst: No specific rune requirement → Too easy

**Solution Applied:** ✅
- **Void Cascade:** Now 5UUB (2 blue, 1 black) - requires blue commitment
- **Multicolor Wrath:** Now 6UUBBGG (2 of each) - requires true 3-color deck
- **Nature's Wisdom:** Now 2UG (reduced mana, added rune requirement)
- **Knowledge Seeker:** Now 5BB (2 black runes) - black payoff card
- **Reflective Shield:** Now 2U (1 blue rune) - requires blue
- **Arcane Burst:** Now 4U (1 blue rune) - requires blue

---

### 2. Lack of Positional Gameplay ⚠️

**Issue:** No interesting positioning decisions during combat.

**Root Causes:**
- No cleave mechanics in drafted decks
- No adjacency buffs/effects
- AOE damage hit "all units" instead of "adjacent units"
- No equipment/heroes that buff adjacent units

**Comparison to Artifact:**
- Artifact had positioning matter through:
  - Cleave (damages adjacent on attack)
  - Adjacent buffs (+X/+X to neighbors)
  - Directional AOE (hit 3 adjacent)
  - Green heroes with "allies within range 2" effects

**Solution Applied:** ✅

**Added White Adjacency Units:**
- **Guardian Angel** (3W): Adjacent allies +0/+2
- **Holy Sentinel** (4WW): Adjacent allies +0/+3
- **Fortified Bastion** (5WWW): Adjacent allies +0/+4

**Reworked Divine Protector:**
- **Old:** "Allies gain +1/+1" (global, boring)
- **New:** "Allies within range 2 gain +2 regeneration"
- **Regeneration:** Heals at end of combat, before lethal
  - Example: Unit at -1 HP with regen 2 → survives at 1 HP
  - Creates interesting save mechanics

**Design Note:** White provides positional buffs (HP to neighbors), Green can provide attack/range buffs later.

---

### 3. Battlefield Resolution Order 💡

**Observation:** If battlefields resolved left-to-right, then right-to-left (alternating each turn like Artifact), there would be more planning depth.

**Example from Playtest:**
- Had lethal in Battlefield A
- Opponent had lethal in Battlefield B
- If B resolved first (second lane of the turn), opponent would win
- If A resolved first, I would win
- Adds strategic layer: "Do I need to win BOTH lanes this turn?"

**Status:** 🔄 **Noted for future implementation**

**Design Impact:**
- Battlefield order becomes strategically important
- Creates tension around "racing" vs "defending"
- Similar to Artifact's initiative system but simpler
- Requires game state changes (track which lane resolves first)

---

### 4. Game Pacing ✅

**Positive:** Game lasted to turn 10, both players at max mana - good pacing!

**Analysis:**
- Not too fast (didn't end turn 5-6)
- Not too slow (didn't drag to turn 15+)
- Both players had resources to execute strategies
- Tie suggests reasonable balance between archetypes

---

## Cards That Worked Well

*(Not explicitly noted in playtest, will track in future sessions)*

---

## Cards That Felt Weak

*(Not explicitly noted in playtest, will track in future sessions)*

---

## Cards That Felt Too Strong

*(Not explicitly noted in playtest, will track in future sessions)*

---

## Next Playtest Goals

1. **Test stricter rune requirements:** Do the new costs feel better? Still too easy to splash?
2. **Test adjacency mechanics:** Do Guardian Angel / Holy Sentinel create interesting decisions?
3. **Test Divine Protector regeneration:** Does it feel impactful? Is +2 regen the right amount?
4. **Track specific cards:** Which cards always get picked? Which never get picked?
5. **Test other archetypes:** RW, RG, GW - how do they perform vs RW boss?

---

## Balance Changes Applied

| Card | Old Cost | New Cost | Reason |
|------|----------|----------|--------|
| Void Cascade | 5 (UB) | 5UUB | Require blue commitment |
| Multicolor Wrath | 6 (any 3 colors) | 6UUBBGG | Require true 3-color deck |
| Nature's Wisdom | 3 (UG) | 2UG | Reduce mana, strict runes |
| Knowledge Seeker | 4 (no runes) | 5BB | Black payoff, requires commitment |
| Reflective Shield | 2 (no runes) | 2U | Require blue |
| Arcane Burst | 4 (generic) | 4U | Require blue |
| Divine Protector | "Allies +1/+1" | "Range 2 allies +2 regen" | Positional gameplay |

---

## New Cards Added

| Card | Cost | Effect | Archetype |
|------|------|--------|-----------|
| Guardian Angel | 3W | Adjacent allies +0/+2 | White/Adjacency |
| Holy Sentinel | 4WW | Adjacent allies +0/+3 | White/Adjacency |
| Fortified Bastion | 5WWW | Adjacent allies +0/+4 | White/Adjacency |

---

## Architecture Notes

**What Worked:**
- Roguelike draft system functional
- Game loop worked end-to-end
- State management handled the game correctly

**What Needs Work:**
- Need to track card pick rates
- Need to track win/loss by archetype
- Should add playtesting metrics (game length, damage dealt, etc.)

---

## Design Philosophy Reinforced

**Color Identity Through Rune Costs:** ✅
- Stricter rune requirements enforce color commitment
- Players can't just "splash everything" without proper rune generation
- Creates meaningful deck building constraints

**Positional Gameplay:** ✅
- White provides defensive adjacency buffs (HP)
- Green can provide offensive buffs (attack, range) later
- Regeneration creates "save" moments (like in Artifact with armor)
- Position should matter ~30% of games (not every game)

**Battlefield Resolution Order:** 💡
- Noted for future: Alternating resolution order (left-right, then right-left)
- Creates additional strategic depth
- Requires implementation work

---

## Next Session

**Focus:**
- Test 2-3 more archetypes (RW, RG, GW)
- Track which cards get picked/ignored
- Note specific balance issues with individual cards
- Test regeneration mechanic with Divine Protector

**Questions to Answer:**
- Are the stricter rune costs too strict now?
- Do adjacency buffs create interesting decisions?
- Which archetypes feel strongest/weakest?
- What's the win rate against RW boss?



