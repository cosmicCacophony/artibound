# Fast Testing & Design Workflow

## Overview

This document addresses three key questions:
1. **How to make playtesting faster and less tedious**
2. **How diagrams/concepts improve card suggestions**
3. **Power level → Color requirements system**

---

## 1. Faster Playtesting Approaches

### A. Scenario-Based Testing (Instead of Full Games)

**Problem**: Full games take 30-45 minutes and test everything at once.

**Solution**: Test specific scenarios that answer specific questions.

#### Example: Exorcism Scenario Testing
Instead of playing a full game to see if Exorcism is balanced:
1. **Set up a specific board state** (like in `EXORCISM_BOARD_STATES.md`)
2. **Test just that interaction** (5-10 minutes)
3. **Document the outcome**
4. **Move on to next scenario**

**Tools Needed:**
- Game state save/load (you already have this!)
- Pre-built scenario templates
- Quick reset functionality

#### Scenario Templates to Create:

**Early Game Scenarios:**
- Turn 1-3: RW pressure vs UB defense
- Turn 3-5: Mana efficiency decisions
- Turn 5-7: Mid-game positioning

**Card Interaction Scenarios:**
- Exorcism positioning (already done!)
- Bounce timing decisions
- Combat positioning
- Item purchase decisions

**Archetype Matchup Scenarios:**
- RW all-in vs UB control
- UB card advantage vs RW tempo
- Late game win conditions

### B. Automated/Simulated Testing

**Create Test Scenarios with Fixed Outcomes:**

```typescript
// Example: Test Exorcism damage distribution
const testScenario = {
  battlefieldA: {
    player1: [/* RW heroes in specific slots */],
    player2: [/* UBG hero in slot 2 */]
  },
  player2Hand: [/* Exorcism card */],
  // ... other state
}

// Run test, check if damage matches expected
```

**Benefits:**
- Test 10 scenarios in the time of 1 full game
- Reproducible results
- Can test edge cases quickly

### C. Focused Testing Sessions

**Instead of**: "Let's play a full game and see what happens"

**Do**: "Let's test if RW can win if it goes all-in on Battlefield A"

**Structure:**
1. **Set up the scenario** (use save state or quick setup)
2. **Play 3-5 turns** focused on that question
3. **Document result**
4. **Move to next question**

**Example Questions:**
- "Can RW win if it focuses one battlefield?"
- "Can UB stabilize against perfect RW start?"
- "Is Exorcism balanced at 8 mana?"
- "Do bounce decisions feel meaningful?"

### D. Use Save States Strategically

**You already have save/load!** Use it more:

1. **Save at key decision points**
   - Before casting Exorcism
   - Before combat phase
   - Before item purchase

2. **Replay scenarios with different choices**
   - "What if I bounce here instead?"
   - "What if I deploy to slot 3 instead of slot 1?"

3. **Compare outcomes**
   - Which choice was better?
   - Was the decision meaningful?

### E. Create "Test Mode" Features

**Quick Setup Options:**
- Set specific mana amounts
- Set specific hand contents
- Set specific board states
- Skip to specific turn numbers

**Example UI:**
```
[Test Mode]
- Set Mana: P1 [3] P2 [8]
- Set Turn: [5]
- Load Scenario: [Exorcism Test] [Bounce Test] [Combat Test]
- Quick Reset: [Reset to Turn 1]
```

### F. Documentation Templates

**Quick Test Template:**
```
## Test: [Scenario Name]
**Question**: [What are you testing?]
**Setup**: [Board state, mana, hands]
**Result**: [What happened?]
**Verdict**: [Works / Needs adjustment / Broken]
**Time**: [5 minutes]
```

**Benefits:**
- Fast to fill out
- Easy to review later
- Can test many scenarios quickly

---

## 2. Diagrams & Concepts → Better Card Suggestions

### Yes, Absolutely!

**Why diagrams help:**

1. **Visual Power Curves**
   - Show mana cost vs power level
   - Identify gaps in your curve
   - See where cards should be

2. **Archetype Identity**
   - Clear visual of what each archetype does
   - See synergies and patterns
   - Identify missing pieces

3. **Counterplay Relationships**
   - Visual map of how cards interact
   - See which cards counter which strategies
   - Identify missing counterplay

4. **Synergy Patterns**
   - See how cards work together
   - Identify combo potential
   - Find missing synergy pieces

### What to Create:

#### A. Power Curve Diagrams

**Mana Cost vs Power Level:**
```
Mana:  1  2  3  4  5  6  7  8  9
Power: ▁  ▂  ▃  ▅  ▆  ▇  █  █  █
       (Single color cards)
       
Mana:  1  2  3  4  5  6  7  8  9
Power: ▁  ▁  ▂  ▃  ▅  ▆  ▇  █  █
       (Multicolor cards - weaker early, stronger late)
```

**Shows:**
- Where you need more cards
- Power level expectations
- Mana curve gaps

#### B. Archetype Identity Diagrams

**RW (Aggro) Identity:**
```
Early Game:  ████████ (Strong)
Mid Game:    ██████░░ (Moderate)
Late Game:   ████░░░░ (Weak)

Focus: Tempo, Pressure, Board Presence
Weakness: Card Advantage, Late Game
```

**UBG (Control) Identity:**
```
Early Game:  ██░░░░░░ (Weak)
Mid Game:    ██████░░ (Moderate)
Late Game:   ████████ (Strong)

Focus: Card Advantage, Removal, Value
Weakness: Early Pressure, Tempo
```

**Shows:**
- What each archetype should do
- Where cards should fit
- What's missing

#### C. Synergy Maps

**Example: RW Legion Synergy**
```
Bronze Legionnaire (2 mana)
    ↓
Imperial Herald (3 mana) - Buffs all Legion
    ↓
Legion Standard Bearer (3 mana) - More buffs
    ↓
Rally Banner (3 mana) - Team pump
```

**Shows:**
- How cards work together
- Missing synergy pieces
- Where to add cards

#### D. Counterplay Matrix

**Example:**
```
RW Strategy          →  UBG Counter
Go-wide (Legion)     →  AOE spells (Exorcism)
Tower pressure       →  Removal + blockers
Early aggression     →  Defensive units + healing
```

**Shows:**
- What counters what
- Missing counterplay options
- Balance relationships

### How This Helps Card Suggestions:

**With diagrams, I can:**
1. **Identify gaps** - "You need a 4-mana RW unit here"
2. **Suggest appropriate power** - "This should be 3/4, not 4/4, based on your curve"
3. **Suggest synergies** - "This card would work well with your Legion strategy"
4. **Suggest counterplay** - "UBG needs a card that counters this RW strategy"
5. **Maintain balance** - "This is too strong for 3 mana, should be 4 or multicolor"

**Without diagrams, I'm guessing:**
- What power level is appropriate
- What your archetypes need
- What's missing
- What's balanced

---

## 3. Power Level → Color Requirements System

### Design Principle

**Lower Mana = Single Color (Less Powerful, Easier to Cast)**
- 1-3 mana: Single color (R, B, U, W, G)
- 4-5 mana: Dual color (RW, UB, etc.)
- 6-8 mana: Triple color (UBG, RWG, etc.)
- 9+ mana: Triple color or special (very powerful)

**Rationale:**
- Early game: Need cards you can cast with any hero
- Mid game: Can afford to bounce/position for colors
- Late game: Powerful effects justify setup cost

### Process: Artifact Foundry → Artibound

#### Step 1: Categorize Artifact Foundry Cards

**Create a spreadsheet or document:**

| Card Name | Mana | Power Level | Artibound Design |
|-----------|------|-------------|------------------|
| Bronze Legionnaire | 2 | Low | Single color (R or W) |
| Culling Blade | 2 | Medium | Single color (R) |
| Exorcism | 8 | High | Triple color (UBG) |
| ... | ... | ... | ... |

#### Step 2: Power Level Ratings

**Rate each card:**
- **Low**: Basic effect, fair stats
- **Medium**: Good effect, above-average stats
- **High**: Powerful effect, game-changing
- **Very High**: Win condition, extremely powerful

#### Step 3: Assign Color Requirements

**Based on power level and mana:**

**Low Power (1-3 mana):**
- Single color
- Easy to cast early
- Basic effects

**Medium Power (4-5 mana):**
- Dual color
- Requires some setup
- Good effects

**High Power (6-8 mana):**
- Triple color
- Requires positioning/bouncing
- Powerful effects

**Very High Power (9+ mana):**
- Triple color or special
- Requires significant setup
- Game-changing effects

#### Step 4: Adjust for Mana Cost

**Even within power levels, consider mana:**

**Low Power, 1-2 mana:**
- Single color
- Very basic effects
- Easy to cast turn 1-2

**Low Power, 3 mana:**
- Single color OR dual color
- Slightly better effects
- Can cast turn 3-4

**Medium Power, 4 mana:**
- Dual color
- Good effects
- Requires 2 colors

**Medium Power, 5 mana:**
- Dual color OR triple color
- Very good effects
- May require 3 colors

**High Power, 6-7 mana:**
- Triple color
- Powerful effects
- Requires setup

**High Power, 8 mana:**
- Triple color
- Very powerful effects
- Exorcism-level power

### Example: Artifact Foundry Card Analysis

**You provide:**
```
Culling Blade (2 mana) - High power
Bronze Legionnaire (2 mana) - Low power
Exorcism (8 mana) - Very High power
Thunderstorm (3 mana) - Medium power
```

**I suggest:**
```
Culling Blade (2 mana, High power)
→ Artibound: 3 mana, Single color (R)
  (High power but low mana = slightly higher cost, still single color)

Bronze Legionnaire (2 mana, Low power)
→ Artibound: 2 mana, Single color (R or W)
  (Low power, low mana = keep cheap, single color)

Exorcism (8 mana, Very High power)
→ Artibound: 8 mana, Triple color (UBG)
  (Very high power = triple color requirement)

Thunderstorm (3 mana, Medium power)
→ Artibound: 3 mana, Single color (U) OR 4 mana, Dual color (UB)
  (Medium power at 3 mana = could be single or dual)
```

### Template for Card Analysis

**Create a document with this format:**

```markdown
## Artifact Foundry → Artibound Card Conversion

### Low Power Cards (Single Color, 1-3 Mana)

| Artifact Card | Mana | Effect | Artibound Design |
|---------------|------|--------|------------------|
| Bronze Legionnaire | 2 | 2/2, Legion, +1 attack on attack | 2 mana, R or W, 2/2 or 2/3 |
| ... | ... | ... | ... |

### Medium Power Cards (Dual Color, 4-5 Mana)

| Artifact Card | Mana | Effect | Artibound Design |
|---------------|------|--------|------------------|
| ... | ... | ... | ... |

### High Power Cards (Triple Color, 6-8 Mana)

| Artifact Card | Mana | Effect | Artibound Design |
|---------------|------|--------|------------------|
| Exorcism | 8 | 12 damage distributed | 8 mana, UBG, same effect |
| ... | ... | ... | ... |
```

### Benefits of This System

1. **Systematic approach** - No guessing about color requirements
2. **Balanced by design** - Lower mana = easier to cast = less powerful
3. **Clear guidelines** - Know where cards should go
4. **Scalable** - Works for any number of cards

---

## Combined Workflow

### Recommended Process:

1. **Create power curve diagrams** (1-2 hours)
   - Shows where cards should be
   - Identifies gaps

2. **Analyze Artifact Foundry cards** (2-3 hours)
   - Rate power levels
   - Assign color requirements
   - Create conversion table

3. **Create archetype identity diagrams** (1 hour)
   - Shows what each archetype needs
   - Identifies missing pieces

4. **Test scenarios, not full games** (ongoing)
   - Focus on specific questions
   - Use save states
   - Document quickly

5. **Iterate based on diagrams + testing** (ongoing)
   - Diagrams guide what to test
   - Testing validates diagrams
   - Adjust both as needed

---

## Quick Start Checklist

### For Faster Testing:
- [ ] Create 5-10 scenario templates
- [ ] Use save states at key decision points
- [ ] Test specific questions, not full games
- [ ] Document with quick templates

### For Better Card Suggestions:
- [ ] Create power curve diagram
- [ ] Create archetype identity diagrams
- [ ] Create synergy maps
- [ ] Create counterplay matrix

### For Power Level → Color System:
- [ ] List Artifact Foundry cards with power ratings
- [ ] Create conversion table
- [ ] Apply system to new cards
- [ ] Adjust based on testing

---

## Example: Complete Workflow

**Step 1: Create Power Curve**
```
I see you need a 4-mana RW card here.
Based on your curve, it should be 3/4 or 4/3.
```

**Step 2: Analyze Artifact Card**
```
You rated "War Banner" as Medium power, 3 mana.
Since it's Medium power, I suggest: 4 mana, RW (dual color).
Or keep at 3 mana but make it slightly weaker.
```

**Step 3: Test Scenario**
```
Test: "Can RW win with War Banner on turn 4?"
Setup: Turn 4, 4 mana, War Banner in hand, 2 RW heroes on board.
Result: [Your test result]
```

**Step 4: Iterate**
```
Based on test: War Banner at 4 mana feels too slow.
Adjust to: 3 mana, RW, slightly weaker effect.
Test again.
```

---

*This workflow makes testing faster, design more systematic, and card suggestions more accurate.*

