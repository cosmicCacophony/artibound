# Exorcism Board States - Visual Analysis

## Overview

**Exorcism** (UBG, 8 mana): Deal 12 total damage distributed to enemy units adjacent to or directly in front of the caster, and the tower.

**Range**: Exorcism affects units that are:
- **Directly in front** (same slot number as the caster)
- **Adjacent** (slots next to the caster's slot)

**Damage Distribution** (based on number of affected units):
- **0 units** in range: 12 damage to tower
- **1 unit** in range: 6 damage to unit, 6 damage to tower
- **2 units** in range: 4 damage to each unit, 4 damage to tower
- **3 units** in range: 3 damage to each unit, 3 damage to tower
- **4 units** in range: 3 damage to each unit, 0 damage to tower (requires UBG in slot 2 or 3 with all 4 opponent slots filled)

**Key Insight**: 
- Exorcism is most efficient when there are 0-1 units in range. More units spread the damage, making it less effective.
- **Positioning matters**: Units must be adjacent to or directly in front of the caster to be affected. Units outside the splash zone are safe.
- To minimize tower damage to 3, you need exactly 3 units in the splash zone.

---

## A. Board States Where Player Denied Exorcism

### Scenario A1: Optimal Positioning with 3 Units (Minimal Tower Damage)

**Situation**: UBG player is in slot 2 (affects slots 1, 2, 3). RW player positions 3 high-health units in the splash zone.

```
BATTLEFIELD A (Exorcism Target Lane)
┌─────────────────────────────────────────┐
│  RW Player (Defending)                  │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │ H3  │     │  Tower: 15 │
│  │ 5/8 │ 4/7 │ 4/7 │     │             │
│  │[S1] │[S2] │[S3] │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (Casting Exorcism)          │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │ UBG │     │     │  Tower: 18 │
│  │     │ 3/8 │     │     │             │
│  │     │[S2] │     │     │  (slot 2)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 2 affects opponent slots 1, 2, 3 (directly in front + adjacent)
Result: 3 units in range
- 3 damage to H1 (5/8 → 5/5)
- 3 damage to H2 (4/7 → 4/4)
- 3 damage to H3 (4/7 → 4/4)
- 3 damage to tower (15 → 12)
- All heroes survive with good health
- Tower takes minimal damage (only 3!)
```

**Decision Point**: This is the optimal positioning! RW player needs to predict UBG's slot position and deploy 3 units in the splash zone. If UBG is in slot 1 or 4, only 2 slots are in range, so you can only get 2 units maximum.

---

### Scenario A2: Strategic Unit Positioning (2 Units - Suboptimal but Viable)

**Situation**: UBG player is in slot 1 (affects slots 1, 2). RW player positions 2 high-health units.

```
BATTLEFIELD A (Exorcism Target Lane)
┌─────────────────────────────────────────┐
│  RW Player (Defending)                  │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 12 │
│  │ 5/8 │ 4/7 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (Casting Exorcism)          │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2 only
Result: 2 units in range
- 4 damage to H1 (5/8 → 5/4)
- 4 damage to H2 (4/7 → 4/3)
- 4 damage to tower (12 → 8)
- Both heroes survive and can still pressure
```

**Decision Point**: RW player chose high-health heroes (5/8 and 4/7) that can survive the 4 damage. Lower health heroes would have died. Note: Can't get 3 units in range when UBG is in slot 1 or 4.

---

### Scenario A3: Positioning Units Outside Splash Zone

**Situation**: RW player positions units outside the Exorcism splash zone to avoid damage entirely.

```
BATTLEFIELD A (Exorcism Target Lane)
┌─────────────────────────────────────────┐
│  RW Player (Defending)                  │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │     │ H1  │ H2  │  Tower: 15 │
│  │     │     │ 3/5 │ 3/5 │             │
│  │     │     │[S3] │[S4] │  (SAFE!)   │
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (Casting Exorcism)          │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2 only
Result: 0 units in range (H1 and H2 are in slots 3, 4 - outside range!)
- 12 damage to tower (15 → 3)
- H1 and H2 take NO damage (they're safe!)
- RW heroes survive but tower takes full damage
```

**Decision Point**: RW player positioned heroes outside the splash zone. This protects heroes but allows full tower damage. Only viable if tower HP is high enough to survive.

---

## B. Board States Where Player Can Play Around A by Bouncing Hero

**Important**: Bouncing means **replacing** a hero with a new hero. The new hero takes the slot position and will be affected by Exorcism. Bouncing is smart when you replace a weak hero with a stronger one that can survive the damage.

### Scenario B1: Bounce Weak Hero, Replace with Strong Hero

**Situation**: UBG player is about to cast Exorcism. RW player bounces a weak hero (2/4) and replaces it with a strong hero (5/8) that can survive.

**Before Bounce:**
```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 15 │
│  │ 3/5 │ 2/4 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (About to cast Exorcism)    │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2
Expected Result (2 units): 4 to each hero, 4 to tower
- H1: 3/5 → 3/1 (survives)
- H2: 2/4 → 2/0 (DIES)
- Tower: 15 → 11
- RW loses H2!
```

**After Bounce (RW bounces H2, replaces with H3 5/8):**
```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H3  │     │     │  Tower: 15 │
│  │ 3/5 │ 5/8 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (Casts Exorcism)            │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2
Actual Result (2 units): 4 to each hero, 4 to tower
- H1: 3/5 → 3/1 (survives)
- H3: 5/8 → 5/4 (survives with good health!)
- Tower: 15 → 11
- Both heroes survive! H2 saved by bouncing, H3 takes damage instead
```

**Analysis**: Bouncing the weak H2 and replacing it with strong H3 (5/8) was smart! H3 can easily survive 4 damage, so both heroes live. The weak H2 is safe in base, and the strong H3 takes the hit.

**Decision Point**: Bouncing weak heroes before Exorcism is smart if you can replace them with stronger heroes that can survive. The new hero takes the damage, but if it has enough HP, everyone survives.

---

## C. Adjust Board States for RW to Properly Position Against Exorcism

### Scenario C1: Optimal RW Positioning (3 Units in Splash Zone)

**Situation**: RW player knows Exorcism is coming. UBG is in slot 2 (affects slots 1, 2, 3). RW positions 3 high-health heroes in the splash zone.

```
BATTLEFIELD A (Exorcism Target)
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │ H3  │     │  Tower: 20 │
│  │ 5/8 │ 4/7 │ 4/7 │     │             │
│  │[S1] │[S2] │[S3] │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │ UBG │     │     │  Tower: 18 │
│  │     │ 3/8 │     │     │             │
│  │     │[S2] │     │     │  (slot 2)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 2 affects opponent slots 1, 2, 3
Result: 3 units in range
- 3 damage to H1 (5/8 → 5/5)
- 3 damage to H2 (4/7 → 4/4)
- 3 damage to H3 (4/7 → 4/4)
- 3 damage to tower (20 → 17)
- All heroes survive with good health
- Tower takes minimal damage (only 3!)
```

**Decision Point**: This is the optimal positioning! RW player needs to:
1. Predict UBG's slot position (slot 2 in this case)
2. Deploy 3 high-health heroes in the splash zone (slots 1, 2, 3)
3. This minimizes tower damage to just 3

**Note**: If UBG is in slot 1 or 4, only 2 slots are in range, so maximum 2 units can be affected.

---

## D. Worst Case Scenario: Getting Blown Out by Exorcism

### Scenario D1: Maximum Value Exorcism (0 Units in Range)

**Situation**: UBG is in slot 1. RW player has no heroes in the splash zone (slots 1-2), Exorcism deals full 12 to tower.

```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │     │ H1  │ H2  │  Tower: 12 │
│  │     │     │ 3/5 │ 3/5 │             │
│  │     │     │[S3] │[S4] │  (SAFE!)   │
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2 only
Result: 0 units in range (H1 and H2 are in slots 3, 4 - outside range!)
- 12 damage to tower (12 → 0)
- TOWER DESTROYED!
- H1 and H2 take NO damage (they're safe!)
- RW player loses the lane entirely
```

**What Went Wrong**: RW player either:
1. Positioned heroes outside the splash zone (slots 3-4 when UBG is in slot 1)
2. Bounced all heroes from the splash zone
3. Never deployed to slots 1-2 (gave up lane control)
4. All heroes in splash zone died earlier (poor positioning in previous turns)

---

## Summary: Optimal Play Patterns

### Against Exorcism (RW Player)

**Best Positioning:**
- **3 high-health heroes (4+ health each) in the splash zone**
- UBG must be in slot 2 or 3 to affect 3 slots (slots 1-3 or 2-4)
- Spreads damage to 3 damage per hero, 3 damage to tower
- All heroes survive, tower takes minimal damage (only 3!)

**Positioning by UBG Slot:**
- **UBG in slot 1 or 4**: Only affects 2 slots (1-2 or 3-4)
  - Maximum 2 units in range
  - Best: 2 high-health heroes = 4 damage each, 4 to tower
- **UBG in slot 2 or 3**: Affects 3 slots (1-3 or 2-4)
  - Maximum 3 units in range
  - Best: 3 high-health heroes = 3 damage each, 3 to tower

**Worst Positioning:**
- 0-1 heroes in the splash zone
- 0 units = 12 to tower (tower dies)
- 1 unit = 6 to unit, 6 to tower (hero likely dies)
- **Units outside splash zone**: Safe from damage but tower takes full 12

**Bounce Timing:**
- Bounce weak heroes (2-3 health) before Exorcism and replace with high-health heroes (5+ health)
- The new high-health hero takes Exorcism damage but survives
- Keep high-health heroes (5+ health) on board in splash zone - they can survive
- Bounce weak heroes if you have strong replacements available
- **Key**: Bouncing replaces the hero - the new hero takes the slot and will be affected by Exorcism. Only bounce if the replacement is stronger!

**Deployment Strategy:**
- Early game: Deploy high-health heroes to key lanes
- Mid game: Predict UBG's slot position, deploy 3 heroes in splash zone if possible
- Late game: Balance tower protection with hero protection
- **Positioning matters**: Units must be adjacent to or directly in front of UBG to be affected

---

*Document created for strategic analysis and playtesting reference*

