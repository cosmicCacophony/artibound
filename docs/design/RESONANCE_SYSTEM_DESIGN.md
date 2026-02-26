# Resonance System Design

**Summary:** Design decisions for the hero/rune improvement plan that introduced **resonance** across lanes and **color-unique rune generation**, and removed bouncing as the core rune generator.

---

## Goals

- Make rune generation tied to **game actions and hero identity** instead of a generic bounce loop.
- Reward **spreading your colors across both lanes** (shared resonance) and **keeping heroes in mirrored slots** (mirror resonance).
- Give each color a **distinct way to generate trigger runes**, so hero draft and lane placement matter.

---

## Key Decisions

### 1. Bouncing Removed as Core Rune Generator

- **Before:** A generic bounce mechanic was the main way to generate runes.
- **After:** Runes come from (a) **seed runes** when you first deploy a hero, (b) **trigger runes** when heroes’ color-specific conditions are met, and (c) **resonance** (see below). No bounce loop.

### 2. Color-Unique Rune Triggers

Each color has one **trigger type**; when that condition is met in a lane where you have a matching hero, that hero can add **one rune of its color** to your pool (max one trigger rune per hero per turn).

| Color | Trigger Type | Condition |
|-------|--------------|-----------|
| Red   | `red_tower_damage` | Your hero in that lane deals combat damage to the enemy tower. |
| Blue  | `blue_spell_cast`  | You cast a spell (in that lane / with that hero’s rune identity). |
| Black | `black_lane_death` | A unit dies in that lane. |
| Green | `green_friendly_deploy` | You deploy a friendly unit to that lane. |
| White | `white_friendly_survive_combat` | A friendly unit in that lane survives combat. |

- Heroes use their **primary color** (or optional `runeTrigger` override) to determine which trigger they use.
- **Dual-color heroes:** With Aspect Shift (see Hero Ability Redesign doc), the **current aspect** decides the trigger type (e.g. UR in Blue aspect = `blue_spell_cast`, in Red aspect = `red_tower_damage`).

### 3. Shared Resonance (Cross-Lane Color Overlap)

- **Rule:** At the start of each turn, the game looks at your heroes in **Lane A** and **Lane B** and finds **colors that appear in both lanes**.
- **Effect:** For each such color, you gain **1 permanent rune** of that color.
- **Implementation:** `getSharedResonanceColors(gameState, player)` returns the list of shared colors; these are added to your rune pool when the turn increments (in `useTurnManagement`).
- **Dual-color heroes and Aspect Shift:** A hero in aspect mode contributes **only its current aspect color** to resonance (see `getHeroActiveResonanceColors` in `heroRuneSystem.ts`). So a UR hero in Blue aspect only adds Blue to the “lane color set”; flipping to Red can break Blue resonance or create Red resonance.

### 4. Mirror Resonance (Same Slot in Both Lanes)

- **Rule:** If you have a hero in **slot N** in Lane A and a hero in **slot N** in Lane B, those heroes are “mirrored.”
- **Buff:** Mirrored heroes get **+1/+1** (temporary) each turn this is true (applied via `applyMirrorResonanceBuffs`).
- **Payoff:** For every **3 consecutive turns** a given slot stays mirrored, you gain **1 rune** of that mirrored hero’s (primary/active) color. Counter is tracked in `metadata.mirrorResonanceTurns` (key e.g. `player1:3`).
- **Note:** Mirror is **slot-based**, not color-based, so aspect doesn’t change whether a hero is mirrored—but **moving** a hero (e.g. via Aspect Shift) can break the mirror and reset the 3-turn counter.

### 5. Seed Runes Unchanged

- When a hero is **first deployed** from base/deploy zone to a battlefield, you still get **seed runes** once per hero: one rune per color of that hero (e.g. UR hero gives 1 red + 1 blue). This is independent of aspect; hero identity (colors) determines seed runes.

---

## Where It Lives in Code

- **`src/game/heroRuneSystem.ts`**
  - `getSharedResonanceColors`, `getHeroActiveResonanceColors`, `getMirroredHeroSlots`, `getMirrorCountdown`, `applyMirrorResonanceBuffs`, `tickMirrorResonance`, `getHeroRuneTrigger`, `grantSeedRunes`, `grantHeroTriggerRune`, `applyBlueSpellTrigger`, etc.
- **`src/hooks/useTurnManagement.ts`**
  - On turn increment: adds shared resonance runes, ticks mirror counters, grants mirror payoff runes, applies mirror +1/+1 buffs.
- **`src/game/types.ts`**
  - `HeroRuneTriggerType`, `RunePool`, `mirrorResonanceTurns`, `heroRuneTriggersThisTurn`, etc.

---

## Interaction with Hero Ability Redesign (Aspect Shift)

- **Resonance:** Shared resonance uses **current aspect** for dual-color heroes, so aspect shift directly changes whether you get a rune per turn for a given color overlap.
- **Rune triggers:** The trigger type (e.g. spell cast vs tower damage) is derived from **current aspect** when set, so aspect shift changes how that hero generates runes.
- **Mirror:** Aspect doesn’t change mirror eligibility; lane movement (e.g. after a shift) can break mirror and its 3-turn payoff.

These interactions are intentional: aspect shift is a strategic trade (lane/ability vs resonance and rune generation).
