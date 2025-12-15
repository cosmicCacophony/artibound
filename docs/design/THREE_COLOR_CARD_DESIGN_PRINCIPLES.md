# Three-Color Card Design Principles

> **Created:** 2025-01-XX  
> **Last Updated:** 2025-01-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Design principles for 3-color cards based on gameplay testing

## Core Problem: 3-Color Cards at 4-5 Mana

### The Issue

**Problem:** Committing 2-3 heroes to one lane to cast a 3-color card (like Prismatic Shield at 4 mana) doesn't provide enough value to justify the commitment, especially when opponent can just go to the other lane.

**Example:**
- UBG player commits 2 heroes to Lane A to cast Prismatic Shield (4 mana UBG)
- Prismatic Shield: 2/4 body, draws 1 card, gets +0/+2 per color
- This doesn't snowball or create enough pressure
- RW player puts 2 heroes in Lane B (War Captain 7 attack, Valiant Commander 4 attack)
- UBG can't win the race in Lane B

### Design Principle

**3-Color cards at 4-5 mana should NOT be designed as early game plays.**

Instead, they should be:
1. **Reactive and Strong** - Powerful answers that justify the commitment
2. **Generate Card Advantage** - Draw cards or create value to offset tempo loss
3. **Create Board Presence** - Generate multiple bodies or significant threats
4. **Cross-Lane Interaction** - Can affect other lanes to prevent opponent from ignoring your commitment

---

## Design Solutions

### Solution 1: Make 3-Color Cards Reactive

**Current Problem:** Prismatic Shield is a proactive play (deploy a body) that doesn't create enough value.

**Better Design:** Make 3-color cards at 4-5 mana reactive answers.

**Example: Prismatic Shield Redesign**
- **Current:** 4 mana UBG, 2/4 body, draw 1 card, +0/+2 per color
- **Redesign Option A (Reactive):** 4 mana UBG spell - "Destroy target unit. Draw 2 cards."
- **Redesign Option B (Reactive + Board):** 4 mana UBG spell - "Destroy target unit. Create two 2/2 units. Draw a card."

**Why This Works:**
- Reactive cards are played when needed (removal, answers)
- Don't require committing to a lane early
- Generate card advantage to offset tempo loss
- Can be held until the right moment

### Solution 2: Generate Significant Card Advantage

**Current Problem:** Drawing 1 card isn't enough to justify committing 2 heroes.

**Better Design:** 3-color cards should generate 2+ cards of value.

**Example: Prismatic Shield Redesign**
- **Current:** 4 mana UBG, 2/4 body, draw 1 card
- **Redesign:** 4 mana UBG spell - "Draw 3 cards. Discard 1 card."
- **Alternative:** 4 mana UBG spell - "Draw 2 cards. Create a 2/2 unit."

**Why This Works:**
- Card advantage offsets tempo loss
- Can find answers to opponent's threats
- Doesn't require committing to a specific lane early
- Flexible timing

### Solution 3: Create Multiple Bodies

**Current Problem:** Single 2/4 body doesn't create enough pressure.

**Better Design:** 3-color cards should create 2+ bodies or significant board presence.

**Example: Prismatic Shield Redesign**
- **Current:** 4 mana UBG, 2/4 body, draw 1 card
- **Redesign:** 4 mana UBG spell - "Create two 3/3 units. Draw a card."
- **Alternative:** 4 mana UBG spell - "Create a 2/4 unit and a 2/2 unit. Draw a card."

**Why This Works:**
- Multiple bodies create more pressure
- Harder for opponent to ignore
- Can help race in the lane you committed to
- Still generates card advantage

### Solution 4: Cross-Lane Interaction

**Current Problem:** Opponent can just go to the other lane and ignore your commitment.

**Better Design:** Add cards that can interact with other lanes.

**Example: Sacred Arrow (Inspired by Artifact Foundry)**
- **Design:** 3 mana UB spell - "Deal 3 damage to target unit in any lane. Stun it this turn."
- **Why This Works:**
  - Can stop opponent's 7-attack hero from dealing damage for 1 turn
  - Weakens threats so you can handle them later
  - Doesn't require committing heroes to that lane
  - Creates tempo advantage

**Example: Cross-Lane Removal**
- **Design:** 4 mana UBG spell - "Destroy target unit in any lane. Draw a card."
- **Why This Works:**
  - Can answer threats in lanes you're not committed to
  - Generates card advantage
  - Flexible positioning

---

## Revised Design Principles

### For 3-Color Cards at 4-5 Mana

**Should Be:**
- ✅ Reactive answers (removal, counters, stuns)
- ✅ Generate 2+ cards of value (draw 2+, create bodies)
- ✅ Create multiple bodies (2+ units)
- ✅ Cross-lane interaction (affect other lanes)
- ✅ Flexible timing (can be held until needed)

**Should NOT Be:**
- ❌ Proactive early game plays (deploy a body turn 1-2)
- ❌ Single weak body (2/4, 2/3, etc.)
- ❌ Minimal card advantage (draw 1 card)
- ❌ Lane-locked effects (only affect one lane)
- ❌ Require early commitment (must play turn 1-2)

### For 3-Color Cards at 6-8 Mana

**These can be proactive** because:
- Higher mana cost = later in game = more setup time
- More powerful effects justify the commitment
- Opponent has less time to ignore your commitment
- Examples: Exorcism (8 mana), Verdant Colossus (8 mana)

### For 2-Color Cards at 4-5 Mana

**These can be proactive** because:
- Only require 1-2 heroes (easier to cast)
- Less commitment required
- Can be played in multiple lanes
- Examples: RW combat tricks, UB removal

---

## Specific Card Redesigns

### Prismatic Shield (Current Problem Card)

**Current Design:**
- 4 mana UBG
- 2/4 body
- Draw 1 card
- +0/+2 per color

**Problems:**
- Weak body for the commitment
- Only draws 1 card
- Proactive play that doesn't create enough value
- Opponent can ignore and go to other lane

**Redesign Options:**

#### Option A: Reactive Removal + Card Advantage
```
Prismatic Shield
4 mana UBG (Spell)
Destroy target unit. Draw 2 cards.
```
- Reactive answer
- Generates card advantage
- Flexible timing

#### Option B: Board Creation + Card Advantage
```
Prismatic Shield
4 mana UBG (Spell)
Create two 3/3 units. Draw a card.
```
- Creates multiple bodies
- Generates card advantage
- Creates pressure

#### Option C: Cross-Lane Interaction
```
Prismatic Shield
4 mana UBG (Spell)
Destroy target unit in any lane. Draw a card. Create a 2/2 unit.
```
- Cross-lane interaction
- Generates value
- Creates board presence

**Recommendation:** Option A or B, depending on whether you want removal or board presence.

### New Cards Needed

#### Sacred Arrow (Cross-Lane Interaction)
```
Sacred Arrow
3 mana UB (Spell)
Deal 3 damage to target unit in any lane. Stun it this turn.
```
- Can stop opponent's threats in other lanes
- Doesn't require committing heroes
- Creates tempo advantage
- Inspired by Artifact Foundry

#### Cross-Lane Removal
```
Void Strike
4 mana UBG (Spell)
Destroy target unit in any lane. Draw a card.
```
- Answers threats in lanes you're not committed to
- Generates card advantage
- Flexible positioning

#### Multi-Body Creation
```
Verdant Summoning
5 mana UBG (Spell)
Create two 4/4 units in target battlefield. Draw a card.
```
- Creates significant board presence
- Generates card advantage
- Can help race in committed lane

---

## Testing Considerations

### Questions to Ask

1. **Does this card justify committing 2-3 heroes to one lane?**
   - If no, make it reactive or generate more value

2. **Can opponent ignore this card and go to other lane?**
   - If yes, add cross-lane interaction or make it more impactful

3. **Does this card generate enough value?**
   - 3-color cards should generate 2+ cards of value

4. **Is this card flexible?**
   - Can it be held until needed, or must it be played early?

5. **Does this card create enough pressure?**
   - Single weak body often isn't enough

### Testing Scenarios

**Scenario 1: Early Commitment**
- Turn 1: UBG commits 2 heroes to Lane A, casts 4-mana UBG card
- Turn 1: RW puts 2 heroes in Lane B
- **Question:** Can UBG still win?
- **If no:** Card needs more value or cross-lane interaction

**Scenario 2: Reactive Play**
- Turn 2: RW commits to Lane B
- Turn 2: UBG casts 4-mana UBG reactive card
- **Question:** Does this answer the threat effectively?
- **If yes:** Card is well-designed

**Scenario 3: Cross-Lane Interaction**
- Turn 1: RW puts 7-attack hero in Lane B
- Turn 1: UBG casts cross-lane spell to stun/damage it
- **Question:** Does this prevent the race?
- **If yes:** Card provides needed interaction

---

## Implementation Priority

### High Priority
1. **Redesign Prismatic Shield** - Current design doesn't work
2. **Add cross-lane interaction cards** - Sacred Arrow, cross-lane removal
3. **Test reactive vs proactive** - Ensure 3-color cards at 4-5 mana are reactive

### Medium Priority
1. **Add multi-body creation spells** - Verdant Summoning, etc.
2. **Test card advantage generation** - Ensure 3-color cards generate 2+ cards of value
3. **Balance cross-lane interaction** - Don't make it too powerful

### Low Priority
1. **Review all 3-color cards** - Ensure they follow these principles
2. **Document design patterns** - Create templates for future 3-color cards
3. **Test with different archetypes** - Ensure principles work across matchups

---

*This document should be referenced when designing any 3-color cards, especially at 4-5 mana. The key insight is that 3-color cards require significant commitment and should provide significant value in return.*




