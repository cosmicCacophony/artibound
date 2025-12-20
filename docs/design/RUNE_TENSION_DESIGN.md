# Rune Tension Design - Artifact Drafting Decisions

> **Created:** 2024-12-20  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Design principle for creating meaningful artifact drafting decisions

## Core Principle: Rune Tension

**The Tension**: Players must decide whether to draft rune artifacts based on their rune requirements.

### The Decision Point

**Low Rune Requirements (1-2 heavy rune cards):**
- **Don't need artifacts** - Heroes provide enough runes
- Can skip artifact picks, focus on threats/removal
- More flexible deck building

**High Rune Requirements (3-6 mana rune spells + 8-9 mana finishers):**
- **Need artifacts** - Heroes alone aren't enough
- Must draft rune generators to enable strategy
- Creates commitment to multicolor strategy

---

## Rune Requirement Tiers

### Tier 1: Low Requirements (No Artifacts Needed)
**Count**: 1-2 cards with heavy rune requirements

**Examples:**
- 1-2 finishers (8-9 mana, requires 2-4 runes)
- 1-2 premium removal spells (4-5 mana, requires 2 runes)

**Strategy**: Heroes provide enough runes. Can skip artifacts.

### Tier 2: Medium Requirements (1-2 Artifacts)
**Count**: 3-5 cards with rune requirements

**Examples:**
- 2-3 mid-cost spells (3-6 mana, requires 1-2 runes)
- 1-2 finishers (8-9 mana, requires 2-4 runes)

**Strategy**: Need 1-2 rune generators to enable strategy.

### Tier 3: High Requirements (3+ Artifacts)
**Count**: 6+ cards with rune requirements

**Examples:**
- 4-5 mid-cost spells (3-6 mana, requires 1-2 runes)
- 2-3 finishers (8-9 mana, requires 2-4 runes)
- Multiple rune-consuming units

**Strategy**: Need 3+ rune generators. Heavy commitment to multicolor.

---

## Card Design Guidelines

### Creating Tension

**Rune-Heavy Spells (3-6 mana):**
- Should require 1-2 runes
- Examples: Removal (2BB), AOE (4UB), Buffs (3RWG)
- **Purpose**: Create need for artifacts if you draft many

**Rune-Heavy Finishers (8-9 mana):**
- Should require 2-4 runes
- Examples: Time of Triumph (9RRGG), Multicolor Wrath (8RRWW)
- **Purpose**: Require artifacts if you want multiple finishers

**Non-Rune Cards:**
- Should exist at all mana costs
- Examples: Generic removal, combat tricks, units
- **Purpose**: Allow decks to skip artifacts entirely

### Balancing the Pool

**Target Distribution:**
- **30-40%** of cards require runes (creates tension)
- **60-70%** of cards are generic (allows flexibility)
- **10-15%** are heavy rune requirements (8-9 mana finishers)
- **20-25%** are medium rune requirements (3-6 mana spells)

---

## Draft Scenarios

### Scenario 1: Low Rune Requirements
**Draft**: 1 finisher (Time of Triumph, 9RRGG), 1 removal (Terminate, 4B)

**Decision**: **Skip artifacts** - Heroes provide R, R, G, G, B
- Can focus on threats and generic cards
- More flexible deck building
- Less committed to specific colors

### Scenario 2: Medium Rune Requirements
**Draft**: 3 removal spells (2BB, 3UB, 4B), 1 finisher (8RRWW)

**Decision**: **Draft 1-2 artifacts** - Need additional runes
- Adaptive Void Generator (UB flexible)
- Legion Generator (RW dual)
- Enables strategy without heavy commitment

### Scenario 3: High Rune Requirements
**Draft**: 5 rune spells (3-6 mana), 2 finishers (8-9 mana)

**Decision**: **Draft 3+ artifacts** - Heavy commitment
- Multiple dual-color generators
- Any-color generators for flexibility
- Creates powerful but inflexible deck

---

## Card Pool Balance

### Current Distribution (Target)

**Rune-Heavy Spells (3-6 mana):**
- ✅ Removal: Doom Blade (2BB), Terminate (4B), Assassinate (3BB)
- ✅ AOE: Void Cascade (5UB), Thunderstorm (4UB), Arcane Sweep (6UB)
- ✅ Buffs: Convergence Rally (6RWG), Growth Rally (4RWG)
- ✅ Damage: Primal Storm (5RWG), Void Storm (5UB)

**Rune-Heavy Finishers (8-9 mana):**
- ✅ Time of Triumph (9RRGG)
- ✅ Wild Convergence (8RRWW)
- ✅ Primal Wrath (7RRGG)
- ✅ Multicolor Wrath (6 any 3 colors)

**Non-Rune Cards:**
- ✅ Generic removal: Arcane Removal (2U), Dismember (2B)
- ✅ Generic damage: Fire Bolt (2R), Lightning Strike (2R)
- ✅ Generic units: Most 1-5 mana units
- ✅ Combat tricks: Rush (1R), Battle Rage (2R)

---

## Design Implications

### For Aggro Decks
- **Generally skip artifacts** (0-1)
- Focus on generic cards and threats
- Exception: 1-2 artifacts if drafting Time of Triumph or rune-consuming early spells

### For Control Decks
- **Need 2-4 artifacts** (enable splashing)
- Many removal spells require runes
- Finishers require multiple colors

### For Midrange Decks
- **Need 3-5 artifacts** (maximum flexibility)
- Many multicolor cards require runes
- Finishers require 3-4 colors

---

## Testing Checklist

- [ ] Can build viable deck with 0 artifacts (low rune requirements)
- [ ] Can build viable deck with 1-2 artifacts (medium requirements)
- [ ] Can build viable deck with 3+ artifacts (high requirements)
- [ ] Drafting many rune spells creates need for artifacts
- [ ] Drafting few rune spells allows skipping artifacts
- [ ] Tension feels meaningful, not forced

---

## Implementation Status

### Current Rune-Heavy Spells (3-6 mana)
**Status**: ✅ Good coverage, but could use more

**Existing Cards:**
- Doom Blade (2BB) - 2 mana removal
- Shadow Kill (2B) - 2 mana removal
- Terminate (4B) - 4 mana removal
- Assassinate (3BB) - 3 mana removal
- Void Cascade (5UB) - 5 mana AOE
- Thunderstorm (4UB) - 4 mana AOE
- Arcane Sweep (6UB) - 6 mana AOE
- Chain Lightning (4U) - 4 mana AOE
- Arcane Burst (4U) - 4 mana AOE
- Lightning Bolt (2RU) - 2 mana damage
- Meteor (6RU) - 6 mana AOE
- Convergence Rally (6RWG) - 6 mana buff
- Growth Rally (4RWG) - 4 mana buff
- Primal Storm (5RWG) - 5 mana damage

**Needed**: More 3-5 mana rune spells to create tension

### Current Finishers (8-9 mana)
**Status**: ✅ Good coverage

**Existing Cards:**
- Time of Triumph (9RRGG) - 9 mana finisher
- Wild Convergence (8RRWW) - 8 mana finisher
- Primal Wrath (7RRGG) - 7 mana finisher
- Multicolor Wrath (6 any 3 colors) - 6 mana finisher

### Current Generic Cards (No Runes)
**Status**: ✅ Good coverage

**Examples:**
- Arcane Removal (2U) - Generic removal
- Fire Bolt (2R) - Generic damage
- Dismember (2B) - Generic removal
- Most units (1-5 mana) - Generic threats

---

## Related Documents
- `docs/design/RUNE_ARTIFACT_DESIGN.md` - Rune artifact design
- `docs/design/RPS_ARCHETYPE_SYSTEM.md` - RPS archetype system
- `docs/design/RPS_CARD_NEEDS.md` - Card creation needs

