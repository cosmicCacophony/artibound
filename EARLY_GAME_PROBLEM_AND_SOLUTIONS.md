# Early Game Problem & Solutions

## The Problem

**Current Issue**: Turns 1-2 feel flat and lack meaningful decisions.

**Why This Happens**:
- In Artifact Foundry, 3 lanes + counter-positioning creates natural combat on turn 1
- This enables interesting 3-mana combat tricks (stun, invulnerable+reflect, extra damage, temporary HP)
- In Artibound, we don't have this natural combat setup
- Result: Players just pass on turn 1
  - **UBG**: Should just pass (no reason to act)
  - **RW**: Has creeps but might as well pass (they'll just get removed, waste of mana)

**The Core Issue**: No natural combat interactions on turn 1, so combat tricks and positioning decisions don't matter.

---

## Solution 1: More Mana + More Cards (User's First Idea)

### Changes:
- Start with **6 mana** (instead of 3)
- Allow **multiple spells per turn**
- **Draw 2-3 cards every turn** (or start with 5 cards, draw 2 per turn)
- Make **creeps cheaper than removal** (e.g., 2-mana creep vs 3-mana removal)
  - Makes removal feel inefficient on single creeps
  - Removal should either kill big things OR AOE multiple things

### Pros:
- More options = more decisions
- Can play multiple cards per turn
- Cheaper creeps = less punishing to deploy
- More cards = more things to do

### Cons:
- Might make game too fast/complex
- Need to balance mana costs carefully
- More cards = more complexity

### Design Considerations:
- **Mana curve**: If starting at 6, need cards at 1-6 mana range
- **Card draw**: 2-3 per turn might be too much, need testing
- **Removal efficiency**: Should removal be 4 mana? Or AOE only?

---

## Solution 2: Forced Combat on Turn 1

### Changes:
- **Pre-deploy heroes facing each other** (similar to Artifact's counter-positioning)
- Heroes start in combat-ready positions
- Turn 1 becomes about combat setup, not deployment

### Implementation:
- After draft, randomly assign heroes to slots
- Heroes in same slot face each other (combat happens automatically)
- Players can use combat tricks before combat resolves

### Pros:
- Creates natural combat on turn 1
- Enables combat tricks immediately
- Similar to Artifact's feel

### Cons:
- Less deployment decisions
- Might feel too random
- Loses some strategic positioning

### Variant: **Combat Setup Phase**
- Turn 1 has a "Combat Setup" phase before normal play
- Players can cast combat tricks
- Then combat resolves
- Then normal play phase

---

## Solution 3: Turn 1 Special Rules

### Changes:
- **Turn 1: Both players act simultaneously** (like secret deployment)
- Players select actions (deploy, cast spell, pass) simultaneously
- Reveal actions at same time
- Creates bluffing and prediction

### Pros:
- Creates interesting decisions
- No "first player advantage"
- Bluffing element

### Cons:
- More complex UI
- Harder to track state
- Might feel clunky

### Variant: **Turn 1 Initiative Auction**
- Players bid mana for initiative
- Higher bid goes first, but starts with less mana
- Creates resource trade-off

---

## Solution 4: Cheaper Early Game Cards

### Changes:
- **1-2 mana cards** that are playable on turn 1
- **Combat tricks at 1-2 mana** (instead of 3)
- **Cheap units at 1-2 mana** (instead of 2-3)
- **Removal at 3-4 mana** (so it's inefficient on 1-2 mana units)

### Pros:
- More things to do on turn 1
- Natural mana efficiency decisions
- Doesn't require system changes

### Cons:
- Need to design many 1-2 mana cards
- Might make early game too fast
- Need to balance carefully

### Design Examples:
- **1 mana combat trick**: +2 attack this turn
- **1 mana unit**: 1/1 with ability
- **2 mana combat trick**: Stun target unit
- **2 mana unit**: 2/2 vanilla
- **3 mana removal**: Deal 3 damage (inefficient on 1-2 mana units)

---

## Solution 5: Turn 1 Bonus Resources

### Changes:
- **Turn 1: Start with 5 mana** (instead of 3)
- **Turn 1: Draw 2 extra cards** (start with 6 cards)
- **Turn 1: Can play 2 cards** (special rule)
- Normal turns: 3 mana, draw 1

### Pros:
- Only affects turn 1
- Gives more options without changing rest of game
- Easy to implement

### Cons:
- Might make turn 1 too different
- Could feel arbitrary

---

## Solution 6: Pre-Combat Phase Every Turn

### Changes:
- **Every turn has a "Pre-Combat" phase**
- Players can cast combat tricks and setup spells
- Then combat resolves
- Then normal play phase

### Pros:
- Creates combat decisions every turn
- Similar to Artifact's feel
- Enables combat tricks consistently

### Cons:
- More phases = more complexity
- Might slow down game

---

## Solution 7: Starting Board State

### Changes:
- **Start with some units already on board**
- Each player starts with 1-2 weak units (1/1 tokens)
- Creates immediate combat interactions
- Players can buff/kill these units

### Pros:
- Immediate combat
- Creates interesting decisions
- Doesn't require rule changes

### Cons:
- Might feel arbitrary
- Less deployment decisions

---

## Solution 8: Initiative-Based Turn 1

### Changes:
- **Turn 1: Player with initiative can deploy OR cast spell**
- **Other player can respond OR pass**
- Creates back-and-forth on turn 1
- More like a "mini-game" on turn 1

### Pros:
- Uses existing initiative system
- Creates interaction
- Natural flow

### Cons:
- Might not solve the core problem
- Still might just pass

---

## Solution 9: Turn 1 Combat Setup Cards

### Changes:
- **Special "Turn 1 Only" cards** that are powerful but only playable turn 1
- **Combat setup spells** that are cheap and only useful turn 1
- Creates incentive to act on turn 1

### Pros:
- Targeted solution
- Doesn't change core rules
- Creates turn 1 decisions

### Cons:
- Might feel gimmicky
- Need to design special cards

---

## Solution 10: Hybrid Approach

### Combine Multiple Solutions:

**Option A: More Mana + Cheaper Cards**
- Start with 5 mana
- Draw 2 cards per turn
- 1-2 mana combat tricks and units
- 3-4 mana removal (inefficient on cheap units)

**Option B: Turn 1 Special + Combat Setup**
- Turn 1: Start with 5 mana, draw 2 cards
- Every turn: Pre-combat phase for combat tricks
- Cheaper early game cards (1-2 mana)

**Option C: Forced Combat + Cheaper Cards**
- Pre-deploy heroes facing each other
- 1-2 mana combat tricks
- Turn 1 becomes combat setup phase

---

## Recommended Testing Order

1. **Solution 4 (Cheaper Early Game Cards)** - Easiest to test, no system changes
2. **Solution 1 (More Mana + More Cards)** - User's suggestion, straightforward
3. **Solution 2 (Forced Combat)** - Most similar to Artifact, might feel best
4. **Solution 6 (Pre-Combat Phase)** - Adds structure, enables combat tricks

---

## Design Principles to Consider

1. **Turn 1 should have meaningful decisions**
2. **Combat tricks should be relevant early**
3. **Mana efficiency should matter**
4. **Shouldn't feel arbitrary or forced**
5. **Should scale well into mid/late game**

---

## Questions to Answer

1. **What makes turn 1 interesting in Artifact?**
   - Natural combat interactions
   - Combat tricks matter
   - Positioning decisions

2. **What do we want turn 1 to feel like?**
   - Setup for future turns?
   - Immediate combat?
   - Resource management?

3. **How much complexity is acceptable?**
   - More phases?
   - More cards?
   - More mana?

4. **What's the core identity of our game?**
   - Positioning-focused?
   - Combat-focused?
   - Resource management?

---

*This document should be used to guide testing and iteration on the early game experience.*

