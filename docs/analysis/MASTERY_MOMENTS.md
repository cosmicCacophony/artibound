# Mastery Moments from Artifact Foundry

## Overview

This document analyzes **mastery moments** from Artifact Foundry - decisions that took time to learn and create skill expression. We'll either port them directly or find other ways to accomplish similar mastery goals in Artibound.

**Goal**: Create games where skill matters more than luck. Close games should be won by slightly better sequencing, positioning, and decision-making.

---

## Mastery Moment 1: Homunculus - Early Safety vs Late Value

### The Card (Artifact Foundry)

**Homunculus** (2 mana, Blue Creep)
- **Devour**: If this card would devour a hero, it bounces it instead, then this card becomes a caster of that hero's color.

### The Decision

**Early Game Scenario:**
- Red deck puts their hero or big creep in front of your important Blue hero
- Blue hero is understatted (e.g., 2/4) and will die in combat
- Opponent will get 5 gold for killing your hero
- You have Homunculus in hand

**Option A: Use Homunculus Early (Bounce Hero)**
- **Benefit**: 
  - Deny opponent 5 gold (they only get 1 gold for killing Homunculus)
  - Protect your important hero (maybe it has stacking ability)
  - Can redeploy hero to safer position next turn
- **Cost**: 
  - Lose Homunculus (valuable card)
  - Miss out on late-game value

**Option B: Let Hero Die, Save Homunculus**
- **Benefit**: 
  - Keep Homunculus for late game
  - Can use it after buffing hero with items
- **Cost**: 
  - Opponent gets 5 gold
  - Lose your important hero (cooldown, lose stacking ability)
  - Setback in early game

**Late Game Scenario:**
- Hero has been buffed with items (e.g., +6 attack)
- Use Homunculus to devour hero
- Homunculus gets the attack bonus (+6 attack)
- Hero returns to base (item stays on hero)
- Deploy hero elsewhere (maybe different lane, or same lane with better positioning)
- **Result**: Double value from items! Homunculus has +6 attack, hero still has item

### Why This Creates Mastery

**Resource Management:**
- Early game: Immediate safety vs long-term value
- Late game: Maximizing item value
- Tests understanding of game state and timing

**Skill Expression:**
- Reading when hero is truly in danger
- Understanding item value and timing
- Knowing when to sacrifice short-term for long-term

**Close Games:**
- Better players save Homunculus for maximum value
- Worse players use it too early or too late
- Small decisions compound into game-winning advantages

---

## Artibound Adaptation

### Option A: Port Homunculus Directly

**Homunculus** (2 mana, Blue Unit)
- **Stats**: 2/2 or 2/3
- **Effect**: When this would devour a hero, bounce that hero instead. This unit becomes a caster of that hero's color.
- **Design**: Single color (U) keeps it accessible early

**Creates Same Decision:**
- Early: Bounce hero to deny gold, protect important hero
- Late: Use after item buffs to get double value

### Option B: Create Similar Mechanic

**"Absorb" Mechanic:**
- Unit can "absorb" a hero's stats/items
- Hero returns to base, unit gains the stats
- Items stay on hero, unit gets temporary stats

**Example Card:**
- **Mana Siphon** (2 mana, Blue Unit, 2/2)
- **Effect**: When this would devour a hero, bounce that hero instead. This unit gains +X/+X equal to that hero's attack/health (or item bonuses).

### Option C: Different Card, Same Decision

**"Hero Swap" Spell:**
- **Tactical Repositioning** (2 mana, Blue Spell)
- **Effect**: Return target hero to base. Deploy target unit from your base to that hero's slot. That unit gains +X/+X equal to items on the returned hero.

**Creates Similar Decision:**
- Early: Use to protect hero, deny gold
- Late: Use to maximize item value, reposition

---

## Mastery Moment 2: Spell Timing - Efficiency vs Maximum Value

### The Decision

**Scenario:**
- You have powerful AOE spell (e.g., Exorcism, board wipe)
- Opponent has 1-2 important units on board
- You also have weaker removal (3-mana spot removal)
- You have mana to cast either

**Option A: Use Powerful AOE Now**
- **Benefit**: Removes threats immediately
- **Cost**: Wastes powerful effect on few units
- **Result**: Opponent can rebuild, you've used your best answer

**Option B: Use Weak Removal + Build Board**
- **Benefit**: 
  - Removes 1 threat efficiently
  - Saves powerful AOE for when opponent overextends
  - Can deploy units, build board presence
- **Cost**: 
  - Opponent still has 1 unit on board
  - Need to manage that threat
- **Result**: Better long-term value, but need to survive short-term

### Why This Creates Mastery

**Sequencing:**
- Understanding when to use powerful effects
- Maximizing value from each card
- Reading opponent's likely plays

**Resource Management:**
- Mana efficiency matters
- Card advantage matters
- Timing matters more than raw power

**Close Games:**
- Better players sequence spells optimally
- Worse players waste powerful effects
- Small sequencing differences win games

---

## Artibound Adaptation

### Cards That Create This

**Powerful AOE (Save for Overextension):**
- **Exorcism** (8 mana, UBG) - Already exists!
- **Board Wipe** (6 mana, UBG) - Deal damage to all units
- **Mass Removal** (7 mana, UBG) - Destroy multiple units

**Efficient Removal (Use Now):**
- **Spot Removal** (3 mana, B) - Deal 3 damage
- **Targeted Kill** (4 mana, UB) - Destroy target unit
- **Damage + Initiative** (3 mana, B) - Deal 3, get initiative

**Board Building (While Saving AOE):**
- **Cheap Units** (2-3 mana) - Build presence
- **Defensive Units** (3 mana, G) - Survive threats
- **Buff Spells** (3 mana, G) - Strengthen board

### Design Principles

**Powerful Effects Should:**
- Be expensive (6-8 mana, multicolor)
- Require setup (positioning, colors)
- Reward waiting for maximum value
- Feel bad when wasted on few units

**Efficient Effects Should:**
- Be cheaper (2-4 mana, single/dual color)
- Answer immediate threats
- Allow you to build board while answering
- Feel good when used efficiently

---

## Mastery Moment 3: Close Games - Skill Over Luck

### The Goal

**Artifact Foundry Achievement:**
- 2 skilled players play out all their cards
- Winner made slightly better decisions
- Better sequencing, positioning, resource management
- **Feels rewarding** - skill mattered, not luck

**Most Card Games:**
- 80% of games: Winner had luckier draw
- 10-20% of games: Close and skill-intensive
- **Feels frustrating** - luck matters more than skill

### How Artifact Foundry Achieves This

**1. Multiple Decision Points Per Turn**
- Deployment decisions
- Spell timing (initiative)
- Combat targeting
- Resource management

**2. Positioning Matters**
- Where you deploy affects everything
- Adjacency matters
- Can't just "play your cards"

**3. Resource Management**
- Mana efficiency
- Gold efficiency
- Card advantage
- Timing

**4. Counterplay Exists**
- Every strategy has answers
- Can't just "draw the nuts" and win
- Need to play around answers

**5. Small Advantages Compound**
- Slightly better sequencing → small advantage
- Small advantage → better position
- Better position → more options
- More options → win

---

## How Artibound Can Achieve This

### 1. Multiple Decision Points

**Already Have:**
- ✅ Deployment decisions (bouncing, positioning)
- ✅ Spell timing (initiative system)
- ✅ Combat targeting (positional)
- ✅ Resource management (mana, gold)

**Can Improve:**
- More deployment decisions (more slots, more options)
- More spell timing decisions (more initiative spells)
- More combat decisions (more targeting options)

### 2. Positioning Matters

**Already Have:**
- ✅ Adjacency mechanics (Exorcism)
- ✅ Slot positioning (1-4 slots)
- ✅ Bouncing for positioning

**Can Improve:**
- More adjacency effects
- More positioning spells
- More rewards for good positioning

### 3. Resource Management

**Already Have:**
- ✅ Mana system (3-10)
- ✅ Gold system (items)
- ✅ Card advantage (draw spells)

**Can Improve:**
- More mana efficiency decisions
- More gold efficiency decisions
- More card advantage engines

### 4. Counterplay

**Already Have:**
- ✅ Removal spells
- ✅ AOE spells
- ✅ Combat tricks

**Can Improve:**
- More counterplay options
- More ways to play around answers
- More strategic depth

### 5. Small Advantages Compound

**Design Cards That:**
- Reward good sequencing
- Punish bad sequencing
- Create small advantages that compound
- Make every decision matter

---

## Cards That Create Mastery Moments

### Resource Management Cards

**Homunculus-Type Cards:**
- Early safety vs late value
- Item value maximization
- Hero protection vs resource efficiency

**Spell Timing Cards:**
- Powerful AOE (save for overextension)
- Efficient removal (use now)
- Board building (while saving AOE)

### Sequencing Cards

**Initiative Spells:**
- Get initiative to sequence better
- Pass to keep initiative
- Force opponent to act first

**Combat Setup:**
- Set up winning trades
- Protect important units
- Maximize combat value

### Positioning Cards

**Adjacency Effects:**
- Exorcism (already exists)
- More AOE with adjacency
- Buffs/debuffs based on positioning

**Movement Spells:**
- Reposition heroes
- Set up better positions
- Respond to threats

---

## Design Checklist

When designing cards, ask:

1. **Does this create a meaningful decision?**
   - Early vs late value?
   - Efficiency vs maximum value?
   - Safety vs resource management?

2. **Does this reward skill?**
   - Better players use it better?
   - Timing matters?
   - Sequencing matters?

3. **Does this create close games?**
   - Small advantages compound?
   - Skill matters more than luck?
   - Better decisions win?

4. **Does this feel rewarding?**
   - Winning feels earned?
   - Losing feels like you could have played better?
   - Games feel skill-intensive?

---

## Porting Strategy

### When Porting Cards:

1. **Does it create a mastery moment?**
   - Early vs late value decision?
   - Efficiency vs maximum value?
   - Sequencing/positioning decision?

2. **What mastery does it teach?**
   - Resource management?
   - Spell timing?
   - Positioning?
   - Sequencing?

3. **Does it fit our system?**
   - Adjust mana/colors to fit
   - Simplify if needed
   - Ensure it creates the decision

4. **Test it:**
   - Does it create the mastery moment?
   - Do better players use it better?
   - Does it feel rewarding?

---

## Mastery Moment 4: RW Aggro - Combat Tricks & Positioning

### The Challenge

**Artifact Foundry:**
- RG (Red/Green) is more of a positioning game
- 3 lanes create natural positioning decisions
- Positioning matters, but less depth with fewer lanes

**Artibound:**
- Only 2 lanes (less positioning depth)
- Need to make RW aggro more interesting
- Solution: Combat tricks + positioning + timing

### The Decision Points

#### 1. Combat Tricks - The Bluff Game

**The Situation:**
- RW has units on board, wants to attack
- UB might have removal/combat tricks
- RW has combat tricks in hand (e.g., +3 attack, first strike)
- UB has 3 mana open (could have removal)

**The Decision (RW):**
- **Option A**: Attack without trick
  - Risk: UB uses removal, kills your unit
  - Benefit: Save trick for later, don't reveal it
- **Option B**: Attack with trick
  - Risk: UB doesn't have removal, waste trick
  - Benefit: Secure kill, get gold, pressure tower

**The Decision (UB):**
- **Option A**: Use removal now
  - Risk: RW has trick, removal wasted
  - Benefit: Kill unit if no trick
- **Option B**: Hold removal
  - Risk: RW has trick, unit kills your hero
  - Benefit: Save removal for better target

**Why It's Interesting:**
- Creates a mini-game of "do I have the answer?"
- Bluffing and reading opponent
- Timing matters (when to commit)
- Small advantages compound

#### 2. Positioning - When to Go for Tower vs Kill Units

**The Situation:**
- RW has units that can attack tower or enemy units
- Killing units gives gold (important for items)
- Attacking tower applies pressure
- Opponent might have AOE/board wipes

**The Decision:**
- **Option A**: Attack tower
  - Benefit: Apply pressure, closer to winning
  - Cost: Don't get gold, units vulnerable to AOE
- **Option B**: Attack units (kill for gold)
  - Benefit: Get gold for items, remove threats
  - Cost: Less tower pressure, risk AOE if overextend

**Why It's Interesting:**
- Tests resource management (gold vs pressure)
- Tests risk assessment (AOE threat)
- Tests game state reading (when to commit)
- Better players balance these correctly

#### 3. Timing - When to Commit Units

**The Situation:**
- RW has multiple units in hand
- Opponent might have AOE (Exorcism, board wipe)
- Can deploy 1-2 units now, or wait

**The Decision:**
- **Option A**: Deploy units now
  - Benefit: Apply pressure, get on board
  - Risk: Opponent has AOE, lose multiple units
- **Option B**: Wait, deploy after AOE
  - Benefit: Avoid AOE, deploy safely
  - Risk: Opponent doesn't have AOE, wasted turns

**Why It's Interesting:**
- Tests prediction (does opponent have AOE?)
- Tests risk management (commit vs hold)
- Tests game state reading (when is it safe?)
- Better players commit at right times

#### 4. Lane Positioning - Wrong Lane Punishment

**The Situation (Artifact Foundry):**
- Combat-focused deck (RW) has 4-power hero
- Spell-focused deck (UB) has 2-power hero
- Hero is deployed in "wrong lane" (not where pressure is needed)
- Tower is destroyed in one lane, now need to apply pressure in other lane

**The Punishment:**
- **RW (4-power hero)**: Stranded in wrong lane = devastating
  - High attack wasted (4 power doing nothing)
  - Can't apply pressure where needed
  - Opponent can ignore that lane
  - Game-losing mistake
- **UB (2-power hero)**: Stranded in wrong lane = less punishing
  - Low attack anyway (2 power not critical)
  - Can still cast spells from any lane
  - Less game-impacting mistake

**Why This Matters:**
- **Stats matter more for combat decks**: High-attack heroes need to be in the right place
- **Spells are more flexible**: Can cast from any lane, less positioning-dependent
- **Creates skill expression**: Better players position combat heroes correctly
- **Punishes mistakes**: Wrong positioning is more costly for RW than UB

**The Decision (Post-Tower Destruction):**
- **Option A**: Focus on destroying second tower
  - Benefit: Can then deal more damage to nexus
  - Cost: Need to apply pressure in other lane
  - Risk: Heroes in wrong lane can't help
- **Option B**: Deal damage to nexus now
  - Benefit: Apply immediate pressure
  - Cost: Less efficient (both towers still up)
  - Risk: Opponent can stabilize

**Why It's Interesting:**
- Tests understanding of win condition
- Tests positioning (where to deploy heroes)
- Tests resource management (pressure vs efficiency)
- Better players balance these correctly
- **This is where RW skill shows**: Positioning combat heroes correctly matters more than positioning spell heroes

**Future Implementation:**
- This dynamic becomes more relevant when towers are destroyed
- Need to balance: destroy both towers (more nexus damage) vs destroy one tower (immediate pressure)
- Combat-focused heroes (high attack) need to be in the right lane
- Spell-focused heroes (low attack) are more flexible
- Creates meaningful positioning decisions for RW

---

## Artibound Adaptation

### Combat Tricks for RW

**Magic-Style Combat Tricks:**

**1. Pump Spells (2-3 mana, R or W)**
- **Rally Banner** (2 mana, RW): All your units gain +2 attack this turn
- **Combat Surge** (2 mana, R): Target unit gains +3 attack this turn
- **Divine Favor** (2 mana, W): Target unit gains +2/+2 this turn

**2. First Strike / Protection**
- **Swift Strike** (2 mana, R): Target unit gains first strike this turn
- **Divine Shield** (2 mana, W): Target unit can't take damage this turn

**3. Initiative Tricks**
- **Quick Draw** (1 mana, R): Get initiative, target unit gains +1 attack this turn
- **Tactical Advantage** (2 mana, RW): Get initiative, all your units gain +1 attack this turn

**Design Principles:**
- Cheap (1-3 mana) - can leave mana open
- Single/dual color - accessible to RW
- Instant-speed (can cast during combat)
- Create "do I have the answer?" moments

### Positioning Cards

**1. Tower Pressure Cards**
- **Siege Unit** (3 mana, R): Can attack towers directly
- **Tower Focus** (2 mana, R): Target unit can attack tower this turn, +3 attack if opponent has few heroes
- **Direct Assault** (3 mana, RW): Deal 3 damage to target tower

**2. Unit Removal Cards**
- **Execute** (2 mana, R): Deal 3 damage to target unit (if it's damaged, destroy it)
- **Finishing Blow** (3 mana, R): Deal 4 damage to target unit, get 2 gold if it dies
- **Combat Mastery** (2 mana, RW): Target unit gains +2 attack and can attack units this turn

**Design Principles:**
- Reward killing units (gold)
- Reward tower pressure (win condition)
- Create meaningful choices
- Balance risk vs reward

### Timing Cards

**1. AOE Protection**
- **Disperse** (2 mana, W): Return target unit to base (protect from AOE)
- **Tactical Retreat** (1 mana, R): Move target unit to different slot (dodge AOE)
- **Resilient Formation** (3 mana, RW): All your units gain +0/+2 this turn (survive AOE)

**2. Commit Cards**
- **All-In** (3 mana, RW): Deploy 2 units from hand (commit to board)
- **Rush** (2 mana, R): Deploy unit, it gains +2 attack this turn (fast pressure)
- **Overwhelm** (4 mana, RW): Deploy unit, all your units gain +1 attack this turn

**Design Principles:**
- Protect from AOE when needed
- Commit when safe
- Reward good timing
- Create risk/reward decisions

---

## Cards That Create This Dynamic

### For RW (Aggro)

**Combat Tricks:**
- ✅ Pump spells (2-3 mana, R or W)
- ✅ First strike spells (2 mana, R)
- ✅ Initiative tricks (1-2 mana, R)
- [ ] More combat tricks with different effects

**Positioning:**
- ✅ Tower pressure cards
- ✅ Unit removal cards
- [ ] More cards that reward positioning

**Timing:**
- ✅ AOE protection
- ✅ Commit cards
- [ ] More timing-based cards

### For UB/UBG (Control)

**Answers to Combat Tricks:**
- ✅ Removal spells (3 mana, B or U)
- ✅ Combat tricks of their own (invulnerable, stun)
- [ ] More instant-speed answers

**AOE Threats:**
- ✅ Exorcism (8 mana, UBG)
- ✅ Board wipes (6-7 mana, UBG)
- [ ] More AOE options at different mana costs

**Positioning Answers:**
- ✅ Removal to kill units
- ✅ Blockers to protect tower
- [ ] More positioning-based answers

---

## Design Principles for RW Aggro

### 1. Combat Tricks Should:
- Be cheap (1-3 mana) - can leave mana open
- Create "do I have the answer?" moments
- Reward good timing
- Punish bad timing

### 2. Positioning Should:
- Reward going for tower (pressure)
- Reward killing units (gold)
- Create meaningful choices
- Balance risk vs reward

### 3. Timing Should:
- Reward committing at right times
- Reward holding back when needed
- Test prediction and risk assessment
- Create close games

### 4. Overall RW Should:
- Feel aggressive but not mindless
- Require skill to play well
- Create interesting decisions
- Reward good play

---

## Porting Strategy

### From Magic: The Gathering

**Combat Tricks:**
- Giant Growth (+3/+3) → Combat Surge (+3 attack)
- Lightning Bolt (3 damage) → Execute (3 damage, conditional)
- Protection spells → Divine Shield (can't take damage)
- First strike → Swift Strike (first strike this turn)

**Positioning:**
- Direct damage → Tower Focus (attack tower)
- Removal → Execute, Finishing Blow
- Pump spells → Rally Banner, Combat Surge

### From Artifact Foundry

**Positioning:**
- RG positioning cards → Adapt to 2-lane system
- Combat-focused cards → Add combat tricks
- Tower pressure → Keep and enhance

### Adaptation Needed

**2 Lanes vs 3 Lanes:**
- Less natural positioning depth
- Need combat tricks to add depth
- Need timing decisions to add skill
- Need risk/reward decisions

---

## Next Steps

1. **Design combat tricks for RW**
2. **Design positioning cards (tower vs units)**
3. **Design timing cards (commit vs hold)**
4. **Test that RW feels skill-intensive**
5. **Ensure close games feel rewarding**

---

*This mastery moment ensures RW aggro is skill-intensive despite having only 2 lanes.*

