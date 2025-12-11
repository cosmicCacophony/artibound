# Items and Battlefield Upgrades

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Reference  
> **Relevance:** Medium  
> **Category:** Design  
> **Notes:** Items currently optional/disabled - kept for potential future use

## Overview

This document describes the new items and battlefield upgrades added to Artibound, inspired by Artifact Foundry.

**Note:** Items are currently **optional/disabled** for playtesting. The item system is implemented but can be ignored during gameplay. Items may be more relevant in a 3-lane system, and with only 2 lanes, the game may not need the additional complexity. Items are kept in the codebase for potential future use.

---

## Items from Artifact Foundry

### Tier 1 Items (Basic)

#### Broadsword
- **Cost:** 15 gold
- **Tier:** 2
- **Effect:** +6 Attack
- **Description:** Simple, powerful weapon upgrade

#### Ring of Tarrasque
- **Cost:** 12 gold
- **Tier:** 2
- **Effect:** +3 Attack, +3 HP, Regeneration
- **Description:** Well-rounded defensive item with regeneration

#### Stonehall Cloak
- **Cost:** 8 gold
- **Tier:** 1
- **Effect:** +3 HP, Increase max HP by 1
- **Description:** Defensive item that increases maximum health

#### Red Mist Maul
- **Cost:** 10 gold
- **Tier:** 1
- **Effect:** +2 Attack, +3 HP, Siege
- **Description:** Siege weapon that can attack towers directly

#### Blade of the Vigil
- **Cost:** 12 gold
- **Tier:** 2
- **Effect:** +5 Attack, Cleave
- **Description:** Powerful weapon with cleave (damages adjacent units)

#### Barbed Mail
- **Cost:** 7 gold
- **Tier:** 1
- **Effect:** +1 Attack, +2 HP, Retaliate, Taunt
- **Description:** Defensive item that forces enemies to attack and deals damage back

#### Demagicking Maul
- **Cost:** 9 gold
- **Tier:** 1
- **Effect:** +2 Attack. When equipped hero deals damage to a tower, dispel a random tower enchantment.
- **Description:** Anti-enchantment weapon

### Items with Activated Abilities

#### Blink Dagger
- **Cost:** 6 gold
- **Tier:** 1
- **Effect:** +2 HP
- **Activated Ability:** Move this hero to a slot in an adjacent lane.
- **Description:** Mobility item for repositioning heroes

#### Phase Boots
- **Cost:** 7 gold
- **Tier:** 1
- **Effect:** +3 HP
- **Activated Ability:** Swap this hero to another slot.
- **Description:** Allows heroes to swap positions on the battlefield

#### Keenfolk Musket
- **Cost:** 5 gold
- **Tier:** 1
- **Effect:** +2 Attack
- **Activated Ability:** Deal 2 damage to a unit.
- **Description:** Ranged attack item

#### Assassin's Veil
- **Cost:** 6 gold
- **Tier:** 1
- **Effect:** +3 HP
- **Activated Ability:** Choose a combat target for equipped hero.
- **Description:** Allows precise targeting in combat

#### Helm of the Dominator
- **Cost:** 10 gold
- **Tier:** 2
- **Effect:** +2 Attack
- **Activated Ability:** Steal an enemy unit.
- **Description:** Powerful control item

#### Bracers of Sacrifice
- **Cost:** 8 gold
- **Tier:** 1
- **Effect:** +1 Attack, +2 HP
- **Activated Ability:** Slay this hero and deal 4 damage to adjacent enemies.
- **Description:** Sacrificial item for area damage

#### Golden Ticket
- **Cost:** 12 gold
- **Tier:** 2
- **Effect:** None (special item)
- **Activated Ability:** Get a random item at your shop level. It costs 0 Mana.
- **Description:** Gambling item that gives a free random item

---

## Battlefield Upgrades

### RW (Red/White) Archetype Upgrades

#### War Banner
- **Cost:** 6 gold
- **Effect Type:** `unit_power`
- **Effect Value:** 1
- **Description:** All your units in this battlefield have +1 Attack
- **Implementation:** Applied to all units in the battlefield during combat calculations

#### Honor Memorial
- **Cost:** 8 gold
- **Effect Type:** `death_counter`
- **Effect Value:** 3 (counters needed to draw a card)
- **Description:** When a unit dies here, add a counter. Remove 3 counters to draw a card.
- **Implementation:** 
  - Tracks death counters in `GameMetadata.battlefieldDeathCounters`
  - Format: `"player-battlefield"` -> count
  - When a unit dies, increment counter
  - When counter reaches 3, player draws a card and counter resets

### UB (Blue/Black) Archetype Upgrades

#### Arcane Focus
- **Cost:** 7 gold
- **Effect Type:** `spell`
- **Effect Value:** 1
- **Description:** Your spells deal +1 additional damage in this battlefield
- **Implementation:** Applied to spell damage calculations in the battlefield

#### Rapid Deployment
- **Cost:** 9 gold
- **Effect Type:** `quick_deploy`
- **Effect Value:** 1
- **Description:** Your heroes have Quick Deploy: No cooldown when dying. They can immediately deploy from base the following turn.
- **Implementation:** 
  - Heroes in battlefields with this upgrade bypass death cooldown
  - When they die, they can be redeployed immediately on the next turn
  - Overrides the normal 1-round cooldown system

---

## Implementation Notes

### Item System Extensions

The `Item` interface has been extended to support:
- `hasActivatedAbility?: boolean` - Marks items with activated abilities
- `activatedAbilityDescription?: string` - Description of the activated ability
- `specialEffects?: string[]` - Array of special effect keywords (e.g., 'cleave', 'siege', 'regeneration', 'taunt', 'retaliate')

**Note:** The actual mechanics for activated abilities and special effects are not yet implemented. Items currently provide stat bonuses, and the descriptions indicate future functionality.

### Battlefield Buff System Extensions

The `BattlefieldBuffEffectType` has been extended with:
- `unit_power` - Increases unit attack power
- `death_counter` - Tracks unit deaths for card draw mechanic
- `quick_deploy` - Removes death cooldown for heroes

The `GameMetadata` interface now includes:
- `battlefieldDeathCounters: Record<string, number>` - Tracks death counters per player-battlefield combination

### Future Implementation Tasks

1. **Activated Abilities:** Implement UI and logic for items with activated abilities
2. **Special Effects:** Implement mechanics for:
   - Cleave (damage adjacent units)
   - Siege (attack towers directly)
   - Regeneration (heal over time)
   - Taunt (force enemies to attack)
   - Retaliate (deal damage when attacked)
3. **Death Counter System:** Implement UI and logic for:
   - Tracking unit deaths in battlefields with Honor Memorial
   - Drawing cards when counter reaches 3
   - Displaying counter status to players
4. **Quick Deploy System:** Implement logic to:
   - Bypass death cooldown for heroes in Rapid Deployment battlefields
   - Allow immediate redeployment on next turn
5. **Battlefield Effect Application:** Implement logic to:
   - Apply unit_power buffs during combat
   - Apply spell damage bonuses
   - Check for quick_deploy when heroes die

---

## Testing Recommendations

1. **Item Balance:** Test item costs vs. their stat bonuses
2. **Battlefield Upgrades:** Test that upgrades apply correctly to the right battlefields
3. **Death Counter:** Test that counters increment and card draw works
4. **Quick Deploy:** Test that heroes can redeploy immediately after death
5. **Item Shop:** Verify items appear in shop correctly and can be purchased

---

## Design Philosophy

### Items
- Items should feel impactful but not game-breaking
- Higher tier items should be significantly more powerful
- Activated abilities add strategic depth
- Special effects create unique play patterns

### Battlefield Upgrades
- Should feel distinct for each archetype
- Create meaningful strategic choices about which battlefield to upgrade
- Should be powerful enough to influence game strategy
- Cost should reflect their impact



