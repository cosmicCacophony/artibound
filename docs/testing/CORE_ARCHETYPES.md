# Core Archetypes for Balance Testing

> **Created:** 2025-12-25  
> **Status:** Active  
> **Purpose:** Define the 4-5 core archetypes to focus on for initial roguelike balance

---

## Selected Archetypes

### 1. RW (Red/White) - Aggro/Go-Wide ⭐

**Strategy:** Fast aggro with Legion tokens and team buffs

**Why This Archetype:**
- Boss uses this archetype (RW Legion)
- Tests player's ability to beat the boss at its own game
- Clear gameplan: Generate tokens → Buff team → Attack towers
- Well-defined cards already exist

**Key Cards:**
- Legion Call, Rally the Troops (token generators)
- War Banner, Rally Banner (team buffs)
- Legion Archers, Legion Champion (units)
- Wrath of Legion (finisher)

**Rune Strategy:** 0-2 rune artifacts (prioritize board presence)

**Target Win Rate vs Boss:** 50-55% (mirror match advantage)

---

### 2. UBG (Blue/Black/Green) - Control/Ramp ⭐

**Strategy:** Control early, ramp into game-ending spells

**Why This Archetype:**
- Opposite of RW aggro (RPS: Control beats Aggro)
- Tests removal + board wipes + ramp
- 3-color archetype tests rune system
- Already playtested (Session 1)

**Key Cards:**
- Void Cascade (5UUB): AOE removal
- Multicolor Wrath (6UUBBGG): Board wipe
- Exorcism (7UBG): Ultimate board wipe
- Nature's Wisdom (2UG): Card draw
- Knowledge Seeker (5BB): Card advantage

**Rune Strategy:** 3-5 rune artifacts (enable splashing)

**Target Win Rate vs Boss:** 45-50% (should beat aggro if survives early)

**Known Issues:**
- Session 1: Rune costs too lenient (FIXED with stricter requirements)
- Need to verify new rune costs are balanced

---

### 3. RG (Red/Green) - Midrange/Ramp ⭐

**Strategy:** Ramp into big creatures, overwhelm with stats

**Why This Archetype:**
- RPS: Midrange beats Aggro (stabilizes, then overpowers)
- Tests ramp mechanics + big threats
- 2-color archetype (simpler than UBG)
- Natural counter to RW boss

**Key Cards:** (To be verified in card data)
- Ramp spells (mana acceleration)
- Big creatures (5-7 mana with high stats)
- Direct damage (red removal)
- Growth/buff effects (green synergy)

**Rune Strategy:** 2-4 rune artifacts (enable mid-game power spikes)

**Target Win Rate vs Boss:** 50-60% (should beat aggro consistently)

**Status:** ⏳ Needs playtesting

---

### 4. UB (Blue/Black) - Control/Removal ⭐

**Strategy:** Removal-heavy control, win late game

**Why This Archetype:**
- Pure 2-color control (simpler than UBG)
- Tests removal suite
- RPS: Control beats Midrange (answers threats efficiently)
- Strong vs RW boss if survives early

**Key Cards:** (To be verified in card data)
- Void Cascade (5UUB): AOE
- Single-target removal (kill spells)
- Bounce effects (tempo plays)
- Card draw (advantage engine)

**Rune Strategy:** 2-4 rune artifacts (enable powerful spells)

**Target Win Rate vs Boss:** 40-50% (should beat aggro with right draws)

**Status:** ⏳ Needs playtesting

---

### 5. GW (Green/White) - Midrange/Defense ⭐

**Strategy:** Defensive midrange with big creatures and healing

**Why This Archetype:**
- Tests defensive mechanics (healing, high HP units)
- Adjacency buffs (positional gameplay)
- 2-color archetype
- Alternative midrange to RG

**Key Cards:**
- Guardian Angel (3W): Adjacent +0/+2
- Holy Sentinel (4WW): Adjacent +0/+3
- Fortified Bastion (5WWW): Adjacent +0/+4
- Divine Protector (hero): Range 2 +2 regen
- Green ramp + White defense

**Rune Strategy:** 2-3 rune artifacts (support adjacency costs)

**Target Win Rate vs Boss:** 45-55% (defensive tools to survive aggro)

**Status:** ⏳ Needs playtesting - just added adjacency units

---

## RPS Triangle

```
        Aggro (RW)
         /      \
        /        \
   beats         loses to
      /            \
     /              \
Control (UBG/UB)  Midrange (RG/GW)
     \              /
      \            /
    beats      beats
        \      /
         \    /
        Midrange
```

**Key Relationships:**
- **Aggro (RW) beats Control:** Too fast, control can't stabilize
- **Control (UBG/UB) beats Midrange:** Answers threats, outvalues
- **Midrange (RG/GW) beats Aggro:** Stabilizes, then overpowers

---

## Playtesting Priority

### Phase 1: Test Each Archetype (Week 2)
1. ✅ UBG vs RW Boss (Session 1 complete - tie)
2. ⏳ RW vs RW Boss (mirror match)
3. ⏳ RG vs RW Boss (midrange vs aggro)
4. ⏳ UB vs RW Boss (control vs aggro)
5. ⏳ GW vs RW Boss (defensive midrange vs aggro)

**Goal:** 2-3 playtests per archetype, track win rates

### Phase 2: Cross-Balance (Week 3)
- Identify overpowered/underpowered cards
- Adjust mana costs, rune costs, stats
- Re-test problem archetypes
- Aim for 40-60% win rate across all

### Phase 3: Refinement (Week 3-4)
- 5-10 playtests per archetype
- Fine-tune individual cards
- Ensure no single card dominates
- Validate RPS triangle works

---

## Success Criteria

**Per Archetype:**
- [ ] 40-60% win rate vs RW Boss
- [ ] Multiple viable draft paths (not forced into one build)
- [ ] Interesting decision points during draft
- [ ] Games feel competitive (not stomps either way)
- [ ] Distinct playstyle from other archetypes

**Overall:**
- [ ] Each archetype wins ~50% of time vs boss with good play
- [ ] No card always picked (>80% pick rate)
- [ ] No card never picked (<10% pick rate, except niche cards)
- [ ] 2-4 colors typical per deck
- [ ] Games last 8-12 turns average

---

## Archetype Color Identity

### Red (R)
- **Identity:** Aggression, direct damage, haste
- **Mechanics:** Tokens, buffs, tower damage
- **Rune Cards:** Minimal (prefer board presence)

### White (W)
- **Identity:** Defense, healing, team buffs
- **Mechanics:** Adjacency buffs, regeneration, protection
- **Rune Cards:** Medium (support adjacency costs)

### Green (G)
- **Identity:** Ramp, big creatures, growth
- **Mechanics:** Mana acceleration, high stats, trample
- **Rune Cards:** Medium (enable big spells)

### Blue (U)
- **Identity:** Control, card draw, bounce
- **Mechanics:** Counterspells, bounce, tempo
- **Rune Cards:** Heavy (enable powerful spells)

### Black (B)
- **Identity:** Removal, sacrifice, card advantage
- **Mechanics:** Kill spells, life drain, recursion
- **Rune Cards:** Heavy (enable powerful removal)

---

## Why These 5 Archetypes?

1. **Cover RPS Triangle:** Aggro, Control, Midrange all represented
2. **Test Color Combinations:** 2-color (RW, RG, UB, GW) and 3-color (UBG)
3. **Test Rune System:** Low (RW), Medium (RG, GW, UB), High (UBG) rune strategies
4. **Distinct Playstyles:** Go-wide, Control, Ramp, Removal, Defense
5. **Existing Card Support:** All have cards already in comprehensiveCardData.ts

---

## Future Archetypes (Phase 4+)

After balancing core 5:
- **RB (Red/Black):** Sacrifice/Aggro
- **RU (Red/Blue):** Tempo/Spellslinger
- **GB (Green/Black):** Graveyard/Ramp
- **GU (Green/Blue):** Ramp/Card Draw
- **BW (Black/White):** Lifegain/Control
- **RWG (3-color):** Big Dumb Creatures
- **UBW (3-color):** Control Combo

---

## Card Pool Size

**Current Card Pool:** 100+ cards across all colors

**Target for 5 Archetypes:**
- ~20-30 cards per archetype
- ~100-150 cards total in draft pool
- Ensures variety while maintaining archetype identity

**Pack Distribution:**
- 70% cards match player colors (after hero picks)
- 30% off-color cards (for splashing)
- Always 1 good multicolor hero per mixed pack

---

## Balance Philosophy

**Color Commitment Through Rune Costs:**
- Light rune costs (R, W): Flexible, can splash
- Medium rune costs (RR, WW): Some commitment needed
- Heavy rune costs (RRR, UUBBGG): True color commitment

**Rune Artifacts Enable Splashing:**
- 0-2 artifacts: Mono-color or tight 2-color
- 2-4 artifacts: Flexible 2-3 colors
- 4-5 artifacts: Greedy 3-4 colors (high power ceiling, risky)

**Payoff for Commitment:**
- Heavy rune cost cards are more powerful
- Tribal synergies (Legion) reward staying in colors
- Color-specific mechanics reward commitment

---

## Notes

- **RW is the benchmark** (boss uses this archetype)
- **All archetypes balanced against RW first**, then against each other
- **UBG already tested** - use as reference for others
- **GW is newest** - just added adjacency units, needs testing
- **RG and UB need card verification** - ensure strong card pool exists


