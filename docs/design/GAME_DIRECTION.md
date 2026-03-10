# Artibound — Game Direction Document

A design document describing the current direction of the Artibound prototype based on the latest implementation work.

---

## Game Overview

Artibound is a 1v1 card game with 2 lanes (battlefields A and B), each containing towers with 15 HP. Players deploy heroes, cast units and spells into lanes, and combat resolves automatically. Victory is achieved by reducing the opponent's tower HP to zero across either lane.

---

## Core Identity Pillars

These pillars define what Artibound is and should remain:

1. **1v1 with 2 lanes** — Two battlefields create lane commitment and strategic allocation of resources.
2. **Heroes define lane identity** — Each hero's color unlocks rune options for that lane; heroes anchor the lane's scaling path.
3. **Core per-lane choice: rune vs generic mana** — Every turn, per lane, players choose between immediate mana or long-term rune investment.
4. **Quick, fun, readable, watchable** — Games should be fast, easy to understand, and entertaining to spectate.
5. **Optional depth through rune scaling** — Strategic players can optimize rune accumulation; newcomers can still play without mastering it.
6. **Lane commitment, tempo, sequencing, synergy** — Depth comes from *when* and *where* you deploy, not micro-positioning within a lane.

---

## Combat System: Autobattler with Formation Tags

Combat is automatic — no click targeting during resolution. Units have a `FormationTag` that determines targeting behavior:

| Tag | Behavior |
|-----|----------|
| **Frontline** | Must be attacked first. Tanks that protect backline. |
| **Ranged** | Shoots over frontline to hit backline. |
| **Assassin** | Bypasses all units, strikes tower directly. |
| **Default** | Balanced; attacks any enemy but must hit frontline first. |

Combat order follows tag priority: frontline → default → ranged → assassin. This creates a clear rock-paper-scissors: frontline blocks assassin, ranged picks off backline, assassin punishes heavy frontline investment.

---

## Rune System (Core Strategic Choice)

Each turn, for each lane, a player chooses **one** of:

- **+1 generic mana** — Immediately usable; cast cards at base stats.
- **+1 permanent rune** — Color must match a hero in that lane (R, W, U, B, G).

**Runes do not pay for cards.** Mana pays for cards. Runes **scale** cards:

- Cards have `runeScaling` tiers (e.g., R → RR → RRB).
- Each tier grants stat bonuses (attack, health, damage, draw).
- Players see which tier would activate per lane via a hover tooltip (`RuneScalingPreview`).

**Tension:** Take mana for tempo now, or invest in runes for stronger cards later.

---

## Staggered Hero Deployment

- **Turn 1:** Primary heroes (2 per player) are pre-deployed to Lane A and Lane B.
- **Turn 2:** Players choose which lane to deploy their first secondary hero (modal choice).
- **Turn 3:** Remaining secondary hero auto-deploys to the other lane.

Heroes define available rune colors per lane. RB has Red + Black; GW has Green + White. Placement locks in which lanes get which scaling paths.

---

## Current Prototype Decks

Two 2-color decks are implemented:

### RB (Red-Black) — Aggressive / Burn
- 4 units (frontline, ranged, assassin, default) + 1 removal spell.
- Scales with R and B runes.
- Heroes: Flame Captain, Ember Tactician (primary) + Blood Broker, Grave Raider (secondary).

### GW (Green-White) — Control / Scaling
- 4 units (frontline, ranged, assassin, default) + 1 buff spell.
- Scales with G and W runes.
- Heroes: Rune Druid, Ancient Warden (primary) + Shield Marshal, Sunward Knight (secondary).

Each deck: **5 card designs × 3 copies = 15 cards.** Starting hand: **4 cards.**

---

## Turn Structure

1. **Deploy Phase** (Turns 2–3 only): Deploy secondary heroes.
2. **Resource Phase**: Both players make rune/mana choices per lane.
3. **Play Phase**: Players alternate casting units/spells into lanes.
4. **Combat A**: Autobattler resolves Lane A.
5. **Adjust Phase**: Post-combat adjustments (e.g. death processing).
6. **Combat B**: Autobattler resolves Lane B.

After Combat B, turn advances and the cycle continues (Deploy → Resource → Play → Combat A → Adjust → Combat B).

---

## Mana System

- Start with **2 mana**.
- Mana increases by choosing mana over runes in the Resource Phase.
- Mana resets each turn to max.
- Cards cost **1–3 mana** in the prototype.

---

## Key Design Principles

- **Meaningful choices:** Rune vs mana each turn, per lane.
- **Risk/reward:** Invest runes now for power later vs tempo now.
- **Lane commitment:** Once heroes are placed, their colors define that lane's scaling path.
- **Multiple strategies:** Aggro (mana/tempo), control (heavy rune investment), hybrid.
- **Clear feedback:** Rune scaling tooltip shows exactly what each tier does per lane.

---

## Inspiration

- **Artifact Foundry** — Lane-based card game, board structure.
- **Riftbound** — Mix of lane and spell concepts.
- **Slay the Spire** — Upgrade visibility UX (rune scaling tooltip).
- **Magic: The Gathering** — Drafting, color system concepts.

---

## Future Directions (Not Yet Implemented)

- **Draft system** — Hero and card selection via drafting.
- **Battlefield static abilities** — Influence draft picks.
- **PVE mode** — AI opponent with tuned cards.
- **More archetypes** — Beyond RB and GW.
- **Archetype identities:**
  - BR: Aggro spells-matter.
  - GW: Combat control (Mighty vs Stun/Barrier paths).
  - UB: Tempo control via stun/curse.

---

## Document History

- Initial version: Current prototype state as of latest development.
