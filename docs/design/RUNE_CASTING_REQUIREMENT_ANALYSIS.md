# Rune Casting Requirement Analysis

> **Created:** 2025-01-XX  
> **Status:** Design Discussion  
> **Purpose:** Analyze whether to require heroes in lane for spell casting or just runes

---

## Current System

### How It Works Now
1. **Heroes generate runes** when deployed (permanent runes)
2. **Artifacts generate temporary runes** each turn (Seals, Prismatic Generator)
3. **Spells require runes** (`consumesRunes: true`) - need specific color runes
4. **Cards also require heroes in lane** - `canPlayCardInLane()` checks if lane has heroes of ALL required colors

### The Problem
**User's Experience:**
- Grixis deck (UB, UR, UR, R heroes)
- Has Black Seal generating temporary black rune
- Wants to cast UBR spell (Exorcism) in left lane
- UB hero is in right lane
- **Can't cast** because UB hero not in left lane (even though has black rune from seal)
- Must bounce hero and wait a turn → feels bad

**The Tension:**
- ✅ **Skill-intensive positioning** - Rewards planning hero placement
- ❌ **Feels stranded** - Have runes but can't use them
- ❌ **Tempo cost** - Bouncing hero costs tempo, waiting a turn feels bad

---

## Design Options

### Option 1: Keep Current System (Heroes Required in Lane)
**How it works:**
- Need hero of each color in the lane to cast spell
- Runes are separate requirement (also needed)

**Pros:**
- ✅ **Strategic depth** - Hero positioning matters
- ✅ **Skill expression** - Rewards planning ahead
- ✅ **Tempo tension** - Bouncing heroes has real cost
- ✅ **Prevents "splashing everything"** - Forces commitment to colors in lanes
- ✅ **Makes artifacts more valuable** - Seals help but don't solve everything

**Cons:**
- ❌ **Feels bad when stranded** - Have runes but can't cast
- ❌ **High skill floor** - Can be frustrating for less experienced players
- ❌ **Tempo cost feels punitive** - Especially with expensive spells (Exorcism)

**When it works well:**
- Player plans ahead and positions heroes correctly
- Player uses bounce strategically
- Player accepts tempo cost for powerful spells

**When it feels bad:**
- Player has runes but hero in wrong lane
- Player needs spell NOW but must wait a turn
- Player feels "I earned these runes, why can't I use them?"

---

### Option 2: Remove Hero Requirement (Runes Only)
**How it works:**
- If you have the runes, you can cast the spell
- No need for hero in lane (for spells with `consumesRunes: true`)

**Pros:**
- ✅ **Feels good** - "I earned these runes, I can use them"
- ✅ **Less frustrating** - No "stranded" feeling
- ✅ **Rewards artifact investment** - Seals become more valuable
- ✅ **Lower skill floor** - Easier to understand and play
- ✅ **More flexible** - Can cast spells where you need them

**Cons:**
- ❌ **Less strategic depth** - Hero positioning less important
- ❌ **Easier to splash** - Can cast powerful spells without heroes in lane
- ❌ **Reduces skill expression** - Less planning required
- ❌ **Makes heroes less important** - Heroes become just rune generators
- ❌ **Grixis becomes too easy** - Powerful 3-color spells become less risky

**When it works well:**
- Player feels rewarded for generating runes
- Player can react to game state flexibly
- Player doesn't feel punished for artifact investment

**When it feels bad:**
- Game feels less strategic
- Hero positioning becomes less meaningful
- Powerful spells feel too easy to cast

---

### Option 3: Partial Hero Requirement (2 of 3 Colors)
**How it works:**
- For 3-color spells, need heroes of 2 out of 3 colors in lane
- Still need all runes
- Example: UBR spell needs (U+B) OR (U+R) OR (B+R) heroes in lane

**Pros:**
- ✅ **Middle ground** - Some positioning skill, but less restrictive
- ✅ **More flexible** - Easier to cast 3-color spells
- ✅ **Still requires planning** - Need at least 2 colors in lane
- ✅ **Rewards multicolor heroes** - UB hero helps cast UBR spells

**Cons:**
- ⚠️ **More complex** - Harder to explain and understand
- ⚠️ **Still can feel stranded** - If you only have 1 color in lane
- ⚠️ **May not solve the problem** - User still might be stuck

**When it works well:**
- Player has multicolor heroes (UB helps with UBR)
- Player still needs some planning
- Player feels less restricted

**When it feels bad:**
- Still can't cast if only have 1 color in lane
- Complexity might confuse players
- Doesn't fully solve the "stranded" problem

---

### Option 4: Runes Only for Spells, Heroes for Units
**How it works:**
- **Spells** (`consumesRunes: true`): Only need runes, no hero requirement
- **Units**: Still need heroes in lane (as they are)
- **Generic cards** (`consumesRunes: false`): Still need heroes in lane

**Pros:**
- ✅ **Spells feel flexible** - Can cast where needed
- ✅ **Units still require positioning** - Strategic depth preserved
- ✅ **Makes sense thematically** - Spells are "magic" that doesn't need heroes nearby
- ✅ **Rewards artifact investment** - Seals help cast spells flexibly
- ✅ **Reduces frustration** - No "stranded" feeling for spells

**Cons:**
- ⚠️ **Inconsistent rules** - Different rules for spells vs units
- ⚠️ **Makes spells easier** - Powerful spells become less risky
- ⚠️ **Heroes less important for spells** - Heroes become just rune generators

**When it works well:**
- Player can react with spells flexibly
- Units still require strategic positioning
- Thematic distinction (spells vs creatures)

**When it feels bad:**
- Inconsistent rules might confuse
- Spells might feel too easy
- Heroes feel less impactful for spell decks

---

## Analysis: Grixis Example

### Current System (Heroes Required)
**Scenario:**
- UB hero in right lane
- Black Seal generating B rune
- Want to cast Exorcism (8UBR) in left lane
- **Can't cast** - Need UB hero in left lane

**Player Options:**
1. Bounce UB hero, wait a turn, redeploy to left lane
2. Cast Exorcism in right lane (where UB hero is)
3. Wait for better positioning

**Feels:**
- ❌ Frustrating - "I have the runes, why can't I cast?"
- ✅ Skill-intensive - Rewards planning
- ❌ Tempo cost feels high for 8-mana spell

### Option 4 (Runes Only for Spells)
**Scenario:**
- UB hero in right lane (generates U+B runes)
- Black Seal generating B rune
- UR hero in left lane (generates U+R runes)
- **Can cast Exorcism in left lane** - Have U+B+R runes

**Player Options:**
1. Cast Exorcism in left lane (where needed)
2. Cast Exorcism in right lane (also works)
3. More flexible positioning

**Feels:**
- ✅ Rewarding - "I earned these runes, I can use them"
- ✅ Flexible - Can cast where needed
- ⚠️ Less strategic - Hero positioning less critical
- ⚠️ Easier - Powerful spells less risky

---

## Design Principles to Consider

### 1. **Reward Investment**
- If player invests in artifacts (Seals), should they be rewarded?
- If player generates runes, should they be able to use them?

### 2. **Skill Expression**
- Should hero positioning be a key skill?
- Is the current system too skill-intensive or appropriately challenging?

### 3. **Power Level Balance**
- Grixis (UBR) is very strong - should it be harder to cast?
- Are powerful 3-color spells appropriately gated?

### 4. **Player Experience**
- Does the current system create "feels bad" moments?
- Is the skill requirement appropriate for the game's complexity?

### 5. **Thematic Consistency**
- Do spells "make sense" to require heroes nearby?
- Or are spells more like "magic" that doesn't need heroes?

---

## Recommendation

### My Vote: **Option 4 (Runes Only for Spells)**

**Reasoning:**

1. **Thematic Fit**
   - Spells are "magic" - they don't need heroes physically present
   - Units are "creatures" - they need heroes to lead/command them
   - This distinction makes thematic sense

2. **Rewards Investment**
   - Player invested in Black Seal → Should be able to use black runes
   - Player generated UBR runes → Should be able to cast UBR spells
   - Artifacts become more valuable and strategic

3. **Reduces Frustration**
   - No more "stranded" feeling
   - Player feels rewarded for generating runes
   - Still requires rune generation (not free)

4. **Preserves Strategic Depth**
   - Units still require hero positioning (strategic depth preserved)
   - Rune generation still matters (need heroes to generate runes)
   - Artifact investment becomes more strategic

5. **Balances Power Level**
   - Grixis is strong, but generating UBR runes is still hard
   - Requires 3-color commitment (heroes + artifacts)
   - Powerful spells still require significant investment

**Implementation:**
- Modify `canPlayCardInLane()` to skip hero check for spells with `consumesRunes: true`
- Keep hero requirement for units and generic cards
- Update UI to reflect this distinction

---

## Alternative: Hybrid Approach

### Option 5: Runes Only for Expensive Spells (6+ mana)
**How it works:**
- **Spells 1-5 mana:** Need heroes in lane (as current)
- **Spells 6+ mana:** Only need runes (no hero requirement)

**Pros:**
- ✅ Big spells feel flexible (Exorcism, Grixis Devastation)
- ✅ Small spells still require positioning (maintains skill)
- ✅ Thematic - Big spells are "world-changing magic"
- ✅ Reduces frustration for expensive spells

**Cons:**
- ⚠️ More complex rules
- ⚠️ Inconsistent (different rules by mana cost)

**When to use:**
- If you want to keep skill for small spells
- But reduce frustration for big spells
- Thematic distinction (small vs big magic)

---

## Questions to Answer

1. **Is the current system too frustrating?**
   - If yes → Consider Option 4 or 5
   - If no → Keep current system

2. **Is hero positioning a core skill you want to preserve?**
   - If yes → Keep current system or Option 5
   - If no → Option 4 (runes only)

3. **Should artifacts (Seals) fully solve rune problems?**
   - If yes → Option 4 (runes only)
   - If no → Keep current system

4. **Is Grixis too strong or appropriately gated?**
   - If too strong → Keep current system (harder to cast)
   - If appropriately gated → Option 4 (runes only is fine)

5. **What's the skill level you're targeting?**
   - High skill → Keep current system
   - Medium skill → Option 4 or 5
   - Lower skill → Option 4

---

## Next Steps

1. **Test current system more** - Play more games, see if frustration persists
2. **Try Option 4 in playtest** - See if it feels better or too easy
3. **Consider Option 5** - Hybrid approach might be best of both worlds
4. **Gather more feedback** - See how other players feel about the system

---

## My Final Recommendation

**Try Option 4 (Runes Only for Spells) as an experiment.**

**Why:**
- Solves the "stranded" problem
- Thematically makes sense (spells vs creatures)
- Still requires rune generation (not free)
- Preserves strategic depth for units
- Rewards artifact investment

**If it feels too easy:**
- Can add back hero requirement for 3+ color spells
- Or use Option 5 (runes only for 6+ mana spells)

**If it feels right:**
- Keep it! The game will feel better and less frustrating.
