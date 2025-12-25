# Rare Hero System - Draft Dopamine Hits

> **Created:** 2025-01-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** System for rare heroes with double color requirements that create exciting draft moments

## Overview

A system of **rare heroes with double color requirements** (e.g., RRG instead of RG) that create "feel good" moments in draft. These heroes are more powerful than normal heroes and create exciting pack synergy when paired with powerful multicolor spells.

## Design Philosophy

### Core Principle
**Rare heroes should create memorable draft moments that feel rewarding when you're in the right colors.**

### Goals
1. **Dopamine Hits**: Seeing a rare hero in your colors feels good
2. **Pack Synergy**: Getting rare hero + powerful spell in same pack feels amazing
3. **Draft Excitement**: Creates memorable moments that players talk about
4. **Color Commitment**: Rewards players who commit to specific color combinations
5. **High-Roll Moments**: Creates variance and excitement in draft

---

## Rare Hero Design

### Double Color Requirements

**Format**: `XXY` where `XX` is double of one color, `Y` is a second color

**Examples:**
- **RRG** (Double Red + Green): Aggressive growth hero
- **BBU** (Double Black + Blue): Control finisher hero
- **GGW** (Double Green + White): Resilient support hero
- **WWB** (Double White + Black): Defensive control hero
- **UUR** (Double Blue + Red): Spell damage hero

### Power Level

**Rare heroes should be 15-20% more powerful than normal heroes:**

| Normal Hero | Rare Hero (XXY) |
|------------|-----------------|
| 3/9 stats | 4/10 or 5/9 stats |
| Basic ability | Enhanced ability |
| Standard support | Stronger support effect |
| 1 signature card | 1 signature card (more powerful) |

### Design Examples

#### RRG Hero (Double Red + Green)
```typescript
{
  id: 'rrg-hero-wild-fury',
  name: 'Wild Fury',
  description: 'Rare. Aggressive growth hero with double red commitment.',
  cardType: 'hero',
  colors: ['red', 'red', 'green'], // Requires 2 red + 1 green
  attack: 6, // +1 over normal RG hero
  health: 10, // +1 over normal RG hero
  maxHealth: 10,
  currentHealth: 10,
  supportEffect: 'Allies gain +2 attack. When this attacks, all your units gain +2/+2 until end of turn.',
  signatureCardId: 'rrg-sig-fury-1',
  equippedItems: [],
  ability: {
    name: 'Primal Rage',
    description: 'All your units gain +3/+3 this turn. Put a +2/+2 counter on each of your units.',
    manaCost: 1,
    cooldown: 2,
    effectType: 'buff_units',
    effectValue: 3, // Stronger than normal RG hero
  },
}
```

#### BBU Hero (Double Black + Blue)
```typescript
{
  id: 'bbu-hero-void-tyrant',
  name: 'Void Tyrant',
  description: 'Rare. Control finisher hero with double black commitment.',
  cardType: 'hero',
  colors: ['black', 'black', 'blue'], // Requires 2 black + 1 blue
  attack: 4, // +1 over normal BU hero
  health: 12, // +1 over normal BU hero
  maxHealth: 12,
  currentHealth: 12,
  supportEffect: 'When an enemy unit dies, draw a card. Spells you cast deal +1 damage.',
  signatureCardId: 'bbu-sig-tyrant-1',
  equippedItems: [],
  ability: {
    name: 'Void Annihilation',
    description: 'Destroy target unit. If it had 5+ health, draw 2 cards instead.',
    manaCost: 1,
    cooldown: 2,
    effectType: 'custom',
    effectValue: 5,
  },
}
```

#### GGW Hero (Double Green + White)
```typescript
{
  id: 'ggw-hero-nature-guardian',
  name: 'Nature Guardian',
  description: 'Rare. Resilient support hero with double green commitment.',
  cardType: 'hero',
  colors: ['green', 'green', 'white'], // Requires 2 green + 1 white
  attack: 4, // +1 over normal GW hero
  health: 13, // +2 over normal GW hero
  maxHealth: 13,
  currentHealth: 13,
  supportEffect: 'Allies gain +0/+3. When a unit dies, put a +1/+1 counter on all your units.',
  signatureCardId: 'ggw-sig-guardian-1',
  equippedItems: [],
  ability: {
    name: 'Nature\'s Embrace',
    description: 'All your units gain +2/+4 until end of turn. Put a +1/+1 counter on each of your units.',
    manaCost: 1,
    cooldown: 2,
    effectType: 'buff_units',
    effectValue: 2,
  },
}
```

---

## Pack Synergy System

### The "Amazing Pack" Moment

**When you get a rare hero AND a powerful multicolor spell in the same pack, it creates an "amazing" feeling.**

### Design Principles

1. **Rare heroes should appear in packs with their signature spells**
   - RRG hero → RRG or RGG spell in same pack
   - BBU hero → BBU or BUU spell in same pack
   - GGW hero → GGW or GWW spell in same pack

2. **Powerful multicolor spells should synergize with rare heroes**
   - Expensive (6-8 mana)
   - Requires same color combination
   - Powerful effect that rewards color commitment

3. **Pack generation should occasionally pair them**
   - 20-30% chance rare hero appears with signature spell
   - Creates memorable "high-roll" moments
   - Feels special when it happens

### Example Pack Synergy

**Pack Contents:**
- **RRG Hero** (Wild Fury) - Rare hero
- **RRG Spell** (Primal Convergence, 7 mana) - Powerful finisher
- **RG Unit** (Raging Bear) - Good support card
- **R Spell** (Fire Bolt) - Generic support
- **G Unit** (Mana Druid) - Generic support

**Player Experience:**
- "Oh wow, a rare RRG hero!"
- "And a powerful RRG spell in the same pack!"
- "This is amazing - I'm definitely going RRG now!"

---

## Powerful Multicolor Spells

### Design for Pack Synergy

**These spells should be expensive (6-8 mana) and powerful, requiring the same color combination as rare heroes.**

#### RRG Spells
```typescript
{
  id: 'rrg-spell-primal-convergence',
  name: 'Primal Convergence',
  description: 'All your units gain +4/+4 until end of turn. Put a +2/+2 counter on each of your units. Costs 7RRG.',
  cardType: 'spell',
  colors: ['red', 'red', 'green'],
  manaCost: 7,
  consumesRunes: true,
  effect: {
    type: 'targeted_damage', // Placeholder - would be team buff + counters
    damage: 0,
  },
}
```

#### BBU Spells
```typescript
{
  id: 'bbu-spell-void-annihilation',
  name: 'Void Annihilation',
  description: 'Destroy all enemy units. Draw a card for each unit destroyed. Costs 7BBU.',
  cardType: 'spell',
  colors: ['black', 'black', 'blue'],
  manaCost: 7,
  consumesRunes: true,
  effect: {
    type: 'aoe_damage',
    damage: 999,
    affectsUnits: true,
    affectsHeroes: false,
    affectsEnemyUnits: true,
  },
}
```

#### GGW Spells
```typescript
{
  id: 'ggw-spell-nature-triumph',
  name: 'Nature\'s Triumph',
  description: 'All your units gain +3/+5 until end of turn. Put a +2/+2 counter on each of your units. Costs 7GGW.',
  cardType: 'spell',
  colors: ['green', 'green', 'white'],
  manaCost: 7,
  consumesRunes: true,
  effect: {
    type: 'targeted_damage', // Placeholder - would be team buff + counters
    damage: 0,
  },
}
```

---

## Color Combinations

### Priority Combinations

**High Priority (Common Archetypes):**
1. **RRG** - Aggressive growth (Red/Green)
2. **BBU** - Control finisher (Black/Blue)
3. **GGW** - Resilient support (Green/White)
4. **WWB** - Defensive control (White/Black)
5. **UUR** - Spell damage (Blue/Red)

**Medium Priority (Less Common):**
6. **RRW** - Aggressive white (Red/White)
7. **BBG** - Black/Green midrange
8. **GGU** - Green/Blue ramp
9. **WWU** - White/Blue control
10. **UUB** - Blue/Black control

**Low Priority (Niche):**
11. **RRB** - Red/Black aggressive
12. **BBW** - Black/White control
13. **GGR** - Green/Red ramp
14. **WWG** - White/Green support
15. **UUG** - Blue/Green control

---

## Draft Experience

### The "Feel Good" Moment

**Scenario 1: Rare Hero in Your Colors**
- You're drafting RG
- Pack opens with rare RRG hero
- "Yes! This is perfect for my deck!"
- **Feeling**: Excited, validated, rewarded for color commitment

**Scenario 2: Rare Hero + Spell in Same Pack**
- You're drafting RG
- Pack opens with rare RRG hero AND powerful RRG spell
- "This is amazing! I'm definitely going RRG now!"
- **Feeling**: Euphoric, high-roll moment, memorable

**Scenario 3: Rare Hero Forces Pivot**
- You're drafting RW
- Pack opens with rare RRG hero
- "Hmm, should I pivot to RG? This hero is really strong..."
- **Feeling**: Interesting decision, draft tension, strategic choice

---

## Implementation

### Hero Rarity System

**Normal Heroes:**
- Single color (R, G, B, U, W)
- Dual color (RG, BU, GW, etc.)
- Standard power level

**Rare Heroes:**
- Double color requirements (RRG, BBU, GGW, etc.)
- 15-20% more powerful
- Appear less frequently in packs
- Create excitement when seen

### Pack Generation

**Rare Hero Frequency:**
- **Hero Picks (1-4)**: 10-15% chance of rare hero
- **Mixed Packs (5-18)**: 5-10% chance of rare hero
- **Pack Synergy**: 20-30% chance rare hero appears with signature spell

**Pack Synergy Logic:**
```typescript
// Pseudo-code for pack generation
function generatePackWithSynergy() {
  const hasRareHero = Math.random() < 0.1; // 10% chance
  
  if (hasRareHero) {
    const rareHero = selectRareHero();
    const signatureSpell = selectSignatureSpell(rareHero);
    
    // 30% chance they appear together
    if (Math.random() < 0.3) {
      pack.push(rareHero, signatureSpell);
    }
  }
}
```

---

## Card Creation Checklist

### High Priority (Phase 1)

#### Rare Heroes
- [ ] **RRG Hero** (Wild Fury) - Aggressive growth
- [ ] **BBU Hero** (Void Tyrant) - Control finisher
- [ ] **GGW Hero** (Nature Guardian) - Resilient support
- [ ] **WWB Hero** (Divine Warden) - Defensive control
- [ ] **UUR Hero** (Arcane Storm) - Spell damage

#### Signature Spells
- [ ] **RRG Spell** (Primal Convergence, 7 mana) - Team buff finisher
- [ ] **BBU Spell** (Void Annihilation, 7 mana) - Board wipe + draw
- [ ] **GGW Spell** (Nature's Triumph, 7 mana) - Team buff + counters
- [ ] **WWB Spell** (Divine Wrath, 7 mana) - Board wipe + protection
- [ ] **UUR Spell** (Arcane Inferno, 7 mana) - Massive spell damage

### Medium Priority (Phase 2)

#### Additional Rare Heroes
- [ ] **RRW Hero** - Aggressive white
- [ ] **BBG Hero** - Black/Green midrange
- [ ] **GGU Hero** - Green/Blue ramp
- [ ] **WWU Hero** - White/Blue control
- [ ] **UUB Hero** - Blue/Black control

#### Additional Signature Spells
- [ ] Matching spells for Phase 2 heroes

---

## Success Criteria

### Draft Experience
- ✅ Rare heroes create excitement when seen
- ✅ Pack synergy moments feel amazing
- ✅ Players remember these moments
- ✅ Rare heroes reward color commitment

### Gameplay Experience
- ✅ Rare heroes are noticeably more powerful
- ✅ Rare heroes don't break the game
- ✅ Signature spells feel rewarding to cast
- ✅ Color commitment is rewarded

### Balance
- ✅ Rare heroes are 15-20% more powerful (not 50%)
- ✅ Rare heroes don't make normal heroes obsolete
- ✅ Signature spells are powerful but not game-breaking
- ✅ Color commitment is rewarded but not required

---

## Related Documents
- `docs/ARCHETYPE_DESIGN_GUIDE.md` - All archetypes (consolidated)
- `docs/CARD_CREATION_MASTER_GUIDE.md` - Rune artifact design (consolidated)
- `docs/DESIGN_PHILOSOPHY_GUIDE.md` - Draft philosophy
- `src/game/roguelikeDraft.ts` - Draft pack generation



