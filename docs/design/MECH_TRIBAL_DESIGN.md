# Mech Tribal Design

> **Created:** 2024-12-23  
> **Last Updated:** 2024-12-23  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Design philosophy and implementation for Mech tribal mechanic

## Overview

Mech tribal is a cross-archetype synergy mechanic inspired by Riftbound, where mechs give each other various bonuses. Mechs serve as "glue" cards that help bridge UR (Blue-Red) and White strategies, creating interesting draft decisions and multicolor deckbuilding opportunities.

---

## Design Philosophy

### Core Concept

**"Mechs synergize with other mechs, regardless of color"**

Unlike Legion (which is strictly RW), mechs are a tribal type that can exist across multiple colors but have their strongest support in UR and White. This creates a cross-archetype synergy that rewards players for drafting mechs from multiple colors.

### Key Principles

1. **Cross-Archetype Glue**: Mechs help bridge different color strategies
2. **Diverse Bonuses**: Multiple bonus types prevent repetitive gameplay
3. **Critical Mass**: Need 3-4 mechs for full value
4. **Color Identity**: UR (aggro/tempo) vs White (defensive) vs Splash (utility)

---

## Color Identity

### UR Mechs (Primary) - 16 cards

**Blue Mechs (8 cards)**: Tempo/spell synergy
- Cost reduction for other mechs
- Spell-triggered bonuses
- Card draw on ETB
- +1/+0 bonuses

**Red Mechs (8 cards)**: Aggro/direct damage
- Tower damage triggers
- Direct damage ETB effects
- Overwhelm grants
- +X/+0 bonuses

**Thematic:** Innovation, aggression, and tempo

### White Mechs (Secondary) - 6 cards

**White Mechs**: Defensive/protective
- Shield grants
- Tower armor gains
- +0/+X bonuses
- Taunt grants

**Thematic:** Protection, defense, and resilience

### Splash Mechs (Tertiary) - 4 cards

**Green Mechs (2 cards)**: Ramp/rune generation
**Black Mechs (2 cards)**: Removal/sacrifice

**Purpose:** Provide flexibility for multicolor drafts without enabling full mech strategies in these colors

---

## Mech Synergy Types

### 1. Stat Bonuses

**Pattern:** Other mechs you control get +X/+Y

Examples:
- Storm Engine: +1/+1 to all mechs
- Blazing Colossus: +2/+0 to all mechs
- Aegis Protector: +0/+2 to all mechs

**Design Note:** Stat bonuses are simple and stack, creating snowball potential

### 2. Keyword Grants

**Pattern:** Other mechs you control have [keyword]

Examples:
- Siege Titan: Grants Overwhelm
- Guardian Sentinel: Grants Shield
- Fortress Titan: Grants Taunt

**Design Note:** Keywords create interesting tactical decisions and interactions

### 3. Cost Reduction

**Pattern:** Other mechs you control cost N less mana

Examples:
- Aether Scout: Mechs cost 1 less
- Mech Assembly Line (artifact): Mechs cost 1 less each turn

**Design Note:** Enables explosive turns but requires setup

### 4. ETB Effects

**Pattern:** When played, if you control another mech, [effect]

Examples:
- Prototype Enforcer: Draw a card
- Assault Construct: Deal 2 damage
- Bastion Automaton: Gain 2 tower armor

**Design Note:** Rewards having mechs in play already, creates sequencing decisions

---

## Mech Heroes

### Master Engineer (Blue)
- **Support:** Mechs you control get +1/+0
- **Ability:** Return target mech from graveyard to hand (1U, Cooldown 3)
- **Role:** Recursion and value

### Forgemaster (Red)
- **Support:** Mechs you control get +1/+0
- **Ability:** Mechs gain +2/+0 until end of turn (1R, Cooldown 2)
- **Role:** Aggressive burst

### Sentinel Commander (White)
- **Support:** Mechs you control get +0/+1
- **Ability:** Mechs gain Shield until end of turn (1W, Cooldown 3)
- **Role:** Defensive protection

---

## Mech Support Cards

### Artifacts

1. **Mech Assembly Line** (4 mana)
   - Effect: Mechs cost 1 less each turn
   - Role: Enables explosive mech turns

2. **Power Core** (3 mana)
   - Effect: Mechs have +1/+1
   - Role: Simple stat boost for tribal

### Spells

1. **Overcharge** (3UR)
   - Effect: Mechs gain +3/+0 and Overwhelm
   - Role: Aggressive finisher

2. **Emergency Repairs** (3W)
   - Effect: Restore all mechs to full health
   - Role: Defensive recovery

---

## Draft Strategy

### As Primary Strategy

**Requirements:**
- 4-6 mechs across colors
- 1-2 mech heroes
- 0-1 mech support cards

**Colors:** UR, URW, UW, RW

**Playstyle:** Tempo-based with synergy payoffs

### As Splash/Secondary

**Requirements:**
- 2-3 mechs as filler
- No dedicated heroes needed

**Colors:** Any multicolor deck

**Playstyle:** Mechs as efficient creatures with minor bonuses

---

## Balance Considerations

### Strengths

- **Scalable:** Gets better with more mechs
- **Flexible:** Works across multiple colors
- **Snowball Potential:** Multiple bonuses stack
- **Cross-Synergy:** UR aggro + White defense creates interesting choices

### Weaknesses

- **Requires Critical Mass:** Need 3-4 mechs for full value
- **Vulnerable to Removal:** Losing key mechs hurts synergy
- **Color Commitment:** Best mechs require rune costs
- **Competes with Other Strategies:** UR and White have other strong archetypes

### Power Level Tuning

**Target Power Level:** Comparable to Legion tribal (RW)

**Considerations:**
- Legion has token generation and go-wide focus
- Mechs have higher individual quality but need critical mass
- Both require color commitment
- Mechs have more diverse bonus types

---

## Comparison to Legion

| Aspect | Legion (RW) | Mech (UR+W) |
|--------|-------------|-------------|
| **Colors** | RW only | UR primary, W secondary, splash in others |
| **Strategy** | Go-wide, token generation | Quality creatures, mutual bonuses |
| **Bonuses** | Mostly stat buffs | Diverse (stats, keywords, cost reduction, ETB) |
| **Identity** | Aggro/tempo | Aggro/tempo (UR) + Defensive (W) |
| **Critical Mass** | 3-5 Legion units | 3-4 mechs |
| **Flexibility** | RW only | Cross-color |

---

## Implementation Notes

### Type System

```typescript
interface GenericUnit {
  isMech?: boolean // Mech tribal tag
  mechSynergy?: {
    attackBonus?: number
    healthBonus?: number
    grantKeyword?: string
    costReduction?: number
    etbEffect?: string
  }
}
```

### Bonus Calculation

Bonuses are calculated dynamically during gameplay:
- Stat bonuses: Applied during combat/display
- Keywords: Checked during combat resolution
- Cost reduction: Applied when checking card affordability
- ETB effects: Triggered when mech enters battlefield

### Visual Indicators

- Mech badge on card preview (⚙️ MECH)
- Active bonuses displayed on card
- Mech count shown in battlefield

---

## Future Considerations

### Expansion Possibilities

1. **More Mech Heroes**: Each color could have a mech-focused hero
2. **Mech Equipment**: Artifacts that attach to mechs specifically
3. **Mech Spells**: More mech-specific support spells
4. **Legendary Mechs**: High-rarity mechs with unique effects

### Balance Adjustments

Monitor win rates for:
- UR mech decks vs other UR strategies
- White mech decks vs other White strategies
- Multicolor mech decks (URW) vs 2-color decks

Adjust:
- Mech stats (attack/health)
- Bonus values (+1/+1 vs +2/+0)
- Mana costs
- Rune requirements

---

## Design Goals Achieved

✅ **Cross-archetype glue**: Mechs bridge UR and White strategies  
✅ **Diverse bonuses**: Stat bonuses, keywords, cost reduction, ETB effects  
✅ **UR aggro/tempo identity**: Red and Blue mechs focus on aggression  
✅ **White defensive identity**: White mechs focus on protection  
✅ **Splash flexibility**: Green and Black have limited mech options  
✅ **Tribal synergy**: Mechs reward drafting multiple mechs  
✅ **Distinct from Legion**: Different color focus and bonus types  

---

## Testing Priorities

1. **Draft Viability**: Can players assemble 4-6 mechs consistently?
2. **UR Mech Tempo**: Do UR mechs feel aggressive and threatening?
3. **White Mech Defense**: Do White mechs effectively protect towers?
4. **Cross-Synergy**: Does UR+W mech deck feel cohesive?
5. **Balance**: Are mechs comparable in power to Legion and other strategies?
6. **Color Commitment**: Do mech rune costs discourage splashing appropriately?

---

## Summary

Mech tribal adds a cross-archetype synergy that rewards flexible deckbuilding while maintaining distinct color identities. UR mechs focus on aggro/tempo, White mechs on defense, and splash mechs provide utility. The diverse bonus types (stats, keywords, cost reduction, ETB) create interesting gameplay decisions while avoiding repetitive patterns.

The tribal mechanic serves as a "glue" between strategies, enabling interesting multicolor decks (especially URW) while still being viable as a focused 2-color strategy (UR or UW).

---

*This document should be used alongside `COLOR_IDENTITY_DESIGN.md` and other tribal mechanics documentation.*


