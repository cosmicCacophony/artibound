# Balance Analysis: RW vs UBG - Overcommitment Problem

## Problem Statement

**Issue:** RW (Red/White) can overcommit to one lane (stacking multiple heroes + units), and UBG (Blue/Black/Green) lacks effective answers.

**Current RW Heroes:**
- Valiant Commander: 4/8 health
- War Captain: 7/10 health  
- Battle Vanguard: 5/9 health

**Current UBG Sweepers:**
- Thunderstorm: 4 mana UB - Deal 3 damage to all enemy units (doesn't kill heroes)
- Arcane Sweep: 6 mana UB - Deal 4 damage to all enemy units (doesn't kill most heroes)
- Frost Wave: 3 mana Blue - Deal 2 damage to all enemy units in target battlefield (too weak)
- Exorcism: 8 mana UBG - Deal 12 distributed damage (too expensive, requires all 3 colors)

**The Problem:** 3-4 damage sweepers don't kill RW heroes (8-10 health), they just weaken them. RW can then buff them back up or continue pressuring.

---

## Solution Options Analysis

### Option 1: Add Stronger Sweepers to UBG

**Examples:**
- **Annihilation** (6 mana UB): Destroy all units in target battlefield
- **Verdant Wrath** (5 mana UBG): Deal 5 damage to all enemy units in target battlefield
- **Void Storm** (5 mana UB): Deal 4 damage to all enemy units, draw a card
- **Nature's Cleansing** (4 mana UG): Deal 4 damage to all enemy units in target battlefield

**Pros:**
- ✅ Direct answer to overcommitment problem
- ✅ Creates clear counterplay - RW must respect sweepers
- ✅ Fits control archetype identity
- ✅ Can be balanced with mana cost and color requirements
- ✅ Doesn't require new mechanics

**Cons:**
- ❌ May be too powerful if not balanced carefully
- ❌ Could make RW feel helpless when opponent has sweeper
- ❌ Might slow down game too much (control vs control)
- ❌ Need to ensure it's not too easy to cast (color requirements)

**Design Considerations:**
- Should cost 5-6 mana (not too early, not too late)
- Should require 2 colors minimum (UB or UBG) to prevent easy access
- Damage should be 4-5 to kill most units but not all heroes (creates interesting decisions)
- Could have conditional effects (e.g., "if opponent has 3+ units, deal +1 damage")

---

### Option 2: Hero Retreat/Repositioning Mechanic

**Examples:**
- **Free retreat**: Heroes can return to base for free (once per turn limit)
- **Mana cost retreat**: Pay 1 mana to return hero to base
- **Spell-based retreat**: "Return target hero to base. It can be deployed this turn without paying mana cost." (2 mana UG)

**Pros:**
- ✅ Allows UBG to reposition heroes to defend overcommitted lane
- ✅ Creates strategic depth - when to retreat vs stay
- ✅ Helps with hero cooldown issue (can bring back stranded heroes)
- ✅ Doesn't directly nerf RW, just gives UBG more flexibility
- ✅ Fits control archetype (tactical repositioning)

**Cons:**
- ❌ Doesn't directly solve the overcommitment problem (RW still has board advantage)
- ❌ May make games longer/more defensive
- ❌ Could be abused if too cheap (constant repositioning)
- ❌ Doesn't address the core issue: UBG can't clear the board

**Design Considerations:**
- Should have a cost (mana or once-per-turn limit)
- Could be a spell rather than free action (costs a card)
- Should heal hero to full when returning to base (already implemented)
- Could be conditional (e.g., "if opponent has 3+ units in this lane, return hero to base")

---

### Option 3: Better Single-Target Removal

**Examples:**
- **Verdant Strike** (3 mana GB): Destroy target unit with 5 or less health
- **Void Bolt** (already exists, 3 mana UB): Deal 4 damage (good but limited)
- **Nature's Judgment** (4 mana GB): Destroy target unit. If it was a hero, gain +1 max mana
- **Assassinate** (already exists, 4 mana UB): Destroy target hero, opponent discards

**Pros:**
- ✅ More efficient than sweepers (can kill key threats)
- ✅ Lower mana cost allows multiple removals per turn
- ✅ Can target specific threats (e.g., kill the buffing hero first)
- ✅ Doesn't require new mechanics

**Cons:**
- ❌ Doesn't solve overcommitment (can only kill 1-2 units per turn)
- ❌ RW can still overwhelm with numbers
- ❌ May not be enough if RW has 3+ heroes in one lane
- ❌ Card disadvantage (spending cards to remove threats)

**Design Considerations:**
- Should be efficient (3-4 mana for good removal)
- Could have card draw attached to offset card disadvantage
- Should be able to kill heroes (not just units)
- Could have conditional effects (e.g., "if opponent has 3+ units, this costs 1 less")

---

### Option 4: Defensive/Stalling Tools

**Examples:**
- **Tower Shield** (3 mana W): Target tower gains +5 HP this turn
- **Mass Stun** (4 mana UB): Stun all enemy units in target battlefield this turn
- **Defensive Barrier** (3 mana UG): All your units gain +0/+3 until end of turn
- **Tactical Withdrawal** (2 mana B): Return all your units to base. Draw a card for each unit returned.

**Pros:**
- ✅ Buys time for UBG to find answers
- ✅ Creates interesting decisions (when to stall vs fight)
- ✅ Doesn't directly kill units (less feel-bad for RW)
- ✅ Can be combined with other answers

**Cons:**
- ❌ Doesn't solve the problem, just delays it
- ❌ RW can still pressure other lane or wait
- ❌ May make games too long/defensive
- ❌ Doesn't address core issue: UBG needs board clears

**Design Considerations:**
- Should be temporary (this turn/this combat)
- Should have a cost (mana or card)
- Could be conditional (e.g., "if opponent has 3+ units, gain additional effect")

---

### Option 5: Conditional/Punishment Effects

**Examples:**
- **Overcommitment Punishment** (4 mana UB): If opponent has 3+ units in target battlefield, deal 4 damage to all enemy units there
- **Tactical Advantage** (3 mana B): If opponent has more units than you, draw 2 cards
- **Desperate Measures** (5 mana UBG): Deal X damage to all enemy units, where X = number of enemy units (max 5)
- **Convergence Strike** (4 mana UBG): Deal 3 damage to all enemy units. If opponent has 3+ units, deal 5 damage instead

**Pros:**
- ✅ Rewards UBG for being behind (catch-up mechanics)
- ✅ Punishes RW for overcommitting
- ✅ Creates interesting risk/reward for RW
- ✅ Scales with the problem (more units = more damage)

**Cons:**
- ❌ May feel bad for RW (punished for playing well)
- ❌ Could be too powerful if not balanced
- ❌ Adds complexity to card text
- ❌ May not be reliable (conditional effects)

**Design Considerations:**
- Should be clearly telegraphed (RW knows the risk)
- Should scale appropriately (not too weak, not too strong)
- Could be a signature card (so it's limited to 2 copies)
- Should require 2-3 colors to prevent easy access

---

### Option 6: Hybrid Approach (Multiple Solutions)

**Combination of:**
1. One stronger sweeper (5-6 mana, 4-5 damage)
2. Hero retreat mechanic (1 mana or free with limit)
3. One conditional punishment card
4. Better early removal options

**Pros:**
- ✅ Addresses problem from multiple angles
- ✅ Gives UBG multiple tools to handle different situations
- ✅ More balanced (not relying on one solution)
- ✅ Creates more strategic depth

**Cons:**
- ❌ More complex to implement
- ❌ Harder to balance (multiple moving parts)
- ❌ May overcorrect (make RW too weak)
- ❌ Requires more testing

---

## Additional Brainstormed Options

### Option 7: Battlefield-Specific Answers

**Examples:**
- **Lane Lockdown** (4 mana UB): Target battlefield's units can't attack this turn
- **Strategic Withdrawal** (3 mana B): Return all your units from target battlefield to base. Draw a card.
- **Tactical Repositioning** (2 mana UG): Move all your units from one battlefield to the other

**Pros:**
- ✅ Allows UBG to abandon overcommitted lane
- ✅ Creates interesting lane management decisions
- ✅ Doesn't directly kill units (less feel-bad)

**Cons:**
- ❌ Doesn't solve the problem, just avoids it
- ❌ RW can still pressure other lane
- ❌ May make games too defensive

---

### Option 8: Hero Ability Cooldown Changes

**Current:** Heroes have ability cooldowns (2-3 turns)

**Change:** Remove cooldowns, but heroes can't use abilities the turn after they die

**Pros:**
- ✅ Simplifies hero ability system
- ✅ Makes heroes more flexible
- ✅ Doesn't directly address overcommitment but helps with hero management

**Cons:**
- ❌ Doesn't solve the core problem
- ❌ May make heroes too powerful
- ❌ Changes fundamental game mechanics

---

### Option 9: Mana Ramp + Bigger Threats

**Examples:**
- **Verdant Colossus** (already exists, 8 mana UBG): 6/8 threat
- **Nature's Wrath** (3 mana G): Deal 3 damage, gain +1 max mana (already exists)
- **Mana Surge** (3 mana G): Gain +2 max mana (new card)

**Pros:**
- ✅ Allows UBG to play bigger threats faster
- ✅ Creates race condition (can UBG ramp fast enough?)
- ✅ Fits green identity

**Cons:**
- ❌ Doesn't solve overcommitment (RW can still overwhelm)
- ❌ May make games too fast
- ❌ Doesn't address core issue: need board clears

---

### Option 10: Card Draw + Value Engine

**Examples:**
- **Arcane Insight** (3 mana UB): Draw 2 cards, discard 1
- **Death Ritual** (already exists, 4 mana B): Draw 2 cards
- **Convergence Study** (4 mana UBG): Draw cards equal to number of different colors among your heroes

**Pros:**
- ✅ Helps UBG find answers faster
- ✅ Creates card advantage
- ✅ Fits control archetype

**Cons:**
- ❌ Doesn't solve the problem, just helps find solutions
- ❌ May not be enough if answers don't exist
- ❌ Doesn't address core issue: need board clears

---

### Option 11: Threat Creation / Punish Overcommitment (NEW)

**Examples:**
- **Verdant Summoning** (5 mana UBG): Create two 4/4 units in target battlefield
- **Nature's Call** (4 mana UG): Create two 3/3 units in target battlefield
- **Convergence Forces** (6 mana UBG): Create X 3/3 units, where X = number of different colors among your heroes (max 3)
- **Tactical Deployment** (4 mana UB): Create two 2/4 units in target battlefield. Draw a card.

**How it works:**
- UBG creates threats in the lane RW didn't overcommit to
- If RW has heroes there, they can deal with it (fair)
- If RW overcommitted to other lane, they take free damage (punishment)
- Creates pressure that RW must respect

**Pros:**
- ✅ Punishes overcommitment indirectly (threat in other lane)
- ✅ Creates board presence (UBG can actually pressure)
- ✅ Doesn't directly kill RW's board (less feel-bad)
- ✅ Creates interesting decisions for RW (commit more or defend?)
- ✅ Fits control archetype (can play defensively or offensively)
- ✅ Rewards UBG for having mana available
- ✅ More proactive than reactive (creates threats vs removing threats)

**Cons:**
- ❌ Doesn't directly solve the problem (RW still has board advantage in overcommitted lane)
- ❌ RW can still win by going all-in on one lane if they have enough damage
- ❌ May not be enough if RW is already ahead
- ❌ Requires UBG to have mana available (can't use if already behind)
- ❌ RW can potentially clear the threats if they have removal
- ❌ Doesn't help if RW is already pressuring both lanes

**Design Considerations:**
- Should create 2-3 units (enough to be threatening)
- Units should be reasonably statted (3/3 or 4/4)
- Should cost 4-6 mana (not too cheap, not too expensive)
- Could have conditional effects (e.g., "if opponent has 3+ units in other lane, create an additional unit")
- Could be a signature card (limited to 2 copies)

**Comparison to Sweepers:**
- **Sweepers:** Reactive, removes threats, answers the problem directly
- **Threat Creation:** Proactive, creates threats, punishes overcommitment indirectly
- **Sweepers:** Better when behind (can clear board)
- **Threat Creation:** Better when at parity (can pressure)
- **Sweepers:** One-time effect (cast and done)
- **Threat Creation:** Creates lasting board presence (units stay)

**Hybrid Approach:**
Could combine both:
- Sweepers for when UBG is behind (reactive)
- Threat creation for when UBG is at parity (proactive)
- Gives UBG multiple tools for different situations

---

## Recommended Approach

### Option A: Sweepers + Hero Retreat (Original Recommendation)

**Primary Solution: Add Stronger Sweepers (Option 1)**

**Recommended Cards:**
1. **Verdant Wrath** (5 mana UBG): Deal 5 damage to all enemy units in target battlefield
   - Kills most units, weakens heroes significantly
   - Requires all 3 colors (harder to cast)
   - Costs 5 mana (not too early, not too late)

2. **Void Storm** (5 mana UB): Deal 4 damage to all enemy units, draw a card
   - Kills most units, weakens heroes
   - Draws a card to offset card disadvantage
   - Requires 2 colors (more accessible)

**Secondary Solution: Hero Retreat Mechanic (Option 2)**

**Recommended Implementation:**
- **Tactical Retreat** (1 mana, free action, once per turn): Return target hero to base
  - Allows repositioning without spending a card
  - Costs 1 mana (not free, but cheap)
  - Once per turn limit prevents abuse

**Why This Combination:**
- Sweepers directly address the overcommitment problem
- Hero retreat gives flexibility and helps with cooldown issue
- Both fit control archetype identity
- Creates multiple tools without overcorrecting

---

### Option B: Threat Creation + Hero Retreat (Alternative Recommendation)

**Primary Solution: Threat Creation Spells (Option 11)**

**Recommended Cards:**
1. **Verdant Summoning** (5 mana UBG): Create two 4/4 units in target battlefield
   - Punishes RW overcommitment to other lane
   - Creates board presence for UBG
   - Requires all 3 colors (harder to cast)
   - Costs 5 mana (reasonable for 2x 4/4)

2. **Nature's Call** (4 mana UG): Create two 3/3 units in target battlefield
   - More accessible (only 2 colors)
   - Lower cost allows earlier use
   - Still creates meaningful pressure

**Secondary Solution: Hero Retreat Mechanic (Option 2)**
- Same as Option A

**Why This Combination:**
- Threat creation punishes overcommitment indirectly
- Creates interesting decisions for RW (defend or commit more?)
- Less feel-bad than sweepers (doesn't kill RW's board)
- Hero retreat still provides flexibility
- More proactive approach (creates threats vs removing threats)

---

### Option C: Hybrid Approach (Best of Both Worlds)

**Combination:**
1. **One sweeper** (Verdant Wrath or Void Storm) - for when behind
2. **One threat creation spell** (Verdant Summoning or Nature's Call) - for when at parity
3. **Hero retreat mechanic** - for flexibility

**Why This Combination:**
- Gives UBG tools for different situations
- Sweeper for reactive play (when behind)
- Threat creation for proactive play (when at parity)
- Hero retreat for flexibility
- Most comprehensive solution

**Recommendation: Option C (Hybrid Approach)**
- Most flexible and comprehensive
- Gives UBG multiple ways to handle overcommitment
- Creates more strategic depth
- Balances reactive and proactive play

---

## Color Requirement Design Analysis

### The Constraint Problem

**Current System:** Multicolor cards require ALL their colors to be present in the lane.

**For UBG spells:** You need either:
- A single hero with all 3 colors (rare - most heroes are 1-2 colors)
- Multiple heroes that together cover all 3 colors (e.g., UG hero + B hero)

**The Problem:** If you have too many UBG spells, you're forced to always deploy your UG and B heroes in the same lane, which limits strategic flexibility.

### Design Options

#### Option A: Reserve UBG for Most Powerful Spells Only
- **8 mana Exorcism** - UBG (justified - game-changing effect)
- **5-6 mana spells** - UB or UG (more flexible deployment)

**Pros:**
- ✅ Allows flexible hero deployment
- ✅ UBG requirement becomes a meaningful constraint for truly powerful effects
- ✅ More strategic depth (when to commit to UBG vs stay flexible)

**Cons:**
- ❌ May not feel "special" enough for 5-6 mana spells
- ❌ Could make UBG feel less cohesive as an archetype

#### Option B: Use UBG for 5-6 Mana Spells
- **5 mana Verdant Wrath** - UBG
- **5 mana Void Storm** - UB (more accessible)
- **6 mana Arcane Sweep** - UB (already exists)

**Pros:**
- ✅ Makes UBG feel more cohesive
- ✅ Rewards proper hero positioning
- ✅ Creates strategic tension (flexibility vs power)

**Cons:**
- ❌ Limits deployment flexibility
- ❌ Forces players to always deploy UG+B heroes together
- ❌ May make games feel repetitive

#### Option C: Hybrid Approach (Recommended)
- **8 mana Exorcism** - UBG (most powerful, justified)
- **5-6 mana spells** - UB or UG (flexible deployment)
- **4 mana spells** - Single color or dual color (early game accessible)

**Rationale:**
- Lower mana = easier to cast = less strict color requirements
- Higher mana = more powerful = stricter color requirements justified
- Creates a natural progression: early game flexibility, late game power

**Example Distribution:**
- **2-3 mana:** Single color (U, B, or G)
- **4 mana:** Dual color (UB or UG)
- **5-6 mana:** Dual color (UB or UG) - flexible but still requires setup
- **7-8 mana:** Triple color (UBG) - reserved for game-changing effects

### Recommended Color Requirements

**For Sweepers:**
- **Verdant Wrath** (5 mana): **UG** (dual color, flexible deployment) - **STARTING IMPLEMENTATION**
- **Void Storm** (5 mana): **UB** (dual color, flexible deployment) - Future addition
- **Arcane Sweep** (6 mana): **UB** (already exists, dual color)

**For Threat Creation:**
- **Verdant Summoning** (5 mana, 2x 4/4): **UG** (dual color, flexible) - Future addition
- **Nature's Call** (4 mana, 2x 3/3): **UG** (dual color, early accessible) - Future addition

**For Exorcism:**
- **Exorcism** (8 mana): **UBG** (triple color, justified for power level)

**Design Note - Future UBG Consideration:**
- Verdant Wrath may become UBG in the future
- This creates interesting draft incentives:
  - **Safe strategy:** Pick stronger-statted black hero (survives longer, enables spell casting) + weaker signature
  - **Greedy strategy:** Pick weaker-statted black hero (dies easily) + strong signature card
- **Punishment:** Aggressive decks (like RW) can kill heroes and deny spell casting on key turns
- **Strategic Depth:** Creates meaningful draft decisions around hero stats vs signature power

**Why This Works:**
- UBG requirement reserved for truly powerful effects (8 mana)
- 5-6 mana spells use dual colors (UB or UG) - still requires setup but more flexible
- Players can deploy heroes more flexibly (don't always need UG+B together)
- Creates strategic decisions: "Do I commit to UBG positioning for Exorcism, or stay flexible?"

## Implementation Priority

1. **High Priority:**
   - Change hero death cooldown from 2 to 1 (user requested)
   - Add one stronger sweeper (5 mana, 4-5 damage) - **Use UB or UG, not UBG**
   - Add one threat creation spell (5 mana, 2x 4/4) - **Use UG, not UBG**

2. **Medium Priority:**
   - Add hero retreat mechanic (1 mana, once per turn)
   - Add one conditional punishment card

3. **Low Priority:**
   - Fine-tune existing removal spells
   - Add more card draw options

---

## Testing Considerations

After implementation, test:
1. Can UBG handle RW overcommitting to one lane?
2. Does RW still feel viable (not too weak)?
3. Are games still fun and interactive?
4. Do the new cards create interesting decisions?
5. Is the hero cooldown change balanced?

