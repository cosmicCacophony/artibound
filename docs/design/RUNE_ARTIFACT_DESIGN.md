# Rune Artifact Design Guide

> **Created:** 2024-12-15  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Design principles for rune-generating artifacts that enable deck building and splashing

## Overview

Rune artifacts are **critical deck building tools** that enable splashing powerful multicolor spells. The more rune artifacts you draft, the more you can splash powerful spells from other colors.

---

## Design Principles

### Core Philosophy
- **Rune artifacts enable splashing** - They're not just ramp, they're deck building enablers
- **More artifacts = more flexibility** - Drafting multiple rune artifacts opens up multicolor strategies
- **Cost vs. Flexibility trade-off** - More expensive artifacts provide more flexibility

### Archetype-Specific Needs

**Aggro (Mono Red)**:
- **Generally**: 0-1 rune artifacts (prioritize threats)
- **Exception**: 1-2 if drafting big finishers (Time of Triumph) or early rune-consuming spells
- **Philosophy**: Race, not ramp - put threats on board

**Control (UG + Splashes)**:
- **Generally**: 2-4 rune artifacts (enable splashing)
- **Purpose**: Access powerful finishers (Exorcism, etc.)
- **Philosophy**: Invest in rune generation to unlock splash colors

**Midrange (Black + 3-4 Colors)**:
- **Generally**: 3-5 rune artifacts (maximum flexibility)
- **Purpose**: Enable 3-4 color strategies
- **Philosophy**: Rune artifacts are essential for multicolor payoffs

---

## Rune Artifact Types

### Type 1: Single Color Rune Generator
**Cost**: 3-4 mana  
**Effect**: Generate 1 rune of specific color each turn  
**Purpose**: Enable single-color splash

**Examples** (Existing):
- **Void Generator** (4 mana, U): Generate 1 blue rune
- **Sacrificial Altar** (3 mana, B): Generate 1 black rune
- **Vanguard Generator** (3 mana, R): Generate 1 red rune (temporary)

**Design Notes**:
- Standard cost: 3-4 mana
- Provides consistent rune generation
- Enables single-color splash

---

### Type 2: Dual Color Rune Generator
**Cost**: 4-5 mana  
**Effect**: Generate 2 runes (1 of each color) each turn  
**Purpose**: Enable dual-color splash or strengthen existing colors

**Examples** (To Be Created):
- **UB Rune Generator** (4 mana, UB): Generate 1 blue rune + 1 black rune
- **GU Rune Generator** (4 mana, GU): Generate 1 green rune + 1 blue rune
- **BG Rune Generator** (4 mana, BG): Generate 1 black rune + 1 green rune

**Design Notes**:
- Cost: 4-5 mana (1 more than single-color)
- Provides 2 runes per turn (more value)
- Enables dual-color splash or strengthens base colors

---

### Type 3: Flexible Color Rune Generator
**Cost**: 4-5 mana  
**Effect**: Generate 1 rune of either colorA OR colorB (player chooses)  
**Purpose**: Flexibility in deck building, adapt to draft

**Examples** (To Be Created):
- **Flexible UB Generator** (4 mana, UB): Generate 1 blue rune OR 1 black rune (choose each turn)
- **Flexible GU Generator** (4 mana, GU): Generate 1 green rune OR 1 blue rune (choose each turn)
- **Flexible RW Generator** (4 mana, RW): Generate 1 red rune OR 1 white rune (choose each turn)

**Design Notes**:
- Cost: 4-5 mana (same as dual-color)
- Provides flexibility (choose color each turn)
- Adapts to draft - can pivot between colors
- Less raw power than dual-color, but more flexibility

---

### Type 4: Any Color Rune Generator
**Cost**: 5-6 mana (+1 mana premium)  
**Effect**: Generate 1 rune of any color (player chooses)  
**Purpose**: Maximum flexibility for 3-4 color decks

**Examples** (To Be Created):
- **Prismatic Generator** (5 mana, colorless or any color): Generate 1 rune of any color
- **Universal Mana Rock** (6 mana, any color): Generate 1 rune of any color
- **Chromatic Seal** (5 mana, any color): Generate 1 rune of any color

**Design Notes**:
- Cost: 5-6 mana (+1-2 mana premium over single-color)
- Provides maximum flexibility
- Essential for 3-4 color midrange decks
- Can be any color or colorless (design choice)

---

## Cost Structure

| Type | Mana Cost | Runes Generated | Flexibility | Use Case |
|------|-----------|-----------------|-------------|----------|
| **Single Color** | 3-4 | 1 rune (fixed) | Low | Single-color splash |
| **Dual Color** | 4-5 | 2 runes (fixed) | Medium | Dual-color splash or strengthen base |
| **Flexible (Either/Or)** | 4-5 | 1 rune (choice) | High | Adapt to draft, pivot colors |
| **Any Color** | 5-6 | 1 rune (any) | Maximum | 3-4 color decks |

---

## Design Examples

### Single Color (Existing)
```typescript
{
  id: 'ub-artifact-void-generator',
  name: 'Void Generator Artifact',
  description: 'Artifact. At the start of your turn, add 1 blue rune to your rune pool.',
  cardType: 'artifact',
  colors: ['blue'],
  manaCost: 4,
  effectType: 'rune_generation',
  effectValue: 1, // Generates 1 blue rune per turn
}
```

### Dual Color (To Be Created)
```typescript
{
  id: 'ub-artifact-dual-generator',
  name: 'Void Shadow Generator',
  description: 'Artifact. At the start of your turn, add 1 blue rune and 1 black rune to your rune pool.',
  cardType: 'artifact',
  colors: ['blue', 'black'],
  manaCost: 5,
  effectType: 'rune_generation',
  effectValue: 2, // Generates 2 runes (1U + 1B) per turn
  runeColors: ['blue', 'black'], // Both colors
}
```

### Flexible Either/Or (To Be Created)
```typescript
{
  id: 'ub-artifact-flexible-generator',
  name: 'Adaptive Generator',
  description: 'Artifact. At the start of your turn, add 1 blue rune or 1 black rune to your rune pool (your choice).',
  cardType: 'artifact',
  colors: ['blue', 'black'],
  manaCost: 4,
  effectType: 'rune_generation',
  effectValue: 1, // Generates 1 rune (choice)
  flexibleColors: ['blue', 'black'], // Player chooses
}
```

### Any Color (To Be Created)
```typescript
{
  id: 'artifact-prismatic-generator',
  name: 'Prismatic Generator',
  description: 'Artifact. At the start of your turn, add 1 rune of any color to your rune pool.',
  cardType: 'artifact',
  colors: [], // Colorless or any color
  manaCost: 5,
  effectType: 'rune_generation',
  effectValue: 1, // Generates 1 rune (any color)
  anyColor: true, // Can generate any color
}
```

---

## Card Creation Priorities

### High Priority (Enable Splashing)

#### Dual Color Generators
- [ ] **UB Generator** (4-5 mana): Generate 1U + 1B
- [ ] **GU Generator** (4-5 mana): Generate 1G + 1U
- [ ] **BG Generator** (4-5 mana): Generate 1B + 1G
- [ ] **RW Generator** (4-5 mana): Generate 1R + 1W
- [ ] **RB Generator** (4-5 mana): Generate 1R + 1B
- [ ] **GW Generator** (4-5 mana): Generate 1G + 1W

#### Flexible Either/Or Generators
- [ ] **UB Flexible** (4-5 mana): Generate 1U OR 1B (choice)
- [ ] **GU Flexible** (4-5 mana): Generate 1G OR 1U (choice)
- [ ] **RW Flexible** (4-5 mana): Generate 1R OR 1W (choice)

#### Any Color Generators
- [ ] **Prismatic Generator** (5 mana): Generate 1 rune of any color
- [ ] **Universal Mana Rock** (6 mana): Generate 1 rune of any color

### Medium Priority (Enhance Existing)

#### Complete Single Color Set
- [ ] **White Generator** (3-4 mana): Generate 1 white rune
- [ ] **Green Generator** (3-4 mana): Generate 1 green rune
- ✅ **Blue Generator** (4 mana): Void Generator (exists)
- ✅ **Black Generator** (3 mana): Sacrificial Altar (exists)
- ✅ **Red Generator** (3 mana): Vanguard Generator (exists, temporary)

### Low Priority (Nice to Have)

#### Specialized Generators
- [ ] **Conditional Generators**: Generate runes based on game state
- [ ] **Temporary Generators**: Generate temporary runes (like Vanguard Generator)
- [ ] **Multi-Rune Generators**: Generate 2+ runes of same color (expensive)

---

## Implementation Notes

### Effect Type
All rune artifacts use `effectType: 'rune_generation'` with:
- `effectValue`: Number of runes generated (usually 1-2)
- `runeColors`: Array of colors generated (for dual-color)
- `flexibleColors`: Array of colors player can choose from (for flexible)
- `anyColor`: Boolean for any-color generators

### Turn Timing
Rune generation happens "At the start of your turn" - this ensures runes are available for the entire turn.

### Rune Persistence
- **Permanent runes**: Generated by artifacts, persist until hero is bounced
- **Temporary runes**: Generated by spells (Dark Ritual), clear at end of turn

---

## Archetype-Specific Recommendations

### Aggro (Mono Red)
**Recommended Artifacts**: 0-1
- **Single Color Red** (if drafting Time of Triumph or rune-consuming spells)
- **Avoid**: Dual-color, flexible, any-color (too slow)

### Control (UG + Splashes)
**Recommended Artifacts**: 2-4
- **Dual Color GU** (strengthen base colors)
- **Flexible UB** (enable Exorcism splash)
- **Any Color** (maximum flexibility for 3-color)

### Midrange (Black + 3-4 Colors)
**Recommended Artifacts**: 3-5
- **Multiple Dual Color** (enable multiple splashes)
- **Any Color** (essential for 4-color)
- **Flexible** (adapt to draft)

---

## Related Documents
- `docs/design/RPS_ARCHETYPE_SYSTEM.md` - RPS system overview
- `docs/design/RPS_CARD_NEEDS.md` - Card creation needs
- `src/game/runeSystem.ts` - Rune system implementation
- `src/game/comprehensiveCardData.ts` - Existing artifacts


