# Card Design and Counterplay Mechanics

## Overview

This document outlines card changes, new mechanics, and design rationale for improving counterplay and skill expression in Artibound, inspired by Artifact Foundry.

**Design Philosophy:**
- Every strategy should have counterplay options
- Items should provide meaningful choices to counter opponent strategies
- Deployment decisions should require skill and prediction
- Hero abilities create unique play patterns and synergies
- All changes must be documented with clear reasoning

---

## 1. Counterplay Items

### Design Rationale

In Artifact Foundry, items provide crucial counterplay:
- **Anti-creep items**: Counter decks that rely on many small units
- **Anti-hero items**: Counter decks that rely on one powerful hero
- **Economic items**: Counter slow decks by generating gold or applying pressure
- **Strategic items**: Provide flexibility and decision-making

### New Counterplay Items

#### 1.1 Anti-Creep Items

**Item: Cleave Axe**
- **Cost**: 10 gold
- **Tier**: 1
- **Stats**: +3 Attack, +2 HP
- **Effect**: Cleave (damages adjacent units)
- **Rationale**: 
  - Counters go-wide strategies (RW Legion, token decks)
  - Forces opponents to spread units or lose value
  - Creates skill expression: deploy units to avoid cleave damage
  - Balanced at 10g (mid-tier cost, not too cheap)

**Item: Chainmail**
- **Cost**: 8 gold
- **Tier**: 1
- **Stats**: +1 Attack, +4 HP
- **Effect**: Retaliate (deals damage back when attacked)
- **Rationale**:
  - Counters aggressive unit strategies
  - Makes attacking into this hero costly
  - Provides defensive option for control decks
  - Similar to Barbed Mail but more defensive

**Item: Siege Engine**
- **Cost**: 12 gold
- **Tier**: 1
- **Stats**: +2 Attack, +3 HP
- **Effect**: Siege (can attack towers directly, bypassing units)
- **Rationale**:
  - Counters decks that rely on units to block
  - Provides alternative win condition
  - Forces opponent to have removal or lose
  - Balanced cost for powerful effect

#### 1.2 Anti-Hero Items

**Item: Mortred's Dagger** (Inspired by Artifact)
- **Cost**: 30 gold
- **Tier**: 2
- **Stats**: +4 Attack
- **Effect**: When this hero attacks, deal 4 damage to target enemy hero. (Cooldown: 3 turns)
- **Rationale**:
  - Expensive but powerful counter to hero-reliant strategies
  - Can kill enemy hero on important turn
  - High cost creates meaningful decision: save for this or buy cheaper items
  - Cooldown prevents abuse, requires timing

**Item: Executioner's Blade**
- **Cost**: 15 gold
- **Tier**: 2
- **Stats**: +5 Attack
- **Effect**: Bonus +3 damage when attacking heroes
- **Rationale**:
  - Cheaper alternative to Mortred's Dagger
  - Still counters hero-reliant strategies
  - Less powerful but more accessible
  - Creates choice between this and Mortred's Dagger

#### 1.3 Economic/Pressure Items

**Item: Gold Mine** (Already exists, but document rationale)
- **Cost**: 8 gold
- **Tier**: 1
- **Effect**: +1 gold per turn
- **Rationale**:
  - Counters slow decks by generating resources
  - Allows faster access to powerful items
  - Creates tempo advantage
  - Balanced: pays for itself in 8 turns

**Item: Broadsword** (Already exists, but document rationale)
- **Cost**: 15 gold
- **Tier**: 2
- **Stats**: +6 Attack
- **Rationale**:
  - Counters slow decks by applying immediate pressure
  - High attack allows hero to threaten towers quickly
  - Forces opponent to answer or lose
  - Expensive but powerful

#### 1.4 Strategic Items

**Item: Blink Dagger** (Already exists, but document rationale)
- **Cost**: 6 gold
- **Tier**: 1
- **Stats**: +2 HP
- **Effect**: Activated: Move hero to adjacent lane
- **Rationale**:
  - Provides deployment flexibility
  - Counters opponent's deployment predictions
  - Creates skill expression: when to reposition
  - Cheap enough to be accessible

**Item: Phase Boots** (Already exists, but document rationale)
- **Cost**: 7 gold
- **Tier**: 1
- **Stats**: +3 HP
- **Effect**: Activated: Swap hero positions
- **Rationale**:
  - Provides tactical repositioning
  - Counters opponent's combat setup
  - Creates skill expression: positioning matters

---

## 2. Hero Abilities (Mana Cost + Cooldown)

### Design Rationale

Hero abilities in Artifact Foundry:
- Cost 1 mana typically
- Have 2-3 turn cooldowns
- Create unique play patterns
- Synergize with specific cards
- Add depth without complexity

### Implementation

**Hero Ability Structure:**
```typescript
interface HeroAbility {
  name: string
  description: string
  manaCost: number // Typically 1
  cooldown: number // Turns until can use again (typically 2-3)
  effect: HeroAbilityEffect
}
```

### Example Hero Abilities

#### 2.1 RW Heroes

**Valiant Commander Ability: Rally**
- **Mana Cost**: 1
- **Cooldown**: 2 turns
- **Effect**: All your units gain +1/+1 this turn
- **Rationale**:
  - Synergizes with go-wide strategies
  - Creates timing decisions: when to use for maximum value
  - Cooldown prevents spam, requires planning
  - Low cost makes it accessible

**War Captain Ability: Charge**
- **Mana Cost**: 1
- **Cooldown**: 3 turns
- **Effect**: Target unit gains +3 attack this turn and can attack immediately
- **Rationale**:
  - Aggressive ability for aggressive hero
  - Can surprise opponent with immediate attack
  - Cooldown balances power
  - Synergizes with high-attack units

#### 2.2 UB Heroes

**Dark Archmage Ability: Arcane Bolt**
- **Mana Cost**: 1
- **Cooldown**: 2 turns
- **Effect**: Deal 2 damage to target unit
- **Rationale**:
  - Provides removal option
  - Low cost makes it accessible
  - Cooldown prevents infinite removal
  - Synergizes with control strategy

**Void Necromancer Ability: Soul Drain**
- **Mana Cost**: 1
- **Cooldown**: 3 turns
- **Effect**: Deal 1 damage to target unit. Draw a card.
- **Rationale**:
  - Provides card advantage
  - Minor removal + draw creates value
  - Cooldown balances card draw
  - Synergizes with control strategy

---

## 3. Cards That Synergize with Hero Abilities

### Design Rationale

Cards should:
- Reward using hero abilities
- Create interesting combos
- Not be strictly better than non-synergy cards
- Provide alternative strategies

### Example Synergy Cards

#### 3.1 RW Synergy Cards

**Card: Battle Standard**
- **Mana Cost**: 3
- **Colors**: Red/White
- **Stats**: 2/3
- **Effect**: When you use a hero ability, all your units gain +1/+1 this turn
- **Rationale**:
  - Rewards using hero abilities
  - Creates combo potential
  - Not overpowered: requires ability usage
  - Synergizes with Valiant Commander's Rally

**Card: War Horn**
- **Mana Cost**: 2
- **Colors**: Red
- **Stats**: 1/2
- **Effect**: Reduce cooldown of target hero's ability by 1 turn
- **Rationale**:
  - Enables more frequent ability usage
  - Creates interesting timing decisions
  - Low cost makes it accessible
  - Synergizes with all hero abilities

#### 3.2 UB Synergy Cards

**Card: Arcane Amplifier**
- **Mana Cost**: 3
- **Colors**: Blue/Black
- **Stats**: 2/3
- **Effect**: When you use a hero ability, deal 2 damage to all enemy units
- **Rationale**:
  - Rewards using hero abilities
  - Provides board control
  - Synergizes with control strategy
  - Creates combo potential

**Card: Mana Conduit**
- **Mana Cost**: 2
- **Colors**: Blue
- **Stats**: 1/2
- **Effect**: Hero abilities cost 1 less mana (minimum 0)
- **Rationale**:
  - Enables more frequent ability usage
  - Creates interesting deck building choices
  - Low cost makes it accessible
  - Synergizes with all hero abilities

---

## 4. Secret Deployment (Simultaneous Deployment)

### Design Rationale

**Problem**: If players see opponent's deployment, they can always counter perfectly.

**Solution**: After Turn 1, both players deploy simultaneously (secret deploys).

**Benefits**:
- Creates skill expression: predict opponent's deployment
- Forces players to deploy to 2nd-3rd best spots sometimes
- Prevents perfect counterplay
- Adds bluffing and mind games
- Makes deployment decisions meaningful

### Implementation

**Rules:**
- Turn 1: Normal deployment (players see each other's moves)
- Turn 2+: Secret deployment phase
  - Both players select deployment simultaneously
  - Reveal deployments at same time
  - Then proceed to combat phases

**UI Considerations:**
- Show "Deploying..." indicator for opponent
- Allow player to change deployment until both ready
- Reveal both deployments simultaneously
- Clear visual feedback

---

## 5. Initiative and Spell Timing

### Design Rationale

**Initiative** (from Artifact):
- Player with initiative plays first
- Some spells give initiative
- Creates timing decisions: pass to keep initiative or play to gain advantage

**Spell Counterplay**:
- Sometimes you want to pass to see opponent's spell
- Sometimes you want to play first to force opponent's response
- Creates skill expression in spell timing

### Current State

- Initiative system exists in types (`initiativePlayer`)
- Some spells have `initiative: true`
- Need to ensure UI shows initiative clearly
- Need to ensure passing is possible

### Improvements Needed

1. **Clear Initiative Display**: Show who has initiative prominently
2. **Pass Button**: Allow players to pass to keep initiative
3. **Spell Timing UI**: Show when spells can be played
4. **Counterplay Spells**: Add spells that counter other spells

---

## 6. Card Replacements for Testing

### RW Deck Changes

**Replace: Bronze Legionnaire**
- **Old**: 2/2, Legion, When this attacks, gain +1 attack this round
- **New**: 2/3, Legion, When you use a hero ability, this gains +1/+1
- **Rationale**:
  - Synergizes with hero abilities
  - More defensive statline (2/3 vs 2/2)
  - Creates interesting combo potential
  - Rewards using hero abilities

**Replace: Imperial Herald**
- **Old**: 2/3, Legion, All Legion units get +1/+1
- **New**: 3/3, Legion, When you use a hero ability, all Legion units gain +1/+1 this turn
- **Rationale**:
  - Synergizes with hero abilities
  - Better base stats (3/3 vs 2/3)
  - Temporary buff creates timing decisions
  - Rewards ability usage

### UB Deck Changes

**Replace: Tower Destroyer**
- **Old**: 6/8, Can attack towers directly
- **New**: 5/7, When you use a hero ability, this can attack towers directly this turn
- **Rationale**:
  - Synergizes with hero abilities
  - Slightly weaker base stats
  - Conditional ability creates timing decisions
  - Rewards ability usage

**Add: Arcane Scholar**
- **New**: 2/3, When you use a hero ability, draw a card
- **Rationale**:
  - Synergizes with hero abilities
  - Provides card advantage
  - Low cost makes it accessible
  - Rewards ability usage

---

## 7. AOE and Unit Spreading

### Design Rationale

**AOE Effects** (Area of Effect):
- Deal damage to multiple units
- Counter go-wide strategies
- Force players to spread units or lose value

**Current AOE Spells:**
- Thunderstorm: Deal 2 damage to all enemy units
- Arcane Burst: Deal 3 damage to 3 adjacent units
- Void Storm: Deal 3 damage to all units

**Skill Expression:**
- Deploying too many units in one lane vs AOE
- Better to spread units out
- Creates meaningful deployment decisions

### Improvements Needed

1. **More AOE Options**: Add more AOE spells for different mana costs
2. **Clear AOE Indicators**: Show which units will be affected
3. **AOE Counterplay**: Add cards that protect from AOE

---

## 8. Testing Plan

### Phase 1: Item Counterplay
1. Add new counterplay items to item shop
2. Test that items counter intended strategies
3. Balance item costs and effects

### Phase 2: Hero Abilities
1. Add hero ability system to Hero type
2. Implement ability usage UI
3. Test ability cooldowns and costs
4. Balance abilities

### Phase 3: Synergy Cards
1. Add cards that synergize with hero abilities
2. Test combo potential
3. Balance synergy cards

### Phase 4: Secret Deployment
1. Implement simultaneous deployment system
2. Test deployment prediction and counterplay
3. Refine UI for secret deployment

### Phase 5: Initiative and Spell Timing
1. Improve initiative display
2. Add pass button
3. Test spell counterplay scenarios

---

## 9. Balance Considerations

### Item Balance
- **Cheap Items (5-8g)**: Should provide utility, not raw power
- **Mid Items (10-15g)**: Should provide meaningful counterplay
- **Expensive Items (20-30g)**: Should be game-changing but risky

### Hero Ability Balance
- **1 Mana Abilities**: Should be useful but not game-breaking
- **2-3 Turn Cooldowns**: Should prevent spam, require planning
- **Ability Power**: Should scale with cooldown (longer cooldown = more powerful)

### Synergy Card Balance
- **Synergy Cards**: Should be slightly weaker than non-synergy cards when ability not used
- **Synergy Cards**: Should be slightly stronger than non-synergy cards when ability is used
- **Combo Potential**: Should be powerful but not game-breaking

---

## 10. Documentation Requirements

**For Every Change:**
1. **What**: What is being changed/added?
2. **Why**: Why does this improve the game?
3. **How**: How does this create skill expression or counterplay?
4. **Balance**: How is this balanced?
5. **Synergy**: How does this synergize with existing mechanics?

**Example Documentation:**
- **Item: Cleave Axe**
  - **What**: New item that provides cleave damage
  - **Why**: Counters go-wide strategies, creates skill expression in deployment
  - **How**: Forces opponents to spread units or lose value
  - **Balance**: 10g cost is mid-tier, not too cheap or expensive
  - **Synergy**: Works well with high-attack heroes, counters Legion strategies

---

*Document created: 2025-01-XX*
*Status: Design phase - ready for implementation*






