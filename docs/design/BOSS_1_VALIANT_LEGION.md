# Boss 1: Valiant Legion (RW Go-Wide)

> **Created:** 2025-12-20  
> **Status:** Designed, Ready for Implementation  
> **Purpose:** First boss in roguelike mode - optimal RW go-wide deck

## Overview

**Boss Name:** Valiant Legion  
**Archetype:** RW Go-Wide  
**Strategy:** Legion tokens, artifact synergies, team buffs  
**Difficulty:** Medium (no stat buffs needed - optimal deck is strong enough)

## Why This Works Well for a First Boss

### 1. **Simple Gameplan**
- Clear strategy: Play artifacts → Generate tokens → Buff team → Attack
- No complex decision-making required
- AI can follow a simple priority list

### 2. **Well-Balanced Deck**
- **4 Heroes:** Mix of RW and R heroes with useful abilities
- **4 Artifacts:** Core synergies (War Banner, rune generators)
- **7 Spells:** Token generators and buffs
- **9 Units:** Legion synergy and good curve (2-5 mana)
- **Total: 24 cards** - Optimal deck size

### 3. **No Buffs Needed**
- Deck is strong enough with optimal composition
- Normal starting mana (3)
- Normal tower HP (20)
- No stat buffs needed
- AI can be simple and still be challenging

### 4. **Clear AI Rules**
The AI can follow these simple rules:
1. Play artifacts early (War Banner first for synergy)
2. Generate tokens when you have runes (Legion Call, Rally the Troops)
3. Play units on curve (Legion Champion, Legion Archers)
4. Use buff spells when you have 3+ units
5. Attack towers when safe (prioritize units that can't be blocked)

## Deck Composition

### Heroes (4)
1. **Valiant Commander (RW)** - Rally ability (+1/+1 to all units)
2. **War Captain (R)** - High attack (7), tactical movement
3. **Battle Vanguard (R)** - Mobile warrior, repositioning
4. **Valiant Commander (RW)** - Duplicate for consistency

### Artifacts (4)
1. **War Banner Artifact** - +1 attack to all units (CORE SYNERGY)
2. **Legion Generator Artifact** - RW rune generation (for token spells)
3. **Vanguard Generator Artifact** - R rune generation (for red runes)
4. **Rally Banner Artifact** - +1/+1 to all units (additional synergy)

### Spells (7)
**Token Generators (Core Strategy):**
1. **Legion Call (3RW)** - Create two 2/2 Legion tokens
2. **Rally the Troops (2RW)** - Create one 2/2 Legion token
3. **Rapid Deployment (2RW)** - Create two 1/1 Legion tokens

**Buff Spells:**
4. **Rally Banner (4RW)** - +1/+1 to all, draw a card
5. **Into the Fray (2RW)** - +3/+3 to target unit

**Finisher:**
6. **Wrath of the Legion (5RRW)** - +3/+3 to all units

**Utility:**
7. **Fighting Words (1R)** - +3 attack to target unit

### Units (9)
**Early Game (2-3 mana):**
1. **War Banner Carrier (2R)** - Bounce utility
2. **Legion Archers (3RW)** - Ranged pressure

**Mid Game (4 mana):**
3. **Legion Champion (4RW)** - Legion synergy (+1/+1 to Legion on attack)
4. **Battle Standard (4R)** - +1 attack to all allies

**Late Game (5 mana):**
5. **Legion General (5RW)** - +2/+2 attack to all Legion units

**Additional Pressure (Duplicates):**
6-9. Duplicates of above for consistency

## AI Strategy

### Priority List (Simple Rules)
1. **Play Artifacts Early**
   - War Banner first (core synergy)
   - Rune generators next (for token spells)
   - Rally Banner last (additional synergy)

2. **Generate Tokens**
   - Use token spells when you have runes
   - Prioritize Legion Call (two 2/2 tokens)
   - Use Rapid Deployment early (two 1/1 tokens)

3. **Play Units on Curve**
   - 2-3 mana: War Banner Carrier, Legion Archers
   - 4 mana: Legion Champion, Battle Standard
   - 5 mana: Legion General

4. **Buff When Wide**
   - Use buff spells when you have 3+ units
   - Prioritize Rally Banner (+1/+1 to all, draw)
   - Use Wrath of the Legion as finisher

5. **Attack Towers**
   - Prioritize units that can't be blocked (ranged)
   - Attack with multiple units when safe
   - Use hero abilities when beneficial

### Rune Management (Simple)
- **Simple rune usage:** Just use runes for token spells
- No complex rune management needed
- Rune generators provide runes automatically

### Aggression Level
- **High aggression:** Go-wide strategy, attack towers early
- Focus on board presence and tower damage
- Use buffs to push for lethal

## Why This Doesn't Need Buffs

### Optimal Composition
- **Well-balanced curve:** 2-5 mana cards
- **Strong synergies:** Artifacts + tokens + buffs
- **Good mix:** Early, mid, late game cards
- **Consistent:** Duplicates of key cards

### Natural Power Level
- **War Banner:** +1 attack to all units (huge with tokens)
- **Legion tokens:** Multiple bodies for go-wide
- **Buff spells:** Scale with board presence
- **Legion synergy:** Units buff each other

### AI Can Be Simple
- No complex decision-making needed
- Just follow priority list
- Deck is strong enough to be challenging without buffs

## Implementation Notes

### Boss Data Structure
- Defined in `src/game/bossData.ts`
- Uses `Boss` interface
- Includes deck composition, buffs, AI strategy

### AI Implementation (Future)
- Simple priority-based AI
- No complex decision trees needed
- Just follow the priority list
- Can be implemented incrementally

### Testing
- Test with various player decks
- Ensure boss is challenging but fair
- Adjust AI rules if needed
- No stat buffs needed (deck is strong enough)

## Success Criteria

✅ **Boss is challenging** - Optimal deck composition makes it strong  
✅ **AI can be simple** - Clear priority list, no complex decisions  
✅ **No buffs needed** - Deck is strong enough naturally  
✅ **Fun to fight** - Go-wide strategy is engaging  
✅ **Teachable** - Shows players how RW go-wide works  

---

## Next Steps

1. **Implement Boss Data** ✅ (Done)
2. **Create Boss Battle UI** (Future)
3. **Implement Simple AI** (Future)
4. **Test Boss Difficulty** (Future)
5. **Adjust if Needed** (Future)




