# MVP Design Spec

## Scope

This document defines the minimum viable design target for Artibound.
It locks the supported archetypes and core mechanics for MVP balance.

## Supported Archetypes

Two-color guilds (draftable):
- RG (Red/Green): Mighty combat, cleave, fight
- UB (Blue/Black): Spell control, removal, curse
- UW (Blue/White): Control with protection and tempo
- BR (Black/Red): Aggressive spells-matter, burn
- RW (Legion) is boss-only and not draftable

Three-color shards (draftable as natural pivots from guilds):
- BRG (Jund): Value aggro + removal
- RWG (Naya): Big creatures + protection
- UWG (Bant): Defensive control + ramp
- UWB (Esper): Multi-angle control
- UBR (Grixis): Tempo/burn control

Do not add other archetypes for MVP without explicit review.

## Core Mechanics (Locked)

1. Rune System
   - Heroes generate runes on deployment
   - Spells with consumesRunes use rune pool
   - Rune death: when a hero dies, remove its runes
   - Bouncing preserves runes

2. Bouncing
   - Deploying a hero on an occupied slot bounces the existing hero
   - Bounced heroes keep runes
   - Bounced heroes have 1-turn cooldown

3. Lane Momentum
   - Track cumulative tower damage per lane and player
   - Thresholds: 5/10/15 damage
   - At each threshold, units in that lane gain +1 attack in combat

4. Two-Lane Combat
   - Slot-based combat
   - Simultaneous resolution
   - Cleave remains in RG identity

## Hero Requirements (MVP Minimums)

Per two-color guild:
- 3-4 heroes total
- At least 2 single-color heroes that align with guild identity
- 1-2 dual-color heroes that anchor the guild
- At least 1 hero-hero synergy tag pair per guild

Hero synergy requirement (MVP):
- RG: 2 heroes with matching synergy tag
- UB: 2 heroes with matching synergy tag
- UW: 1 core hero + 1 rare hero with matching synergy tag
- BR: 2 heroes with matching synergy tag

## Card Pool Targets

Draft pool size target:
- 120-180 total cards (excluding heroes)
- Maintain the 300-card maximum draft pool limit

Per guild card targets (including shared mono-color cards):
- Commons/uncommons: 18-24
- Rares: 2-4
- Spells: 35-45% of pool
- Units: 45-55% of pool
- Artifacts: 5-10% of pool

## Balance Targets

Game speed:
- Average game length: 7-9 turns
- Decisive moments by turn 5-6

Archetype win rates vs RW boss:
- 45-60% with competent play
- No archetype below 40% or above 65%

## Implementation Notes

Avoid adding new keyword complexity in MVP.
Use tuning (costs, stats, rune requirements) before adding new systems.
