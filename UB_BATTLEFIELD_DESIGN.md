# UB Battlefield Design Document

## Overview

This document explores UB (Blue/Black) battlefield designs with a focus on **combo synergies**. Since each player drafts 2 battlefields and they provide global bonuses, battlefield synergy becomes crucial. Players want battlefields that compound with each other, creating powerful combinations that reward strategic drafting.

**Key Design Principles**:
- Battlefields should create spell-based synergies that scale with spell casting
- Bonuses should compound when both battlefields are active
- Spell cost reduction should work with spell count/quality thresholds
- Card draw and spell damage should create interesting feedback loops

---

## UB Battlefield Designs (Global Bonuses)

**Note**: These bonuses apply to **both Lane A and Lane B** and only affect **your spells/units**.

### Option 1: Arcane Nexus
- **Ability**: Your spells deal +1 damage (applies to both lanes)
- **Archetype Fit**: Supports spell-heavy UB control
- **Draft Impact**: Makes removal spells more efficient
- **Global Application**: All your spells get bonus damage everywhere
- **Balance Concern**: +1 damage is significant but not game-breaking if it's the only source
- **Stacking**: Could be strong with hero bonuses, but only affects your spells

### Option 2: Shadow Library
- **Ability**: When you cast a spell, draw a card (applies to both lanes)
- **Archetype Fit**: Supports spell-heavy strategies with card advantage
- **Draft Impact**: Makes spells more attractive in draft
- **Global Application**: Card draw works everywhere
- **Balance Note**: Card draw is powerful but conditional on casting spells
- **Stacking**: Doesn't conflict, provides card advantage

### Option 3: Death Altar
- **Ability**: When a unit dies, gain 2 gold (applies to both lanes)
- **Archetype Fit**: Supports removal-heavy strategies
- **Draft Impact**: Rewards killing units (fits UB removal theme)
- **Global Application**: Gold generation works from both lanes
- **Balance Note**: Gold generation is strong but requires units to die
- **Stacking**: Doesn't conflict, provides resource advantage

### Option 4: Void Rift
- **Ability**: Your spells cost 1 less mana (applies to both lanes)
- **Archetype Fit**: Enables more spell casting
- **Draft Impact**: Makes expensive spells more playable
- **Global Application**: Mana reduction works everywhere
- **Balance Note**: Mana reduction is powerful but doesn't directly affect combat
- **Stacking**: Doesn't conflict, enables more spell casting

### Option 5: Rapid Deployment
- **Ability**: Your heroes have Quick Deploy: No cooldown when dying (applies to both lanes)
- **Archetype Fit**: Supports aggressive hero deployment
- **Draft Impact**: Makes hero-focused strategies more viable
- **Global Application**: Works on both lanes, enables flexible hero deployment
- **Stacking**: Doesn't conflict, provides deployment advantage

---

## UB Battlefield Combo Synergies

### Design Philosophy for UB Combos

**Core Concept**: UB battlefields should create spell-based synergies that scale with spell casting frequency and power. The goal is to make spells more efficient and create feedback loops between spell casting, card draw, and spell power.

**Key Synergy Patterns**:
1. **Cost Reduction + Threshold**: Reduce spell costs, unlock bonuses when casting high-cost spells
2. **Spell Count Synergy**: Multiple spells matter - casting many spells unlocks bonuses
3. **Spell Power + Card Draw**: Spell damage bonuses combined with card draw create value loops
4. **Resource Generation**: Gold/spell synergies that enable more spell casting

---

### Combo Idea 1: Cost Reduction + High-Cost Threshold

**Battlefield A: Void Rift**
- **Ability**: Your spells cost 1 less mana (applies to both lanes)

**Battlefield B: Arcane Nexus** (Enhanced Version)
- **Ability**: Your spells deal +1 damage. If you cast a spell with original cost 5+ mana (cost before discounts), draw a card (applies to both lanes)

**Combo Effect**:
- Void Rift reduces all spell costs by 1
- Arcane Nexus gives +1 damage and draws a card when casting 5+ cost spells
- **Key Mechanic**: Original cost (before discount) still counts as 5+ for the trigger
- **Result**: You can cast expensive spells cheaper, and when you cast 5+ cost spells, you get card draw
- **Synergy**: Cost reduction makes it easier to cast 5+ cost spells, triggering card draw

**Draft Strategy**: Draft high-cost spells (5+ mana). The discount makes them playable, and casting them draws cards.

**Example**:
- Cast a 6-cost spell → costs 5 mana (Void Rift discount) → deals +1 damage (Arcane Nexus) → draws a card (Arcane Nexus threshold)

---

### Combo Idea 2: Spell Count Synergy

**Battlefield A: Void Rift**
- **Ability**: Your spells cost 1 less mana (applies to both lanes)

**Battlefield B: Shadow Library** (Enhanced Version)
- **Ability**: When you cast a spell, draw a card. If you cast 3+ spells in a turn, all your spells deal +1 damage this turn (applies to both lanes)

**Combo Effect**:
- Void Rift reduces spell costs, enabling more spells per turn
- Shadow Library draws cards on each spell cast
- Casting 3+ spells in a turn adds +1 damage to all spells that turn
- **Result**: More spells per turn = more cards drawn = easier to cast 3+ spells = bonus damage
- **Synergy**: Cost reduction enables spell count threshold, creating a value loop

**Draft Strategy**: Draft cheap spells and spell-generating cards. Build towards casting 3+ spells per turn.

**Example Turn**:
- Cast 1-cost spell (free with discount) → draw card
- Cast 2-cost spell (1 mana) → draw card
- Cast 3-cost spell (2 mana) → draw card → now at 3+ spells, all spells get +1 damage
- Cast 4-cost spell (3 mana) → +1 damage → draw card

---

### Combo Idea 3: Spell Power + Card Draw Loop

**Battlefield A: Arcane Nexus**
- **Ability**: Your spells deal +1 damage (applies to both lanes)

**Battlefield B: Shadow Library**
- **Ability**: When you cast a spell, draw a card (applies to both lanes)

**Combo Effect**:
- Arcane Nexus makes all spells deal +1 damage
- Shadow Library draws a card on each spell cast
- **Result**: Every spell is more powerful AND draws a card, creating a value loop
- **Synergy**: More spells = more cards = more spells = more damage

**Draft Strategy**: Draft as many spells as possible. Every spell becomes removal + card draw.

**Balance Note**: This combo is very strong but requires drafting many spells. Opponent can play around it by not giving you spell targets.

---

### Combo Idea 4: Cost Reduction + Spell Count Threshold

**Battlefield A: Void Rift**
- **Ability**: Your spells cost 1 less mana (applies to both lanes)

**Battlefield B: Mystic Archive** (New)
- **Ability**: When you cast your first spell each turn, draw a card. If you cast 4+ spells in a turn, all your spells cost 1 less mana this turn (applies to both lanes)

**Combo Effect**:
- Void Rift gives permanent -1 cost
- Mystic Archive draws on first spell, and at 4+ spells gives another -1 cost
- **Result**: Base -1 cost, first spell draws a card, at 4+ spells you get -2 total cost
- **Synergy**: Void Rift makes it easier to reach 4+ spell threshold, which then reduces costs further

**Draft Strategy**: Draft cheap spells and spell-generating effects. Build towards 4+ spell turns for maximum value.

**Example Turn**:
- Cast 2-cost spell (1 mana) → draw card (first spell)
- Cast 2-cost spell (1 mana)
- Cast 2-cost spell (1 mana)
- Cast 2-cost spell (1 mana) → now at 4+ spells, all spells cost 1 less
- Cast 2-cost spell (0 mana) → free spell!

---

### Combo Idea 5: Spell Power + High-Cost Threshold

**Battlefield A: Arcane Nexus**
- **Ability**: Your spells deal +1 damage (applies to both lanes)

**Battlefield B: Grand Archive** (New)
- **Ability**: Your spells cost 1 less mana. If you cast a spell with original cost 6+ mana, all your spells deal +1 additional damage this turn (applies to both lanes)

**Combo Effect**:
- Arcane Nexus gives +1 damage base
- Grand Archive reduces costs and adds +1 damage when casting 6+ cost spells
- **Result**: Base +1 damage, easier to cast 6+ cost spells, casting them adds another +1 damage
- **Synergy**: Cost reduction enables casting 6+ cost spells, which then boosts all spell damage

**Draft Strategy**: Draft high-cost powerful spells. The discount makes them playable, and casting them boosts all your spells.

**Example**:
- Cast 7-cost spell (6 mana with discount) → deals +2 damage (Arcane Nexus + Grand Archive threshold) → all future spells this turn deal +2 damage

---

### Combo Idea 6: Resource Generation + Spell Synergy

**Battlefield A: Death Altar**
- **Ability**: When a unit dies, gain 2 gold (applies to both lanes)

**Battlefield B: Shadow Library** (Enhanced Version)
- **Ability**: When you cast a spell, draw a card. If you cast a spell that kills a unit, gain 3 gold (applies to both lanes)

**Combo Effect**:
- Death Altar gives gold on unit deaths
- Shadow Library draws cards on spells and gives extra gold when spells kill units
- **Result**: Removal spells become card draw + gold generation
- **Synergy**: Gold from kills enables more spells, spells that kill give more gold

**Draft Strategy**: Draft removal spells. Every kill spell becomes card draw + 5 gold (2 from Death Altar + 3 from Shadow Library).

---

### Combo Idea 7: Double Spell Count Synergy

**Battlefield A: Void Rift**
- **Ability**: Your spells cost 1 less mana (applies to both lanes)

**Battlefield B: Spellweaver's Sanctum** (New)
- **Ability**: When you cast a spell, draw a card. If you cast 2+ spells in a turn, your spells deal +1 damage this turn. If you cast 4+ spells in a turn, draw an additional card for each spell cast (applies to both lanes)

**Combo Effect**:
- Void Rift reduces costs, enabling more spells
- Spellweaver's Sanctum draws on each spell, adds damage at 2+ spells, draws extra at 4+ spells
- **Result**: Escalating value as you cast more spells
- **Synergy**: Cost reduction enables thresholds, thresholds provide more value

**Draft Strategy**: Draft cheap spells and build towards 4+ spell turns for maximum card draw.

**Example Turn**:
- Cast spell 1 → draw 1 card
- Cast spell 2 → draw 1 card, now +1 damage to all spells
- Cast spell 3 → draw 1 card, +1 damage
- Cast spell 4 → draw 2 cards (base + bonus), +1 damage

---

### Combo Idea 8: Spell Power Scaling

**Battlefield A: Arcane Nexus**
- **Ability**: Your spells deal +1 damage (applies to both lanes)

**Battlefield B: Mana Surge** (New)
- **Ability**: Your spells cost 1 less mana. The first time you cast a spell with original cost 5+ mana each turn, all your spells deal +1 additional damage this turn (applies to both lanes)

**Combo Effect**:
- Arcane Nexus gives +1 damage base
- Mana Surge reduces costs and adds +1 damage when casting 5+ cost spells
- **Result**: Base +1 damage, easier to cast 5+ cost spells, casting them adds another +1 damage
- **Synergy**: Cost reduction enables threshold, threshold boosts damage

**Draft Strategy**: Draft 5+ cost spells. Cast one per turn to boost all your spells.

---

## Recommended UB Battlefield Pairs

### Primary Recommendation: Void Rift + Arcane Nexus (Enhanced) (Combo Idea 1)

**Void Rift**
- Your spells cost 1 less mana (applies to both lanes)

**Arcane Nexus** (Enhanced)
- Your spells deal +1 damage. If you cast a spell with original cost 5+ mana (cost before discounts), draw a card (applies to both lanes)

**Why This Works**:
- ✅ Clear synergy: Cost reduction enables high-cost spell casting
- ✅ Meaningful threshold: 5+ cost spells trigger card draw
- ✅ Balanced: Requires drafting expensive spells to unlock full potential
- ✅ Interesting mechanic: Original cost (not discounted) counts for threshold
- ✅ Creates strategic depth: Players must balance cheap vs expensive spells
- ✅ Scales well: More expensive spells = more value

**Draft Strategy**: Draft 5+ cost spells. The discount makes them playable, and casting them draws cards.

---

### Alternative Recommendation: Void Rift + Shadow Library (Enhanced) (Combo Idea 2)

**Void Rift**
- Your spells cost 1 less mana (applies to both lanes)

**Shadow Library** (Enhanced)
- When you cast a spell, draw a card. If you cast 3+ spells in a turn, all your spells deal +1 damage this turn (applies to both lanes)

**Why This Works**:
- ✅ Creates spell count synergy: More spells = more value
- ✅ Clear threshold: 3+ spells per turn unlocks bonus damage
- ✅ Cost reduction enables threshold: Easier to cast 3+ spells
- ✅ Value loop: More spells = more cards = more spells
- ✅ Rewards aggressive spell casting

**Draft Strategy**: Draft cheap spells and spell-generating effects. Build towards 3+ spell turns.

---

## Balance Considerations

### Spell Cost Reduction Stacking
- **Problem**: Multiple cost reductions could make spells too cheap
- **Solution**: Limit to -1 cost per battlefield, or cap total reduction at -2
- **Design**: Cost reduction should enable more spells, not make them free

### Spell Damage Stacking
- **Problem**: Multiple +1 damage sources could make spells too powerful
- **Solution**: Keep base damage bonuses at +1, use thresholds for additional damage
- **Design**: Spell damage should scale with investment, not stack infinitely

### Card Draw Balance
- **Problem**: Drawing a card per spell could create infinite loops
- **Solution**: Make card draw conditional (thresholds, first spell only, etc.)
- **Design**: Card draw should reward spell casting but not guarantee infinite value

### High-Cost Spell Thresholds
- **Problem**: Thresholds might be too easy or too hard to trigger
- **Solution**: Use "original cost" (before discounts) for thresholds
- **Design**: Thresholds should reward drafting expensive spells, not just casting discounted ones

---

## Implementation Notes

### Original Cost Tracking
When implementing cost reduction + threshold combos, ensure that:
- Spell's **original cost** (before battlefield discounts) is tracked
- Threshold checks use original cost, not discounted cost
- Example: 6-cost spell with -1 discount still counts as 6-cost for "5+ cost" threshold

### Spell Count Tracking
When implementing spell count thresholds:
- Track spells cast per turn (resets each turn)
- Apply bonuses immediately when threshold is reached
- Bonuses last for the turn (or until end of turn)

### Global Bonus Application
- All battlefield bonuses apply to both Lane A and Lane B
- Bonuses only affect your spells (not opponent's)
- Both players' bonuses are active simultaneously

---

## Testing Questions

1. **Cost Reduction Balance**: Is -1 cost per battlefield balanced, or should it be capped?
2. **Threshold Difficulty**: Are 3+ spell or 5+ cost thresholds too easy/hard to trigger?
3. **Card Draw Balance**: Does drawing a card per spell create too much value?
4. **Spell Damage Stacking**: Is +1 base + +1 threshold too much damage?
5. **Draft Impact**: Do these battlefields make spell-heavy decks too strong?
6. **Combo Clarity**: Is it clear how the battlefields synergize?
7. **Original Cost Tracking**: Is the "original cost" mechanic clear to players?

---

## Next Steps

1. **Finalize battlefield pair**: Choose between Void Rift + Arcane Nexus (Enhanced) or Void Rift + Shadow Library (Enhanced)
2. **Implement original cost tracking**: Ensure thresholds use original cost, not discounted
3. **Design spell count tracking**: Implement per-turn spell counting for thresholds
4. **Balance test**: Verify spell damage and card draw feel balanced
5. **Playtest**: Test that spell-heavy decks are strong but not overpowered
6. **Iterate**: Adjust thresholds and bonuses based on playtesting feedback

---

*Document created: 2025-01-XX*
*Status: Design exploration - combo-focused battlefield synergies*

