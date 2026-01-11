# UB Archetype Decision: Force into UBR or UBW

> **Created:** 2025-01-XX  
> **Status:** Design Decision  
> **Purpose:** Document decision to remove UB as standalone archetype, force players into UBR or UBW

---

## Problem Statement

**With the recent rune casting change (spells don't need heroes in lane, just runes), UB might not need to be a standalone archetype.**

### Current State

**UB (Blue-Black) as Standalone:**
- Listed as a guild in archetype system
- Has heroes, cards, spells
- Identity: "Removal-heavy control deck"
- **Known Weakness**: "Lacks finishers, needs to expand to 3-4 colors for Tier 1 power"

**With Flexible Rune Casting:**
- Spells can be cast anywhere (don't need heroes in lane)
- Easier to splash third color
- UB alone might not have enough identity/power
- Players naturally want to splash anyway

### Design Question

**Should UB be a standalone archetype, or should players be forced to choose between:**
- **UBR (Grixis)** - Control with red splash (AOE + card advantage)
- **UBW (Esper)** - Control with white splash (barrier/stun + finishers)

---

## Proposed Solution: Remove UB as Standalone

### Core Philosophy

**Force UB players into either UBR or UBW through card design and draft system.**

### Rationale

1. **UB Alone Lacks Identity**
   - Generic "removal-heavy control" isn't distinctive
   - No clear win condition
   - Players naturally want to splash anyway

2. **UBR and UBW Have Clear Identities**
   - **UBR (Grixis)**: AOE + card advantage, spell-synergy
   - **UBW (Esper)**: Barrier/stun control, finishers

3. **Flexible Rune Casting Makes Splashing Easy**
   - With spells not needing heroes in lane, splashing is easier
   - No reason to stay pure UB
   - Force interesting deck-building decisions

4. **Creates More Interesting Choices**
   - Do you want red (AOE + card advantage)?
   - Or white (barrier/stun + finishers)?
   - More meaningful than "just play UB"

---

## Implementation Strategy

### Option 1: Remove UB Cards, Keep Only UBR/UBW

**Approach:**
- Remove or reduce UB-specific cards
- Move key cards to UBR or UBW
- Keep only cards that work in both

**Pros:**
- Clear separation
- Forces choice
- Cleaner archetype system

**Cons:**
- Loses some flexibility
- Might be too restrictive

### Option 2: Make UB Cards Require Third Color

**Approach:**
- Keep UB cards, but make key cards require third color
- Example: "UBR" or "UBW" requirements on powerful cards
- Generic UB cards still exist, but aren't powerful enough alone

**Pros:**
- More flexible
- Allows gradual transition
- Doesn't break existing cards

**Cons:**
- Less clear
- Might confuse players

### Option 3: Draft System Forces Choice

**Approach:**
- Keep UB cards
- Draft system encourages/forces third color pick
- Example: "If you have UB heroes, you must pick a third color hero"

**Pros:**
- Flexible card design
- Clear draft guidance
- Doesn't break existing cards

**Cons:**
- Requires draft system changes
- Might feel forced

---

## Recommended Approach: Hybrid (Option 2 + 3)

### Card Design Changes

1. **Move Key Cards to UBR or UBW**
   - Powerful finishers → UBR or UBW
   - Generic removal → Keep in UB (but not powerful enough alone)

2. **Make Powerful Cards Require Third Color**
   - Example: "UBR" or "UBW" requirements on finishers
   - Generic UB cards exist but aren't game-winning

3. **Keep Generic UB Cards**
   - Basic removal (2-3 mana)
   - Card draw (2-3 mana)
   - Not powerful enough to win alone

### Draft System Changes

1. **Encourage Third Color Pick**
   - If player has UB heroes, suggest third color
   - Show UBR/UBW cards more prominently
   - Make it clear UB alone is weak

2. **Don't Force, But Guide**
   - Allow pure UB (for experimentation)
   - But make it clear it's weaker
   - Guide players toward UBR or UBW

---

## UBR (Grixis) Identity

**Colors:** Blue + Black + Red

**Identity:**
- AOE + card advantage
- Spell-synergy
- Control with red splash

**Key Cards:**
- Grixis Wave (6UBR): 3 AOE + draw 2
- Void Blast (5UBR): 4 AOE + draw 1
- Exorcism (8UBR): 12 damage distributed
- Grixis Devastation (8UBR): 10 damage + draw 2

**Win Condition:**
- Clear board with AOE
- Draw cards to outvalue
- Finish with big spells

---

## UBW (Esper) Identity

**Colors:** Blue + Black + White

**Identity:**
- Barrier/stun control
- Finishers
- Control with white splash

**Key Cards:**
- Barrier spells (grant barrier)
- Stun spells (stun units)
- Finishers (big units or spells)
- Protection (keep key units alive)

**Win Condition:**
- Control with barrier/stun
- Protect key units
- Finish with finishers

---

## Current UB Cards Analysis

### What to Keep (Generic, Work in Both)

**Removal:**
- Basic removal (2-3 mana, B or U)
- Works in both UBR and UBW

**Card Draw:**
- Basic card draw (2-3 mana, U or B)
- Works in both UBR and UBW

**Generic Control:**
- Bounce spells (U)
- Works in both UBR and UBW

### What to Move (Powerful, Need Third Color)

**AOE Spells:**
- Move to UBR (Grixis Wave, Void Blast)
- Or make require UBR

**Finishers:**
- Move to UBW (big units, protection)
- Or make require UBW

**Curse/Stun:**
- Move to UBW (stun/barrier synergy)
- Or make require UBW

---

## Implementation Plan

### Phase 1: Card Design Changes

1. **Move AOE + Draw to UBR**
   - Grixis Wave (6UBR) ✅ Already done
   - Void Blast (5UBR) ✅ Already done
   - Keep generic AOE in UB (but weaker)

2. **Move Finishers to UBW**
   - Big units with protection
   - Barrier/stun finishers
   - Or make require UBW

3. **Keep Generic UB Cards**
   - Basic removal
   - Basic card draw
   - Not powerful enough alone

### Phase 2: Draft System Changes

1. **Guide Players to Third Color**
   - If UB heroes picked, suggest UBR or UBW
   - Show third-color cards prominently
   - Make it clear UB alone is weaker

2. **Don't Force, But Encourage**
   - Allow pure UB (for experimentation)
   - But make it clear it's B-tier
   - Guide toward UBR or UBW

### Phase 3: Documentation Updates

1. **Update Archetype Guide**
   - Remove UB as standalone
   - Add UBR and UBW as primary
   - Document UB as "base" for UBR/UBW

2. **Update Card Creation Guidelines**
   - UB cards should be generic
   - Powerful cards should require third color
   - Guide toward UBR or UBW

---

## Benefits

1. **Clearer Archetype Identities**
   - UBR and UBW have distinct identities
   - UB alone is generic and weak

2. **More Interesting Decisions**
   - Do you want red (AOE) or white (barrier)?
   - Creates meaningful deck-building choices

3. **Better Balance**
   - UB alone is weak (as intended)
   - UBR and UBW are strong (with clear identities)

4. **Aligns with Design Philosophy**
   - Flexible rune casting makes splashing easy
   - No reason to stay pure UB
   - Force interesting choices

---

## Risks

1. **Too Restrictive**
   - Players might want pure UB
   - But it's okay if it's B-tier

2. **Confusion**
   - Players might not understand
   - Need clear communication

3. **Balance Issues**
   - UBR or UBW might be too strong
   - Need careful tuning

---

## Next Steps

1. **Test Current State**
   - Playtest UB alone
   - Playtest UBR
   - Playtest UBW
   - See if UB alone feels weak

2. **Make Card Changes**
   - Move powerful cards to UBR/UBW
   - Keep generic cards in UB
   - Test balance

3. **Update Draft System**
   - Guide players to third color
   - Don't force, but encourage
   - Test player experience

4. **Document Changes**
   - Update archetype guide
   - Update card creation guidelines
   - Communicate design philosophy

---

## Summary

**Decision: Remove UB as standalone archetype, force players into UBR or UBW**

**Rationale:**
- UB alone lacks identity and finishers
- UBR and UBW have clear identities
- Flexible rune casting makes splashing easy
- Creates more interesting deck-building decisions

**Implementation:**
- Move powerful cards to UBR/UBW
- Keep generic cards in UB (but not powerful enough alone)
- Guide players to third color in draft
- Don't force, but encourage

**Benefits:**
- Clearer archetype identities
- More interesting decisions
- Better balance
- Aligns with design philosophy

---

*This decision aligns with the flexible rune casting change and creates more interesting deck-building choices. UB becomes a "base" for UBR or UBW, rather than a standalone archetype.*
