# Combo System Design

This document describes the combo archetypes added to Artibound, inspired by classic MTG combo strategies.

## Overview

Combos in Artibound require assembling 2-5 cards (heroes, units, items, spells) to create powerful synergies. Unlike MTG where you draw through a 60-card deck, Artibound's draft structure means you see more of your deck, so combos can require more pieces.

---

## Combo 1: Storm (Infinite Runes → Tower Damage)

**Theme:** Generate massive temporary runes, convert to direct damage.

### Key Pieces

| Card | Type | Cost | Effect |
|------|------|------|--------|
| **Rune Channeler** | Hero (UB) | - | Ability: Spend 3 runes → Deal 2 tower damage. NO COOLDOWN. |
| **Storm Conduit** | Unit (UB) | 3 | When you add temp runes, add 1 additional rune of that color. |
| **Ritual Keeper** | Unit (B) | 2 | When you cast a spell that adds runes, deal 1 tower damage. |
| **Dark Ritual** | Spell (B) | 1 | Add BBB temporarily. |
| **Cabal Ritual** | Spell (BB) | 3 | Add BBBBB temporarily. Consumes BB runes. |
| **Ritual Recursion** | Spell (B) | 2 | Add BB temporarily. Draws a card. |

### The Loop (Simplified)

1. Deploy **Rune Channeler** + **Storm Conduit** + **Ritual Keeper**
2. Cast **Dark Ritual** (1 mana) → Get BBB + 1 (from Conduit) = BBBB. Ritual Keeper deals 1 damage.
3. Use Rune Channeler ability: Spend BBB → Deal 2 damage. Left with B.
4. Cast **Cabal Ritual** (3 mana, consumes BB) → But we only have B... need more setup.

### Realistic Combo Line

With **2x Dark Ritual**, **1x Cabal Ritual**, **Rune Channeler**, **Storm Conduit**:

1. Cast Dark Ritual #1 (1 mana) → BBBB (3 + 1 from Conduit)
2. Cast Dark Ritual #2 (1 mana) → BBBB + BBBB = 8 black runes
3. Cast Cabal Ritual (3 mana, uses BB) → 6 remaining + 6 new = 12 black runes
4. Activate Rune Channeler 4x (spend 3 each) = 8 tower damage

**Total: 5 mana, 3 cards → 8+ tower damage in one turn**

### Implementation Notes

- Rune Channeler's ability needs `effectType: 'rune_to_damage'` with `runeCost` and `cooldown: 0`
- Storm Conduit's effect is a triggered ability (needs event system)
- Ritual Keeper's effect is a triggered ability (needs spell cast tracking)

---

## Combo 2: Aristocrats (Sacrifice Engine)

**Theme:** Repeatedly sacrifice and recur creatures for incremental value.

### Key Pieces

| Card | Type | Cost | Effect |
|------|------|------|--------|
| **Blood Artist** | Hero (B) | - | Ability: Sacrifice a unit → Deal 2 tower damage + gain 1 gold. NO COOLDOWN. |
| **Sacrificial Altar** | Unit (B) | 2 | You may sacrifice this to add BBB temporarily. |
| **Gravecrawler** | Unit (B) | 1 | When this dies, return it to your hand at start of next turn. |
| **Doomed Dissenter** | Unit (B) | 2 | When this dies, create a 2/2 Zombie token. |

### The Loop

1. Deploy **Blood Artist** + **Gravecrawler** in same lane
2. Use Blood Artist ability: Sacrifice Gravecrawler → 2 damage + 1 gold
3. Gravecrawler returns to hand at start of next turn
4. Replay Gravecrawler (1 mana), repeat

**Each turn: 1 mana → 2 damage + 1 gold (net 0 after replaying)**

### Going Infinite (Needs More Pieces)

Add **Sacrificial Altar** for mana generation:
1. Sacrifice Altar → Get BBB (3 runes, not mana though)
2. Need a way to convert runes to mana, or replay Altar...

For true infinite, need:
- **Death trigger that creates tokens** (Doomed Dissenter)
- **Token creation that's free**
- Or reduce costs somehow

### Implementation Notes

- Blood Artist's ability needs `effectType: 'sacrifice_unit'` with targeting
- Gravecrawler needs death trigger → add to hand (needs death event system)
- Doomed Dissenter needs death trigger → spawn token

---

## Combo 3: Bounce (Deploy Triggers)

**Theme:** Repeatedly deploy heroes to trigger ETB effects.

### Key Pieces

| Card | Type | Cost | Effect |
|------|------|------|--------|
| **Echo Mage** | Hero (U) | - | When deployed, deal 1 damage to enemy tower. Ability: Return to hand (1 mana, CD 1). |
| **Mana Battery** | Unit (U) | 3 | At start of turn, add UU temporarily. |
| **Cloud Sprite** | Unit (U) | 1 | When a hero is deployed to this lane, gains +1/+1. |
| **Ghostly Flicker** | Unit (U) | 3 | When this enters, may return another unit to hand. |

### The Loop

1. Deploy **Echo Mage** → 1 tower damage
2. Deploy **Mana Battery** in same lane
3. Use Echo Mage ability (1 mana) → Return to hand
4. Next turn: Get UU from Mana Battery
5. Redeploy Echo Mage → 1 damage, still have mana left

**Each turn: Free 1 damage if Mana Battery is out**

### Scaling Up

With **2x Mana Battery** (UUUU per turn):
- Redeploy Echo Mage + play other cards
- Cloud Sprites grow each time

### Implementation Notes

- Echo Mage needs deploy trigger (ETB) → deal damage
- Mana Battery needs start-of-turn trigger → add temp runes
- Cloud Sprite needs deploy trigger in same lane → buff self

---

## Required Systems (Not Yet Implemented)

### 1. Triggered Abilities
- **On Deploy (ETB):** When a card enters the battlefield
- **On Death:** When a card dies
- **On Spell Cast:** When a spell is cast
- **Start of Turn:** Beginning of each turn

### 2. Hero Ability: Sacrifice Unit
```typescript
// In useHeroAbilities.ts
case 'sacrifice_unit':
  // Player selects a unit they control
  // Remove unit from battlefield
  // Apply effect (damage, gold, etc.)
  break
```

### 3. Hero Ability: Rune to Damage
```typescript
// In useHeroAbilities.ts
case 'rune_to_damage':
  // Check if player has enough runes (ability.runeCost)
  // Consume runes
  // Deal damage to enemy tower (ability.effectValue)
  break
```

### 4. Spell Effect: Create Seal
```typescript
// When casting a seal spell
case 'create_seal':
  // Add seal to player's seals array
  // Seal generates rune each turn
  break
```

---

## Balance Considerations

1. **Combo requires setup time:** 2-3 turns to assemble pieces
2. **Opponent can disrupt:** Kill key pieces, bounce, stun
3. **Resource intensive:** Rune costs, mana costs
4. **Tower HP is 20:** Most combos deal 4-10 damage per activation
5. **Roguelike context:** AI opponents will have overpowered cards to compensate for weaker play

---

## Testing Checklist

- [ ] Rune Channeler can activate ability repeatedly in one turn
- [ ] Temporary runes clear at end of turn
- [ ] Seals generate runes at start of turn
- [ ] Dark Ritual adds BBB correctly
- [ ] Storm Conduit bonus triggers (needs implementation)
- [ ] Blood Artist sacrifice works (needs implementation)
- [ ] Gravecrawler returns to hand on death (needs implementation)
- [ ] Echo Mage deals damage on deploy (needs implementation)

