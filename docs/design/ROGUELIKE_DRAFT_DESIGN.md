# Roguelike Draft Design: Fresh Start

> **Created:** 2025-01-XX  
> **Status:** Design Phase  
> **Purpose:** Design the draft structure for roguelike mode (heroes, artifacts, spells, units only)

## Requirements

- **4 heroes** needed
- **20-30 cards** needed (artifacts, spells, units)
- **No battlefields** (removed from roguelike)
- **No items** (removed from roguelike)
- Start with **single-color heroes** (more flexibility)
- Later can draft **multi-color heroes** (2-color)
- Should create **interesting decisions**
- Should allow **color pivoting**

---

## Draft Structure: Hero-Focused with Mixed Packs

### Core Concept
- **Guaranteed hero picks** at intervals (ensures you get 4 heroes)
- **Mixed packs** between hero picks (heroes + artifacts + spells + units)
- **Progression**: Single-color heroes early → Multi-color heroes later

### Flow

```
Hero Pick 1: Single-Color Hero
  → Show 5 single-color heroes (one of each color: R, U, W, B, G)
  → Pick 1
  → Establishes your first color commitment

Mixed Packs 1-5: Pick 2 items per pack
  → Each pack contains:
     - 1-2 heroes (mix of single-color and 2-color)
     - 3-4 artifacts
     - 3-4 spells
     - 3-4 units
     - Total: 10-14 items
  → Pick 2 (can be any combination: 2 heroes, 2 cards, 1 hero + 1 card, etc.)

Hero Pick 2: Single-Color or 2-Color Hero
  → Show 5 heroes:
     - 2-3 single-color heroes (weighted toward your colors)
     - 2-3 two-color heroes (weighted toward your colors)
  → Pick 1
  → Can commit to colors or pivot

Mixed Packs 6-10: Pick 2 items per pack
  → Same structure as packs 1-5
  → Continue building deck

Hero Pick 3: Single-Color or 2-Color Hero
  → Show 5 heroes (weighted toward your colors)
  → Pick 1

Mixed Packs 11-15: Pick 2 items per pack
  → Same structure

Hero Pick 4: Single-Color or 2-Color Hero
  → Show 5 heroes (weighted toward your colors)
  → Pick 1

Final Packs 16-18: Pick 2 items per pack
  → Final card picks to polish deck
```

### Pack Contents

**Hero Picks:**
- **Pick 1**: 5 single-color heroes (one of each color: R, U, W, B, G)
- **Pick 2-4**: 5 heroes total
  - 2-3 single-color heroes (weighted 70% toward your colors, 30% random)
  - 2-3 two-color heroes (weighted 70% toward your colors, 30% random)

**Mixed Packs:**
- **1-2 heroes** (mix of single-color and 2-color, weighted toward your colors)
- **3-4 artifacts** (weighted toward your colors)
- **3-4 spells** (weighted toward your colors)
- **3-4 units** (weighted toward your colors)
- **Total: 10-14 items**, pick 2

### Example Draft Flow

```
Hero Pick 1:
  → Red Hero, Blue Hero, White Hero, Black Hero, Green Hero
  → Pick: Red Hero (committing to red)

Mixed Packs 1-5:
  Pack 1: [Red Hero, Red/White Hero, Red Artifact, Red Artifact, Red Spell, Red Spell, Red Unit, Red Unit, Blue Artifact, Blue Spell]
    → Pick: Red Hero, Red Artifact (staying red)
  
  Pack 2: [Red Hero, Red Artifact, Red Spell, Red Unit, Red Unit, White Artifact, White Spell, Blue Artifact, Blue Spell]
    → Pick: Red Spell, White Artifact (adding white)
  
  ...continue...

Hero Pick 2:
  → Red Hero, Red/White Hero, White Hero, Blue Hero, Blue/Black Hero
  → Pick: Red/White Hero (committing to RW)

Mixed Packs 6-10:
  → Continue building RW deck...

Hero Pick 3:
  → Red Hero, White Hero, Red/White Hero, Blue Hero, Green Hero
  → Pick: White Hero (filling out white)

...continue...
```

---

## Pack Generation Rules

### Hero Picks

**Pick 1 (Single-Color Only):**
- Show exactly 5 heroes: one of each color (R, U, W, B, G)
- All single-color heroes
- Purpose: Establish first color commitment with maximum flexibility

**Picks 2-4 (Single-Color + 2-Color):**
- Show 5 heroes total
- 2-3 single-color heroes (70% chance of your colors, 30% random)
- 2-3 two-color heroes (70% chance include your colors, 30% random)
- Purpose: Allow commitment or pivoting

### Mixed Packs

**Heroes (1-2 per pack):**
- 70% chance: Heroes that match your colors
- 30% chance: Random heroes (allows pivoting)
- Mix of single-color and 2-color heroes
- Later packs: More 2-color heroes available

**Artifacts (3-4 per pack):**
- 70% chance: Artifacts that match your colors
- 30% chance: Random artifacts
- Include rune generators (Seals, mana rocks)

**Spells (3-4 per pack):**
- 70% chance: Spells that match your colors
- 30% chance: Random spells
- Mix of early-game and late-game spells

**Units (3-4 per pack):**
- 70% chance: Units that match your colors
- 30% chance: Random units
- Mix of vanilla units and units with abilities

### Color Weighting

**Track Colors Drafted:**
- Count heroes by color (e.g., 2 red heroes, 1 white hero = "RW")
- Weight pack generation 70% toward your colors
- 30% random (allows pivoting)

**Example:**
- You have: 2 red heroes, 1 white hero
- Next pack: 70% chance of R/W/RW cards, 30% chance of any color
- Allows you to commit to RW or pivot to other colors

---

## Total Pack Count

### Option A: Full Draft (18 packs)
- 4 hero picks
- 14 mixed packs
- **Total: 18 packs**
- **Result: ~28 cards** (4 heroes + 24 cards from mixed packs)

### Option B: Shorter Draft (15 packs)
- 4 hero picks
- 11 mixed packs
- **Total: 15 packs**
- **Result: ~22 cards** (4 heroes + 18 cards from mixed packs)

### Option C: Longer Draft (20 packs)
- 4 hero picks
- 16 mixed packs
- **Total: 20 packs**
- **Result: ~32 cards** (4 heroes + 28 cards from mixed packs)

**Recommendation: Option A (18 packs)** - Good balance of decisions without being too long

---

## Card Type Distribution

### Per Mixed Pack (10-14 items total)
- **1-2 heroes** (10-15% of pack)
- **3-4 artifacts** (30-35% of pack)
- **3-4 spells** (30-35% of pack)
- **3-4 units** (30-35% of pack)

### Overall Draft (18 packs, picking 2 per pack = 36 picks)
- **4 heroes** (guaranteed from hero picks)
- **~10-12 artifacts** (from mixed packs)
- **~10-12 spells** (from mixed packs)
- **~10-12 units** (from mixed packs)
- **Total: ~36 cards** (4 heroes + 32 other cards)

---

## Strategic Decisions

### Early Draft (Packs 1-5)
- **Hero Pick 1**: Choose starting color (R, U, W, B, G)
- **Mixed Packs**: Build foundation
  - Take rune generators (artifacts that generate runes)
  - Take early-game cards
  - Decide: Take more heroes or powerful cards?

### Mid Draft (Packs 6-10)
- **Hero Pick 2**: Commit to colors or pivot
  - If you have red cards, take red/white hero to go RW
  - Or pivot to blue if you see good blue cards
- **Mixed Packs**: Fill out deck
  - Take late-game payoffs
  - Take synergy cards

### Late Draft (Packs 11-18)
- **Hero Picks 3-4**: Fill out hero roster
- **Mixed Packs**: Polish deck
  - Take missing pieces
  - Take powerful cards
  - Fix mana curve

---

## Implementation Details

### Pack Generation Function

```typescript
interface RoguelikePack {
  heroes: Hero[]           // 1-2 heroes
  artifacts: Artifact[]    // 3-4 artifacts
  spells: Spell[]          // 3-4 spells
  units: Unit[]            // 3-4 units
}

function generateMixedPack(
  packNumber: number,
  playerColors: Color[],  // Colors player has drafted
  allHeroes: Hero[],
  allArtifacts: Artifact[],
  allSpells: Spell[],
  allUnits: Unit[]
): RoguelikePack {
  // Weight 70% toward player colors, 30% random
  // Mix single-color and 2-color heroes
  // Include variety of card types
}
```

### Hero Pick Function

```typescript
function generateHeroPick(
  pickNumber: 1 | 2 | 3 | 4,
  playerColors: Color[],
  allHeroes: Hero[]
): Hero[] {
  if (pickNumber === 1) {
    // Pick 1: One of each color (R, U, W, B, G), single-color only
    return [redHero, blueHero, whiteHero, blackHero, greenHero]
  } else {
    // Picks 2-4: 5 heroes, mix of single-color and 2-color
    // Weighted 70% toward player colors, 30% random
  }
}
```

### Draft State

```typescript
interface RoguelikeDraftState {
  currentPack: number
  phase: 'heroPick' | 'mixedPack'
  heroPickNumber: 1 | 2 | 3 | 4 | null
  draftedHeroes: Hero[]
  draftedArtifacts: Artifact[]
  draftedSpells: Spell[]
  draftedUnits: Unit[]
  playerColors: Color[]  // Track colors for weighting
}
```

---

## UI Flow

### Hero Pick Screen
- Show 5 heroes in a row
- Highlight single-color vs 2-color
- Show current drafted colors
- Click to pick

### Mixed Pack Screen
- Show all items in pack (heroes, artifacts, spells, units)
- Group by type (or show all together)
- Show current drafted colors
- Click 2 items to pick
- Show what you've drafted so far

### Draft Progress
- Show: Heroes (X/4), Cards (X/30)
- Show: Current colors (R, W, etc.)
- Show: Pack number (X/18)

---

## Questions to Answer

1. **How many packs total?** (15? 18? 20?) → **Recommend: 18**
2. **How many items per mixed pack?** (10? 12? 14?) → **Recommend: 10-14**
3. **Should hero picks 2-4 include 2-color heroes?** → **Yes, weighted toward your colors**
4. **Color weighting percentage?** (70/30? 80/20?) → **Recommend: 70/30**
5. **Should we show all items together or grouped by type?** → **TBD (UI decision)**

---

## Next Steps

1. **Finalize pack counts** (recommend 18 packs total)
2. **Implement pack generation** (with color weighting)
3. **Build UI** (hero picks + mixed packs)
4. **Test** (draft a few decks, see how it feels)
5. **Iterate** (adjust based on playtesting)
