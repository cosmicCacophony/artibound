# Cards for Review - Potential Cuts

> **Created:** 2025-01-XX  
> **Status:** For Review  
> **Purpose:** Identify 10 cards that don't clearly support archetypes for potential removal

---

## Criteria for Review

Cards were selected based on:
1. **Lack of archetype identity** - Don't clearly support a guild strategy
2. **Generic "goodstuff"** - Just stats/effects without synergy
3. **Weak mechanics** - Effects that don't contribute to archetype goals
4. **Redundancy** - Similar effects exist elsewhere with better archetype support

---

## 10 Cards for Review

### 1. **Vampiric Assaulter** (4B)
**Location:** `rbCards` (line ~1088)  
**Stats:** 4/2  
**Effect:** Whenever this attacks a tower, you gain 2 life.  
**Issue:** Generic life gain doesn't support RB spell velocity or any clear archetype. Life gain is more of a WB identity, not RB.

**Recommendation:** Cut - Life gain doesn't fit RB aggressive spells-matter identity.

---

### 2. **Cross Lane Assassin** (4B)
**Location:** `rbCards` (line ~1170)  
**Stats:** 3/6  
**Effect:** Deals double damage to heroes.  
**Issue:** Generic assassin effect, doesn't support RB spell velocity, UB control, or any specific archetype. Just a stat creature with bonus damage.

**Recommendation:** Cut - Generic "goodstuff" without archetype synergy.

---

### 3. **Tower Saboteur** (2R)
**Location:** `rbCards` (line ~1076)  
**Stats:** 2/2  
**Effect:** When this enters, target tower loses 1 armor.  
**Issue:** Very weak effect (1 armor removal), doesn't clearly support RB spell velocity. Too minor to matter.

**Recommendation:** Cut - Effect is too weak and doesn't support archetype.

---

### 4. **Pain Dealer** (3B)
**Location:** `rbCards` (line ~1052)  
**Stats:** 3/3 (becomes 5/5 conditionally)  
**Effect:** If you have dealt noncombat damage to the tower this round, this becomes a 5/5.  
**Issue:** Conditional stat boost doesn't clearly support RB spell velocity or any archetype. The condition is vague and doesn't create interesting gameplay.

**Recommendation:** Cut - Conditional effect is weak and doesn't support archetype identity.

---

### 5. **Hasty Striker** (2R)
**Location:** `rbCards` (line ~1197)  
**Stats:** 3/1  
**Effect:** Haste (can attack immediately). Costs 1 less if you cast a spell this turn.  
**Issue:** Very fragile (1 health), spell synergy is minimal. Doesn't clearly support RB spell velocity (which focuses on 2nd spell triggers).

**Recommendation:** Cut - Too fragile and weak spell synergy.

---

### 6. **Target Grower** (3G)
**Location:** `gwCards` (line ~1667)  
**Stats:** 3/3  
**Effect:** Whenever you target this, it gets +1/+1 permanently.  
**Issue:** Generic growth mechanic, doesn't support GW mighty (5+ power) or stun/barrier paths. The "target" mechanic is vague and doesn't create clear synergy.

**Recommendation:** Cut - Generic mechanic doesn't support GW archetype identity.

---

### 7. **Token Generator** (4G)
**Location:** `guCards` (line ~2120)  
**Stats:** 4/4  
**Effect:** When this enters, create a 2/2 token.  
**Issue:** Generic token generation, doesn't support GU ramp strategy. Token generation is more of a RW identity, not GU.

**Recommendation:** Cut - Token generation doesn't fit GU ramp identity.

---

### 8. **Storm Attacker** (4RB)
**Location:** `rbCards` (line ~1184)  
**Stats:** 4/3  
**Effect:** When you cast your 3rd spell each turn, this unit attacks immediately.  
**Issue:** Requires 3 spells which is very difficult to achieve. RB spell velocity focuses on 2nd spell triggers, not 3rd. This is too hard to trigger.

**Recommendation:** Cut - Too difficult to trigger, doesn't align with RB 2nd-spell focus.

---

### 9. **Blood Warrior** (4R)
**Location:** `rbCards` (line ~1040)  
**Stats:** 4/3  
**Effect:** When this enters, all towers take 1 damage.  
**Issue:** Generic symmetrical damage, doesn't support RB spell velocity. The symmetrical effect doesn't create advantage and doesn't fit aggressive RB identity.

**Recommendation:** Cut - Symmetrical effect doesn't support RB aggressive identity.

---

### 10. **Sacrifice Fiend** (5B)
**Location:** `rbCards` (line ~1064)  
**Stats:** 5/4  
**Effect:** When this enters, you may sacrifice a unit. If you do, deal 3 damage to any target.  
**Issue:** Generic sacrifice effect, doesn't clearly support RB spell velocity or any specific archetype. Sacrifice is more of a generic black mechanic without clear archetype identity.

**Recommendation:** Cut - Generic sacrifice doesn't support archetype identity.

---

## Summary

**Total Cards Identified:** 10

**By Color:**
- **Black (B):** 5 cards (Vampiric Assaulter, Cross Lane Assassin, Pain Dealer, Sacrifice Fiend, Tower Saboteur is Red but in RB section)
- **Red (R):** 3 cards (Tower Saboteur, Hasty Striker, Blood Warrior)
- **Green (G):** 2 cards (Target Grower, Token Generator)

**By Issue Type:**
- **Generic "goodstuff":** 4 cards (Vampiric Assaulter, Cross Lane Assassin, Token Generator, Sacrifice Fiend)
- **Weak effects:** 3 cards (Tower Saboteur, Pain Dealer, Hasty Striker)
- **Wrong archetype fit:** 2 cards (Target Grower, Token Generator)
- **Too difficult to trigger:** 1 card (Storm Attacker)

---

## Notes

- All cards are currently in `rbCards`, `gwCards`, or `guCards` arrays
- Most are generic stat creatures without clear archetype mechanics
- Some have effects that don't align with their color pair's identity
- Cutting these would help move towards more focused, archetype-driven card pool

---

## Next Steps

1. Review each card individually
2. Decide which to cut vs. which to redesign for archetype support
3. Consider if any could be moved to different color pairs where they fit better
4. Update card counts after cuts

---

## Round 2: 10 More Cards for Review

### 11. **Mana Warrior** (3R)
**Location:** `rwCards` (line ~197)  
**Stats:** 3/3  
**Effect:** You may stun this unit to add 1 mana to your mana pool this turn.  
**Issue:** Generic mana generation doesn't support RW Legion go-wide strategy. Mana generation is more of a GU/ramp identity, not RW aggressive.

**Recommendation:** Cut - Doesn't support RW Legion identity.

---

### 12. **Tactical Commander** (4R)
**Location:** `rwCards` (line ~185)  
**Stats:** 4/2  
**Effect:** Bounce. When a hero is deployed to this lane, you may return target hero to base. That hero has rapid deploy and can be redeployed this turn.  
**Issue:** Complex bounce mechanic doesn't clearly support RW Legion go-wide strategy. Bounce is more of a blue identity, and the effect is too complex for RW's straightforward aggro plan.

**Recommendation:** Cut - Complex mechanic doesn't fit RW identity.

---

### 13. **Strategic Scout** (5RW)
**Location:** `rwCards` (line ~172)  
**Stats:** 5/5  
**Effect:** When this enters, reveal the top 5 cards of your library. You may play a unit with 5 or less mana cost for free.  
**Issue:** Generic tutor effect doesn't support RW Legion go-wide strategy. Tutors are more of a control/combo identity, not aggro. RW should focus on tokens and team buffs.

**Recommendation:** Cut - Tutor doesn't support RW Legion identity.

---

### 14. **Colossus** (5G)
**Location:** `guCards` (line ~2107)  
**Stats:** 5/5, Regen 3  
**Effect:** None (just stats and regen)  
**Issue:** Generic stat creature with regen, doesn't clearly support GU ramp identity. GU should have big finishers that ramp enables, but this is just a generic creature without clear ramp payoff.

**Recommendation:** Cut - Generic stat creature, doesn't support GU ramp identity.

---

### 15. **Cleaving Warrior** (3R)
**Location:** `rwCards` (line ~117)  
**Stats:** 2/2  
**Effect:** Cleave (damages adjacent units when attacking)  
**Issue:** Generic cleave creature in RW section, but cleave is more of an RG identity. RW should focus on Legion tokens and team buffs, not cleave.

**Recommendation:** Cut - Cleave doesn't fit RW Legion identity (should be in RG if kept).

---

### 16. **Cleaving Berserker** (4R)
**Location:** `rwCards` (line ~130)  
**Stats:** 3/2  
**Effect:** Cleave (damages adjacent units when attacking)  
**Issue:** Same as Cleaving Warrior - generic cleave in RW section, but cleave is RG identity. RW should focus on Legion.

**Recommendation:** Cut - Cleave doesn't fit RW Legion identity (should be in RG if kept).

---

### 17. **Cleaving Beast** (3G)
**Location:** `ubCards` (line ~2159)  
**Stats:** 2/3  
**Effect:** Cleave (damages adjacent units when attacking)  
**Issue:** Generic cleave creature in UB section, doesn't fit UB control identity at all. Cleave is RG identity, and this is in the wrong section.

**Recommendation:** Cut - Wrong section, doesn't fit UB control identity.

---

### 18. **Stun Grower** (2U)
**Location:** `ubCards` (line ~2315)  
**Stats:** 2/2  
**Effect:** Whenever you stun a unit, this gets +1/+1 this turn.  
**Issue:** Generic stun synergy with weak temporary effect. UB has better stun/curse support cards. This is too weak and doesn't clearly support UB control identity.

**Recommendation:** Cut - Weak effect, UB has better stun support.

---

### 19. **Spell Cascade** (5B)
**Location:** `ubCards` (line ~2327)  
**Stats:** 4/5  
**Effect:** Whenever you cast 2+ spells in one turn, stun a random enemy unit.  
**Issue:** Generic multispell effect, but UB already has better multispell support cards (Spell Scribe, Multispell Enabler). The "random" targeting makes it less useful than targeted stuns.

**Recommendation:** Cut - Redundant with better UB multispell cards, random targeting is weak.

---

### 20. **Wild Colossus** (8RW)
**Location:** `rwCards` (line ~3349)  
**Stats:** 5/5, Trample  
**Effect:** When this attacks, all your units gain +1/+1 until end of turn.  
**Issue:** Too expensive (8 mana) for RW Legion aggro strategy. RW should focus on cheaper threats and team buffs. This is too slow and doesn't support the go-wide aggro plan.

**Recommendation:** Cut - Too expensive for RW aggro identity.

---

## Round 2 Summary

**Total Cards Identified (Round 2):** 10

**By Color:**
- **Red (R):** 4 cards (Mana Warrior, Tactical Commander, Cleaving Warrior, Cleaving Berserker)
- **Red/White (RW):** 2 cards (Strategic Scout, Wild Colossus)
- **Green (G):** 2 cards (Colossus, Cleaving Beast)
- **Blue (U):** 1 card (Stun Grower)
- **Black (B):** 1 card (Spell Cascade)

**By Issue Type:**
- **Wrong archetype fit:** 5 cards (Mana Warrior, Tactical Commander, Strategic Scout, Cleaving Warrior/Berserker)
- **Generic stat creatures:** 2 cards (Colossus, Wild Colossus)
- **Wrong section:** 1 card (Cleaving Beast in UB)
- **Weak/redundant effects:** 2 cards (Stun Grower, Spell Cascade)

---

## Combined Summary (Rounds 1 & 2)

**Total Cards Identified:** 20

**Removed in Round 1:** 10 cards
**Removed in Round 2:** 8 cards (2 moved to RG: Cleaving Warrior, Cleaving Berserker)

---

## Round 3: 10 More Cards for Review

### 21. **Necromancer Apprentice** (3B)
**Location:** `ubCards` (line ~2098)  
**Stats:** 3/3  
**Effect:** When this enters, draw a card and lose 1 life.  
**Issue:** Generic draw + life loss, doesn't clearly support UB control or multispell identity. Just a stat creature with minor card advantage.

**Recommendation:** Cut - Generic effect doesn't support UB archetype.

---

### 22. **Druid Adept** (3G)
**Location:** `ubCards` (line ~2110)  
**Stats:** 2/4  
**Effect:** When this enters, gain +1 max mana.  
**Issue:** Generic ramp creature in UB section (wrong place). Ramp is GU identity, but this is in UB cards array. Also, UB doesn't need ramp - it's a control deck.

**Recommendation:** Cut - Wrong section, doesn't fit UB control identity.

---

### 23. **Clue Investigator** (3U)
**Location:** `ubCards` (line ~2127)  
**Stats:** 1/2  
**Effect:** When this enters, create a clue token. Whenever you draw an extra card each turn, this gets +3/+0.  
**Issue:** Very weak stats (1/2), clue tokens are a minor mechanic. UB has better card draw and multispell support. The conditional +3/+0 is weak.

**Recommendation:** Cut - Too weak, UB has better support cards.

---

### 24. **Tower Assault** (3R)
**Location:** `rbSpells` (line ~1241)  
**Effect:** Deal 3 damage to target tower. Refunds 3 mana.  
**Issue:** Generic tower damage spell, doesn't support RB spell velocity (which focuses on 2nd spell triggers). Just a free tower damage spell without archetype synergy.

**Recommendation:** Cut - Generic tower damage, doesn't support RB spell velocity.

---

### 25. **Life Drain** (2RB)
**Location:** `rbSpells` (line ~1257)  
**Effect:** Pay 3 life, draw 2 cards. Refunds 2 mana.  
**Issue:** Generic life-for-cards, doesn't support RB spell velocity. Life as resource is more WB identity, not RB aggressive.

**Recommendation:** Cut - Life as resource doesn't fit RB aggressive identity.

---

### 26. **Tower Decay** (2RB)
**Location:** `rbSpells` (line ~1272)  
**Effect:** Target tower loses 2 armor permanently. Refunds 2 mana.  
**Issue:** Generic armor removal, very weak effect. Doesn't support RB spell velocity or aggressive strategy. Armor removal is too minor to matter.

**Recommendation:** Cut - Weak effect, doesn't support RB identity.

---

### 27. **Suffering Curse** (2RB)
**Location:** `rbSpells` (line ~1287)  
**Effect:** Target unit gets -3/-3 until end of turn. Refunds 2 mana.  
**Issue:** Temporary debuff, doesn't support RB spell velocity. RB should focus on direct damage and spell triggers, not temporary debuffs.

**Recommendation:** Cut - Temporary debuff doesn't fit RB aggressive identity.

---

### 28. **Mighty Warrior** (5G)
**Location:** `gwCards` (line ~1560)  
**Stats:** 5/5  
**Effect:** When this enters, other creatures you control get +1/+1 this turn.  
**Issue:** Generic team buff, temporary effect. GW has better mighty support and permanent buffs. This is just a stat creature with a minor temporary buff.

**Recommendation:** Cut - Generic temporary buff, GW has better mighty support.

---

### 29. **Trample Beast** (6G)
**Location:** `gwCards` (line ~1573)  
**Stats:** 6/4  
**Effect:** Trample. When this attacks, deal 2 damage to opponent tower.  
**Issue:** Generic trample creature, doesn't clearly support GW mighty or stun/barrier paths. Just a stat creature with trample and minor tower damage.

**Recommendation:** Cut - Generic stat creature, doesn't support GW archetype.

---

### 30. **Mighty Charger** (7G)
**Location:** `gwCards` (line ~1598)  
**Stats:** 7/5  
**Effect:** When this attacks, all your creatures with 5+ power get +2/+0.  
**Issue:** Too expensive (7 mana) for GW. The mighty synergy is good, but the cost is prohibitive. GW should have cheaper mighty support.

**Recommendation:** Cut - Too expensive for GW archetype.

---

## Round 3 Summary

**Total Cards Identified (Round 3):** 10

**By Color:**
- **Black (B):** 1 card (Necromancer Apprentice)
- **Green (G):** 3 cards (Druid Adept, Mighty Warrior, Trample Beast, Mighty Charger)
- **Blue (U):** 1 card (Clue Investigator)
- **Red (R):** 1 card (Tower Assault)
- **Red/Black (RB):** 3 cards (Life Drain, Tower Decay, Suffering Curse)

**By Issue Type:**
- **Generic effects:** 5 cards (Necromancer Apprentice, Tower Assault, Life Drain, Tower Decay, Suffering Curse)
- **Wrong section:** 1 card (Druid Adept in UB)
- **Too weak:** 1 card (Clue Investigator)
- **Generic stat creatures:** 2 cards (Mighty Warrior, Trample Beast)
- **Too expensive:** 1 card (Mighty Charger)

---

## Combined Summary (All Rounds)

**Total Cards Identified:** 30

**Removed in Round 1:** 10 cards
**Removed in Round 2:** 8 cards (2 moved to RG)
**Removed in Round 3:** 10 cards

**Total Removed:** 28 cards
**Total Moved:** 2 cards (to RG)
