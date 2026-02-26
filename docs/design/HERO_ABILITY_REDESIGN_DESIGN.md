# Hero Ability Redesign: Aspect Shift + Signature Triggers

**Summary:** Design decisions for replacing Artifact-style **mana-activated hero abilities** with **Signature Triggers** (automatic, condition-based effects) and **Aspect Shift** (dual-color heroes paying a rune to flip color aspect, change stats/ability, and optionally move lanes).

---

## Goals

- Remove the “pay 1 mana, do X” hero abilities that were a straight copy of Artifact.
- Make **hero colors and draft** more meaningful: single-color vs dual-color is a real trade-off.
- Give dual-color heroes a **transform**-style mechanic (inspired by Lorywyn/Oko): pay a rune to switch aspect, with different stats and abilities per aspect, and optional lane movement.

---

## Key Decisions

### 1. Signature Triggers Replace Activated Abilities

- **What:** Every hero has a **Signature Trigger**—a named, condition-based effect that fires **automatically** when its condition is met. No mana cost, no cooldown (optional `oncePerTurn` per trigger).
- **Why:** Keeps heroes impactful and readable without the generic “click to pay 1 mana” pattern. Encourages build-around and sequencing (e.g. “2nd spell” or “friendly survives combat”).
- **Types:** Conditions include `on_spell_cast`, `on_second_spell`, `on_friendly_death`, `on_unit_survive_combat`, `on_tower_damage`, `on_friendly_deploy`, `on_deploy`, `start_of_turn`, `passive`. Effects include `buff_self_attack`, `deal_tower_damage`, `draw_card`, `heal_tower`, `buff_lane_units`, `create_spell`, `custom`.
- **Implementation:** `SignatureTrigger` in `types.ts`; `signatureTriggerSystem.ts` exposes helpers like `getActiveSignatureTrigger`, `triggerSignaturesOnSpellCast`, `triggerSignaturesOnFriendlyDeploy`, `triggerSignaturesOnFriendlyDeath`, `triggerSignaturesOnFriendlySurviveCombat`, `triggerSignaturesOnTowerDamage`. Hooks are called from deployment (deploy, spell cast) and from turn management (post-combat death/survive/tower damage).
- **Per-turn cap:** `metadata.heroSignatureTriggersThisTurn` tracks activations for triggers that set `oncePerTurn`.

### 2. Single-Color vs Dual-Color Trade-Off

- **Single-color heroes:** One strong signature trigger, locked to one lane, clear rune identity. Specialist.
- **Dual-color heroes:** Two aspects, each with its own stats and signature trigger; **Aspect Shift** (see below) lets you switch. More flexible and mobile, but each trigger is intentionally a bit weaker, and shifting costs runes.

### 3. Aspect Shift (Dual-Color Only)

- **What:** During deploy or play phase, if you have a **dual-color hero** with `aspects` defined, you may pay **1 rune of the *target* aspect color** to switch that hero to the other aspect.
- **Effect of shift:**
  - **Stats:** Hero’s attack/health/maxHealth/currentHealth are replaced from `aspects[targetAspect]` (with current-health scaling so the hero doesn’t die unfairly).
  - **Ability:** The active signature trigger becomes that aspect’s `signatureTrigger`.
  - **Color provided:** For lane color-gating and resonance, the hero counts as only the **current aspect** color (see Resonance doc).
  - **Rune trigger:** The hero’s rune trigger type (e.g. `blue_spell_cast` vs `red_tower_damage`) is derived from **current aspect** in `getHeroRuneTrigger` / `getHeroActiveResonanceColors`.
  - **Optional lane move:** If the **other** lane has a hero that provides the **new** aspect color (or has that aspect), you may move the shifting hero to that lane (same or first available slot). So you can “flip to Red and jump to the Red lane.”
- **Cost:** One rune of the color you’re shifting *to*. Shifting passes action and initiative to the opponent. Tracked in `metadata.heroAspectShiftsThisTurn` for visibility.
- **Implementation:** `handleAspectShift` in `useDeployment.ts`; UI “Shift Aspect” on battlefield hero cards when phase is deploy/play and owner has action.

### 4. Resonance and Rune Integration (Coupled Design)

- **Shared resonance:** Uses **current aspect** only for dual-color heroes (`getHeroActiveResonanceColors`). Flipping aspect can add or remove a color from your cross-lane overlap, so you gain or lose 1 rune per turn for that color.
- **Rune trigger type:** Comes from **current aspect** when set (`getHeroRuneTrigger` in `heroRuneSystem.ts`). So the same UR hero generates runes from spells in Blue aspect and from tower damage in Red aspect.
- **Mirror resonance:** Unchanged by aspect (slot-based). But **moving** the hero when shifting can break mirror and the 3-turn payoff.

This coupling makes aspect shift a real trade: lane presence, ability, resonance income, and rune generation are all in play.

### 5. Lane Color-Gating Uses Active Aspect

- **Rule:** A card can be played in a lane if the lane has heroes that together provide **all** colors required by the card.
- **Dual-color hero in aspect:** Contributes **only** `currentAspect` to the lane’s colors (`canPlayCardInLane` / color system uses `getHeroActiveResonanceColors`-style logic: if `currentAspect` is set, use that; else use all hero colors). So after shifting to Red, that lane no longer counts as having Blue for color requirements until you shift back or have another Blue hero there.

### 6. Hero Data and Defaults

- **Single-color:** `signatureTrigger` is set per hero; optional `runeTrigger` override; no `aspects` / `currentAspect`.
- **Dual-color:** In `comprehensiveCardData.ts`, dual-color heroes get `currentAspect` (default first color), `aspects` with an entry per color: `attack`, `health`, `signatureTrigger`, `colorProvided`. Default triggers are inferred from color (e.g. Red → tower damage, Blue → spell cast) when not explicitly set. Legacy `ability` is still supported for migration; default signature trigger can be inferred from it (e.g. `on_spell_cast` + damage → `deal_tower_damage`).

### 7. UI and Deprecations

- **Removed:** “Activate Ability” button, hero ability cooldown UI, and Hero Ability Editor from the main flow. `HeroAbility` and `heroAbilityCooldowns` remain for backward compatibility only.
- **Added:** Hero cards show **signature trigger** name/description; dual-color heroes show **current aspect** and a **Shift Aspect** button (with tooltip explaining rune cost and resonance impact when applicable). Battlefield view shows aspect and trigger name on the unit.

---

## Where It Lives in Code

- **`src/game/types.ts`**  
  `SignatureTrigger`, `SignatureTriggerCondition`, `SignatureTriggerEffectType`, `AspectData`, Hero fields: `signatureTrigger`, `currentAspect`, `aspects`, `heroSignatureTriggersThisTurn`, `heroAspectShiftsThisTurn`.
- **`src/game/signatureTriggerSystem.ts`**  
  Trigger resolution and application for spell cast, deploy, death, survive combat, tower damage.
- **`src/game/heroRuneSystem.ts`**  
  `getHeroActiveResonanceColors`, `getHeroRuneTrigger` (aspect-aware).
- **`src/game/colorSystem.ts`**  
  Lane color for playability uses current aspect when set.
- **`src/game/comprehensiveCardData.ts`**  
  Default signature triggers and aspect data for single/dual-color heroes.
- **`src/hooks/useDeployment.ts`**  
  `handleAspectShift`, and calls to `triggerSignaturesOnFriendlyDeploy` / `triggerSignaturesOnSpellCast`.
- **`src/hooks/useTurnManagement.ts`**  
  Post-combat signature triggers (death, survive, tower damage); reset of `heroSignatureTriggersThisTurn` and `heroAspectShiftsThisTurn`.
- **`src/components/BattlefieldView.tsx`**, **`HeroCard.tsx`**  
  Aspect label, signature trigger display, Shift Aspect button and tooltip.

---

## Example Hero Shapes (Conceptual)

- **Single-color (e.g. Pyromancer):** “When you cast your 2nd spell this turn, deal 3 to the enemy tower.” One strong trigger, one lane, one rune trigger type.
- **Dual-color (e.g. Stormcaller UR):**  
  - Blue aspect (2/5): “When you cast a spell, give a friendly unit +0/+1.” Contributes Blue, `blue_spell_cast` rune trigger.  
  - Red aspect (4/3): “When you deal tower damage, deal 1 extra.” Contributes Red, `red_tower_damage` rune trigger.  
  Pay 1 Red rune to shift to Red (and optionally move to the Red lane); pay 1 Blue rune to shift back to Blue.

---

## Relationship to Resonance Plan

The Resonance System design (shared resonance, mirror resonance, color-unique rune triggers) was implemented first. The Hero Ability Redesign was designed to **coexist** with it: aspect shift and signature triggers both respect and use resonance (shared colors, rune trigger type) and mirror (slot-based). The two plans together make hero draft, lane placement, and aspect choices deeply strategic.
