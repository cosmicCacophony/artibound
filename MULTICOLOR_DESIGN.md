# Multi-Color Design Document

## Overview

This document explores how the 2-battlefield structure enables 3-4 color deck building, making it a core design strength that differentiates Artibound from Artifact Foundry's 3-lane system.

## The Core Insight

**Artifact Foundry's Problem**: With 3 lanes, single-color decks are heavily incentivized because you can always play cards in any lane without worrying about off-color heroes.

**Artibound's Advantage**: With only 2 battlefields, multi-color decks become more viable:
- **1 color**: 100% chance of having the right hero (same as Foundry)
- **2 colors**: ~75% chance with 2 battlefields vs ~67% with 3 lanes
- **3 colors**: ~83% chance with 2 battlefields vs ~56% with 3 lanes  
- **4 colors**: ~94% chance with 2 battlefields vs ~42% with 3 lanes

**Design Goal**: Make 3-4 color decks **optimal** rather than just viable. This creates:
- More skill-intensive deck building
- Synergy-driven gameplay
- Unique strategic depth compared to Foundry

---

## Design Principles

### 1. Power Scaling with Color Count
Cards and abilities should get stronger as you add more colors:
- **2-color cards**: Baseline power, work in 2-color decks
- **3-color cards**: Stronger effects, require 3 colors
- **4-color cards**: Powerful "convergence" effects, require 4 colors

### 2. Multicolor Hero Design
Heroes should encourage multi-color strategies:
- **Dual-color heroes**: Enable 2-color strategies, stronger than mono-color
- **Tri-color heroes**: Enable 3-color strategies, powerful but require commitment
- **Hero abilities**: Scale with color diversity in your deck

### 3. Synergy Requirements
Best cards should require multiple colors:
- Cards that check "if you control heroes of X, Y, and Z colors"
- Battlefields that reward color diversity
- Effects that scale with the number of different colors

### 4. Draft Tension
Draft should create interesting decisions:
- Early picks: Set your color identity
- Mid picks: Reward branching into 3rd/4th color
- Late picks: Powerful convergence cards for multi-color decks

### 5. Risk/Reward Balance
More colors = more power, but harder to cast:
- Higher variance in early game (might not have right colors)
- Stronger late game (more options, better synergies)
- Skill expression: Managing color requirements across 2 battlefields

---

## Color System Rules

### Current Rules
- **MAX_COLORS_PER_DECK**: 3 (should be increased to 4)
- Cards require heroes of **ALL** their colors in the lane to be played
- Multicolor cards require heroes of each color present

### Proposed Rules
1. **Increase color limit to 4** - Enable 4-color strategies
2. **Multicolor casting**: If you have RW hero in one battlefield and G hero in another, you can play RWG cards in either battlefield (as long as all colors are present somewhere)
3. **Convergence bonuses**: Cards that scale with total color count in your deck

---

## Multicolor Hero Philosophy

### Dual-Color Heroes (Current)
- **Purpose**: Enable 2-color strategies
- **Power Level**: Stronger than mono-color, baseline for multi-color
- **Examples**: 
  - RW heroes (Valiant Commander, War Captain)
  - UB heroes (Void Archmage, Shadow Necromancer)

### Tri-Color Heroes (New)
- **Purpose**: Enable 3-color strategies, powerful convergence effects
- **Power Level**: Stronger than dual-color, but require 3-color commitment
- **Design**: Should have abilities that reward having all 3 colors
- **Examples**:
  - RWG hero: Combines RW aggression with Green's growth
  - UBG hero: Combines UB control with Green's resilience

### Hero Ability Scaling
Heroes should have abilities that scale with color diversity:
- "If you control heroes of 3+ different colors, this ability costs 1 less"
- "Deal damage equal to the number of different colors among your heroes"
- "Draw a card for each different color you control"

---

## Card Design Patterns

### Pattern 1: Convergence Cards
Cards that require 3-4 colors but are very powerful:

**Example: Convergence Storm**
- **Cost**: 6 mana (3RWG)
- **Colors**: Red, White, Green
- **Effect**: "All your units gain +2/+2 until end of turn. If you control heroes of 4 different colors, they gain +3/+3 instead."
- **Design**: Powerful team buff that scales with color diversity

**Example: Rainbow Nexus**
- **Cost**: 5 mana (2UBG)
- **Colors**: Blue, Black, Green
- **Effect**: "Draw 2 cards. For each different color among your heroes, deal 1 damage to target unit."
- **Design**: Card advantage + removal that scales with colors

### Pattern 2: Hybrid Cards
Cards that work in multiple color combinations:

**Example: Wild Rally**
- **Cost**: 4 mana (2RW or 2RG or 2WG)
- **Colors**: Red, White, Green (can be cast with any 2 of these colors)
- **Effect**: "All your units gain +1/+1 until end of turn."
- **Design**: Flexible casting cost, works in multiple 2-color decks

### Pattern 3: Color Count Scaling
Cards that get stronger with more colors:

**Example: Prismatic Burst**
- **Cost**: 3 mana (1RWG)
- **Colors**: Red, White, Green
- **Effect**: "Deal damage equal to the number of different colors among your heroes to target unit."
- **Design**: Scales from 2 damage (2 colors) to 4 damage (4 colors)

### Pattern 4: Color Requirement Checks
Cards that check for specific color combinations:

**Example: Unified Front**
- **Cost**: 5 mana (2RWG)
- **Colors**: Red, White, Green
- **Effect**: "If you control heroes of Red, White, and Green, all your units gain +2/+2 and can attack immediately."
- **Design**: Powerful effect that requires all 3 colors to be present

---

## Archetype Extensions

### RW → RWG (Red/White/Green)
**Theme**: Go-wide beatdown + growth/resilience

**New Mechanics**:
- Units that grow over time (Green's growth theme)
- Resilient units that survive combat (Green's toughness)
- Synergy between wide boards and growth effects

**Example Cards**:
- **Convergence Rally** (3RWG, 6 mana): "All your units gain +2/+2 until end of turn. If you control 5+ units, they gain +3/+3 instead."
- **Wild Legionnaire** (2RG): "Legion. When this attacks, put a +1/+1 counter on it."
- **Primal Banner** (4RWG): "All your units gain +1/+1. At the start of your next turn, all your units gain +1/+1 again."

**New Heroes**:
- **Wild Commander** (RWG): Combines RW's team buffs with Green's growth
- **Primal Warlord** (RG): Aggressive growth hero

### UB → UBG (Blue/Black/Green)
**Theme**: Control + resilience + card advantage

**New Mechanics**:
- Control elements that also grow (Green's growth)
- Resilient threats that survive removal (Green's toughness)
- Card advantage engines that scale (Green's resource generation)

**Example Cards**:
- **Verdant Control** (3UBG, 6 mana): "Draw 2 cards. If you control heroes of 4 different colors, draw 3 cards instead."
- **Shadow Growth** (2BG): "Destroy target unit. If it had 4+ health, draw a card."
- **Prismatic Mastery** (5UBG): "Draw 3 cards, then discard 1. For each different color among your heroes, deal 1 damage to all enemy units."

**New Heroes**:
- **Void Druid** (UBG): Control hero with growth elements
- **Shadow Sage** (BG): Resilient control hero

---

## Battlefield Design for Multi-Color

### Color Diversity Battlefields
Battlefields that reward having multiple colors:

**Rainbow Nexus**
- **Ability**: "For each different color among your heroes, all your units gain +0/+1"
- **Effect**: With 4 colors = +0/+4 to all units
- **Design**: Rewards color diversity, scales with commitment

**Convergence Grounds**
- **Ability**: "If you control heroes of 3+ different colors, all your units gain +1/+1"
- **Effect**: Threshold-based bonus
- **Design**: Rewards 3+ color decks specifically

**Prismatic Forge**
- **Ability**: "Your multicolor cards cost 1 less mana"
- **Effect**: Makes 3-4 color cards more playable
- **Design**: Enables multi-color strategies

### Archetype-Specific Multi-Color Battlefields

**RWG Battlefield: Wild Training Grounds**
- **Ability**: "You can deploy 6 units instead of 5. If you control heroes of 3+ different colors, you can deploy 7 units instead."
- **Effect**: Combines RW's wide strategy with color diversity reward
- **Design**: Encourages 3-color RWG decks

**UBG Battlefield: Verdant Library**
- **Ability**: "When you cast a spell, draw a card. If you control heroes of 3+ different colors, draw 2 cards instead."
- **Effect**: Combines UB's spell focus with color diversity reward
- **Design**: Encourages 3-color UBG decks

---

## Draft Strategy Implications

### Early Picks (Picks 1-7)
- **Set color identity**: Pick 1-2 colors to focus on
- **Dual-color heroes**: Enable 2-color strategies
- **Flexible cards**: Cards that work in multiple color combinations

### Mid Picks (Picks 8-14)
- **Branch into 3rd color**: Pick a hero or cards in a 3rd color
- **Tri-color heroes**: Enable 3-color strategies
- **Hybrid cards**: Cards that work with your existing colors

### Late Picks (Picks 15-21)
- **Convergence cards**: Powerful 3-4 color cards
- **Color diversity rewards**: Cards that scale with color count
- **Battlefields**: Multi-color battlefields that reward diversity

### Draft Tension
- **Risk**: Picking 3rd/4th color early might leave you with unplayable cards
- **Reward**: Late-game convergence cards are very powerful
- **Skill**: Balancing early consistency vs late-game power

---

## Implementation Plan

### Phase 1: Foundation
1. **Increase MAX_COLORS_PER_DECK to 4**
2. **Update color validation** to allow 4 colors
3. **Design multicolor casting rules** (can play RWG if you have RW in one battlefield and G in another)

### Phase 2: Hero Design
1. **Create tri-color heroes** for RWG and UBG
2. **Design hero abilities** that scale with color diversity
3. **Balance hero power levels** (tri-color should be stronger than dual-color)

### Phase 3: Card Design
1. **Create convergence cards** (3-4 color cards with powerful effects)
2. **Design hybrid cards** (flexible casting costs)
3. **Create color-scaling cards** (effects that scale with color count)

### Phase 4: Battlefield Design
1. **Design color diversity battlefields**
2. **Create archetype-specific multi-color battlefields**
3. **Balance battlefield power levels**

### Phase 5: Testing & Balance
1. **Playtest 3-color decks** (RWG, UBG)
2. **Playtest 4-color decks** (full rainbow)
3. **Balance convergence cards** (ensure they're powerful but not broken)
4. **Adjust draft** to reward multi-color picks

---

## Example Cards

### RWG Convergence Cards

#### Convergence Rally
- **Cost**: 6 mana (3RWG)
- **Colors**: Red, White, Green
- **Type**: Spell
- **Effect**: "All your units gain +2/+2 until end of turn. If you control heroes of 4 different colors, they gain +3/+3 instead."
- **Design Notes**: Powerful team buff that scales with color diversity. Requires RWG heroes but rewards 4-color decks.

#### Wild Legionnaire
- **Cost**: 3 mana (1RG)
- **Colors**: Red, Green
- **Type**: Generic Unit
- **Stats**: 3 Attack / 3 Health
- **Effect**: "Legion. When this attacks, put a +1/+1 counter on it."
- **Design Notes**: Combines RW's Legion theme with Green's growth. Works in RG or RWG decks.

#### Primal Banner
- **Cost**: 5 mana (2RWG)
- **Colors**: Red, White, Green
- **Type**: Generic Unit
- **Stats**: 2 Attack / 4 Health
- **Effect**: "All your units gain +1/+1. At the start of your next turn, all your units gain +1/+1 again."
- **Design Notes**: Persistent team buff that works over multiple turns. Requires RWG but very powerful.

### UBG Convergence Cards

#### Verdant Control
- **Cost**: 6 mana (3UBG)
- **Colors**: Blue, Black, Green
- **Type**: Spell
- **Effect**: "Draw 2 cards. If you control heroes of 4 different colors, draw 3 cards instead."
- **Design Notes**: Card advantage that scales with color diversity. Combines UB's control with Green's resource generation.

#### Shadow Growth
- **Cost**: 4 mana (2BG)
- **Colors**: Black, Green
- **Type**: Spell
- **Effect**: "Destroy target unit. If it had 4+ health, draw a card."
- **Design Notes**: Removal with conditional card advantage. Works in BG or UBG decks.

#### Prismatic Mastery
- **Cost**: 7 mana (3UBG)
- **Colors**: Blue, Black, Green
- **Type**: Spell
- **Effect**: "Draw 3 cards, then discard 1. For each different color among your heroes, deal 1 damage to all enemy units."
- **Design Notes**: Powerful card advantage + board control that scales with color count.

### Tri-Color Heroes

#### Wild Commander (RWG)
- **Colors**: Red, White, Green
- **Stats**: 5 Attack / 11 Health
- **Support Effect**: "Allies gain +1/+1. If you control heroes of 4 different colors, allies gain +2/+2 instead."
- **Ability**: 
  - **Name**: "Primal Rally"
  - **Cost**: 1 mana
  - **Cooldown**: 2 turns
  - **Effect**: "All your units gain +2/+2 this turn. If you control heroes of 3+ different colors, they gain +3/+3 instead."
- **Signature Cards**: Convergence Rally, Primal Banner
- **Design Notes**: Combines RW's team buffs with Green's growth. Scales with color diversity.

#### Void Druid (UBG)
- **Colors**: Blue, Black, Green
- **Stats**: 3 Attack / 10 Health
- **Support Effect**: "When you cast a spell, draw a card. If you control heroes of 4 different colors, draw 2 cards instead."
- **Ability**:
  - **Name**: "Verdant Control"
  - **Cost**: 1 mana
  - **Cooldown**: 2 turns
  - **Effect**: "Draw 2 cards. For each different color among your heroes, deal 1 damage to target unit."
- **Signature Cards**: Verdant Control, Prismatic Mastery
- **Design Notes**: Combines UB's control with Green's resource generation. Scales with color diversity.

---

## Balance Considerations

### Power Level
- **2-color cards**: Baseline power, should be playable in 2-color decks
- **3-color cards**: 20-30% stronger than 2-color equivalents
- **4-color cards**: 40-50% stronger than 2-color equivalents, but require full commitment

### Mana Costs
- **Convergence cards**: Should cost 5-7 mana (late-game power)
- **Hybrid cards**: Should cost 3-5 mana (mid-game flexibility)
- **Color-scaling cards**: Should cost 2-4 mana (early-game with scaling)

### Draft Balance
- **Early picks**: 2-color cards should be more common
- **Mid picks**: 3-color cards start appearing
- **Late picks**: 4-color convergence cards appear, rewarding multi-color decks

### Battlefield Balance
- **Color diversity battlefields**: Should be powerful but not auto-win
- **Archetype battlefields**: Should support their archetype without being mandatory
- **Stacking**: Both players' battlefields active should create interesting interactions

---

## Testing Questions

1. **Power Level**: Are 3-4 color cards too strong or too weak?
2. **Consistency**: Do 3-4 color decks have enough early-game consistency?
3. **Draft**: Does the draft properly reward multi-color picks?
4. **Battlefields**: Do color diversity battlefields feel impactful?
5. **Synergies**: Do convergence cards create interesting synergies?
6. **Balance**: Are 3-4 color decks optimal, or are 2-color decks still better?

---

## Next Steps

1. **Increase color limit** to 4 in `types.ts`
2. **Design tri-color heroes** for RWG and UBG
3. **Create convergence cards** that require 3-4 colors
4. **Design color diversity battlefields**
5. **Update draft system** to include multi-color cards
6. **Playtest** 3-4 color decks vs 2-color decks
7. **Balance** based on playtesting feedback

---

*Document created: 2025-01-XX*
*Status: Design exploration - ready for implementation*

