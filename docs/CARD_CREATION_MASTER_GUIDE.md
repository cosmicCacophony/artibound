# Card Creation Master Guide

> **Created:** 2025-12-25  
> **Status:** Active  
> **Relevance:** Core  
> **Purpose:** Complete workflow for creating any card in Artibound

---

## Quick Start: Card Creation Workflow

When creating a card, follow these steps in order:

1. **Identify archetype fit** - Which archetype(s) use this card?
2. **Determine power level** - How powerful is this effect?
3. **Set mana cost** - Based on power level
4. **Apply color + rune requirements** - Based on power level and archetype
5. **Check for counterplay** - Can opponents answer this?
6. **Test vs boss strategies** - Does this help beat bosses?

---

## Step 1: Identify Archetype Fit

### Question: Which archetype uses this card?

**Aggro Archetypes** (1-2 colors):
- **Red Aggro** (R): Direct damage, small aggressive units
- **Red/White** (RW): Go-wide tokens, combat tricks
- Uses: Low-cost units (1-4 mana), burn spells, combat tricks

**Control Archetypes** (2-3 colors):
- **Blue/Black** (UB): Removal, card draw, AOE
- **Green/Blue + Splash** (GU + splash): Ramp, removal, finishers
- Uses: Removal (2-5 mana), AOE (4-6 mana), card draw, finishers (7-9 mana)

**Midrange Archetypes** (3-4 colors):
- **Black-based** (BRG, BGUW): Efficient threats, removal, value
- Uses: Efficient units (3-6 mana), multicolor payoffs, flexible spells

**High-Roll Archetypes** (5 colors):
- **5-Color Goodstuff**: Best cards from all colors
- Uses: Powerful multicolor cards, artifacts, any-color effects

**Design Question:**
- Is this card archetype-specific (only works in one archetype)?
- Or generic (works in multiple archetypes)?

**Examples:**
- ✅ **Legion tribal card** → RW-specific
- ✅ **Spell booster card** → UB-specific
- ✅ **Generic removal** → Works in multiple archetypes

---

## Step 2: Determine Power Level

### Power Level Scale (1-10)

**1-3 (Low Power):**
- Vanilla units (3 mana 2/2)
- Weak removal (deal 2 damage)
- Conditional effects (requires setup)

**4-6 (Medium Power):**
- Efficient units (3 mana 3/3)
- Good removal (destroy target unit)
- Token generators (create 2 units)

**7-9 (High Power):**
- Above-curve units (6 mana 7/7)
- Board wipes (destroy all units)
- Game-changing effects (draw 5 cards)

**10 (Very High Power):**
- Game-winning cards (Time of Triumph)
- Expensive finishers (9+ mana)
- Requires heavy setup (many runes, multiple colors)

---

## Step 3: Updated Power Level → Mana → Color System

### The Core Principle

**More expensive = More colors + More runes required**

| Mana Cost | Color Requirements | Rune Requirements | Power Level | Examples |
|-----------|-------------------|-------------------|-------------|----------|
| **1-2 mana** | Single color | 0-1 rune | Low | Fire Bolt (2R, 1 red rune) |
| **3 mana** | **DUAL color** | **1-2 runes** | Low-Medium | **NEW STANDARD** |
| **4-5 mana** | Dual color | 2-3 runes | Medium | Removal (4UB, 1U + 1B) |
| **6-8 mana** | Triple color | 3-4 runes | High | Exorcism (8UBG) |
| **9+ mana** | Triple+ color | 4+ runes | Very High | Time of Triumph (9RRRR) |

### Key Update: 3-Mana Cards

**Old System:** 3 mana = single color  
**NEW System:** **3 mana = DUAL color with rune costs**

**Why:**
- Forces meaningful deckbuilding choices
- Players can't run every good 3-mana card
- Creates archetype identity
- Balances powerful effects

**Examples:**

**Before (Too Generic):**
```typescript
{
  name: 'Good Removal',
  manaCost: 3,
  colors: ['black'],  // Single color
  // Everyone runs this
}
```

**After (Better):**
```typescript
{
  name: 'Good Removal',
  manaCost: 3,
  colors: ['blue', 'black'],  // Dual color
  consumesRunes: true,
  runeCost: ['blue', 'black'],  // Requires 1U + 1B
  // Only UB decks run this
}
```

---

## Step 4: Rune Cost Design Philosophy

### The Balance: Rune-Heavy vs Generic

**Every deck should have a mix:**
- **30-40% rune-heavy cards** (powerful but risky)
- **60-70% generic cards** (always castable, weaker)

**Rune-Heavy Cards:**
- Require heroes staying alive
- Vulnerable to rune death mechanic
- More powerful for the cost
- Reward bouncing (preserves runes)

**Generic Cards:**
- Always castable (low/no rune cost)
- Don't require heroes alive
- Less powerful
- Safe picks in draft

### When to Add Rune Costs

**Add Rune Costs When:**
- Card is powerful for its mana cost
- Card is archetype-defining
- Card should require commitment
- Card rewards multicolor strategies

**Skip Rune Costs When:**
- Card is generic filler
- Card is early-game (1-2 mana)
- Card is already weak
- Want to ensure always castable

**Examples:**

**Good Rune Cost:**
```typescript
{
  name: 'Exorcism',
  manaCost: 8,
  colors: ['blue', 'black', 'green'],
  consumesRunes: true,
  runeCost: ['blue', 'black', 'green'],  // Requires 1 of each
  // Very powerful, requires all 3 colors + heroes alive
}
```

**Good No Rune Cost:**
```typescript
{
  name: 'Generic Warrior',
  manaCost: 3,
  colors: ['red'],
  attack: 3,
  health: 2,
  // Always castable, not particularly powerful
}
```

---

## Step 5: Heavy Color Requirements (RRRR, WWWW)

### Purpose: Reward Deep Color Commitment

**Use Heavy Requirements For:**
- Archetype-defining finishers
- Color-specific payoffs
- 8-9+ mana cards

**Structure:**
- **RRRR** = 4 red runes required
- **WWWW** = 4 white runes required
- **UUGG** = 2 blue + 2 green required

**Design Implications:**
- Can't splash these cards easily
- Requires 2-3 heroes of that color OR artifacts
- Rewards color commitment
- Creates distinct archetypes

**Examples:**

```typescript
// Heavy Red Commitment
{
  name: 'Time of Triumph',
  manaCost: 9,
  colors: ['red'],
  consumesRunes: true,
  runeCost: ['red', 'red', 'red', 'red'],  // 4 red runes
  // Can't splash this - needs heavy red
}

// Heavy White Commitment
{
  name: 'Divine Wrath',
  manaCost: 5,
  colors: ['white'],
  consumesRunes: true,
  runeCost: ['white', 'white', 'white', 'white'],  // 4 white
  effect: 'Destroy all non-Legion units',
  // Rewards RW Legion archetype
}
```

---

## Step 6: Three-Color Card Design Principles

### The Problem

**3-color cards at 4-5 mana require committing 2-3 heroes to one lane.** If the payoff isn't worth it, opponent just goes to the other lane.

### The Solution

**3-color cards at 4-5 mana MUST be:**

1. **Reactive** (not proactive bodies)
2. **Generate card advantage** (draw 2+, create multiple bodies)
3. **Cross-lane interaction** (affect other lanes)
4. **NOT weak single bodies** (no 2/4 for 4 mana)

### Good Examples

**Reactive Removal + Value:**
```typescript
{
  name: 'Void Strike',
  manaCost: 4,
  colors: ['blue', 'black', 'green'],
  consumesRunes: true,
  runeCost: ['blue', 'black', 'green'],
  effect: 'Destroy target unit in any lane. Draw a card.',
  // Reactive, cross-lane, generates value
}
```

**Multi-Body Creation:**
```typescript
{
  name: 'Verdant Summoning',
  manaCost: 5,
  colors: ['blue', 'black', 'green'],
  consumesRunes: true,
  runeCost: ['blue', 'black', 'green'],
  effect: 'Create two 4/4 units. Draw a card.',
  // Creates pressure, generates value
}
```

### Bad Examples

**Weak Proactive Body:**
```typescript
{
  name: 'Prismatic Shield',  // OLD DESIGN - BAD
  manaCost: 4,
  colors: ['blue', 'black', 'green'],
  attack: 2,
  health: 4,
  effect: 'When this enters, draw 1 card.',
  // Single weak body, minimal value, can be ignored
}
```

### Design Checklist for 3-Color Cards

- [ ] Is this reactive (removal, answer) or proactive (body)?
- [ ] Does this generate 2+ cards of value?
- [ ] Can this affect other lanes?
- [ ] Would committing 2-3 heroes to cast this be worth it?
- [ ] Can opponent just ignore this and go to other lane?

---

## Step 7: Rune Artifact Design

### Types of Rune Artifacts

**Single-Color Generators (3-4 mana):**
- Generate 1 rune per turn (fixed color)
- Enable single-color splash
- Examples: Void Generator (4 mana, 1 blue rune)

**Dual-Color Generators (4-5 mana):**
- Generate 2 runes per turn (fixed colors)
- Enable dual-color splash or strengthen base
- Examples: UB Generator (5 mana, 1U + 1B)

**Flexible Generators (4-5 mana):**
- Generate 1 rune per turn (player chooses)
- Adapt to draft, pivot between colors
- Examples: Adaptive Generator (4 mana, choose 1U OR 1B)

**Any-Color Generators (5-6 mana):**
- Generate 1 rune per turn (any color)
- Maximum flexibility for 3-4 color decks
- Examples: Prismatic Generator (5 mana, any color)

### Archetype Artifact Needs

**Aggro (0-1 artifacts):**
- Generally skip artifacts
- Exception: 1-2 if drafting big finishers

**Control (2-4 artifacts):**
- Need artifacts to enable splashing
- Dual-color + any-color recommended

**Midrange (3-5 artifacts):**
- Essential for 3-4 color strategies
- Multiple dual-color + any-color

**5-Color (4-6 artifacts):**
- Maximum artifacts
- Mostly any-color and flexible

### Design Template

```typescript
// Single-Color Artifact
{
  id: 'red-generator',
  name: 'Red Seal',
  cardType: 'artifact',
  colors: ['red'],
  manaCost: 3,
  effectType: 'rune_generation',
  effectValue: 1,  // 1 red rune per turn
}

// Any-Color Artifact
{
  id: 'prismatic-generator',
  name: 'Prismatic Generator',
  cardType: 'artifact',
  colors: [],  // Colorless
  manaCost: 5,
  effectType: 'rune_generation',
  effectValue: 1,
  anyColor: true,  // Player chooses color each turn
}
```

---

## Step 8: Counterplay Checklist

### Every Card Should Have Counterplay

**Question:** Can opponents answer this card?

**Good Counterplay:**
- Removal answers big creatures
- Board wipes answer token strategies
- Protection answers removal
- Bouncing answers buffs

**Bad (No Counterplay):**
- Unstoppable combos
- Un-answerable threats
- Cards that win if unchecked

### Examples

**Good (Has Counterplay):**
```typescript
{
  name: 'Big Threat',
  attack: 7,
  health: 7,
  // Counterplay: Removal spells, chump blocking, bouncing
}
```

**Bad (No Counterplay):**
```typescript
{
  name: 'Invincible Combo',
  effect: 'You cannot lose the game. Win next turn.',
  // No counterplay = bad design
}
```

---

## Step 9: Common Patterns & Examples

### Pattern 1: Removal Spells

**Low-Cost Removal (2-3 mana):**
```typescript
{
  name: 'Shadow Kill',
  cardType: 'spell',
  manaCost: 2,
  colors: ['black'],
  consumesRunes: true,
  runeCost: ['black'],
  effect: 'Deal 3 damage to target unit.',
  rarity: 'common',
}
```

**Medium Removal (4-5 mana):**
```typescript
{
  name: 'Destroy',
  cardType: 'spell',
  manaCost: 4,
  colors: ['black'],
  consumesRunes: true,
  runeCost: ['black', 'black'],  // Requires 2 black
  effect: 'Destroy target unit.',
  rarity: 'uncommon',
}
```

### Pattern 2: Board Wipes

**Single-Lane AOE (4-6 mana):**
```typescript
{
  name: 'Thunderstorm',
  cardType: 'spell',
  manaCost: 4,
  colors: ['blue'],
  consumesRunes: true,
  runeCost: ['blue', 'blue'],
  effect: 'Deal 3 damage to all enemy units in target battlefield.',
  rarity: 'uncommon',
}
```

**Multi-Lane AOE (6-8 mana):**
```typescript
{
  name: 'Exorcism',
  cardType: 'spell',
  manaCost: 8,
  colors: ['blue', 'black', 'green'],
  consumesRunes: true,
  runeCost: ['blue', 'black', 'green'],
  effect: 'Deal 12 damage distributed among all units and towers.',
  rarity: 'rare',
}
```

### Pattern 3: Token Generators

**Small Tokens (2-3 mana):**
```typescript
{
  name: 'Legion Call',
  cardType: 'spell',
  manaCost: 3,
  colors: ['red', 'white'],
  consumesRunes: true,
  runeCost: ['red', 'white'],
  effect: 'Create two 1/1 Legion tokens.',
  rarity: 'common',
}
```

**Big Tokens (5-6 mana):**
```typescript
{
  name: 'Verdant Summoning',
  cardType: 'spell',
  manaCost: 5,
  colors: ['green', 'blue', 'black'],
  consumesRunes: true,
  runeCost: ['green', 'blue', 'black'],
  effect: 'Create two 4/4 units.',
  rarity: 'uncommon',
}
```

### Pattern 4: Combat Tricks

**Low-Cost Buffs (1-2 mana):**
```typescript
{
  name: 'Battle Rage',
  cardType: 'spell',
  manaCost: 2,
  colors: ['red'],
  consumesRunes: true,
  runeCost: ['red'],
  effect: 'Target unit gains +3/+0 until end of turn.',
  rarity: 'common',
}
```

**Protection (2-3 mana):**
```typescript
{
  name: 'Invulnerable',
  cardType: 'spell',
  manaCost: 2,
  colors: ['white'],
  consumesRunes: true,
  runeCost: ['white'],
  effect: 'Target hero gains invulnerable this turn. Reflect damage.',
  rarity: 'uncommon',
}
```

### Pattern 5: Finishers

**Big Damage (7-9 mana):**
```typescript
{
  name: 'Time of Triumph',
  cardType: 'spell',
  manaCost: 9,
  colors: ['red'],
  consumesRunes: true,
  runeCost: ['red', 'red', 'red', 'red'],  // 4 red
  effect: 'All your units gain +3/+3. Draw a card for each unit.',
  rarity: 'rare',
}
```

### Pattern 6: Card Draw

**Cheap Cantrips (2-3 mana):**
```typescript
{
  name: 'Arcane Insight',
  cardType: 'spell',
  manaCost: 2,
  colors: ['blue'],
  consumesRunes: true,
  runeCost: ['blue'],
  effect: 'Draw 2 cards.',
  rarity: 'common',
}
```

**Big Draw (5-6 mana):**
```typescript
{
  name: 'Deep Research',
  cardType: 'spell',
  manaCost: 5,
  colors: ['blue', 'black'],
  consumesRunes: true,
  runeCost: ['blue', 'blue', 'black'],
  effect: 'Draw 5 cards. Discard 2 cards.',
  rarity: 'rare',
}
```

---

## Step 10: Rune Death Mechanic Considerations

### Design With Death in Mind

**The Mechanic** (Not yet implemented, but design for it):
- Heroes dying → Lose their runes
- Heroes bounced → Keep their runes

**Card Design Questions:**

1. **How does this card interact with hero deaths?**
   - Does it require many runes? (More vulnerable)
   - Does it help keep heroes alive? (More valuable)

2. **Should this encourage bouncing?**
   - Does it protect heroes?
   - Does it reward preserving runes?

3. **Is this a "safe" card or "risky" card?**
   - Safe: Low rune cost, always castable
   - Risky: High rune cost, powerful but vulnerable

**Examples:**

**Risky Card (Rewards Keeping Heroes Alive):**
```typescript
{
  name: 'Exorcism',
  manaCost: 8,
  runeCost: ['blue', 'black', 'green'],  // Needs 3 heroes alive
  // If heroes die, can't cast this
}
```

**Safe Card (Always Castable):**
```typescript
{
  name: 'Generic Warrior',
  manaCost: 3,
  colors: ['red'],
  // No rune cost = always castable
}
```

**Bouncing Support Card:**
```typescript
{
  name: 'Tactical Retreat',
  manaCost: 2,
  effect: 'Return target hero to base. It can be deployed next turn for free.',
  // Helps preserve runes by bouncing heroes before death
}
```

---

## Boss Testing Checklist

### Test Against RW Legion Boss

When creating a card, ask:

1. **Does this help beat the boss?**
   - Answers tokens?
   - Clears board?
   - Protects towers?

2. **Does this enable a viable strategy?**
   - Enables control?
   - Enables ramp?
   - Enables combo?

3. **Is this too weak vs aggro?**
   - Too slow?
   - Too expensive?
   - Requires too much setup?

**Good vs RW Boss:**
- Board wipes (Exorcism, Thunderstorm)
- Early removal (Shadow Kill, Terminate)
- Tower protection (healing, shields)
- Efficient blockers (3/3 for 3)

**Bad vs RW Boss:**
- Slow ramp (too late)
- Expensive finishers without board control
- Cards that don't affect board

---

## File Locations

**Card Definitions:**
- `src/game/comprehensiveCardData.ts` - All card definitions

**Type Definitions:**
- `src/game/types.ts` - Card types, effects, etc.

**Systems:**
- `src/game/runeSystem.ts` - Rune generation and consumption
- `src/game/draftSystem.ts` - Archetype matching

---

## Common Mistakes to Avoid

### ❌ Don't: Forget Rune Costs on Powerful Cards
```typescript
// BAD - Too powerful without rune cost
{
  name: 'Board Wipe',
  manaCost: 4,
  colors: ['blue'],
  // Should require runes!
}
```

### ❌ Don't: Make 3-Mana Cards Single-Color
```typescript
// BAD - Should be dual-color
{
  name: 'Good Removal',
  manaCost: 3,
  colors: ['black'],  // Should be ['blue', 'black']
}
```

### ❌ Don't: Create Weak 3-Color 4-5 Mana Cards
```typescript
// BAD - Not worth the commitment
{
  name: 'Weak Body',
  manaCost: 4,
  colors: ['blue', 'black', 'green'],
  attack: 2,
  health: 4,
  // Should be reactive or generate value
}
```

### ❌ Don't: Design Without Counterplay
```typescript
// BAD - No counterplay
{
  name: 'Auto-Win',
  effect: 'You win the game next turn.',
  // Needs counterplay options
}
```

### ✅ Do: Balance Rune-Heavy and Generic
- 30-40% rune-heavy
- 60-70% generic
- Mix in every deck

### ✅ Do: Test Against Boss
- Does this help beat RW Legion?
- Does this enable strategies?

### ✅ Do: Consider Rune Death Mechanic
- High rune cost = risky but powerful
- Low rune cost = safe but weaker

---

## Quick Reference: Mana → Color → Runes

| Mana | Colors | Runes | Power | Example |
|------|--------|-------|-------|---------|
| 1-2 | 1 color | 0-1 | Low | Fire Bolt (2R, 1 red) |
| 3 | **2 colors** | **1-2** | Med | **NEW STANDARD** |
| 4-5 | 2 colors | 2-3 | Med | Removal (4UB, 1U+1B) |
| 6-8 | 3 colors | 3-4 | High | Exorcism (8UBG) |
| 9+ | 3+ colors | 4+ | V.High | Time of Triumph (9RRRR) |

---

## Related Documents

### Philosophy
- `docs/DESIGN_PHILOSOPHY_GUIDE.md` - Core design philosophy (companion to this doc)

### Archetypes
- `docs/ARCHETYPE_DESIGN_GUIDE.md` - All archetypes (companion to this doc)

### Specific Designs
- `docs/design/THREE_COLOR_CARD_DESIGN_PRINCIPLES.md` - 3-color specifics
- `docs/design/RUNE_ARTIFACT_DESIGN.md` - Rune artifacts
- `docs/design/RUNE_TENSION_DESIGN.md` - Rune tension
- `docs/design/ARTIFACT_CARD_ANALYSIS.md` - Artifact Foundry analysis

---

*This guide provides the complete workflow for creating cards in Artibound. When in doubt, refer to the design philosophy and test against the boss.*



