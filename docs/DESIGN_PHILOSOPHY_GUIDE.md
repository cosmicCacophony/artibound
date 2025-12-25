# Artibound Design Philosophy Guide

> **Created:** 2025-12-25  
> **Status:** Active  
> **Relevance:** Core  
> **Purpose:** The "why" behind Artibound's design - what makes it unique and how to think about the game

---

## Core Game Vision

**Artibound is a PVE roguelike deckbuilding card game** where you:
1. **Draft a full deck** at the start to face a boss
2. **Build multicolor decks** (3-4 colors) enabled by strategic hero management
3. **Master the rune death mechanic** - keep heroes alive or lose access to powerful spells
4. **Bounce heroes tactically** to preserve runes and enable spell casting
5. **Beat increasingly difficult bosses** with your drafted strategy

**Target Experience:** Strategic deckbuilding with meaningful decisions about resource management, positioning, and when to commit heroes vs. keep them safe.

---

## What Makes Artibound Unique

### 1. Full Draft at Start
**Unlike Slay the Spire** (which adds cards progressively), Artibound has you **draft your entire deck before facing the boss**.

**Why This Matters:**
- **Upfront commitment** - You lock into an archetype early
- **Intentional synergy** - Build around specific strategies
- **Counterdraft opportunities** - Adapt your draft to counter the boss
- **High-skill deckbuilding** - Requires understanding archetypes and synergies

### 2. Two-Battlefield System
**Two battlefields (A and B)**, each with:
- **4 hero slots** (where you deploy heroes)
- **20 HP tower** (damage this to 0 to win)
- **Simultaneous combat** - Both battlefields fight each turn

**Why This Matters:**
- **Fewer lanes than Artifact Foundry** (2 vs 3) makes multicolor MORE viable
- **Hero rotation is essential** - You must move heroes between lanes
- **Strategic positioning** - Where you deploy matters
- **Bouncing is a core mechanic** - Not just an advanced trick

### 3. Rune Death Mechanic ⚡ (HIGH PRIORITY)

**The Core Tension:**

**How Runes Work:**
- **Heroes generate runes** when deployed (1 rune per color)
- **Powerful spells require runes** to cast (e.g., 3BB = 3 mana + 2 black runes)
- **Artifacts generate bonus runes** for splashing colors

**The Death Mechanic** (Not yet implemented, but CRITICAL):
- **When a hero DIES, you LOSE their runes**
- **When you BOUNCE a hero, you KEEP their runes**
- Creates massive incentive to bounce before death
- Powerful rune-heavy cards become high-risk if heroes die

**Design Implications:**
```
Example Scenario:
- You have 3 heroes deployed: UU, BB, GG (2 blue, 2 black, 2 green runes)
- You want to cast Exorcism (8 mana, requires UBG = 1 blue, 1 black, 1 green rune)
- Enemy threatens to kill your UU hero
- 
If UU dies → You lose 2 blue runes → Can't cast Exorcism
If you bounce UU → You keep the runes → Can still cast Exorcism next turn
```

**The Push-Pull:**
- **Powerful rune-heavy cards** are amazing if heroes stay alive
- **Generic low-rune cards** are always castable but weaker
- Players must balance their deck between these extremes

### 4. Bouncing Philosophy

**Bouncing** = Deploying a hero on top of another hero in the same slot, returning the original hero to base.

**Why Bounce?**

1. **Preserve Runes** (Most Important with Death Mechanic)
   - Hero about to die → Bounce before death → Keep runes
   - Makes powerful rune spells reliable

2. **Enable Spell Casting**
   - Need Blue runes in Lane B → Bounce Blue hero from Lane A → Redeploy next turn

3. **Protect Heroes**
   - Damaged hero → Bounce to base to heal
   - Avoid 2-turn death cooldown

4. **Deny Gold**
   - Opponent gets gold for kills → Bounce denies this

**The Cost of Bouncing:**
- **Tempo loss** - Hero out for 1 turn
- **Mana investment** - Must pay deployment cost again
- **Less damage** - Fewer heroes = less tower damage

**The Balance:**
- Bounce too much → Aggro decks run you over
- Bounce too little → Heroes die, lose runes, can't cast powerful spells

---

## The Rune System (Detailed)

### How Runes Enable Multicolor

**Base Rune Generation:**
- Each hero generates **1 rune per color** when deployed
- Examples:
  - Red hero (R) → 1 red rune
  - Blue/Black hero (UB) → 1 blue rune + 1 black rune
  - Green/Blue/Black hero (GUB) → 1 green + 1 blue + 1 black rune

**Artifact Rune Generation:**
- **Single-color artifacts** (3-4 mana): Generate 1 rune per turn
- **Dual-color artifacts** (4-5 mana): Generate 2 runes per turn
- **Flexible artifacts** (4-5 mana): Generate 1 rune (player chooses color)
- **Any-color artifacts** (5-6 mana): Generate 1 rune of any color

**Rune Persistence:**
- Runes persist **while hero is deployed**
- **Hero dies → Lose runes** (once implemented)
- **Hero bounced → Keep runes** (preserve them)
- Temporary runes (from spells) clear at end of turn

### Rune Requirements in Spells

**Why Rune Costs Exist:**
- Create meaningful deckbuilding choices
- Reward keeping heroes alive
- Make bouncing strategically valuable
- Force commitment to colors

**Examples:**
- **Low Rune Cost** (2B): 2 mana + 1 black rune - Easy to cast
- **Medium Rune Cost** (4UB): 4 mana + 1 blue + 1 black - Requires 2 colors
- **High Rune Cost** (8UBBG): 8 mana + 1 blue + 2 black + 1 green - Requires 3 colors + multiple black

**Design Tension:**
- **Rune-heavy decks**: Powerful but vulnerable to hero deaths, need artifacts
- **Generic decks**: Always castable but less powerful
- **Balanced decks**: Mix of both (recommended)

---

## Color Requirements Philosophy

### Updated Mana → Color System

**The Principle:** More expensive = more colors required.

| Mana Cost | Color Requirements | Rune Requirements | Example |
|-----------|-------------------|-------------------|---------|
| **1-2 mana** | Single color | 0-1 rune | Fire Bolt (2R): 2 mana, 1 red rune |
| **3 mana** | **Dual color** | 1-2 runes | NEW STANDARD - Force meaningful choices |
| **4-5 mana** | Dual color | 2-3 runes | Removal (4UB): 4 mana, 1 blue + 1 black |
| **6-8 mana** | Triple color | 3-4 runes | Exorcism (8UBG): 8 mana, 1 each color |
| **9+ mana** | Triple+ color | 4+ runes | Time of Triumph (9RRRR): 9 mana, 4 red |

**Key Update:** More 3-mana cards should be **dual-color with rune costs** to force players to choose carefully which spells they want, rather than always having perfect answers.

### Heavy Color Requirements (RRRR, WWWW)

**Purpose:** Reward deep color commitment

**Examples:**
- **Time of Triumph** (9RRRR): 9 mana + 4 red runes - Requires heavy red
- **Legion's Charge** (4RRRR): 4 mana + 4 red runes - Red finisher
- **Divine Wrath** (5WWWW): 5 mana + 4 white runes - White board wipe

**Why This Works:**
- Prevents "goodstuff" decks that splash everything
- Creates distinct archetype identities
- Requires artifacts to enable (can't just rely on heroes)

---

## Multicolor Design (3-4 Color Decks)

### Why Multicolor Is The Goal

**Artibound is designed for 3-4 color decks** because:
1. **2 battlefields make it viable** (fewer lanes than Artifact Foundry)
2. **Bouncing is encouraged** (preserves runes, enables positioning)
3. **Powerful multicolor spells exist** (Exorcism, etc.)
4. **Artifacts enable splashing** (generate bonus runes)

### Archetype Color Ranges

**Aggro Archetypes:**
- **1-2 colors** (Mono Red, RW)
- Minimal bouncing, maximal pressure
- Few artifacts (0-1)

**Control Archetypes:**
- **2-3 colors** (UB, GU + splash)
- Frequent bouncing, removal-heavy
- Some artifacts (2-4)

**Midrange Archetypes:**
- **3-4 colors** (BRG, BGUW)
- Balanced bouncing, threat-dense
- Many artifacts (3-5)

**High-Roll Archetypes:**
- **5 colors** (Goodstuff)
- Heavy bouncing, artifact-dependent
- Maximum artifacts (4-6)

### Three-Color Card Design

**For 3-color cards at 4-5 mana:**
- **Should be REACTIVE** (removal, answers, not proactive bodies)
- **Should generate card advantage** (draw 2+, create multiple bodies)
- **Should affect multiple lanes** (cross-lane interaction)
- **Should NOT be weak single bodies** (2/4 for 4 mana is bad)

**Why:**
- Committing 2-3 heroes to one lane is expensive
- Opponent can ignore and go to other lane
- Card must justify the commitment

**Good Example:** "Void Strike (4UBG): Destroy target unit in any lane. Draw a card."
- Reactive (removal)
- Cross-lane interaction
- Generates value

**Bad Example:** "Weak Body (4UBG): 2/4 unit, draw 1 card."
- Proactive (must commit early)
- Single weak body
- Minimal value

---

## PVE Roguelike Focus

### All Archetypes Should Be Viable

**Unlike PVP** where some archetypes counter others, **in PVE all archetypes should be playable**.

**Why:**
- Boss has fixed strategy (e.g., RW Legion aggro)
- Player can draft to counter boss
- Multiple solutions to same boss
- No "trap" archetypes

**Design Implication:** Don't create archetype "tiers" (Tier 1/2/3). All should be strong enough to beat bosses.

### Boss-Centric Design

**Cards should be evaluated:**
- "Does this help beat the RW Legion boss?"
- "Does this enable a viable strategy vs aggro?"
- "Does this create counterplay?"

**NOT:**
- "Does this beat other player archetypes?"
- "Is this a higher tier archetype?"
- "Can this archetype hate-draft the opponent?"

### Post-Boss Rewards (Future)

After beating a boss, player receives rewards (Slay the Spire style):
- **Draft more cards** (swap weak cards for strong ones)
- **Upgrade heroes** (+1/+1 to all heroes)
- **Upgrade cards** (buff specific cards)
- **Gain artifacts** (permanent rune generation)

**Design Implication:** Early draft doesn't have to be perfect. Deck evolves over the run.

---

## Core Design Principles Summary

### 1. Rune Death Mechanic Is Central
- Heroes dying loses runes
- Bouncing preserves runes
- Creates risk/reward for powerful spells
- **HIGH PRIORITY TO IMPLEMENT**

### 2. Bouncing Is Strategic, Not Automatic
- Costs tempo and mana
- Preserves runes and heroes
- Enables multicolor spell casting
- Balance between bouncing and staying

### 3. More Rune Requirements
- 3-mana cards should often be dual-color with runes
- Forces meaningful deckbuilding choices
- Balance between rune-heavy and generic cards

### 4. Multicolor Is The Default
- 3-4 color decks are the goal
- Enabled by bouncing and artifacts
- Aggro can stay 1-2 colors
- Control and midrange go 3-4+

### 5. PVE Focus
- All archetypes viable
- Boss-centric design
- No archetype tiers
- Counterplay over "rock-paper-scissors"

### 6. Full Draft at Start
- Commit to archetype early
- Intentional synergy building
- Counterdraft opportunities
- High-skill deckbuilding

---

## Design Philosophy in Practice

### When Designing a Card, Ask:

1. **Rune Death Mechanic:**
   - Does this reward keeping heroes alive?
   - Does this create interesting decisions about bouncing?

2. **Color Requirements:**
   - Is this the right mana cost for the color requirements?
   - Should this be dual-color instead of single?

3. **Rune Requirements:**
   - Should this have rune costs?
   - Would this be too strong without rune costs?

4. **Multicolor Viability:**
   - Does this enable multicolor strategies?
   - Does this work in 3-4 color decks?

5. **Boss Counterplay:**
   - Does this help beat the RW Legion boss?
   - Does this create viable strategies?

### When Evaluating Balance:

1. **Against the Boss:**
   - Can a deck with this card beat the boss?
   - Does this enable new strategies?

2. **Rune Management:**
   - Does this require heroes staying alive?
   - Does this encourage bouncing?

3. **Archetype Viability:**
   - Does this make an archetype viable?
   - Does this fit multiple archetypes?

---

## Common Design Mistakes to Avoid

### ❌ Don't: Create "Always Better" Cards
- Every card should have context where it's good
- Generic powerful cards reduce deck diversity

### ❌ Don't: Ignore Rune Death Mechanic
- Design with the assumption heroes can die
- Rune-heavy cards should reward keeping heroes alive

### ❌ Don't: Make 3-Color Cards Weak
- 3-color cards at 4-5 mana should be powerful
- They require significant commitment

### ❌ Don't: Design for PVP Balance
- No archetype tiers
- No "hate-drafting"
- Focus on boss counterplay

### ❌ Don't: Make Single-Color Too Strong
- Multicolor should be rewarded
- Single-color should be simpler, not stronger

---

## Future Development

### Rune Death Mechanic (IMMEDIATE)
- Implement hero death → lose runes
- Implement bouncing → keep runes
- Test with various archetypes
- Balance rune requirements on spells

### More 3-Mana Dual-Color Cards
- Convert some single-color 3-mana cards to dual
- Add rune requirements
- Force meaningful deckbuilding choices

### Boss Variety
- More bosses beyond RW Legion
- Different strategies (control, midrange, combo)
- Boss-specific counterplay cards

### Roguelike Progression
- Post-boss rewards
- Deck evolution
- Run persistence
- Meta progression (unlocks)

---

## Related Documents

### Core Design
- `docs/core/MULTICOLOR_DESIGN.md` - Original bouncing philosophy
- `docs/core/DRAFT_PHILOSOPHY_AND_DEVELOPMENT_APPROACH.md` - Development approach
- `docs/core/CARD_DESIGN_AND_COUNTERPLAY.md` - Counterplay mechanics

### Card Design
- `docs/CARD_CREATION_MASTER_GUIDE.md` - How to create cards (companion to this doc)
- `docs/design/THREE_COLOR_CARD_DESIGN_PRINCIPLES.md` - 3-color specifics
- `docs/design/COLOR_IDENTITY_DESIGN.md` - Color identity

### Archetypes
- `docs/ARCHETYPE_DESIGN_GUIDE.md` - All archetypes and strategies (companion to this doc)
- `docs/design/RPS_ARCHETYPE_SYSTEM.md` - Archetype system

### Rune System
- `docs/design/RUNE_ARTIFACT_DESIGN.md` - Rune artifacts
- `docs/design/RUNE_TENSION_DESIGN.md` - Rune tension

---

*This document defines the core philosophy of Artibound. When making design decisions, refer back to these principles. The rune death mechanic is the centerpiece that makes everything else work.*

