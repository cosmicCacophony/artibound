# Dopamine Hit Mechanics - Memorable Gameplay Moments

> **Created:** 2025-01-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Powerful, exciting cards that create memorable moments inspired by Artifact Foundry

## Overview

A collection of powerful mechanics that create "dopamine hits" - exciting, memorable moments that players remember and talk about. These cards are inspired by Artifact Foundry's most satisfying mechanics, adapted for Artibound.

## Design Philosophy

### Core Principle
**Dopamine hits should feel powerful, create memorable moments, and reward strategic play.**

### Goals
1. **Memorable Moments**: Cards that create stories ("I wiped 3 units with one card!")
2. **Strategic Depth**: Require setup or positioning to maximize value
3. **Color Identity**: Each color has distinct dopamine hit mechanics
4. **High Impact**: Powerful effects that feel rewarding when they work
5. **Skill Expression**: Better players get more value from these cards

---

## Red/Green (RG) - Fighting Mechanics

### RG 6-Drop: Multi-Fight Unit

**Concept**: A 6-mana unit that fights enemies in front and adjacent to it. Can wipe 3 units if positioned correctly.

**Design**:
```typescript
{
  id: 'rg-unit-battle-tyrant',
  name: 'Battle Tyrant',
  description: '6/7. When this enters, it fights all enemy units in front of it and adjacent to it. (Can wipe 3 units if lucky)',
  cardType: 'generic',
  colors: ['red', 'green'],
  manaCost: 6,
  attack: 6,
  health: 7,
  maxHealth: 7,
  currentHealth: 7,
  specialEffects: ['multi_fight'], // Custom effect: fights front + adjacent
}
```

**Dopamine Moment**: 
- Deploy in slot 3 with enemies in slots 2, 3, 4
- Fights all 3 enemies simultaneously
- Can wipe entire board section with one card

### RG Hero: Activated Fight Ability

**Concept**: Hero with activated ability to fight front/adjacent. Low attack (3), so you want to buff it first.

**Design**:
```typescript
{
  id: 'rg-hero-axe-warrior',
  name: 'Axe Warrior',
  description: '3/10. Activated (1 mana): Fight all enemy units in front of this hero and adjacent to it.',
  cardType: 'hero',
  colors: ['red', 'green'],
  attack: 3,
  health: 10,
  maxHealth: 10,
  currentHealth: 10,
  supportEffect: 'Can fight enemy units',
  signatureCardId: 'rg-sig-axe-1',
  equippedItems: [],
  ability: {
    name: 'Battle Rage',
    description: 'Fight all enemy units in front of this hero and adjacent to it.',
    manaCost: 1,
    cooldown: 0, // Can use multiple times
    effectType: 'multi_fight', // Custom effect
    effectValue: 3, // Can hit up to 3 units
  },
}
```

**Dopamine Moment**:
- Buff hero to 6+ attack first
- Activate ability to fight 3 enemies
- Wipes multiple units with one activation

---

## Blue - AOE Board Clearing

### Blue AOE Spells

**Concept**: Powerful AOE damage spells that clear multiple units.

**Design Examples**:
```typescript
{
  id: 'blue-spell-thunderstorm',
  name: 'Thunderstorm',
  description: 'Deal 4 damage to all enemy units.',
  cardType: 'spell',
  colors: ['blue'],
  manaCost: 5,
  effect: {
    type: 'aoe_damage',
    damage: 4,
    affectsUnits: true,
    affectsHeroes: true,
    affectsEnemyUnits: true,
  },
}
```

**Dopamine Moment**:
- Opponent has 4 units on board
- Cast Thunderstorm
- Wipes entire board in one spell

---

## Black - Cross-Lane Mechanics

### Black Cross-Lane Spells

**Concept**: Spells that can target units/heroes across battlefields, or move heroes to assassinate.

**Design Examples**:
```typescript
{
  id: 'black-spell-assassinate',
  name: 'Assassinate',
  description: 'Destroy target unit or hero. You may move one of your heroes to the target\'s battlefield.',
  cardType: 'spell',
  colors: ['black'],
  manaCost: 4,
  effect: {
    type: 'targeted_damage',
    damage: 999,
    affectsUnits: true,
    affectsHeroes: true,
    crossLane: true, // Can target across battlefields
  },
}
```

**Dopamine Moment**:
- Opponent has weak hero in Battlefield B
- Cast Assassinate from Battlefield A
- Move your hero to finish it off
- Cross-lane assassination feels powerful

### Black Hero Movement

**Concept**: Hero ability to move across battlefields to assassinate.

**Design**:
```typescript
{
  id: 'black-hero-assassin',
  name: 'Shadow Assassin',
  description: '4/8. Activated (1 mana): Move this hero to any battlefield. If it moves, it may fight an enemy unit there.',
  cardType: 'hero',
  colors: ['black'],
  attack: 4,
  health: 8,
  maxHealth: 8,
  currentHealth: 8,
  supportEffect: 'Gain gold when units die',
  signatureCardId: 'black-sig-assassin-1',
  equippedItems: [],
  ability: {
    name: 'Shadow Step',
    description: 'Move this hero to any battlefield. If it moves, it may fight an enemy unit there.',
    manaCost: 1,
    cooldown: 2,
    effectType: 'move_and_fight', // Custom effect
    effectValue: 1,
  },
}
```

**Dopamine Moment**:
- Opponent has weak hero in other battlefield
- Move assassin across battlefields
- Fight and kill the hero
- Cross-lane assassination

---

## Green - Combat Protection & High Stats

### Green Protection Spells

**Concept**: Spells that protect your board in combat, or units with high stats.

**Design Examples**:
```typescript
{
  id: 'green-spell-nature-shield',
  name: 'Nature\'s Shield',
  description: 'All your units gain +0/+4 until end of turn. They cannot be destroyed this turn.',
  cardType: 'spell',
  colors: ['green'],
  manaCost: 4,
  effect: {
    type: 'team_buff',
    damage: 0,
    protection: true, // Units cannot be destroyed
  },
}
```

**Dopamine Moment**:
- Opponent attacks with 3 units
- Cast Nature's Shield
- All your units survive combat
- Opponent's units die, yours live

### Green High-Stat Units

**Concept**: Units with above-average stats for their cost.

**Design Examples**:
```typescript
{
  id: 'green-unit-ancient-beast',
  name: 'Ancient Beast',
  description: '7/9. Big creature with high stats.',
  cardType: 'generic',
  colors: ['green'],
  manaCost: 6,
  attack: 7,
  health: 9,
  maxHealth: 9,
  currentHealth: 9,
}
```

**Dopamine Moment**:
- Deploy 7/9 for 6 mana (above curve)
- Opponent can't easily remove it
- Dominates combat

---

## White - Tower Healing & Protection

### White Tower Healing

**Concept**: Spells that heal your tower.

**Design Examples**:
```typescript
{
  id: 'white-spell-divine-healing',
  name: 'Divine Healing',
  description: 'Heal your tower for 5 HP. Draw a card.',
  cardType: 'spell',
  colors: ['white'],
  manaCost: 3,
  effect: {
    type: 'tower_heal',
    healAmount: 5,
    drawCard: true,
  },
}
```

**Dopamine Moment**:
- Tower at 5 HP (almost dead)
- Cast Divine Healing
- Tower back to 10 HP
- Gain card advantage

### White Indestructible Shields

**Concept**: Units or spells that give indestructible to your units.

**Design Examples**:
```typescript
{
  id: 'white-spell-divine-protection',
  name: 'Divine Protection',
  description: 'Target unit gains indestructible until end of turn. (Cannot be destroyed)',
  cardType: 'spell',
  colors: ['white'],
  manaCost: 2,
  effect: {
    type: 'targeted_buff',
    indestructible: true,
  },
}
```

**Dopamine Moment**:
- Opponent tries to kill your key unit
- Cast Divine Protection
- Unit survives everything
- Opponent wasted resources

### White Disarm

**Concept**: Spells that disarm enemy units (prevent them from attacking).

**Design Examples**:
```typescript
{
  id: 'white-spell-disarm',
  name: 'Disarm',
  description: 'Target enemy unit cannot attack this turn. Draw a card.',
  cardType: 'spell',
  colors: ['white'],
  manaCost: 2,
  effect: {
    type: 'stun', // Stun prevents attacking
    drawCard: true,
  },
}
```

**Dopamine Moment**:
- Opponent has big threat ready to attack
- Cast Disarm
- Threat can't attack this turn
- You get card advantage

---

## Special: Self-Fight Hero

### Hero That Makes Attackers Fight Themselves

**Concept**: Hero ability that makes units that attack it fight themselves with +2 damage.

**Design**:
```typescript
{
  id: 'white-hero-reflector',
  name: 'Divine Reflector',
  description: '3/11. When an enemy unit attacks this hero, that unit fights itself with +2 damage instead.',
  cardType: 'hero',
  colors: ['white'],
  attack: 3,
  health: 11,
  maxHealth: 11,
  currentHealth: 11,
  supportEffect: 'Reflects attacks',
  signatureCardId: 'white-sig-reflector-1',
  equippedItems: [],
  ability: {
    name: 'Divine Reflection',
    description: 'When an enemy unit attacks this hero, that unit fights itself with +2 damage instead.',
    manaCost: 0,
    cooldown: 0,
    effectType: 'reflect_attack', // Custom effect
    effectValue: 2, // +2 damage when fighting itself
  },
}
```

**Dopamine Moment**:
- Hero has taunt (forces attacks)
- 3 enemy units attack it
- Each unit fights itself with +2 damage
- All 3 enemy units die
- Hero survives

---

## Implementation Priorities

### High Priority (Phase 1)

#### RG Fighting Mechanics
- [ ] **Battle Tyrant** (6 mana, RG): Fights front + adjacent on enter
- [ ] **Axe Warrior Hero** (RG): Activated fight ability
- [ ] **Fight Spell** (4 mana, RG): Target unit fights front + adjacent

#### Blue AOE
- [ ] **Thunderstorm** (5 mana, U): Deal 4 to all enemies
- [ ] **Chain Lightning** (4 mana, U): Deal 3 to all enemies
- [ ] **Arcane Explosion** (6 mana, U): Deal 5 to all enemies

#### Black Cross-Lane
- [ ] **Assassinate** (4 mana, B): Destroy + move hero
- [ ] **Shadow Assassin Hero** (B): Move across battlefields
- [ ] **Cross-Lane Murder** (5 mana, B): Destroy unit in other battlefield

#### Green Protection
- [ ] **Nature's Shield** (4 mana, G): +0/+4 + indestructible
- [ ] **Ancient Beast** (6 mana, G): 7/9 high stats
- [ ] **Combat Protection** (3 mana, G): Units can't die this turn

#### White Support
- [ ] **Divine Healing** (3 mana, W): Heal tower 5 HP
- [ ] **Divine Protection** (2 mana, W): Indestructible
- [ ] **Disarm** (2 mana, W): Prevent attack + draw

#### Special
- [ ] **Divine Reflector Hero** (W): Makes attackers fight themselves

### Medium Priority (Phase 2)

#### Additional RG
- [ ] More fight mechanics
- [ ] Fight-based units

#### Additional Blue
- [ ] More AOE variations
- [ ] Board wipe finishers

#### Additional Black
- [ ] More cross-lane mechanics
- [ ] Hero movement spells

#### Additional Green
- [ ] More protection spells
- [ ] More high-stat units

#### Additional White
- [ ] More tower healing
- [ ] More protection effects

---

## Success Criteria

### Gameplay Experience
- ✅ Cards create memorable moments
- ✅ Players remember specific plays
- ✅ Strategic depth (setup/positioning matters)
- ✅ High impact when they work

### Color Identity
- ✅ Each color has distinct dopamine hits
- ✅ Colors feel different to play
- ✅ Players can identify color by mechanics

### Balance
- ✅ Powerful but not game-breaking
- ✅ Require setup or positioning
- ✅ Skill expression matters
- ✅ Counterplay exists

---

## Related Documents
- `docs/design/RARE_HERO_SYSTEM.md` - Rare hero system
- `docs/ARCHETYPE_DESIGN_GUIDE.md` - All archetypes (consolidated)
- `src/game/combatSystem.ts` - Combat system implementation



