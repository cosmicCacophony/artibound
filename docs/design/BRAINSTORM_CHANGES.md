# Brainstorm: Game Balance & Design Changes

> **Created:** 2025-01-XX  
> **Status:** Brainstorming  
> **Purpose:** Document proposed changes based on playtest feedback

---

## 1. UB (Blue-Black) Enhancements

### Problem
UB needs more help beyond AOE. Curse mechanic exists but needs more support.

### Proposed Changes

#### A. Enhanced Morgana Hero - Curse Card Generator
**Current**: Curse Weaver only curses on deploy, draws when cursing
**New**: Create curse cards every turn

**New Hero Ability:**
- **Curse Mastery (Enhanced)**: At the start of your turn, create a "Curse" spell card in your hand. Curse spells cost 2UB and curse target unit (opponent pays 3 mana to remove). If a cursed unit is not removed by end of turn, create an additional Curse card.

**Implementation:**
```typescript
{
  id: 'ub-hero-morgana-curser-enhanced',
  name: 'Curse Weaver',
  description: '2/6. At start of turn: Create a Curse spell in hand. If enemy has cursed units at end of turn, create another Curse. Draw a card whenever an enemy is cursed.',
  ability: {
    name: 'Curse Mastery',
    trigger: 'start_of_turn', // New trigger type
    effectType: 'create_curse_spell', // Creates curse spell card
    effectValue: 1, // Creates 1 curse spell
    spreadEffect: true, // If curses not removed, create more
  }
}
```

#### B. Curse Spreading Mechanic
- If a cursed unit is not removed by end of turn, the curse "spreads"
- Spread effect: Create an additional Curse spell card in hand
- Creates snowball effect if opponent can't pay removal costs

#### C. New UB Curse Support Cards
- **Curse Spreader** (3UB): 2/3. When you cast a Curse spell, if target is already cursed, create a Curse spell in hand.
- **Curse Master** (4UB): 3/4. Cursed units get -1/-1. When a cursed unit dies, draw a card.

---

## 2. Bant (WGU) & GWR - Kithkin-Style Units

### Inspiration
Kithkin from Magic: Start small (2/2), grow with +1/+1 counters, can become mighty, protected from dying.

### Proposed Changes

#### A. Kithkin-Style Units for Bant
**New Unit:**
- **Kithkin Protector** (3WGU): 2/2. Enters with 1 +1/+1 counter. At start of turn, put a +1/+1 counter on this. When this would die, remove a +1/+1 counter instead. (Shadow Fiend-style protection)

**Implementation:**
```typescript
{
  id: 'wgu-unit-kithkin-protector',
  name: 'Kithkin Protector',
  description: '2/2. Enters with 1 +1/+1 counter. At start of turn, put a +1/+1 counter on this. When this would die, remove a +1/+1 counter instead.',
  attack: 2,
  health: 2,
  entersWithCounters: 1,
  specialEffects: ['grows_each_turn', 'counter_protection'], // Grows, protected by counters
}
```

#### B. GWR Mighty Kithkin
**New Unit:**
- **Mighty Kithkin** (4GWR): 2/2. Enters with 2 +1/+1 counters. At start of turn, put a +1/+1 counter on this. When this has 5+ power, it gains +2/+2. When this would die, remove a +1/+1 counter instead.

**Design Notes:**
- Starts 2/2 with 2 counters = 4/4 (mighty threshold)
- Grows each turn
- Becomes 6/6 when mighty (5+ power triggers +2/+2)
- Protected from death by counters

---

## 3. UBR (Grixis) - Enhanced Curses

### Problem
UBR curses should be stronger than default UB curses.

### Proposed Changes

#### A. UBR Curses with -1/-1 Counters
**New Spell:**
- **Grixis Curse** (3UBR): Curse target unit (opponent pays 4 mana to remove). Cursed unit gets -1/-1. If this kills the unit, draw a card.

**Enhanced Curse Mechanic:**
- UBR curses apply -1/-1 counters in addition to stun
- Makes them more threatening than default curses
- Creates pressure: pay mana or unit gets weaker

**Implementation:**
```typescript
{
  id: 'ubr-spell-grixis-curse',
  name: 'Grixis Curse',
  description: 'Curse target unit (opponent pays 4 mana to remove). Cursed unit gets -1/-1. If this kills the unit, draw a card.',
  manaCost: 3,
  consumesRunes: true,
  effect: {
    type: 'curse_with_debuff',
    curseCost: 4, // Higher cost than default
    debuffValue: -1, // -1/-1 counter
  }
}
```

#### B. UBR Curse Support Units
- **Curse Enforcer** (4UBR): 3/4. Cursed units get -2/-2. When a cursed unit dies, deal 2 damage to enemy tower.

---

## 4. Blue Empty Slot Damage Spell

### Problem
Need to force enemy to balance tower/hero damage, keep them honest.

### Proposed Changes

#### A. Empty Slot Damage Spell
**New Spell:**
- **Void Rift** (4U): Deal 2 damage to each empty slot. If a slot is empty, deal 2 damage to the tower in that lane instead.

**Design Notes:**
- Forces opponent to deploy units or take tower damage
- Creates interesting decision: deploy weak unit or take tower damage?
- Helps control decks pressure opponents

**Implementation:**
```typescript
{
  id: 'blue-spell-void-rift',
  name: 'Void Rift',
  description: 'Deal 2 damage to each empty slot. If a slot is empty, deal 2 damage to the tower in that lane instead.',
  manaCost: 4,
  consumesRunes: true,
  effect: {
    type: 'empty_slot_damage',
    damage: 2,
    towerDamage: 2, // If slot empty, damage tower
  }
}
```

---

## 5. RG (Red-Green) Balance - Make Spells More Expensive

### Problem
RG is getting stats too easily. Should not be top tier unless drafted exceedingly well.

### Proposed Changes

#### A. Increase RG Spell Costs
**Current Fight Spell:**
- 3 mana, no rune requirement

**New Fight Spell:**
- **Fight Spell** (4RG): Make unit fight enemy. Requires RG runes. Costs 4RG.

**Other RG Spell Changes:**
- **Mighty Strike** (5RG): Target creature with 5+ power deals damage equal to its power to target unit. Costs 5RG.
- **Overwhelming Force** (6RG): All your creatures with 5+ power get +2/+2 until end of turn. Costs 6RG.

#### B. Make RG More Rune Intensive
- All RG spells should require both R and G runes
- Increase mana costs by 1-2 across the board
- Make RG a "high commitment" archetype that requires good drafting

#### C. Reduce RG Unit Stat Efficiency
- Slightly reduce base stats on RG units
- Make them rely more on spells for power
- Force RG to commit to both colors

---

## 6. Cube-Style Tutors (Future - Documented for Later)

### Inspiration
Booster Tutor, Grimoire, Invoke from Magic cube formats.

### Proposed Future Mechanics

#### A. Tutor Spells
- **Booster Tutor** (3UB): Look at top 5 cards, put one in hand, rest on bottom.
- **Grimoire** (4UB): Search your library for a spell, put it in hand.
- **Invoke** (5UBR): Look at top 10 cards, cast one without paying its mana cost.

#### B. Design Notes
- Adds fun "high roll" moments
- Creates variance and excitement
- Should be expensive and require multiple colors
- **Status**: Documented for future implementation, not implementing now

#### C. Implementation Considerations
- Need to implement library/deck searching mechanics
- May require new effect types: `tutor`, `look_at_top`, `cast_from_top`
- Should be rare/uncommon to maintain balance
- Consider mana costs carefully - tutors are powerful

---

## 7. Card Cuts & Constructed Focus

### Problem
Too many cards, too much variance. Need to move towards constructed with consistent paths.

### Proposed Changes

#### A. Cut Generic/Weak Cards
**Cards to Remove:**
- Generic stat creatures without mechanics
- Redundant removal spells
- Weak units that don't support archetypes
- Cards that are "goodstuff" without guild identity

#### B. Strengthen Archetype Identity
- Each guild should have 15-20 strong, focused cards
- Remove cards that don't clearly support an archetype
- Make drafting more consistent - you can get to your archetype

#### C. Reduce Total Card Count
- Target: Under 200 cards (currently ~300+)
- Focus on quality over quantity
- Each card should have a clear purpose

---

## Implementation Priority

### High Priority (Implement Now)
1. ✅ Enhanced Morgana hero with curse card generation
2. ✅ UBR curses with -1/-1 counters
3. ✅ Blue empty slot damage spell
4. ✅ RG spell cost increases

### Medium Priority (Next Phase)
5. Kithkin-style units for Bant/GWR
6. Curse spreading mechanic
7. Card cuts for constructed focus

### Low Priority (Future)
8. Cube-style tutors
9. Additional curse support cards

---

## Design Principles

1. **Archetype Identity**: Every card should clearly support a guild
2. **Power Level**: RG should require high commitment, not be generically strong
3. **Mechanical Depth**: Curses should have multiple dimensions (spread, debuff, etc.)
4. **Consistency**: Drafting should lead to consistent archetypes
5. **Fun Moments**: Cube-style tutors add excitement (future)

---

## Notes

- Curse spreading creates interesting tension: opponent must pay or face more curses
- Kithkin-style units create protected threats that grow over time
- UBR curses being stronger makes the 3-color commitment worthwhile
- Empty slot damage forces tactical deployment decisions
- RG balance ensures it's not generically strong without commitment
