# Guild System Design

> **Created:** 2025-12-23  
> **Last Updated:** 2025-12-23  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Core guild-based archetype system for Artibound

## Overview

Artibound uses a guild-based archetype system inspired by Magic: The Gathering's Ravnica guilds. The system supports:
- **5 two-color guilds** (primary archetypes)
- **5 three-color wedges** (splash archetypes)
- **Five-color rainbow** (high-roll deck)
- **RW Legion** (special strong 2-color archetype)

## Color Philosophy

### White
- **Identity**: Protection, order, community
- **Mechanics**: Tower protection, unit buffs, healing, equipment synergy
- **Playstyle**: Defensive, supportive, resilient

### Blue
- **Identity**: Knowledge, control, manipulation
- **Mechanics**: Card draw, spellcaster synergy, bounce, cost reduction
- **Playstyle**: Controlling, reactive, spell-based

### Black
- **Identity**: Ambition, sacrifice, power at any cost
- **Mechanics**: Removal, sacrifice effects, life drain, evolve synergy
- **Playstyle**: Controlling, value-oriented, resource conversion

### Red
- **Identity**: Passion, chaos, freedom
- **Mechanics**: Direct damage, cleave, aggressive units, burn
- **Playstyle**: Aggressive, proactive, fast

### Green
- **Identity**: Nature, growth, strength
- **Mechanics**: Efficient creatures, +1/+1 counters, evolve, overrun
- **Playstyle**: Midrange, creature-based, efficient

## Two-Color Guilds

### RG (Red-Green) - "Gruul"
**Theme**: Efficient aggression with cleave
**Strategy**: Play efficient green creatures, enhance them with red's cleave and direct damage
**Key Cards**:
- Efficient green creatures (3/3 for 3, 4/4 for 4)
- Red cleave units and spells
- Equipment that grants cleave (Savage Battlemaster)

**Draft Priority**:
1. Efficient creatures (green)
2. Cleave effects (red)
3. Combat tricks and removal
4. Equipment for resilience

### WG (White-Green) - "Selesnya"
**Theme**: Efficient creatures with tower protection
**Strategy**: Build a board of efficient creatures while protecting towers and gaining life
**Key Cards**:
- Efficient green creatures
- White protection and healing
- Equipment with taunt (Guardian's Sanctuary)
- Tower healing effects

**Draft Priority**:
1. Efficient creatures (green)
2. Tower protection (white)
3. Healing effects
4. Taunt units/equipment

### WU (White-Blue) - "Azorius"
**Theme**: Spellcaster control with tower protection
**Strategy**: Control the board with spells while protecting towers, win with spell synergies
**Key Cards**:
- Spellcaster heroes (Spellweaver's Aegis, Archmage's Apprentice)
- Cheap spells (1-3 mana)
- Tower protection
- Card draw

**Draft Priority**:
1. Spellcaster heroes
2. Cheap spells
3. Tower protection
4. Card draw

### UB (Blue-Black) - "Dimir"
**Theme**: Spellcaster control with removal
**Strategy**: Control with removal and card draw, win with spell synergies and value
**Key Cards**:
- Spellcaster heroes
- Removal spells
- Card draw
- Value creatures (Shadowmind Assassin)

**Draft Priority**:
1. Removal spells
2. Spellcaster heroes
3. Card draw
4. Value creatures

### BR (Black-Red) - "Rakdos"
**Theme**: Aggressive removal and burn
**Strategy**: Remove blockers, attack aggressively, finish with burn
**Key Cards**:
- Aggressive red creatures with cleave
- Black removal
- Direct damage to towers
- Board wipes (Chaos Demolisher)

**Draft Priority**:
1. Removal
2. Aggressive creatures
3. Direct damage
4. Board wipes

### RW Legion (Special)
**Theme**: Go-wide token strategy
**Strategy**: Generate Legion tokens, buff them, attack with overwhelming numbers
**Key Cards**:
- Legion token generators
- Team buffs (+1/+1 to all)
- Legion-matters cards
- Artifacts that support go-wide

**Draft Priority**:
1. Token generators
2. Team buffs
3. Legion synergies
4. Artifacts

## Three-Color Wedges

### RGW (Naya)
**Theme**: RG aggro with white splash for protection
**Strategy**: Efficient RG creatures with white protection/healing
**Splash Payoffs**: Tower healing, protection spells, team buffs

### GWU (Bant)
**Theme**: WG midrange with blue splash for card draw
**Strategy**: Efficient creatures with blue card draw and control
**Splash Payoffs**: Card draw, bounce effects, counterspells

### WUB (Esper)
**Theme**: WU control with black splash for removal
**Strategy**: Spellcaster control with access to premium removal
**Splash Payoffs**: Destroy effects, life drain, finishers

### UBR (Grixis)
**Theme**: UB control with red splash for burn
**Strategy**: Spellcaster control with red direct damage
**Splash Payoffs**: Exorcism (UBR finisher), burn spells, aggressive finishers

### BRG (Jund)
**Theme**: BR aggro/removal with green splash for efficiency
**Strategy**: Removal-heavy midrange with efficient creatures
**Splash Payoffs**: Efficient creatures, ramp, evolve synergies

## Five-Color Rainbow

**Theme**: High-roll deck with access to all colors
**Strategy**: Draft the best cards regardless of color, use rune artifacts to enable splashing
**Requirements**: 4-6 rune artifacts to enable mana fixing
**Payoffs**: Access to all the most powerful cards in the draft

**Draft Priority**:
1. Rune artifacts (critical)
2. Powerful bombs
3. Removal
4. Card draw

## Rune System and Splashing

### Rune Artifacts
- Enable splashing by generating runes each turn
- More artifacts = more colors you can splash

### Archetype Guidelines
- **2-color guilds**: 0-2 rune artifacts (focus on board presence)
- **3-color wedges**: 2-4 rune artifacts (enable splash)
- **5-color**: 4-6 rune artifacts (essential for consistency)

### Splashing Strategy
1. Draft your primary 2 colors (guild)
2. Identify powerful splash cards (finishers, removal)
3. Draft rune artifacts to enable splashing
4. Don't over-commit to splash colors

## Draft Strategy

### Early Picks (Packs 1-2)
- Stay open, draft powerful cards
- Identify which guilds are open
- Prioritize removal and bombs

### Mid Picks (Packs 2-3)
- Commit to a guild
- Draft synergies
- Consider splash options

### Late Picks (Packs 4-5)
- Fill curve
- Draft rune artifacts if splashing
- Grab finishers

## Archetype Matchups

### Aggro (RG, BR, RW) beats Control (WU, UB)
- Too fast, control can't stabilize
- Direct damage to towers

### Control (WU, UB, UBR) beats Midrange (WG, BRG)
- Outvalues with card draw
- Efficient removal

### Midrange (WG, BRG, GWU) beats Aggro (RG, BR)
- Efficient creatures stabilize
- Survives early pressure
- Wins through value

## Card Distribution by Guild

Each guild should have:
- **15-20 playable cards** at common/uncommon
- **2-3 rare bombs** for the archetype
- **Mix of creatures, spells, and artifacts**

Target rarity distribution:
- **70% common**: Core cards, curve fillers
- **20% uncommon**: Good removal, solid units, multicolor cards
- **10% rare**: Bombs, finishers, unique effects

## Design Guidelines

### Creating Guild Cards

1. **Color Identity**: Cards should feel like they belong to their colors
2. **Synergy**: Cards should work well with the guild's strategy
3. **Power Level**: Rares should be exciting but not game-breaking
4. **Mana Costs**: Appropriate for the archetype's speed
   - Aggro: 1-4 mana focus
   - Midrange: 2-6 mana focus
   - Control: 3-7+ mana focus

### Multicolor Cards

- **2-color**: Guild identity cards, require both colors
- **3-color**: Wedge payoffs, powerful but harder to cast
- **4-5 color**: Extreme payoffs for rainbow decks

### Equipment Design

- **White**: Defensive (+health, taunt, armor)
- **Red/Green**: Aggressive (+attack, cleave)
- **Blue/Black**: Utility (card draw, removal triggers)

## Future Expansion

Potential additions:
- More guilds (enemy color pairs)
- Shards (3-color allied)
- Tribal synergies within guilds
- Guild-specific mechanics


