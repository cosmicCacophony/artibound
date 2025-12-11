# Interesting Game States & Decision Points

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Catalog of interesting game states to guide card design

## Overview

This document catalogs **interesting game states** - board positions and scenarios where players face **fun, meaningful decisions**. Cards should be designed to create these moments.

**Design Philosophy:**
- Define the fun moments first
- Design cards to create those moments
- Port cards from Artifact Foundry/Riftbound/Magic/Hearthstone that help achieve these states
- Tweak/augment ported cards to fit our goals
- Remove cards that don't contribute to interesting decisions

---

## Template for New Game States

### [Game State Name]

**The Situation:**
- [Board state description]
- [Mana/hand state]
- [Turn/phase]

**The Decision:**
- [What decision does the player face?]
- [What are the options?]

**Why It's Interesting:**
- [What makes this decision meaningful?]
- [What skills does it test?]

**Cards That Create This:**
- [List cards that enable this state]
- [What properties do they need?]

**Cards That Should Exist:**
- [What cards are missing to create this?]
- [What should they do?]

---

## Game State Categories

### 1. Initiative & Mana Management
### 2. Positioning & Adjacency
### 3. Bounce Decisions
### 4. Combat Setup
### 5. Resource Management
### 6. Counterplay & Response

---

## Game State Examples

### Game State 1: Homunculus - Early Safety vs Late Value

**The Situation:**
- Early game: Opponent's hero/creep in front of your important hero
- Your hero is understatted (2/4) and will die
- Opponent gets 5 gold for killing your hero
- You have Homunculus (2 mana, Blue) in hand

**The Decision:**
- **Option A**: Use Homunculus early (bounce hero)
  - Benefit: Deny 5 gold, protect hero, can redeploy safely
  - Cost: Lose Homunculus, miss late-game value
- **Option B**: Let hero die, save Homunculus
  - Benefit: Keep for late game, can use after item buffs
  - Cost: Opponent gets 5 gold, lose hero, early setback

**Late Game Scenario:**
- Hero has +6 attack from items
- Use Homunculus to devour hero
- Homunculus gets +6 attack, hero returns to base (item stays)
- Deploy hero elsewhere
- **Result**: Double value from items!

**Why It's Interesting:**
- Tests resource management (immediate vs long-term)
- Tests understanding of game state and timing
- Small decisions compound into advantages
- Better players maximize value

**Cards That Create This:**
- **Homunculus** (2 mana, U) - the decision card
- **Important heroes** (understatted, stacking abilities)
- **Item system** (buffs that can be doubled)
- **Gold system** (5 gold for hero kill vs 1 for creep)

**Cards That Should Exist:**
- ✅ Homunculus or similar card (should be ported!)
- [ ] More heroes with stacking abilities
- [ ] More items that work with Homunculus
- [ ] More cards that create early vs late value decisions

**Porting Opportunities:**
- Artifact Foundry: Homunculus (perfect fit!)
- Could adapt to different mechanics but same decision

---

### Game State 2: Spell Timing - Efficiency vs Maximum Value

**The Situation:**
- You have powerful AOE (Exorcism, 8 mana, UBG)
- Opponent has 1-2 important units on board
- You also have efficient removal (3 mana, B)
- You have mana to cast either

**The Decision:**
- **Option A**: Use powerful AOE now
  - Benefit: Removes threats immediately
  - Cost: Wastes powerful effect on few units
- **Option B**: Use efficient removal + build board
  - Benefit: Saves AOE for overextension, builds presence
  - Cost: Opponent still has 1 unit, need to manage it

**Why It's Interesting:**
- Tests sequencing and timing
- Maximizes value from each card
- Better players sequence optimally
- Small sequencing differences win games

**Cards That Create This:**
- **Powerful AOE** (Exorcism, board wipes) - save for overextension
- **Efficient removal** (3-4 mana) - use now
- **Board building** (cheap units) - build while saving AOE

**Cards That Should Exist:**
- ✅ Exorcism (already exists!)
- ✅ Efficient removal (3 mana, B)
- [ ] More powerful AOE options
- [ ] More efficient removal options
- [ ] More board building cards

**Porting Opportunities:**
- Artifact Foundry: Various AOE and removal spells
- Magic: Board wipes and spot removal
- Hearthstone: AOE and efficient removal

---

### Game State 3: Initiative Pass vs Cast

**The Situation:**
- Turn 1, after deployment
- RW has initiative, stronger board (5/8 hero vs 3/6 hero)
- Both players have 3 mana
- RW has 2-mana creep in hand
- UB has 2-mana invulnerable spell in hand

**The Decision (RW):**
- **Option A**: Cast creep now (2 mana)
  - Risk: UB might remove it (3 mana)
  - Benefit: Adds pressure if it survives
- **Option B**: Pass (keep initiative, save mana)
  - Risk: UB might also pass, go to combat
  - Benefit: Forces UB to act first, can respond

**Why It's Interesting:**
- Tests reading the board state
- Initiative has real value
- Mana efficiency matters
- Creates a mini-game of prediction

**Cards That Create This:**
- **Initiative system** (who plays first)
- **Cheap units** (2-3 mana creeps) - vulnerable but apply pressure
- **Removal spells** (3 mana) - can answer creeps
- **Combat setup spells** (2 mana invulnerable) - UB needs reason to spend mana

**Cards That Should Exist:**
- ✅ Invulnerable + Reflect (2 mana, B) - gives UB reason to spend mana
- ✅ Cheap removal (3 mana, B or U) - answers creeps
- ✅ Initiative spells (1-2 mana) - maintain tempo
- [ ] More combat setup spells for UB
- [ ] More cheap units for RW

**Porting Opportunities:**
- Artifact Foundry: Invulnerable + Reflect (perfect fit!)
- Artifact Foundry: Cheap removal spells
- Magic: Combat tricks that create this dynamic

---

### Game State 4: Exorcism Positioning

**The Situation:**
- Turn 6-8, mid-late game
- UBG player has Exorcism (8 mana, UBG) in hand
- UBG hero is in slot 2 (affects opponent slots 1, 2, 3)
- RW player has 3 heroes on board: H1 (5/8) in slot 1, H2 (4/7) in slot 2, H3 (4/7) in slot 3
- RW tower at 15 HP

**The Decision (RW):**
- **Option A**: Keep all 3 heroes in splash zone
  - Result: 3 damage to each hero, 3 to tower (15 → 12)
  - All heroes survive, tower takes minimal damage
- **Option B**: Bounce weak hero, replace with strong one
  - Result: Still 3 units, but stronger hero survives better
- **Option C**: Position heroes outside splash zone (slots 3-4)
  - Result: Heroes safe, but tower takes full 12 (15 → 3)

**Why It's Interesting:**
- Tests prediction (where will UBG be?)
- Positioning matters (adjacency mechanics)
- Bounce decisions matter (weak vs strong heroes)
- Risk/reward (protect heroes vs protect tower)

**Cards That Create This:**
- **Exorcism** (8 mana, UBG) - the threat
- **High-health heroes** (5+ health) - can survive 3-4 damage
- **Bounce mechanic** - replace weak with strong
- **Positioning system** - adjacency matters

**Cards That Should Exist:**
- ✅ Exorcism (already exists)
- ✅ Bounce mechanic (already exists)
- [ ] More high-health heroes for RW (5+ health)
- [ ] More positioning spells (move heroes)
- [ ] More AOE spells with similar distribution patterns

**Porting Opportunities:**
- Artifact Foundry: Exorcism (already ported!)
- Artifact Foundry: Other AOE spells with distribution
- Magic: Positioning/combat tricks

---

### Game State 5: Bounce Before Exorcism

**The Situation:**
- Turn 6-8, mid-late game
- UBG player is about to cast Exorcism
- RW player has H1 (3/5) and H2 (2/4) in splash zone
- RW player has H3 (5/8) in base
- Both players have 8 mana

**The Decision (RW):**
- **Option A**: Do nothing
  - Result: H1 survives (3/5 → 3/1), H2 dies (2/4 → 2/0)
  - Loses H2, H1 barely survives
- **Option B**: Bounce H2, replace with H3 (5/8)
  - Result: H1 survives (3/5 → 3/1), H3 survives (5/8 → 5/4)
  - Saves H2, H3 takes damage but survives easily

**Why It's Interesting:**
- Tests hero management (weak vs strong)
- Bounce timing matters (before vs after)
- Resource management (mana for bounce)
- Prediction (will Exorcism be cast?)

**Cards That Create This:**
- **Bounce mechanic** - replace heroes
- **Exorcism threat** - creates the decision
- **Hero health variance** - weak (2-3) vs strong (5+)
- **Mana system** - need mana to bounce

**Cards That Should Exist:**
- ✅ Bounce mechanic (already exists)
- ✅ Exorcism (already exists)
- [ ] More hero health variance (more 2-3 health heroes, more 5+ health heroes)
- [ ] Cards that reward bouncing weak heroes
- [ ] Cards that punish bouncing too much

**Porting Opportunities:**
- Artifact Foundry: Cards that interact with hero health
- Magic: Hero/creature management cards

---

### Game State 6: Combat Setup with Invulnerable

---

### Game State 7: Combat Tricks - The Bluff Game

**The Situation:**
- Turn 3-5, mid game
- RW has 2 units on board (H1 4/5, Unit 3/3)
- RW wants to attack UB hero (3/6)
- RW has combat trick in hand (Combat Surge, 2 mana, +3 attack)
- UB has 3 mana open (could have removal)
- Both players have 3-4 mana

**The Decision (RW):**
- **Option A**: Attack without trick
  - Risk: UB uses removal (3 mana), kills your unit
  - Benefit: Save trick for later, don't reveal it
  - Result: Unit dies, wasted attack
- **Option B**: Attack with trick (Combat Surge)
  - Risk: UB doesn't have removal, trick wasted
  - Benefit: Secure kill (4+3 = 7 damage, kills 3/6), get gold
  - Result: Hero dies, RW gets 5 gold, applies pressure

**The Decision (UB):**
- **Option A**: Use removal now (3 mana)
  - Risk: RW has trick, removal wasted
  - Benefit: Kill unit if no trick
  - Result: Either kills unit or wastes removal
- **Option B**: Hold removal
  - Risk: RW has trick, unit kills your hero
  - Benefit: Save removal for better target
  - Result: Either hero dies or removal saved

**Why It's Interesting:**
- Creates mini-game of "do I have the answer?"
- Bluffing and reading opponent
- Timing matters (when to commit)
- Small advantages compound
- Better players read the situation correctly

**Cards That Create This:**
- **Combat tricks** (2-3 mana, R or W) - pump, first strike, etc.
- **Removal spells** (3 mana, B or U) - answers to tricks
- **Mana system** - leaving mana open matters
- **Initiative system** - who acts first matters

**Cards That Should Exist:**
- ✅ Combat Surge (2 mana, R, +3 attack) - should be ported
- ✅ Execute (2 mana, R, 3 damage) - should be ported
- [ ] More combat tricks (first strike, protection, etc.)
- [ ] More instant-speed answers for UB
- [ ] More ways to bluff and read opponent

**Porting Opportunities:**
- Magic: Combat tricks (Giant Growth, Lightning Bolt, etc.)
- Magic: Protection spells
- Artifact Foundry: Combat-focused cards

---

### Game State 8: Post-Tower Destruction - Lane Positioning Strategy

**The Situation:**
- One tower is destroyed (20 HP → 0)
- RW has 4-power hero in destroyed tower's lane
- RW needs to apply pressure in other lane to destroy second tower
- Or RW can deal damage to nexus now (less efficient)
- UB has 2-power hero in destroyed tower's lane

**The Decision (RW):**
- **Option A**: Keep 4-power hero in destroyed lane
  - Problem: Hero can't help destroy second tower
  - Problem: High attack wasted (4 power doing nothing)
  - Result: Devastating positioning mistake
- **Option B**: Bounce/redeploy 4-power hero to active lane
  - Benefit: Hero can help destroy second tower
  - Benefit: High attack applied where needed
  - Cost: Mana for bounce, lose positioning
  - Result: Better positioning, can apply pressure

**The Decision (UB):**
- **Option A**: Keep 2-power hero in destroyed lane
  - Less Problem: Low attack anyway (2 power not critical)
  - Benefit: Can still cast spells from any lane
  - Result: Less game-impacting mistake
- **Option B**: Bounce/redeploy 2-power hero
  - Benefit: Better positioning
  - Cost: Mana for bounce
  - Result: Slightly better, but less critical

**Why It's Interesting:**
- **Stats matter more for combat decks**: High-attack heroes need correct positioning
- **Spells are more flexible**: Can cast from any lane
- **Creates skill expression**: Better players position combat heroes correctly
- **Punishes mistakes**: Wrong positioning is more costly for RW than UB
- Tests understanding of win condition (destroy both towers vs immediate nexus damage)
- Tests resource management (pressure vs efficiency)

**Cards That Create This:**
- **High-attack heroes** (4+ attack) - need correct positioning
- **Low-attack heroes** (2-3 attack) - more flexible
- **Bounce mechanic** - allows repositioning
- **Tower destruction** - creates the decision point
- **Nexus damage system** - creates win condition

**Cards That Should Exist:**
- ✅ Bounce mechanic (already exists)
- ✅ High-attack heroes for RW (4+ attack)
- ✅ Low-attack heroes for UB (2-3 attack)
- [ ] More positioning spells (move heroes between lanes)
- [ ] More cards that reward correct positioning
- [ ] More cards that punish wrong positioning

**Porting Opportunities:**
- Artifact Foundry: Positioning cards that work with destroyed towers
- Magic: Cards that reward positioning
- Hearthstone: Cards that interact with destroyed lanes

**Design Note:**
- This dynamic becomes more relevant when towers are destroyed
- Combat-focused decks (RW) should feel more punished for wrong positioning
- Spell-focused decks (UB) should feel more flexible
- Creates meaningful skill expression for RW players

---

### Game State 9: Tower vs Units - Gold vs Pressure

**The Situation:**
- Turn 4-6, mid game
- RW has 3 units on board
- Can attack tower (20 HP) or enemy units
- Killing units gives 5 gold (important for items)
- Opponent might have AOE (Exorcism, board wipe)
- RW tower at 18 HP, UB tower at 15 HP

**The Decision:**
- **Option A**: Attack tower
  - Benefit: Apply pressure (15 → 12), closer to winning
  - Cost: Don't get gold, units vulnerable to AOE
  - Risk: Opponent has AOE, lose multiple units
- **Option B**: Attack units (kill for gold)
  - Benefit: Get gold (5 per kill), remove threats, safer from AOE
  - Cost: Less tower pressure, opponent can stabilize
  - Risk: Opponent stabilizes, game goes longer

**Why It's Interesting:**
- Tests resource management (gold vs pressure)
- Tests risk assessment (AOE threat)
- Tests game state reading (when to commit)
- Better players balance these correctly
- Creates meaningful choices every turn

**Cards That Create This:**
- **Tower pressure cards** (can attack tower directly)
- **Gold system** (5 gold for hero kill)
- **AOE threats** (Exorcism, board wipes)
- **Unit removal** (kill units for gold)

**Cards That Should Exist:**
- ✅ Tower Focus (2 mana, R) - attack tower, +3 if opponent has few heroes
- ✅ Execute (2 mana, R) - kill units for gold
- [ ] More tower pressure options
- [ ] More ways to get gold
- [ ] More risk/reward decisions

**Porting Opportunities:**
- Artifact Foundry: Tower pressure cards
- Magic: Direct damage spells
- Hearthstone: Face damage vs board control

**The Situation:**
- Turn 1, after deployment
- RW: H1 (5/8) in slot 1, facing UB: H2 (3/6) in slot 1
- UB has initiative
- Both players have 3 mana
- UB has 2-mana invulnerable + reflect spell

**The Decision (UB):**
- **Option A**: Cast invulnerable on H2 before combat
  - Result: H1 attacks, takes 5 reflected damage, dies
  - H2 survives, UB wins trade with 2 mana
- **Option B**: Pass, go to combat
  - Result: H1 kills H2, H1 survives at 5/5
  - UB loses trade

**Why It's Interesting:**
- Tests combat prediction
- 2-mana spell turns losing trade into winning trade
- Timing matters (before combat)
- Creates "gotcha" moments

**Cards That Create This:**
- **Invulnerable + Reflect** (2 mana, B) - the combat trick
- **Hero positioning** - heroes in front of each other
- **Combat system** - damage reflection
- **Initiative** - who acts first

**Cards That Should Exist:**
- ✅ Invulnerable + Reflect (should be ported!)
- [ ] More combat setup spells (stun, buff, etc.)
- [ ] More positioning spells (move heroes)
- [ ] Cards that reward combat prediction

**Porting Opportunities:**
- Artifact Foundry: Invulnerable + Reflect (perfect!)
- Artifact Foundry: Other combat tricks
- Magic: Combat tricks and instants

---

## Design Process Using Game States

### Step 1: Identify Interesting Game States
- Playtest and document moments that feel fun
- Analyze what makes them interesting
- Categorize by decision type

### Step 2: Design Cards to Create Those States
- Identify what cards enable each state
- Design new cards or port existing ones
- Ensure cards have the right properties (mana, colors, effects)

### Step 3: Test Cards Against Game States
- Does this card help create interesting game states?
- Does it contribute to meaningful decisions?
- If not, remove or tweak it

### Step 4: Iterate
- Add new game states as you discover them
- Refine existing states based on testing
- Remove cards that don't contribute

---

## Porting Strategy

### When Porting Cards:

1. **Does it create an interesting game state?**
   - Yes → Port it
   - No → Skip it or modify it

2. **What game state does it create?**
   - Identify which game state(s) it enables
   - Ensure it has the right properties

3. **Does it need modification?**
   - Adjust mana cost to fit power level → color system
   - Adjust colors to fit our system
   - Simplify complex mechanics if needed

4. **Test it:**
   - Does it create the intended game state?
   - Does it feel fun?
   - Does it contribute to meaningful decisions?

### Example: Invulnerable + Reflect

**From Artifact Foundry:**
- 2 mana, Black
- Give hero invulnerable, reflect damage

**Analysis:**
- ✅ Creates interesting game state (combat setup)
- ✅ Tests prediction and timing
- ✅ Creates meaningful decisions

**Porting:**
- Keep as 2 mana, Black (single color, accessible early)
- Fits power level → color system
- Enables "Combat Setup with Invulnerable" game state

**Result:** Port it as-is!

---

## Next Steps

1. **Document more game states** as you discover them
2. **Identify cards that create each state**
3. **Port cards from other games** that enable these states
4. **Test and iterate** based on whether cards create fun moments

---

*This document should be used to guide card design. Every card should contribute to creating interesting game states with meaningful decisions.*

