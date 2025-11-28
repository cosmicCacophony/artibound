# Battlefield Design Document

## Overview

This document explores different approaches to battlefield design, upgrades, and integration with the game's archetype system. We're iterating on how battlefields should work to create meaningful strategic choices while maintaining balance.

**Key Questions:**
- Should battlefields be drafted or assigned at game start?
- How should battlefield upgrades interact with static abilities?
- How can battlefields create archetype-specific advantages without being overpowered?
- What's the right balance between battlefield power and upgrade potential?

---

## Current State

### Existing Battlefields
- **RW Battlefield (Training Grounds)**: "You can deploy 6 units instead of 5"
- **UB Battlefield**: Not yet defined in current implementation
- **RU Battlefield (Arcane Nexus)**: "Spells deal +1 damage" (example of potential stacking issue)

### Existing Upgrade System
- **War Banner** (RW): +1 Attack to all units in battlefield
- **Arcane Focus** (UB): +1 spell damage in battlefield
- **Honor Memorial** (RW): Death counter → draw cards
- **Rapid Deployment** (UB): Quick Deploy for heroes

### The Problem
If a battlefield already has "Spells deal +1 damage" and you add Arcane Focus (+1 spell damage), that's +2 total. Combined with a hero that has spell damage bonuses, this could stack to +3 or +4, making spells overpowered. Similar stacking concerns exist for unit power buffs.

---

## Design Iterations

### Iteration 1: Static Battlefields + Upgrades (Current Approach)

**Concept:** Battlefields have static abilities. Players can purchase upgrades that stack on top.

**Pros:**
- Simple to understand
- Upgrades feel impactful
- Clear progression path

**Cons:**
- Stacking can get out of hand (spell damage +1 base + upgrade = +2, could be +3+ with hero)
- Hard to balance across different battlefield types
- May make some battlefields "must-have" for certain archetypes

**Balance Concerns:**
- Arcane Nexus (+1 spell damage) + Arcane Focus (+1 spell damage) = +2 total
- Training Grounds (6th slot) + War Banner (+1 attack) = strong but maybe okay?
- Need to cap total bonuses or make upgrades more conditional

**Questions:**
- Should upgrades be weaker if battlefield already has a related ability?
- Should there be upgrade "slots" (only 1 upgrade per battlefield)?
- Should upgrades be archetype-specific or generic?

---

### Iteration 2: Draft Battlefields, No Upgrades

**Concept:** Battlefields are drafted like heroes. They have static abilities that define your strategy. No upgrade system.

**Pros:**
- Drafting creates interesting choices
- Static abilities are easier to balance (no stacking)
- Battlefields become part of deck identity
- Simpler system overall

**Cons:**
- Less progression/upgrade feel during game
- Battlefields might feel "set and forget"
- Less gold sink (items become more important)

**Draft Structure:**
- Players draft 2 battlefields each (4 total)
- Battlefields are assigned to lanes A and B
- Each battlefield has a strong, archetype-specific ability
- Battlefields should be powerful enough to influence draft picks

**Example Battlefields:**

**RW Battlefield Options:**
1. **Training Grounds**: Deploy 6 units instead of 5
2. **War Camp**: All units gain +1/+0
3. **Banner Field**: When you deploy a unit, give all allies +0/+1 this turn
4. **Legion Barracks**: Legion units cost 1 less mana

**UB Battlefield Options:**
1. **Arcane Nexus**: Spells deal +1 damage
2. **Shadow Library**: When you cast a spell, draw a card
3. **Death Altar**: When a unit dies, gain 2 gold
4. **Void Rift**: Your spells cost 1 less mana

**Design Philosophy:**
- Each battlefield should enable a specific strategy
- Battlefields should be powerful enough that drafting the right one for your archetype matters
- Battlefields should create interesting lane assignment decisions (which battlefield goes to lane A vs B?)

---

### Iteration 3: Draft Battlefields + Conditional Upgrades

**Concept:** Battlefields are drafted. Upgrades exist but are weaker/more conditional. Upgrades don't stack with static abilities in the same category.

**Pros:**
- Drafting creates strategic choices
- Upgrades provide progression without breaking balance
- Conditional upgrades create interesting decision points

**Cons:**
- More complex rules (when do upgrades apply?)
- Need clear rules about what stacks and what doesn't

**Upgrade Rules:**
- If battlefield has spell damage bonus, spell damage upgrades are disabled or weaker
- If battlefield has unit power bonus, unit power upgrades are disabled or weaker
- Upgrades can only enhance different aspects (e.g., spell damage battlefield can get card draw upgrade, but not more spell damage)

**Example Upgrades:**

**For Spell Damage Battlefield (Arcane Nexus):**
- ❌ Arcane Focus (+1 spell damage) - DISABLED (already has spell damage)
- ✅ Spell Library: When you cast a spell, draw a card
- ✅ Mana Well: Your spells cost 1 less mana
- ✅ Arcane Shield: Your units take 1 less damage from spells

**For Unit Power Battlefield (War Camp):**
- ❌ War Banner (+1 attack) - DISABLED (already has unit power)
- ✅ Training Dummy: Units gain +0/+1
- ✅ Rally Point: When you deploy a unit, all allies can attack immediately
- ✅ Armory: Your units have +1 HP

**Design Philosophy:**
- Upgrades complement rather than stack
- Creates interesting choices: do you upgrade your strong battlefield or your weak one?
- Prevents exponential power scaling

---

### Iteration 4: Start with Generic Battlefields, Upgrade to Archetype-Specific

**Concept:** All players start with neutral battlefields. During the game, you can purchase upgrades that transform your battlefield into an archetype-specific one.

**Pros:**
- Everyone starts equal
- Upgrades feel transformative
- Creates interesting resource allocation (upgrade battlefield vs buy items vs save for cards)

**Cons:**
- Less draft strategy around battlefields
- Upgrades might feel mandatory rather than optional
- Could slow down early game if players feel they need to upgrade

**Upgrade Paths:**

**Neutral Battlefield → RW Battlefield:**
- **War Banner Upgrade** (6 gold): Transform to Training Grounds (6th slot) + War Banner effect
- **Legion Standard Upgrade** (8 gold): Transform to Legion Barracks (Legion cost -1) + Honor Memorial effect

**Neutral Battlefield → UB Battlefield:**
- **Arcane Focus Upgrade** (7 gold): Transform to Arcane Nexus (+1 spell damage) + Arcane Focus effect
- **Shadow Library Upgrade** (9 gold): Transform to Shadow Library (spell draw) + Rapid Deployment effect

**Design Philosophy:**
- Upgrades are expensive but transformative
- Players must choose when to invest in battlefield vs other resources
- Creates mid-game power spikes

---

### Iteration 5: Battlefield Abilities Scale with Investment

**Concept:** Battlefields start weak. You can invest gold to "level up" your battlefield, making its ability stronger.

**Pros:**
- Clear progression
- Players control how much to invest
- Prevents early game power spikes
- Creates interesting resource management

**Cons:**
- More complex tracking (battlefield levels)
- Might feel like mandatory investment
- Need to balance level costs vs power gained

**Example: Training Grounds (RW)**

**Level 1 (Start)**: Deploy 5 units (normal)
**Level 2 (6 gold)**: Deploy 6 units
**Level 3 (12 gold total)**: Deploy 6 units, all units gain +0/+1
**Level 4 (20 gold total)**: Deploy 6 units, all units gain +1/+1

**Example: Arcane Nexus (UB)**

**Level 1 (Start)**: No bonus
**Level 2 (7 gold)**: Spells deal +1 damage
**Level 3 (15 gold total)**: Spells deal +1 damage, when you cast a spell draw a card
**Level 4 (25 gold total)**: Spells deal +2 damage, when you cast a spell draw a card

**Design Philosophy:**
- Early levels are cheap and provide clear benefit
- Later levels are expensive but powerful
- Creates interesting decisions: level up one battlefield or spread investment?

---

### Iteration 6: Global Battlefield Bonuses (NEW - Addresses Deployment Problem)

**Concept:** Each player drafts battlefields that provide **global bonuses** to both lanes. Both players' bonuses are active simultaneously on both battlefields.

**The Problem This Solves:**
- If RW drafts a battlefield with +1 attack, they would just deploy all heroes to that battlefield
- The other battlefield becomes irrelevant
- Creates "ignore one battlefield" problem
- Not like Riftbound where you're conquering/holding battlefields for points

**How It Works:**
- Player 1 drafts **RW Battlefield** → Provides global bonus to both Lane A and Lane B
- Player 2 drafts **UB Battlefield** → Provides global bonus to both Lane A and Lane B
- Both bonuses are active simultaneously on both lanes
- Players deploy to both lanes because both have relevant bonuses

**Example:**
- **RW Player** drafts **Training Grounds** (6th slot) + **War Camp** (+1 attack)
  - Both Lane A and Lane B: Can deploy 6 units, all units have +1 attack
- **UB Player** drafts **Arcane Nexus** (+1 spell damage) + **Shadow Library** (spell draw)
  - Both Lane A and Lane B: Spells deal +1 damage, casting spells draws cards

**Pros:**
- ✅ Both lanes remain relevant (can't ignore one)
- ✅ Both players' bonuses stack (interesting interactions)
- ✅ Battlefields become part of deck identity
- ✅ Drafting creates meaningful choices
- ✅ No "deploy to one battlefield only" problem
- ✅ Creates interesting synergies (RW +1 attack + UB spell damage on same lane)

**Cons:**
- ❌ Bonuses stack (could be too strong - need careful balance)
- ❌ Both players' bonuses on both lanes might be confusing
- ❌ Need to design bonuses that work well together

**Design Considerations:**
1. **Bonus Types**: Should bonuses be:
   - **Additive** (RW +1 attack + UB +1 attack = +2 attack total)?
   - **Separate** (RW +1 attack, UB +1 spell damage - different categories)?
   - **Conditional** (RW bonus only applies to RW units, UB bonus only to UB units)?

2. **Number of Battlefields**: Should players draft:
   - **1 battlefield** (simpler, but less customization)
   - **2 battlefields** (more options, but more complex)
   - **2 battlefields but only 1 active per lane** (assign one to A, one to B)

3. **Bonus Balance**: If both players' bonuses stack:
   - Need to ensure bonuses aren't too strong when combined
   - Consider making bonuses archetype-specific (only affect your units)
   - Or make bonuses additive but weaker individually

**Recommended Variant: 2 Battlefields, Archetype-Specific Bonuses**
- Each player drafts 2 battlefields
- Each battlefield provides a global bonus
- Bonuses only affect **your units/spells** (not opponent's)
- Both bonuses are active on both lanes
- Example: RW gets Training Grounds (6th slot) + War Camp (+1 attack to your units)
- Example: UB gets Arcane Nexus (+1 spell damage to your spells) + Shadow Library (draw on your spells)

**Why This Works:**
- Both lanes have both players' bonuses active
- Bonuses don't help opponent (archetype-specific)
- Creates interesting lane decisions (which lane gets which units?)
- Prevents "ignore one battlefield" problem
- Both players' bonuses stack but don't directly conflict

---

## Recommended Approach: Iteration 6 (Global Battlefield Bonuses)

### Rationale

1. **Solves Deployment Problem**: Both lanes remain relevant, prevents "ignore one battlefield" issue
2. **Strategic Depth**: Drafting battlefields creates meaningful choices
3. **Archetype Identity**: Battlefields become part of your deck's identity
4. **Interesting Interactions**: Both players' bonuses active on both lanes creates synergies
5. **Balanced Stacking**: Bonuses are archetype-specific (only affect your units), so they stack but don't directly conflict

### Implementation Plan

**Draft Structure:**
- Players alternate drafting: P1-hero, P2-hero-hero, P1-hero-hero, P2-battlefield, P1-battlefield-battlefield, P2-battlefield-battlefield, P1-battlefield
- Each player ends with 4 heroes and 2 battlefields
- **Both battlefields provide global bonuses to both Lane A and Lane B**
- Both players' bonuses are active simultaneously on both lanes

**Battlefield Design Principles:**
1. **Archetype-Specific**: Each battlefield should strongly support one archetype
2. **Global Application**: Bonuses apply to both lanes (not lane-specific)
3. **Player-Specific**: Bonuses only affect your units/spells (not opponent's)
4. **Powerful but Balanced**: Should feel impactful but not game-breaking
5. **Draft Relevance**: Should influence which heroes/cards you draft
6. **Stacking Consideration**: Bonuses should work well when both players' bonuses are active

---

## RW Battlefield Designs (Global Bonuses)

**Note**: These bonuses apply to **both Lane A and Lane B** and only affect **your units**.

### Option 1: Training Grounds
- **Ability**: You can deploy 6 units instead of 5 (applies to both lanes)
- **Archetype Fit**: Perfect for go-wide RW strategies
- **Draft Impact**: Makes Legion/wide strategies more viable
- **Global Application**: Works on both lanes, enables wide strategies everywhere
- **Stacking**: Works well with other bonuses (doesn't conflict)

### Option 2: War Camp
- **Ability**: All your units have +1/+0 (applies to both lanes)
- **Archetype Fit**: Supports aggressive RW strategies
- **Draft Impact**: Makes combat-focused cards stronger
- **Global Application**: All your units get bonus attack everywhere
- **Stacking**: Additive with other attack bonuses (could be strong)

### Option 3: Legion Barracks
- **Ability**: Your Legion units cost 1 less mana (applies to both lanes)
- **Archetype Fit**: Enables Legion tribal strategies
- **Draft Impact**: Makes Legion cards more attractive in draft
- **Global Application**: Mana reduction works everywhere
- **Stacking**: Doesn't conflict with other bonuses

### Option 4: Banner Field
- **Ability**: When you deploy a unit, all your units gain +0/+1 until end of turn (applies to both lanes)
- **Archetype Fit**: Rewards deploying multiple units
- **Draft Impact**: Makes wide strategies more resilient
- **Global Application**: Works on both lanes, encourages wide deployment
- **Stacking**: Temporary bonus, doesn't conflict

### Option 5: Honor Memorial
- **Ability**: When a unit dies, add a counter. Remove 3 counters to draw a card (applies to both lanes)
- **Archetype Fit**: Rewards aggressive play and unit deaths
- **Draft Impact**: Makes aggressive strategies more sustainable
- **Global Application**: Counters accumulate from both lanes
- **Stacking**: Doesn't conflict, provides card advantage

**Recommendation**: **Training Grounds** + **War Camp** - Training Grounds enables wide strategies, War Camp makes units stronger. Both are simple, powerful, and work well together.

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

**Recommendation**: **Arcane Nexus** + **Shadow Library** - Arcane Nexus makes spells stronger, Shadow Library provides card advantage. Both clearly support UB's spell-focused identity and work well together.

---

## Alternative: Hybrid Approach

### Concept
- **Draft 1 battlefield** (archetype-specific, powerful)
- **Start with 1 neutral battlefield** (weak, generic)
- **Upgrades can transform neutral battlefield** into archetype-specific one

**Pros:**
- Combines draft strategy with upgrade progression
- Neutral battlefield provides fallback if draft doesn't go your way
- Upgrades feel meaningful (transformation)

**Cons:**
- More complex than pure draft
- Still has upgrade balance concerns

**Example:**
- Player drafts **Training Grounds** (RW) → assigned to Lane A
- Player starts with **Neutral Ground** (no ability) → assigned to Lane B
- During game, can purchase **War Camp Upgrade** (8 gold) → transforms Lane B to War Camp

---

## Balance Considerations

### Spell Damage Stacking
- **Problem**: Base +1, upgrade +1, hero bonus +1 = +3 total (too strong)
- **Solution (Iteration 2)**: Only one source of spell damage (battlefield OR upgrade, not both)
- **Alternative**: Cap total spell damage bonus at +2

### Unit Power Stacking
- **Problem**: Base +1, upgrade +1, hero support +1 = +3 total (too strong)
- **Solution (Iteration 2)**: Only one source of unit power (battlefield OR upgrade, not both)
- **Alternative**: Make bonuses additive but diminishing returns (+1, +1, +0.5)

### Draft Balance
- **Problem**: Some battlefields might be too strong for certain archetypes
- **Solution**: Make battlefields archetype-specific but not auto-win
- **Design**: Battlefields should give an edge, not guarantee victory

### Lane Assignment Strategy
- **Problem (OLD)**: If battlefields are too powerful, lane assignment becomes too important
- **Solution (NEW)**: Global bonuses eliminate lane assignment - both lanes get all bonuses
- **Design**: Battlefields influence strategy globally, not per-lane

### Global Bonus Stacking
- **Problem**: Both players' bonuses active on both lanes could be confusing or too strong
- **Solution**: Make bonuses archetype-specific (only affect your units/spells)
- **Design**: Bonuses stack but don't directly help opponent
- **Example**: RW +1 attack only affects RW units, UB +1 spell damage only affects UB spells

---

## Testing Questions

1. **Global vs Lane-Specific**: Do global bonuses solve the "ignore one battlefield" problem?
2. **Power Level**: Are battlefields too strong, too weak, or just right when both players' bonuses stack?
3. **Archetype Fit**: Do battlefields feel essential for their archetypes or just nice-to-have?
4. **Deployment Strategy**: Do players deploy to both lanes now that both have relevant bonuses?
5. **Balance**: Are certain battlefield combinations too strong when both players' bonuses are active?
6. **Clarity**: Is it clear which bonuses affect which player's units/spells?
7. **Stacking**: Do bonuses feel balanced when both players' bonuses are active simultaneously?

---

## Next Steps

1. **Decide on approach**: Global bonuses (Iteration 6) vs lane-specific (Iteration 2)
2. **Finalize RW battlefields**: Choose 2 options for RW (Training Grounds + War Camp recommended)
3. **Finalize UB battlefields**: Choose 2 options for UB (Arcane Nexus + Shadow Library recommended)
4. **Design bonus application**: Ensure bonuses are clearly player-specific (only affect your units/spells)
5. **Design other archetypes**: RG, GW, GB, GU, etc. (if needed)
6. **Playtest**: Test that both lanes remain relevant with global bonuses
7. **Balance test**: Verify bonuses feel balanced when both players' bonuses stack
8. **Iterate**: Adjust based on playtesting feedback

## Key Design Decision: Global Bonuses

**The Core Insight**: If battlefields are lane-specific, players will deploy to their advantageous battlefield and ignore the other. Global bonuses ensure both lanes remain relevant and create interesting strategic decisions about where to deploy units, even when both lanes have your bonuses active.

**Implementation Note**: When implementing, ensure that:
- RW bonuses only affect RW units (not UB units)
- UB bonuses only affect UB spells (not RW spells)
- Both players' bonuses are clearly displayed and understood
- UI shows which bonuses are active on each lane

---

*Document created: 2025-01-XX*
*Status: Design exploration - no code changes yet*

