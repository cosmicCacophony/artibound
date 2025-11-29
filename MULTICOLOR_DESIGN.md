# Multi-Color Design Document

## Overview

This document explores how the 2-battlefield structure enables 3-4 color deck building, making it a **core design pillar** that differentiates Artibound from Artifact Foundry's 3-lane system. **3-4 color decks are the optimal strategy**, not just viable - players should be incentivized to build multi-color decks while being punished for greedy deck building that leaves them unable to cast pivotal spells on key turns.

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
- **Risk/reward balance**: Players must manage multicolor hero safety or face severe punishment for greedy builds

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

### Artifact Foundry Draft Pattern (Reference)

**2-Color Draft Strategy in Foundry:**
- **Turn 1**: Deploy 1 strong-statted champion with weaker signature cards
  - Purpose: Cast spells in 1/3 lanes
  - Trade-off: Strong stats but weaker signature cards
- **Turn 2-3**: Deploy weaker-statted but strong hero of that color in different lane
  - Purpose: Have 2/3 lanes access to that color
  - Trade-off: Weaker stats but enables color access across lanes

**Design Insight**: Heroes are deployed strategically to enable color access, not just for their individual power.

### Dual-Color Heroes (Current)
- **Purpose**: Enable 2-color strategies
- **Power Level**: Stronger than mono-color, baseline for multi-color
- **Examples**: 
  - RW heroes (Valiant Commander, War Captain)
  - UB heroes (Void Archmage, Shadow Necromancer)

### Turn 1 Deployment Strategy in Artibound

**Key Difference**: Artibound deploys 2 heroes on turn 1 (vs Foundry's 1 hero)

**Turn 1 Hero Selection Options:**
1. **Strong heroes that are a bit less strong** - Prioritize enabling colors over raw power
2. **Heroes you don't mind dying** - Deploy heroes that enable colors but aren't critical to your game plan

**Design Goal**: Turn 1 deployment should create interesting trade-offs between hero power and color access.

**Important**: Draft should always provide enough heroes to make a deck, even if players choose poorly colored champions. There are no default heroes - players must draft all 4 heroes.

### Multicolor Hero Balance Approaches

Multicolor heroes (2-3 colors) should be balanced using one of two approaches:

#### Approach A: Weaker Stats, Stronger Spells
- **Stats**: Statted a bit weaker than mono-color heroes
- **Rationale**: Balance having access to much stronger spells
- **Example**: 2-color hero with 4/9 stats (vs 5/11 for mono-color) but enables powerful 2-color spells
- **Trade-off**: Less durable but enables more powerful deck

#### Approach B: Normal Stats, Weaker Signature, Enabler Role
- **Stats**: Statted as normal color heroes (same as mono-color)
- **Signature Cards**: Weaker than mono-color hero signatures
- **Power Source**: Power comes from enabling other cards in your deck, not from signature cards
- **Example**: 2-color hero with 5/11 stats but signature card is 3-mana instead of 4-mana, and weaker effect
- **Trade-off**: Same durability but less individual power, more enabling power

**Design Principle**: Multicolor heroes should not be strictly better than mono-color heroes. They should have trade-offs that balance their color access advantage.

### Hero Deployment Patterns

#### Pattern 1: Color Access Priority
- **Turn 1**: Deploy heroes to enable color access for your deck
- **Priority**: Color access > Individual hero power
- **Risk**: Weaker heroes may die, but you can cast your spells

#### Pattern 2: Power Priority
- **Turn 1**: Deploy strongest heroes regardless of color
- **Priority**: Individual hero power > Color access
- **Risk**: May not be able to cast all your spells, but heroes are safer

#### Pattern 3: Balanced Approach
- **Turn 1**: Mix of strong heroes and color enablers
- **Priority**: Balance between power and access
- **Risk**: Moderate risk, moderate reward

**Design Goal**: Create meaningful decisions about which heroes to deploy when, based on your deck's needs.

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

#### Verdant Control (NEEDS REVISION)
- **Cost**: 6 mana (3UBG)
- **Colors**: Blue, Black, Green
- **Type**: Spell
- **Current Effect**: "Draw 2 cards. If you control heroes of 4 different colors, draw 3 cards instead."
- **Problem**: 6 mana for drawing 2 cards is very expensive. Artifact Foundry's Foresight costs 3 mana to draw 2. Multicolor cards should provide MORE effect for their cost.
- **Proposed Revisions**:
  - **Option 1**: Draw 2 cards and create two 3/3 units
  - **Option 2**: Draw 2 cards and deal 2 damage to each enemy unit
  - **Option 3**: Draw 3 cards (50% more than Foresight for multicolor)
  - **Option 4**: Draw 2 cards + additional effect that scales with color count
- **Design Notes**: Card advantage that scales with color diversity. Combines UB's control with Green's resource generation. **MUST be revised to provide more value for 6 mana cost.**

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

## Core Design Philosophy: Multicolor Balance & Counterplay

### Terminology Note
**Important**: When referring to "turn 5", we mean "when you have 5 mana" (which is actually turn 3 in the game). This terminology will be used throughout design discussions to refer to mana availability rather than actual turn number.

### Multicolor Hero Vulnerability

**Core Principle**: Multicolor heroes must be answerable and create meaningful risk/reward decisions.

#### Hero Threat Assessment
- **Heroes should be under threat from**:
  - Other heroes + spells (combined damage)
  - Enemy units being placed in front of them (if already damaged)
  - Opponent setup on specific turns (e.g., if opponent knows you have strong 6-mana cards, they can setup to kill your multicolor commander on "turn 5" - when you have 5 mana)
  
#### Strategic Counterplay Windows
- **Turn 5 Example**: If opponent has strong 6-mana multicolor cards, you can setup to kill their multicolor hero on turn 5 (when they have 5 mana), preventing them from casting their 6-mana spell on turn 6
- **Saving Resources**: Players may need to save their most important spell for killing multicolor heroes at critical moments
- **Tempo Decisions**: Killing a multicolor hero can set opponent back by a turn, which can decide the game tempo-wise

#### Player Responses to Multicolor Hero Threats
Players need strategic options when their multicolor heroes are threatened:
1. **Retreat**: Move multicolor hero to base before important turns (heals to full)
2. **Bounce During Deployment**: If you deploy a hero to the same battlefield as your multicolor hero, you can recall that hero to base, healing it and allowing you to replay it next turn - this "bouncing" mechanic is crucial for protecting multicolor heroes
3. **Items**: Buy items to protect multicolor heroes (armor, health, defensive abilities)
4. **Save Mana**: Keep mana available to respond if opponent casts a unit in front or threatens with a spell
5. **Risk Assessment**: If you tap out, opponent might cast unit + spell in front and kill the hero

**Design Goal**: Multicolor heroes should feel powerful but risky - players must actively manage their safety. Every turn counts - if your multicolor heroes die and you can't cast pivotal spells on key turns, you should be punished hard for greedy deck building.

### Mana Cost & Power Level Guidelines

#### Artifact Foundry Reference: Foresight
- **Foresight**: 3 mana to draw 2 cards
- **Our Verdant Control**: 6 mana (3UBG) to draw 2 cards - **TOO EXPENSIVE**
- **Multicolor cards should provide MORE effect** for their cost, not just be more expensive

#### Revised Verdant Control Design
**Current**: 6 mana (3UBG) - Draw 2 cards  
**Problem**: 6 mana for drawing 2 cards is very expensive compared to Foundry's 3 mana Foresight

**Proposed Options**:
1. **Draw 2 + Create Units**: Draw 2 cards and create two 3/3 units (or similar)
2. **Draw 2 + Immediate Effect**: Draw 2 cards and deal damage/remove unit
3. **Draw 3**: If multicolor, should draw 3 cards for 6 mana (50% more than Foresight)
4. **Scaling Effect**: Draw 2 cards, plus additional effect that scales with color count

**Design Principle**: Multicolor cards at 6+ mana should feel significantly more powerful than their 2-color equivalents.

### Artifact Foundry Multicolor Examples

#### UB (Blue/Black) - Best Multicolor Card
- **Effect**: Deal 2 damage to each unit and give 2 decay (damage added to combat)
- **Multicolor Bonus**: If you have both color heroes, deals decay damage immediately instead
- **Impact**: 4 damage pre-combat is much stronger than 2 + 2, since it's more likely to kill their hero/units before they can deal combat damage
- **Design Insight**: Immediate effect is more powerful than delayed effect, even if numbers are the same

#### RG (Red/Green) Examples
- **Strong Creep at 6 mana**: Does AOE damage if you have both colors in lane
- **Smaller Creep**: Leaves behind a tower enchantment that deals 1 damage to any unlocked units
- **Design Insight**: Multicolor effects can be conditional (if both colors present) or permanent (tower enchantment)

### Early vs Late Game Multicolor Design

#### Early Game Multicolor Cards (1-4 Mana)
**Design Philosophy**: Less powerful but above rate for multicolor
- **Rewards**: Just drafting multicolor colors
- **Safety**: Less likely to be punished since early drops will be castable (opponent doesn't have enough time to remove heroes yet)
- **Examples**: 
  - 2-mana multicolor unit that's slightly better than 2-mana mono-color
  - 3-mana spell that's more efficient than 3-mana mono-color equivalent

#### Late Game Multicolor Cards (5-7+ Mana)
**Design Philosophy**: Require more build-up and thought around casting/playing around them
- **Risk**: Opponent can setup to kill your multicolor hero before you can cast
- **Reward**: Powerful effects that can decide games
- **Strategic Depth**: Players must manage hero safety, save mana for responses, or retreat heroes
- **Examples**:
  - 6-mana multicolor spell that requires setup and protection
  - 7-mana convergence card that's game-winning if cast

**Design Goal**: Players should feel good about removing multicolor heroes at the right moments to set opponent back from casting certain spells by a turn.

### Hero Bouncing & Recall Strategy

**Core Mechanic**: During deployment, if you place a hero into the same battlefield location as your existing multicolor hero, you can recall that hero to base. This heals the hero to full health and allows you to replay it next turn, ensuring you can cast whatever powerful spell you are preparing for.

**Strategic Importance**:
- **Protection**: Bouncing heroes back to base protects them from being killed before key turns
- **Healing**: Heroes heal to full when moved to base, allowing you to redeploy them fresh
- **Timing**: Critical for ensuring you can cast 6-7 mana multicolor spells on the exact turn you need them
- **Counterplay**: Opponents can predict when you'll bounce and try to kill the hero before you can recall it

**Example Scenario**:
- Turn 5 (5 mana): You have a damaged RWG hero in Battlefield A and a powerful 6-mana RWG spell in hand
- You deploy a new hero to Battlefield A, recalling your RWG hero to base (heals to full)
- Turn 6 (6 mana): You redeploy your RWG hero fresh, now able to cast your 6-mana spell safely

**Design Principle**: Bouncing heroes is a core strategic mechanic that rewards careful planning and punishes greedy deck building. Players who don't protect their multicolor heroes will be unable to cast pivotal spells on key turns.

### Testing & Balance Framework

#### Matchup Testing Plan
1. **RWG vs UB**: Test 3-color deck against 2-color deck
2. **UBG vs RW**: Test 3-color deck against 2-color deck
3. **RWG vs UBG**: Test 3-color vs 3-color
4. **RW vs UB**: Baseline 2-color vs 2-color

#### Balance Goals
- **3-color decks should be stronger** if built correctly
- **2-color decks should still be viable** in niche situations (e.g., when you don't find proper synergies in draft)
- **Multicolor heroes should feel powerful but risky**
- **Late-game multicolor cards should feel impactful** but require setup

#### Key Questions for Testing
1. Do multicolor heroes feel too safe or too vulnerable?
2. Are late-game multicolor cards worth the risk?
3. Can 2-color decks compete with 3-color decks?
4. Do players feel rewarded for managing multicolor hero safety?
5. Are there enough counterplay options against multicolor strategies?

### Design Checklist for Multicolor Cards

When designing multicolor cards, consider:
- [ ] **Mana Efficiency**: Is this card more powerful than equivalent 2-color card?
- [ ] **Counterplay**: Can opponent reasonably answer this before it's cast?
- [ ] **Risk/Reward**: Does the risk of losing multicolor hero balance the power?
- [ ] **Timing**: Is this card castable early (safe) or late (risky)?
- [ ] **Synergy**: Does this card reward having multiple colors?
- [ ] **Artifact Foundry Comparison**: How does this compare to Foundry's multicolor cards?
- [ ] **Answerability**: Can opponents answer multicolor heroes with units in front, direct damage, or other heroes?
- [ ] **Item Protection**: Do items provide meaningful protection for multicolor heroes?
- [ ] **Bounce Synergy**: Does this card work well with hero bouncing/recall strategies?

---

## New Multicolor Cards: Counterplay & Protection

The following cards highlight key design principles: multicolor heroes being answerable, hero bouncing/recall strategies, item protection, and punishment for greedy deck building.

### RWG (Red/White/Green) Cards

#### 1. Primal Recall
- **Cost**: 2 mana (1RWG)
- **Colors**: Red, White, Green
- **Type**: Spell
- **Effect**: "Return target friendly hero to base. It heals to full health. Draw a card."
- **Design Notes**:
  - Enables hero bouncing strategy without needing to deploy another hero
  - Provides card advantage to offset the tempo loss
  - Low cost makes it accessible for protecting multicolor heroes
  - Rewards careful planning and hero management
  - **Highlights**: Hero bouncing/recall mechanics

#### 2. Wild Protector
- **Cost**: 4 mana (2RWG)
- **Colors**: Red, White, Green
- **Type**: Generic Unit
- **Stats**: 2 Attack / 5 Health
- **Effect**: "When this enters, target friendly hero gains +0/+3 until end of turn. If that hero is multicolor, it gains +0/+5 instead."
- **Design Notes**:
  - Provides immediate protection for multicolor heroes
  - Can be placed in front of a multicolor hero to block incoming damage
  - Scales better for multicolor heroes (reward for multi-color commitment)
  - High health makes it a good blocker
  - **Highlights**: Multicolor heroes being answerable (units in front), protection for multicolor heroes

#### 3. Convergence Shield
- **Cost**: 3 mana (1RWG)
- **Colors**: Red, White, Green
- **Type**: Spell
- **Effect**: "Target friendly hero gains +2/+2 and 'Cannot be targeted by spells' until end of turn. If that hero is multicolor, it gains +3/+3 instead."
- **Design Notes**:
  - Protects heroes from direct damage spells (key counterplay option)
  - Provides stat boost to survive combat
  - Scales better for multicolor heroes
  - Creates interesting timing decisions (when to use protection)
  - **Highlights**: Multicolor heroes being answerable (direct damage), protection for multicolor heroes

### UBW (Blue/Black/White) Cards

#### 1. Tactical Retreat
- **Cost**: 1 mana (1UBW)
- **Colors**: Blue, Black, White
- **Type**: Spell
- **Effect**: "Return target friendly hero to base. It heals to full health. If that hero is multicolor, draw a card."
- **Design Notes**:
  - Even cheaper than Primal Recall (1 mana vs 2)
  - Provides card advantage only for multicolor heroes (reward for commitment)
  - Enables frequent hero bouncing for control strategies
  - Low cost makes it easy to hold up mana for protection
  - **Highlights**: Hero bouncing/recall mechanics, reward for multicolor commitment

#### 2. Prismatic Ward
- **Cost**: 2 mana (1UBW)
- **Colors**: Blue, Black, White
- **Type**: Spell
- **Effect**: "Target friendly hero gains 'Spells and abilities cannot target this hero' until end of turn. If that hero is multicolor, it also gains +0/+2."
- **Design Notes**:
  - Complete protection from targeted removal and abilities
  - Still vulnerable to units in front (maintains answerability)
  - Scales better for multicolor heroes
  - Creates interesting counterplay (opponent must use units, not spells)
  - **Highlights**: Multicolor heroes being answerable (units in front), protection for multicolor heroes

#### 3. Multicolor Guardian
- **Cost**: 5 mana (2UBW)
- **Colors**: Blue, Black, White
- **Type**: Generic Unit
- **Stats**: 1 Attack / 6 Health
- **Effect**: "When this enters, you may return target friendly multicolor hero to base. If you do, that hero gains an item slot (max 3 items)."
- **Design Notes**:
  - Enables hero bouncing while providing item protection
  - Extra item slot allows multicolor heroes to equip more protective items
  - High health makes it a good blocker
  - Rewards item-based protection strategies
  - **Highlights**: Hero bouncing/recall mechanics, item protection for multicolor heroes

### Design Principles Demonstrated

These cards showcase:

1. **Answerability**: Multicolor heroes can be answered by:
   - Units placed in front (Wild Protector, Multicolor Guardian can block)
   - Direct damage spells (Convergence Shield, Prismatic Ward protect against this)
   - Other heroes attacking (protection spells help but don't make heroes invincible)

2. **Hero Bouncing**: 
   - Primal Recall, Tactical Retreat, and Multicolor Guardian enable hero recall
   - Allows players to protect multicolor heroes and ensure they can cast pivotal spells
   - Creates strategic depth around timing and resource management

3. **Item Protection**:
   - Multicolor Guardian provides extra item slots
   - Players are incentivized to buy items to protect multicolor heroes
   - Items become crucial for greedy multicolor strategies

4. **Punishment for Greedy Building**:
   - If multicolor heroes die, players can't cast pivotal spells
   - Every turn counts - missing a key turn due to hero death is severe punishment
   - Cards that protect multicolor heroes are essential, not optional

---

*Document created: 2025-01-XX*  
*Last updated: 2025-01-XX*  
*Status: Design exploration - ready for implementation*

