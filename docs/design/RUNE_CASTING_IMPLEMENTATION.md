# Rune Casting Requirement Implementation

> **Created:** 2025-01-XX  
> **Status:** Implemented  
> **Purpose:** Document the implementation of Option 4 (Runes Only for Spells)

---

## Changes Implemented

### 1. Modified `canPlayCardInLane()` - Option 4

**File:** `src/game/colorSystem.ts`

**Change:**
- Spells with `consumesRunes: true` no longer require heroes in lane
- Only need runes to cast (flexible spell casting)
- Units and generic cards still require heroes in lane (preserves strategic positioning)

**Code:**
```typescript
// OPTION 4: Spells with consumesRunes: true only need runes, not heroes in lane
// This allows flexible spell casting - if you have the runes, you can cast the spell
// Units and generic cards still require heroes in lane for strategic positioning
if (card.cardType === 'spell' && (card as any).consumesRunes === true) {
  return true // Spells with rune requirements don't need heroes in lane
}
```

**Impact:**
- ✅ Solves "stranded" problem - can cast spells where you have runes
- ✅ Rewards artifact investment (Seals generate runes you can use)
- ✅ Reduces frustration for expensive spells (Exorcism, Grixis Devastation)
- ✅ Still requires rune generation (not free)
- ✅ Preserves strategic depth for units (still need heroes in lane)

---

### 2. Replaced Dark Pact Artifact

**File:** `src/game/comprehensiveCardData.ts`

**Removed:**
- `black-artifact-dark-pact` (3B): At start of turn, both towers lose 1 HP
  - **Problem:** Too good against aggro RW, gives them a big clock
  - **Issue:** Life loss each turn feels bad against aggressive decks

**Added:**
- `black-artifact-rune-scroll` (3B): At start of turn, create a scroll token. Pay 2 or B rune to draw a card and destroy token
  - **Solution:** Converts runes into cards (like UB clue generator)
  - **Benefit:** Creates card advantage without giving aggro a clock
  - **Trade-off:** Requires runes (can't use for spells) or mana (2 cost)
  - **Design:** Similar to UB clue generator, but for black identity

**Rationale:**
- Clue/scroll generators create card advantage through resource conversion
- Doesn't give aggro decks a clock (no life loss)
- Rewards rune generation and creates interesting decisions (runes for spells vs cards)
- Fits black's identity (resource conversion, card advantage)

---

### 3. Added UBR Card Advantage Spells

**File:** `src/game/comprehensiveCardData.ts`

**Added Two New Spells:**

1. **Grixis Wave** (6UBR)
   - Deal 3 damage to all enemy units
   - Draw 2 cards
   - **Purpose:** Balanced AOE + card advantage for control
   - **Design:** Doesn't fully clear board (3 damage), but draws cards to handle aggression

2. **Void Blast** (5UBR)
   - Deal 4 damage to all enemy units
   - Draw 1 card
   - **Purpose:** Stronger AOE, less card advantage
   - **Design:** More damage, less draw (different power level)

**Rationale:**
- UBR (Grixis) needs more card advantage compared to other colors
- AOE + draw creates balanced control tools
- Doesn't fully clear board (3-4 damage) but provides cards to handle aggression
- Creates interesting decisions (when to use for board control vs card advantage)
- Fits Grixis identity (control, card advantage, AOE)

---

## Design Philosophy

### Why Option 4 (Runes Only for Spells)?

1. **Thematic Fit**
   - Spells are "magic" - don't need heroes physically present
   - Units are "creatures" - need heroes to lead/command them
   - Makes thematic sense

2. **Rewards Investment**
   - Player invested in artifacts (Seals) → Should be able to use runes
   - Player generated runes → Should be able to cast spells
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

### Why Replace Dark Pact?

1. **Too Good Against Aggro**
   - Life loss each turn gives aggro a clock
   - Feels bad when playing against aggressive decks
   - Creates unfun gameplay patterns

2. **Better Alternatives**
   - Clue/scroll generators create card advantage without life loss
   - Resource conversion (runes → cards) creates interesting decisions
   - Doesn't give aggro decks a clock

3. **Fits Black Identity**
   - Resource conversion (runes → cards)
   - Card advantage through sacrifice/conversion
   - Doesn't need to be life loss

### Why Add UBR Card Advantage?

1. **UBR Needs More Card Advantage**
   - Control decks need card advantage to handle aggression
   - Grixis is spell-heavy, needs cards to fuel spells
   - Other colors have better card advantage options

2. **AOE + Draw is Balanced**
   - Doesn't fully clear board (3-4 damage)
   - Provides cards to handle remaining threats
   - Creates interesting decisions (when to use)

3. **Fits Grixis Identity**
   - Control archetype
   - AOE damage
   - Card advantage
   - Spell-slinging

---

## Testing Notes

### What to Test

1. **Spell Casting Flexibility**
   - Can cast UBR spells in lanes without UBR heroes (if you have runes)
   - Can cast spells where you need them (not just where heroes are)
   - Artifacts (Seals) become more valuable

2. **Dark Pact Replacement**
   - Rune Scroll creates card advantage without life loss
   - Doesn't give aggro decks a clock
   - Creates interesting resource decisions (runes for spells vs cards)

3. **UBR Card Advantage**
   - Grixis Wave and Void Blast provide card advantage
   - AOE damage doesn't fully clear board
   - Cards help handle remaining threats

### Expected Outcomes

1. **Less Frustration**
   - No more "stranded" feeling when you have runes
   - Can cast spells where you need them
   - Artifacts feel more valuable

2. **Better Balance**
   - Dark Pact replacement doesn't give aggro a clock
   - UBR has more card advantage options
   - Control decks can better handle aggression

3. **More Strategic Depth**
   - Artifact investment becomes more strategic
   - Resource conversion (runes → cards) creates interesting decisions
   - Spell positioning becomes less critical, but rune generation still matters

---

## Future Considerations

### Potential Adjustments

1. **If Spells Feel Too Easy**
   - Could add back hero requirement for 3+ color spells
   - Or use hybrid approach (runes only for 6+ mana spells)

2. **If Dark Pact Replacement Feels Weak**
   - Could adjust scroll token cost (1 mana or 1 rune?)
   - Or add alternative black card advantage options

3. **If UBR Card Advantage Feels Too Strong**
   - Could reduce damage (2 damage instead of 3-4)
   - Or reduce draw count (1 card instead of 2)

### Design Space

- More clue/scroll generators for other colors?
- More AOE + draw spells for other color combinations?
- Alternative card advantage mechanics (scry, looting, etc.)?

---

## Summary

**Implemented:**
- ✅ Option 4: Spells with `consumesRunes: true` only need runes, not heroes in lane
- ✅ Replaced Dark Pact with Rune Scroll (clue generator for black)
- ✅ Added Grixis Wave (6UBR: 3 AOE + draw 2) and Void Blast (5UBR: 4 AOE + draw 1)

**Impact:**
- Solves "stranded" problem for spell casting
- Reduces frustration for expensive spells
- Better card advantage for UBR without giving aggro a clock
- Preserves strategic depth for units

**Next Steps:**
- Test in gameplay
- Gather feedback
- Adjust if needed
