# Color Identity Design Philosophy

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Design principles for maintaining strong color identity and discouraging excessive color splashing

## Overview

This document outlines the design philosophy for maintaining strong color identity in Artibound. The goal is to make each color combination feel distinct and reward players for committing to specific color pairs or triples, rather than encouraging generic "goodstuff" decks that splash everything.

---

## Core Problem

**Question:** Why shouldn't RW (Red/White) just add more colors? Why stay RW instead of splashing Blue or Black for powerful cards?

**Answer:** Strong color identity through:
1. **Heavy color requirements** (RRRR, WWWW costs)
2. **Tribal/synergy cards** (Legion cards that only work in RW)
3. **Weaker rune-generating cards** for aggro colors (so they lean aggro instead of combo)
4. **Color-specific mechanics** that don't work well when splashed

---

## RW (Red/White) Color Identity

### Design Goals

**Make RW want to stay RW, not splash other colors.**

### Implementation Strategies

#### 1. Heavy Color Requirements (RRRR/WWWW)

**Cards with heavy color costs reward commitment:**

- **Legion's Charge** (4RRRR): "All your Legion units gain +2/+2 and haste this turn. Draw a card."
  - Requires 4 red runes - can't easily splash
  - Rewards heavy red commitment
  - Powerful but tempo-based strategies should be better

- **Divine Wrath** (5WWWW): "Destroy all non-Legion units. Your Legion units gain +1/+1."
  - Requires 4 white runes - heavy white commitment
  - Protects Legion tribal strategy
  - Powerful board wipe that only works if you're committed

- **War Banner** (2RR): "All your units gain +1 attack. If you control 3+ Legion units, they gain +2 attack instead."
  - Dual red requirement
  - Scales with Legion tribal

**Design Note:** Heavy color requirements (3-4 of same color) make splashing difficult. Players must commit to the color to use these cards.

#### 2. Legion Tribal Synergy

**Legion cards only work well together:**

- **Legion units** have tribal bonuses
- **Legion spells** buff all Legion units
- **Legion heroes** enable Legion strategies

**Example:**
- If you splash Blue, you lose Legion tribal bonuses
- Legion cards are weaker without other Legion cards
- Creates incentive to stay RW

#### 3. Weaker Rune-Generating Cards for RW

**Philosophy:** Make rune-generating cards weaker for RW so they lean aggro instead of combo.

**Current State:**
- RW has access to some rune-generating cards
- But they should be weaker than UGB rune cards
- RW should prefer aggro/tempo over combo

**Design Note:** If RW rune cards are too strong, RW might become a combo deck instead of aggro. Keep them weak to maintain identity.

#### 4. Time of Triumph (9RRRR) - Semi-Bait Card

**Design:** Powerful but tempo-based strategies should be better.

- **Cost:** 9RRRR (9 mana, 4 red runes)
- **Effect:** "All your units gain +3/+3 and trample this turn. Draw a card for each unit you control."
- **Philosophy:** 
  - Powerful effect, but very expensive
  - Tempo-based RW strategies (early pressure, efficient units) should win before this matters
  - Rewards heavy red commitment
  - Acts as a "bait" - looks powerful but tempo is usually better

**Design Note:** Semi-bait cards create interesting draft decisions. Do you go for the powerful late-game card, or focus on tempo?

---

## UGB (Blue/Black/Green) Color Identity

### Design Goals

**Make UGB feel distinct from RW - control/combo vs aggro.**

### Implementation Strategies

#### 1. Strong Rune-Generating Cards

**UGB should have access to powerful rune generation:**

- Dark Ritual (BBB temporary)
- Cabal Ritual (BBBBB temporary)
- Wild Growth (G permanent)
- High Tide (UU temporary)

**Philosophy:** UGB leans into combo/control, so rune generation is important.

#### 2. ETB Effects on Units

**UGB units should have interesting ETB effects:**

- **Ethereal Scholar** (3 mana, U): "When this enters, draw a card. You may return target unit you control to your hand."
- **Void Walker** (4 mana, UB): "When this enters, stun target enemy unit for 1 turn."
- **Nature's Guardian** (5 mana, UG): "When this enters, all your units gain +1/+1 until end of turn."

**Design Note:** ETB effects make UGB units more interesting than generic stat blocks. Creates value even if unit dies immediately.

#### 3. Control Tools

**UGB should have access to powerful control tools:**

- Board wipes (Exorcism, Necromantic Rite)
- Removal spells (Assassinate, Void Bolt)
- Card draw (Death Ritual, Arcane Insight)

**Philosophy:** Control/combo identity requires these tools.

---

## Color Splashing Philosophy

### When Splashing Should Be Possible

**Splashing should be possible but come with costs:**

1. **Color requirements:** Splashing requires deploying heroes of that color
2. **Rune costs:** Splashed cards often have rune costs, requiring setup
3. **Synergy loss:** Splashed cards don't benefit from tribal/synergy bonuses
4. **Deployment constraints:** Need to deploy heroes in specific lanes for color access

### When Splashing Should Be Discouraged

**Heavy color requirements discourage splashing:**

- **RRRR costs:** Can't easily splash - need 4 red runes
- **WWWW costs:** Can't easily splash - need 4 white runes
- **Tribal cards:** Only work with other cards of same tribe
- **Synergy cards:** Require multiple pieces of same color

**Design Note:** Balance between allowing flexibility and maintaining identity.

---

## Design Principles

### 1. Heavy Color Costs for Powerful Effects

**Powerful effects should require heavy color commitment:**

- 3-4 of same color for game-changing effects
- 2 of same color for strong effects
- 1 color for efficient effects

**Example:**
- **Time of Triumph** (9RRRR): Game-changing effect, requires 4 red
- **Legion's Charge** (4RRRR): Strong effect, requires 4 red
- **War Banner** (2RR): Efficient effect, requires 2 red

### 2. Tribal/Synergy Rewards

**Cards that only work well with other cards of same type:**

- Legion tribal (RW)
- Combo pieces (UGB)
- Synergy engines (color-specific)

**Design Note:** Tribal cards create identity - if you splash, you lose synergy.

### 3. Color-Specific Mechanics

**Mechanics that work best in specific colors:**

- **RW:** Aggro, tempo, combat tricks
- **UGB:** Control, combo, value engines

**Design Note:** Each color should have mechanics that don't translate well to other colors.

### 4. Rune Generation Balance

**Balance rune generation to maintain identity:**

- **RW:** Weaker rune generation (lean aggro)
- **UGB:** Stronger rune generation (lean combo/control)

**Design Note:** If RW has strong rune generation, it might become a combo deck instead of aggro.

---

## Implementation Checklist

### RW Color Identity

- [x] Add cards with heavy RRRR/WWWW costs
- [x] Ensure Legion tribal cards are RW-specific
- [x] Make rune-generating cards weaker for RW
- [x] Add Time of Triumph (9RRRR) as semi-bait card
- [ ] Test that RW feels incentivized to stay RW
- [ ] Test that splashing feels costly but possible

### UGB Color Identity

- [x] Add UGB units with ETB effects
- [x] Ensure strong rune-generating cards exist
- [x] Maintain control/combo identity
- [ ] Test that UGB feels distinct from RW
- [ ] Test that UGB has interesting decision points

---

## Future Considerations

### Additional Color Combinations

As more color combinations are added:
- Each should have distinct identity
- Heavy color costs for powerful effects
- Tribal/synergy rewards
- Color-specific mechanics

### Draft Implications

**Color identity affects draft:**

- Players should feel rewarded for committing to colors
- Splashing should be possible but costly
- Draft decisions should matter (color commitment vs flexibility)

**Design Note:** Draft system should reinforce color identity through pick order and availability.

---

## Summary

**Key Principles:**

1. **Heavy color requirements** (RRRR/WWWW) for powerful effects
2. **Tribal/synergy rewards** that only work with commitment
3. **Weaker rune generation** for aggro colors (RW)
4. **Stronger rune generation** for combo/control colors (UGB)
5. **Color-specific mechanics** that don't translate well

**Goal:** Make each color combination feel distinct and reward commitment, while still allowing strategic flexibility through splashing (with costs).

---

*This document should be used alongside `RW_UB_CARDS.md` and `COMBO_SYSTEM.md` to understand color identity design.*


