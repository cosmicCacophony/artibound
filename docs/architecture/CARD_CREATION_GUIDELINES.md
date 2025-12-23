# Card Creation Guidelines

> **Created:** 2024-12-XX  
> **Last Updated:** 2025-12-23  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Architecture  
> **Notes:** Guidelines for creating cards in the guild-based archetype system

## Guild-Based Archetype System

**IMPORTANT:** Artibound uses a **guild-based archetype system** with 5 two-color guilds, 5 three-color wedges, and support for five-color decks.

See [`docs/design/GUILD_SYSTEM.md`](../design/GUILD_SYSTEM.md) for complete guild design documentation.

### Supported Archetypes

**Two-Color Guilds:**
- `'guild-rg'` - Red-Green: Efficient creatures + cleave
- `'guild-wg'` - White-Green: Efficient creatures + tower protection
- `'guild-wu'` - White-Blue: Spellcaster + tower protection
- `'guild-ub'` - Blue-Black: Spellcaster + removal
- `'guild-br'` - Black-Red: Removal + aggro
- `'guild-rw'` - Red-White Legion: Go-wide (special)

**Three-Color Wedges:**
- `'wedge-rgw'` - Naya (RG + white splash)
- `'wedge-gwu'` - Bant (WG + blue splash)
- `'wedge-wub'` - Esper (WU + black splash)
- `'wedge-ubr'` - Grixis (UB + red splash)
- `'wedge-brg'` - Jund (BR + green splash)

**Five-Color:**
- `'five-color'` - Rainbow (high-roll deck)

**Legacy (for backward compatibility):**
- `'rw-legion'`, `'ub-control'`, `'ubg-control'`

## Rarity System

All cards should have a rarity field:

```typescript
rarity?: 'common' | 'uncommon' | 'rare'
```

**Target Distribution:**
- **70% common**: Core cards, curve fillers, basic effects
- **20% uncommon**: Good removal, solid units, multicolor cards
- **10% rare**: Bombs, finishers, unique effects

**Rarity Guidelines:**
- **Common**: Simple effects, fair stats, 1-5 mana
- **Uncommon**: Good effects, above-curve stats, 3-6 mana
- **Rare**: Unique effects, game-changing, 4-9 mana

## Color Identity

When creating cards, follow these color identities:

### White
- **Mechanics**: Tower protection, unit buffs, healing, equipment
- **Playstyle**: Defensive, supportive, resilient
- **Card Types**: Protection spells, healing, taunt units, equipment

### Blue
- **Mechanics**: Card draw, spellcaster synergy, bounce, cost reduction
- **Playstyle**: Controlling, reactive, spell-based
- **Card Types**: Cantrips, bounce spells, spellcaster heroes

### Black
- **Mechanics**: Removal, sacrifice, life drain, evolve
- **Playstyle**: Controlling, value-oriented, resource conversion
- **Card Types**: Destroy effects, sacrifice outlets, card draw

### Red
- **Mechanics**: Direct damage, cleave, aggressive units, burn
- **Playstyle**: Aggressive, proactive, fast
- **Card Types**: Burn spells, cleave units, aggressive creatures

### Green
- **Mechanics**: Efficient creatures, +1/+1 counters, evolve, overrun
- **Playstyle**: Midrange, creature-based, efficient
- **Card Types**: Efficient creatures, ramp, combat tricks

## New Mechanics

See [`docs/design/NEW_MECHANICS.md`](../design/NEW_MECHANICS.md) for complete mechanics documentation.

### Equipment Artifacts

Equipment can be attached to units and survives when they die:

```typescript
{
  cardType: 'artifact',
  effectType: 'equipment',
  rarity: 'rare',
  equipCost: 2,
  equipmentBonuses: {
    attack: 2,
    health: 3,
    abilities: ['taunt']
  }
}
```

**Design Guidelines:**
- Mana cost: 4-8
- Equip cost: 1-4 (usually 2-3)
- Bonuses: +1/+1 to +4/+4
- Abilities: cleave, taunt, overrun, etc.

### Spellcaster Synergies

Heroes with spell synergies:

```typescript
{
  cardType: 'hero',
  ability: {
    trigger: 'on_spell_cast',
    manaRestore: 2,           // Restore mana when casting spells
    spellCostReduction: 1,    // Spells cost less
    spellDamageBonus: 1,      // Spells deal more damage
  }
}
```

**Design Guidelines:**
- Mana restore: 1-2 (once per turn)
- Cost reduction: 1-2
- Damage bonus: 1-2
- Lower attack (2-4), higher health (6-8)

### Evolve Mechanics

Units that get bonuses when you play diverse colors:

```typescript
{
  cardType: 'generic',
  evolveThreshold: 3,
  evolveBonus: {
    attack: 3,
    health: 3,
    abilities: ['When this kills a unit, draw a card']
  }
}
```

**Design Guidelines:**
- Evolve 2: +1/+1 to +2/+2
- Evolve 3: +2/+2 to +3/+3 with ability
- Evolve 4: +4/+4 with multiple abilities

## Card Matching Logic

Cards are matched to archetypes using `cardMatchesArchetype()` in `src/game/draftSystem.ts`:

**Guild Matching:**
- Card colors must be a subset of guild colors
- Example: `['red']` or `['red', 'green']` matches `guild-rg`

**Wedge Matching:**
- Card colors must be a subset of wedge's 3 colors
- Example: `['red', 'green', 'white']` matches `wedge-rgw`

**Five-Color:**
- Any colored card matches

## Common Patterns

### Efficient Creatures (Green)
```typescript
{
  name: 'Efficient Bear',
  cardType: 'generic',
  rarity: 'common',
  colors: ['green'],
  manaCost: 3,
  attack: 3,
  health: 3,
}
```

### Removal Spell (Black)
```typescript
{
  name: 'Destroy',
  cardType: 'spell',
  rarity: 'uncommon',
  colors: ['black'],
  manaCost: 3,
  consumesRunes: true,
  effect: {
    type: 'targeted_damage',
    damage: 999, // Destroy effect
  }
}
```

### Multicolor Bomb (Rare)
```typescript
{
  name: 'Guild Champion',
  cardType: 'generic',
  rarity: 'rare',
  colors: ['red', 'green'],
  manaCost: 6,
  consumesRunes: true,
  attack: 6,
  health: 6,
  // + special ability
}
```

## Testing Your Cards

After creating cards:
1. Generate draft packs
2. Verify cards appear with correct rarity distribution
3. Check guild/wedge filtering works
4. Test new mechanics (equipment, spellcaster, evolve)

## File Locations

- **Card definitions**: `src/game/comprehensiveCardData.ts`
- **Archetype matching**: `src/game/draftSystem.ts`
- **Equipment system**: `src/game/equipmentSystem.ts`
- **Spellcaster system**: `src/game/spellcasterSystem.ts`
- **Evolve system**: `src/game/evolveSystem.ts`
- **Type definitions**: `src/game/types.ts`

## Common Mistakes to Avoid

1. ❌ **Forgetting rarity field** - Always specify rarity
2. ❌ **Wrong color combinations** - Check guild compatibility
3. ❌ **Equipment without equipCost** - Equipment needs equip cost
4. ❌ **Evolve without threshold** - Evolve units need threshold
5. ✅ **Follow color identity** - Match mechanics to colors
6. ✅ **Balance rarity distribution** - Mostly commons, few rares
7. ✅ **Test in draft** - Verify cards work in packs



