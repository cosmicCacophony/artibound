# New Mechanics Guide

> **Created:** 2025-12-23  
> **Last Updated:** 2025-12-23  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Documentation for Equipment, Spellcaster, and Evolve mechanics

## Overview

Artibound introduces three major new mechanics to add depth and variety to gameplay:
1. **Equipment System** - Attachable artifacts that survive unit deaths
2. **Spellcaster Synergies** - Rewards for casting spells
3. **Evolve Mechanics** - Diversity-based unit evolution

## Equipment System

### Concept

Equipment artifacts can be attached to units (heroes or generic units) to provide bonuses. When the equipped unit dies, the equipment returns to base and can be re-equipped to another unit.

### Design Goals

- **Resilience**: Survive board wipes and cleave effects
- **Flexibility**: Can be moved between units
- **Strategic Depth**: Choose which units to equip
- **Resource Investment**: Costs mana to equip and re-equip

### How Equipment Works

1. **Play Equipment**: Pay mana cost, equipment goes to base
2. **Attach to Unit**: Pay equip cost (usually 0 on first equip)
3. **Unit Gets Bonuses**: +attack, +health, abilities
4. **Unit Dies**: Equipment returns to base automatically
5. **Re-Equip**: Pay equip cost again to attach to another unit

### Equipment Properties

```typescript
{
  effectType: 'equipment',
  equipCost: number,        // Mana cost to equip/re-equip
  equipmentBonuses: {
    attack?: number,        // +attack bonus
    health?: number,        // +health bonus
    maxHealth?: number,     // +max health bonus
    abilities?: string[]    // Granted abilities (cleave, taunt, etc.)
  }
}
```

### Equipment Examples

**Armory of the Divine** (White, 6 mana)
- +2/+3 and Taunt
- Equip cost: 2
- Defensive equipment for protecting key units

**Savage Battlemaster** (RG, 6 mana)
- +3/+2 and Cleave
- Equip cost: 3
- Aggressive equipment for RG beatdown

**Guardian's Sanctuary** (WG, 7 mana)
- +2/+4, Taunt
- "At start of turn: Heal 2 HP to your towers"
- Equip cost: 2
- Defensive equipment with tower healing

### Design Guidelines

**Equipment Mana Costs**:
- Cheap equipment (4-5 mana): +1/+1 to +2/+2
- Medium equipment (6-7 mana): +2/+3 to +3/+3 with abilities
- Expensive equipment (8+ mana): +4/+4+ with multiple abilities

**Equip Costs**:
- Simple bonuses: 1-2 mana
- With abilities: 2-3 mana
- Powerful effects: 3-4 mana

**Color Identity**:
- **White**: +health, taunt, armor, healing
- **Red**: +attack, cleave, direct damage
- **Green**: +both stats, overrun, efficient
- **Blue**: Card draw triggers, cost reduction
- **Black**: Life drain, sacrifice triggers, removal

### Strategic Considerations

**When to Play Equipment**:
- Early game: Protect key units from removal
- Mid game: Enhance threats
- Late game: Re-equip after board wipes

**Target Selection**:
- Heroes: Persistent threats, hard to remove
- Key units: Protect your best creatures
- Tokens: Make disposable units valuable

**Counterplay**:
- Bounce effects: Return unit to hand, equipment stays
- Transform effects: Equipment stays attached
- Board wipes: Equipment survives, can be re-equipped

## Spellcaster Synergies

### Concept

Spellcaster heroes and cards reward you for casting spells through mana restoration, cost reduction, and bonus effects.

### Design Goals

- **Enable spell-heavy decks**: Make blue viable
- **Reward diversity**: Encourage mixing spells and units
- **Create decision points**: When to cast spells for value
- **Support control archetypes**: WU, UB, UBR

### Spellcaster Mechanics

**Mana Restoration**:
- Restore mana when you cast a spell
- Usually limited to once per turn (first spell)
- Enables "spell chaining" - cast multiple spells in one turn

**Cost Reduction**:
- Your spells cost less mana
- Passive ability on heroes
- Stacks with multiple heroes

**Spell Damage Bonus**:
- Your spells deal bonus damage
- From heroes or artifacts
- Enhances control strategies

### Spellcaster Examples

**Archmage's Apprentice** (Blue, 4 mana, Rare Hero)
- 2/6
- "When you cast your first spell each turn, restore 2 mana"
- Enables spell-heavy strategies

**Spellweaver's Aegis** (WU, 5 mana, Rare Hero)
- 3/7
- "Your spells cost 1 less"
- "When you cast a spell, your towers gain +1 armor until end of turn"
- Control hero with defensive synergy

### Spellcaster Archetypes

**WU Spellcaster Control**:
- Cheap spells (1-3 mana)
- Spellcaster heroes
- Tower protection
- Win through spell value

**UB Spellcaster Control**:
- Removal spells
- Card draw
- Spellcaster heroes
- Win through value and removal

**UBR Grixis Control**:
- Spells + removal + burn
- Exorcism as finisher
- Spellcaster synergies
- Win through controlling board and burning towers

### Design Guidelines

**Spellcaster Heroes**:
- Lower stats than normal (2-4 attack)
- Higher health (6-8)
- Spell synergy abilities
- Cost 4-6 mana

**Spell Costs for Spellcaster Decks**:
- 1-2 mana: Cantrips, cheap removal
- 3-4 mana: Premium removal, card draw
- 5-7 mana: Finishers, board wipes

**Mana Restoration Balance**:
- 2 mana per spell (once per turn): Strong but fair
- 1 mana per spell: Weaker, can be unlimited
- 3+ mana per spell: Too strong, must be limited

### Strategic Considerations

**Deck Building**:
- 15-20 spells recommended
- Mix of cheap and expensive spells
- 2-3 spellcaster heroes
- Some units for board presence

**Gameplay**:
- Cast cheap spell first to restore mana
- Chain spells together
- Protect spellcaster heroes
- Balance spells and units

**Counterplay**:
- Pressure early before spellcasters stabilize
- Remove spellcaster heroes
- Play around board wipes
- Direct damage to towers

## Evolve Mechanics

### Concept

Evolve units gain bonuses when you've played a certain number of different colors or card types in a turn. Inspired by Legends of Runeterra's evolution system.

### Design Goals

- **Reward diversity**: Encourage multicolor decks
- **Create decision points**: When to play cards for evolve
- **Support midrange**: Reward balanced decks
- **Enable combos**: Evolve + other synergies

### How Evolve Works

1. **Track Diversity**: Game tracks colors/types played each turn
2. **Check Threshold**: Unit checks if threshold is met
3. **Apply Bonuses**: Unit gets +stats and/or abilities
4. **Reset**: Diversity tracking resets at end of turn

### Evolve Properties

```typescript
{
  evolveThreshold: number,  // Colors needed (2-3)
  evolveBonus: {
    attack?: number,        // +attack when evolved
    health?: number,        // +health when evolved
    abilities?: string[]    // Gained abilities
  },
  isEvolved?: boolean       // Current evolved state
}
```

### Evolve Examples

**Void Devourer** (Black, 5 mana, Rare)
- 3/4 base stats
- Evolve 3: Becomes 6/7
- Gains: "When this kills a unit, draw a card"
- Rewards 3-color decks

**Worldshaper Colossus** (Green, 7 mana, Rare)
- 6/8 base stats
- Evolve 2: Gains "Can attack immediately" and "Overrun"
- Rewards 2-color decks

### Evolve Thresholds

**Evolve 2**: Easy to achieve
- 2-color guilds can trigger
- Common on efficient creatures
- Modest bonuses (+1/+1, minor ability)

**Evolve 3**: Moderate difficulty
- 3-color wedges trigger reliably
- Rare on powerful creatures
- Strong bonuses (+3/+3, powerful ability)

**Evolve 4**: Hard to achieve
- 4-5 color decks only
- Very rare, very powerful
- Game-winning bonuses

### Design Guidelines

**Evolve Costs**:
- Evolve 2: 4-6 mana creatures
- Evolve 3: 5-7 mana creatures
- Evolve 4: 7+ mana creatures

**Evolve Bonuses**:
- Evolve 2: +1/+1 to +2/+2
- Evolve 3: +2/+2 to +3/+3 with ability
- Evolve 4: +4/+4 with multiple abilities

**Color Identity**:
- **Green**: Efficient evolve creatures (Evolve 2)
- **Black**: Card draw on evolve
- **Blue**: Spell synergies on evolve
- **Red**: Aggressive abilities (cleave, haste)
- **White**: Defensive abilities (taunt, armor)

### Strategic Considerations

**Deck Building**:
- 3-4 colors for Evolve 3
- Mix of card types
- Rune artifacts for fixing
- Evolve creatures as payoffs

**Gameplay**:
- Play diverse cards early
- Save evolve creatures for when you can trigger
- Maximize value from evolved state
- Plan turns around evolve triggers

**Counterplay**:
- Remove evolve creatures before they evolve
- Pressure before they stabilize
- Board wipes reset evolve state
- Fast aggro doesn't give time to evolve

## Mechanic Interactions

### Equipment + Spellcaster
- Equip spellcaster heroes for protection
- Equipment with spell synergies
- Re-equip after board wipes

### Equipment + Evolve
- Equip evolved creatures for massive threats
- Equipment survives when evolved creatures die
- Stack bonuses for game-winning plays

### Spellcaster + Evolve
- Cast spells to enable evolve
- Evolved creatures with spell synergies
- Control decks with evolve finishers

## Balance Considerations

### Equipment
- **Too Strong**: Equipment that's too cheap or provides too much value
- **Too Weak**: Equipment that costs too much to re-equip
- **Sweet Spot**: 6-7 mana equipment with 2-3 mana re-equip cost

### Spellcaster
- **Too Strong**: Unlimited mana restoration
- **Too Weak**: Mana restoration that doesn't enable combos
- **Sweet Spot**: 2 mana restoration once per turn

### Evolve
- **Too Strong**: Easy to trigger with massive bonuses
- **Too Weak**: Hard to trigger with small bonuses
- **Sweet Spot**: Evolve 2-3 with +2/+2 to +3/+3 and one ability

## Future Expansion

Potential additions:
- **Equipment Types**: Weapons, Armor, Accessories
- **Spellcaster Tiers**: Different levels of spell synergy
- **Evolve Variants**: Type-based evolve, permanent evolution
- **Cross-Mechanic Payoffs**: Cards that care about all three mechanics

