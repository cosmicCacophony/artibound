# Combo System Design

This document describes the combo archetypes added to Artibound, inspired by classic MTG combo strategies.

## Overview

Combos in Artibound require assembling **3-5 cards** (heroes, units, items, spells) to create powerful synergies. Unlike MTG where you draw through a 60-card deck, Artibound's draft structure means you see more of your deck, so combos can require more pieces.

**Design Philosophy:**
- **3-5 pieces required**: Combos should require meaningful setup, not just 2-card combos
- **Counterplay exists**: Opponent can disrupt by killing key pieces, making combos brittle
- **Non-infinite preferred**: Instead of pure infinite loops, consider incremental value (e.g., add +1 attack per loop)
- **Setup time**: Combos may require waiting a turn to deploy all pieces, creating vulnerability
- **Rapid deploy mechanics**: Consider allowing bounce + redeploy in same turn for combo enablers

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

1. **Combo requires setup time:** 2-3 turns to assemble 3-5 pieces
2. **Opponent can disrupt:** Kill key pieces, bounce, stun - combos are brittle if opponent removes one piece
3. **Resource intensive:** Rune costs, mana costs
4. **Tower HP is 20:** Most combos deal 4-10 damage per activation
5. **Roguelike context:** AI opponents will have overpowered cards to compensate for weaker play
6. **Non-infinite design:** Prefer incremental value over infinite loops (e.g., add +1 attack per loop instead of infinite damage)
7. **Counterplay window:** Setup time creates vulnerability - opponent has turns to respond

## New Combo Concepts (From Playtesting)

### Rapid Deploy Loop
**Concept:** Bounce using runes, but bounced card creates runes (through items/abilities) that net you a rune, enabling infinite runes → payoff

**Example:**
- Hero with ability: "Spend 3 runes → Return this hero to hand, then deploy it for free"
- Item: "When this hero is deployed, add RRR temporarily"
- **Loop:** Spend 3 runes → bounce → redeploy → get 3 runes back → repeat
- **Payoff:** Each loop triggers ETB effects, deals damage, or generates value

**Design Note:** Net rune cost should be 0 or positive, creating the loop

### Copy Hero Combo
**Concept:** Copy hero temporarily, copy items on that hero, strong item lets you copy again, fill lane with 4-5 copies

**Example:**
- **Mirror Image** (Spell, 4 mana UU): "Create a token copy of target hero. Copy all items on that hero."
- **Mirror Shard** (Item, 8 gold): "When this hero enters, you may create a token copy of it."
- **Loop:** Deploy hero with Mirror Shard → create copy → copy has Mirror Shard → create more copies
- **Payoff:** Fill lane with 4-5 copies, each with strong ETB effects (e.g., draw 4-5 cards, deal 4-5 damage)

**Design Note:** Requires 3-4 pieces: hero, Mirror Image spell, Mirror Shard item, payoff ETB

### Lich Combo (Sacrifice Engine)
**Concept:** Sac unit to add runes, whenever you sac create a unit, whenever you create runes add additional rune

**Example:**
- **Lich Lord** (Hero, B): "Ability: Sacrifice a unit → Add BBB temporarily. No cooldown."
- **Soul Forge** (Unit, 3 mana B): "When you sacrifice a unit, create a 1/1 Zombie token."
- **Rune Amplifier** (Unit, 2 mana B): "When you add temporary runes, add 1 additional rune of that color."
- **Loop:** Sac Zombie → get BBB + 1 (from Amplifier) = BBBB → create new Zombie → repeat
- **Payoff:** Infinite runes → convert to damage via Rune Channeler or similar

**Design Note:** Non-infinite variant: Instead of infinite, each loop adds +1 attack to a unit (counterplay, not auto-win)

### Non-Infinite Variants
**Philosophy:** Instead of pure infinite loops, create incremental value that scales but has counterplay

**Examples:**
- **Incremental Attack:** Each loop adds +1 attack to a unit (opponent can kill the unit)
- **Limited Loops:** Combo can only be activated 3-5 times per turn (resource cap)
- **Scaling Cost:** Each activation costs more (1 rune → 2 runes → 3 runes, eventually stops)
- **Temporary Value:** Generated value lasts only this turn (can't stockpile)

**Design Note:** Creates interesting decisions - when to go off, how many times, risk vs reward

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
- [ ] Rapid deploy mechanics work (bounce + redeploy same turn)
- [ ] Non-infinite combos provide incremental value without auto-winning
- [ ] 3-5 piece combos feel balanced (not too easy, not too hard)
- [ ] Counterplay exists (opponent can disrupt by killing key pieces)

## Future Combo Ideas to Explore

- **Sensei's Top variant:** Instead of library manipulation, goes to base, reduces cost for infinite effect
- **Omniscience/Storm effects:** Free spells, storm count mechanics
- **Venomancer:** Spawns units, once you get enough it enables combo
- **Tyrndamere combo from Riftbound:** Reference for design inspiration
- **Artifact/Gear loops:** Add runes for artifacts/gear, untapper loops
- **Mage Armor Lux build:** OP builds under certain conditions, maybe reroll mechanic for items



