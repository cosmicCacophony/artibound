# Multi-Color Card Examples

This document contains example cards that extend RW and UB archetypes into 3-color decks (RWG and UBG), demonstrating the multi-color design philosophy.

---

## RWG (Red/White/Green) - Convergence Cards

### Convergence Rally
**The card you requested!**

```typescript
{
  id: 'rwg-spell-convergence-rally',
  name: 'Convergence Rally',
  description: 'All your units gain +2/+2 until end of turn. If you control heroes of 4 different colors, they gain +3/+3 instead.',
  cardType: 'spell',
  colors: ['red', 'white', 'green'],
  manaCost: 6, // 3RWG = 6 total mana
  effect: {
    type: 'custom', // Custom effect: team buff that scales with color count
    // Implementation: Check color count, apply +2/+2 or +3/+3
  },
}
```

**Design Notes**:
- Requires RWG heroes to cast (3 colors)
- Powerful team buff (+2/+2 to all units)
- Scales to +3/+3 if you have 4 colors (full rainbow)
- Perfect for go-wide RW strategies with Green's growth
- Costs 6 mana (late-game power spike)

---

### Wild Legionnaire
**Extends RW Legion tribal with Green growth**

```typescript
{
  id: 'rwg-unit-wild-legionnaire',
  name: 'Wild Legionnaire',
  description: 'Legion. When this attacks, put a +1/+1 counter on it.',
  cardType: 'generic',
  colors: ['red', 'green'], // Can be cast with RG heroes
  manaCost: 3,
  attack: 3,
  health: 3,
  maxHealth: 3,
  currentHealth: 3,
}
```

**Design Notes**:
- Works in RG or RWG decks (flexible casting)
- Combines RW's Legion theme with Green's growth
- Gets stronger over time (Green's growth mechanic)
- Fits RW's go-wide strategy

---

### Primal Banner
**Persistent team buff unit**

```typescript
{
  id: 'rwg-unit-primal-banner',
  name: 'Primal Banner',
  description: 'All your units gain +1/+1. At the start of your next turn, all your units gain +1/+1 again.',
  cardType: 'generic',
  colors: ['red', 'white', 'green'],
  manaCost: 5, // 2RWG = 5 total mana
  attack: 2,
  health: 4,
  maxHealth: 4,
  currentHealth: 4,
}
```

**Design Notes**:
- Requires RWG heroes to cast
- Persistent team buff over multiple turns
- Combines RW's team buffs with Green's growth
- Resilient body (4 health) fits Green's toughness theme

---

### Wild Commander (Tri-Color Hero)
**RWG hero that enables 3-color strategies**

```typescript
{
  id: 'rwg-hero-wild-commander',
  name: 'Wild Commander',
  description: 'Combines RW aggression with Green growth',
  cardType: 'hero',
  colors: ['red', 'white', 'green'],
  attack: 5,
  health: 11,
  maxHealth: 11,
  currentHealth: 11,
  supportEffect: 'Allies gain +1/+1. If you control heroes of 4 different colors, allies gain +2/+2 instead.',
  signatureCardId: 'rwg-sig-commander-1',
  equippedItems: [],
  ability: {
    name: 'Primal Rally',
    description: 'All your units gain +2/+2 this turn. If you control heroes of 3+ different colors, they gain +3/+3 instead.',
    manaCost: 1,
    cooldown: 2,
    effectType: 'buff_units',
    effectValue: 2, // Base +2/+2, scales to +3/+3 with 3+ colors
  },
}
```

**Design Notes**:
- Tri-color hero (RWG) enables 3-color strategies
- Support effect scales with color diversity
- Ability scales with color count
- Stronger than dual-color heroes but requires commitment

---

### Wild Commander Signature Cards

#### Convergence Banner (Signature Unit)
```typescript
{
  id: 'rwg-sig-commander-1',
  name: 'Convergence Banner',
  description: 'Wild Commander signature - team buff. All allies gain +1/+1. If you control heroes of 3+ different colors, they gain +2/+2 instead.',
  cardType: 'generic',
  colors: ['red', 'white', 'green'],
  manaCost: 4,
  attack: 2,
  health: 3,
  maxHealth: 3,
  currentHealth: 3,
}
```

#### Primal Charge (Signature Spell)
```typescript
{
  id: 'rwg-sig-commander-2',
  name: 'Primal Charge',
  description: 'Wild Commander signature - aggressive. All allies gain +2 attack this turn and can attack immediately.',
  cardType: 'spell',
  colors: ['red', 'white', 'green'],
  manaCost: 4,
  effect: {
    type: 'custom', // Custom effect: team buff + immediate attack
  },
}
```

---

### Growth Rally
**Green growth effect for RW wide strategies**

```typescript
{
  id: 'rwg-spell-growth-rally',
  name: 'Growth Rally',
  description: 'All your units gain +1/+1. Put a +1/+1 counter on each of your units.',
  cardType: 'spell',
  colors: ['red', 'white', 'green'],
  manaCost: 4, // 1RWG = 4 total mana
  effect: {
    type: 'custom', // Custom effect: team buff + permanent counters
  },
}
```

**Design Notes**:
- Requires RWG heroes
- Immediate buff (+1/+1) + permanent growth (counters)
- Combines RW's team buffs with Green's growth
- Perfect for wide boards

---

### Primal Warlord (Dual-Color Hero)
**RG hero that bridges to RWG**

```typescript
{
  id: 'rwg-hero-primal-warlord',
  name: 'Primal Warlord',
  description: 'Aggressive growth hero',
  cardType: 'hero',
  colors: ['red', 'green'],
  attack: 6,
  health: 9,
  maxHealth: 9,
  currentHealth: 9,
  supportEffect: 'Allies gain +1 attack. When this attacks, put a +1/+1 counter on all your units.',
  signatureCardId: 'rwg-sig-warlord-1',
  equippedItems: [],
  ability: {
    name: 'Wild Growth',
    description: 'All your units gain +2/+2 this turn. Put a +1/+1 counter on each of your units.',
    manaCost: 1,
    cooldown: 3,
    effectType: 'buff_units',
    effectValue: 2,
  },
}
```

**Design Notes**:
- Dual-color hero (RG) that works in RWG decks
- Combines Red's aggression with Green's growth
- Enables 3-color strategies without requiring RWG hero

---

## UBG (Blue/Black/Green) - Convergence Cards

### Verdant Control
**Card advantage that scales with color diversity**

```typescript
{
  id: 'ubg-spell-verdant-control',
  name: 'Verdant Control',
  description: 'Draw 2 cards. If you control heroes of 4 different colors, draw 3 cards instead.',
  cardType: 'spell',
  colors: ['blue', 'black', 'green'],
  manaCost: 6, // 3UBG = 6 total mana
  effect: {
    type: 'custom', // Custom effect: card draw that scales with color count
  },
}
```

**Design Notes**:
- Requires UBG heroes to cast (3 colors)
- Card advantage (UB's strength) that scales with color diversity
- Combines UB's control with Green's resource generation
- Costs 6 mana (late-game power)

---

### Shadow Growth
**Removal with conditional card advantage**

```typescript
{
  id: 'ubg-spell-shadow-growth',
  name: 'Shadow Growth',
  description: 'Destroy target unit. If it had 4+ health, draw a card.',
  cardType: 'spell',
  colors: ['black', 'green'], // Can be cast with BG heroes
  manaCost: 4, // 2BG = 4 total mana
  effect: {
    type: 'targeted_damage', // Placeholder - would need custom effect for destroy + conditional draw
    damage: 0,
  },
}
```

**Design Notes**:
- Works in BG or UBG decks (flexible casting)
- Combines Black's removal with Green's resource generation
- Rewards killing big threats (Green's growth theme)

---

### Prismatic Mastery
**Powerful card advantage + board control**

```typescript
{
  id: 'ubg-spell-prismatic-mastery',
  name: 'Prismatic Mastery',
  description: 'Draw 3 cards, then discard 1. For each different color among your heroes, deal 1 damage to all enemy units.',
  cardType: 'spell',
  colors: ['blue', 'black', 'green'],
  manaCost: 7, // 3UBG = 7 total mana (high cost for powerful effect)
  effect: {
    type: 'custom', // Custom effect: card draw + discard + scaling AOE damage
  },
}
```

**Design Notes**:
- Requires UBG heroes to cast
- Powerful card advantage (draw 3, discard 1)
- AOE damage that scales with color count (2-4 damage)
- Combines UB's control with Green's resource generation
- High cost (7 mana) for late-game power

---

### Void Druid (Tri-Color Hero)
**UBG hero that enables 3-color strategies**

```typescript
{
  id: 'ubg-hero-void-druid',
  name: 'Void Druid',
  description: 'Combines UB control with Green resilience',
  cardType: 'hero',
  colors: ['blue', 'black', 'green'],
  attack: 3,
  health: 10,
  maxHealth: 10,
  currentHealth: 10,
  supportEffect: 'When you cast a spell, draw a card. If you control heroes of 4 different colors, draw 2 cards instead.',
  signatureCardId: 'ubg-sig-druid-1',
  equippedItems: [],
  ability: {
    name: 'Verdant Control',
    description: 'Draw 2 cards. For each different color among your heroes, deal 1 damage to target unit.',
    manaCost: 1,
    cooldown: 2,
    effectType: 'draw_card',
    effectValue: 2, // Base draw 2, scales damage with color count
  },
}
```

**Design Notes**:
- Tri-color hero (UBG) enables 3-color strategies
- Support effect scales with color diversity
- Ability combines card draw (UB) with scaling damage (Green)
- Stronger than dual-color heroes but requires commitment

---

### Void Druid Signature Cards

#### Verdant Bolt (Signature Spell)
```typescript
{
  id: 'ubg-sig-druid-1',
  name: 'Verdant Bolt',
  description: 'Void Druid signature - removal. Deal 3 damage to target unit. If it dies, draw a card.',
  cardType: 'spell',
  colors: ['blue', 'black', 'green'],
  manaCost: 3,
  effect: {
    type: 'targeted_damage',
    damage: 3,
    affectsUnits: true,
    affectsHeroes: true,
  },
}
```

#### Prismatic Shield (Signature Unit)
```typescript
{
  id: 'ubg-sig-druid-2',
  name: 'Prismatic Shield',
  description: 'Void Druid signature - resilient. When this enters, draw a card. This has +0/+2 for each different color among your heroes.',
  cardType: 'generic',
  colors: ['blue', 'black', 'green'],
  manaCost: 4,
  attack: 2,
  health: 4, // Base 4, scales with color count
  maxHealth: 4,
  currentHealth: 4,
}
```

---

### Shadow Sage (Dual-Color Hero)
**BG hero that bridges to UBG**

```typescript
{
  id: 'ubg-hero-shadow-sage',
  name: 'Shadow Sage',
  description: 'Resilient control hero',
  cardType: 'hero',
  colors: ['black', 'green'],
  attack: 2,
  health: 11,
  maxHealth: 11,
  currentHealth: 11,
  supportEffect: 'When an enemy unit dies, draw a card. This hero has +0/+1 for each different color among your heroes.',
  signatureCardId: 'ubg-sig-sage-1',
  equippedItems: [],
  ability: {
    name: 'Verdant Removal',
    description: 'Destroy target unit with 4 or less health. If it had 4+ health, draw a card.',
    manaCost: 1,
    cooldown: 3,
    effectType: 'custom', // Custom effect: conditional removal + card draw
    effectValue: 4, // Health threshold
  },
}
```

**Design Notes**:
- Dual-color hero (BG) that works in UBG decks
- Combines Black's removal with Green's resilience
- Enables 3-color strategies without requiring UBG hero

---

## Implementation Notes

### Color Requirements
These cards require heroes of specific colors to be cast:
- **RWG cards**: Need Red, White, AND Green heroes in the battlefield
- **UBG cards**: Need Blue, Black, AND Green heroes in the battlefield
- **RG/BG cards**: Need the two colors (can be cast with just those two)

### Casting Rules
With 2 battlefields, you can play RWG cards if:
- You have RW hero in Battlefield A and G hero in Battlefield B, OR
- You have RWG hero in either battlefield

This makes 3-color decks more viable than in Foundry's 3-lane system.

### Power Level
- **3-color cards**: 20-30% stronger than 2-color equivalents
- **Convergence effects**: Scale with total color count (reward 4-color decks)
- **Mana costs**: Higher for convergence cards (5-7 mana) to balance power

### Synergy with Existing Archetypes
- **RWG**: Extends RW's go-wide strategy with Green's growth
- **UBG**: Extends UB's control strategy with Green's resilience
- **Both**: Reward color diversity while maintaining archetype identity

---

## Next Steps

1. Add these cards to `comprehensiveCardData.ts`
2. Implement custom effects for:
   - Team buffs that scale with color count
   - Card draw that scales with color count
   - Conditional effects based on color diversity
3. Update color system to support 4 colors
4. Test 3-color decks vs 2-color decks
5. Balance based on playtesting

---

*Document created: 2025-01-XX*
*Status: Example cards ready for implementation*




