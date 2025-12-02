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

### Scenario A1: Spreading Units to Minimize Tower Damage

**Situation**: UBG player has Exorcism ready in slot 1. RW player positions 3 units in the splash zone to minimize tower damage.

```
BATTLEFIELD A (Exorcism Target Lane)
┌─────────────────────────────────────────┐
│  RW Player (Defending)                  │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │ H3  │     │  Tower: 15 │
│  │ 4/6 │ 3/5 │ 3/5 │     │             │
│  │ [✓] │ [✓] │ [✓] │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (Casting Exorcism)          │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1 (directly in front) and 2 (adjacent)
Result: 3 units in range (H1 in slot 1, H2 in slot 2, H3 in slot 2? Wait, need to clarify)

Actually, let me reconsider: If UBG is in slot 1:
- Directly in front: opponent slot 1
- Adjacent: opponent slot 2

So only 2 slots are in range. Let me fix this...
```

**Corrected Scenario A1**: UBG in slot 1, RW positions units in slots 1 and 2

```
BATTLEFIELD A (Exorcism Target Lane)
┌─────────────────────────────────────────┐
│  RW Player (Defending)                  │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 15 │
│  │ 4/6 │ 3/5 │     │     │             │
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

Range: UBG in slot 1 affects opponent slots 1 (directly in front) and 2 (adjacent)
Result: 2 units in range
- 4 damage to H1 (4/6 → 4/2)
- 4 damage to H2 (3/5 → 3/1)
- 4 damage to tower (15 → 11)
- Both heroes survive
- Tower takes moderate damage
```

**Decision Point**: RW player deployed 2 heroes in the splash zone (slots 1-2). To get 3 units in range and minimize tower damage to 3, they would need UBG to be in slot 2 (affecting slots 1, 2, 3).

---

### Scenario A2: Optimal Positioning with 3 Units (Minimal Tower Damage)

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

### Scenario A3: Strategic Unit Positioning (2 Units - Suboptimal but Viable)

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

---

### Scenario A5: Positioning Units Outside Splash Zone

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

### Scenario B2: Bounce Weak Hero, Replace with Another Strong Hero

**Situation**: UBG is in slot 2 (affects slots 1-3). RW player has two weak heroes and one strong hero. Bounces a weak hero and replaces it with the strong one.

**Before Bounce:**
```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 12 │
│  │ 2/4 │ 2/4 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (About to cast Exorcism)    │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │ UBG │     │     │  Tower: 18 │
│  │     │ 3/8 │     │     │             │
│  │     │[S2] │     │     │  (slot 2)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 2 affects opponent slots 1, 2, 3
Expected Result (2 units): 4 to each hero, 4 to tower
- H1: 2/4 → 2/0 (DIES)
- H2: 2/4 → 2/0 (DIES)
- Tower: 12 → 8
- Both heroes die!
```

**After Bounce (RW bounces H2, replaces with H3 5/8):**
```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H3  │     │     │  Tower: 12 │
│  │ 2/4 │ 5/8 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player (Casts Exorcism)            │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │ UBG │     │     │  Tower: 18 │
│  │     │ 3/8 │     │     │             │
│  │     │[S2] │     │     │  (slot 2)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 2 affects opponent slots 1, 2, 3
Actual Result (2 units): 4 to each hero, 4 to tower
- H1: 2/4 → 2/0 (DIES - still weak)
- H3: 5/8 → 5/4 (survives with good health!)
- Tower: 12 → 8
- H2 saved by bouncing, H3 survives the damage
```

**Analysis**: Bouncing H2 and replacing it with H3 (5/8) saved H2 and ensured H3 survives. H1 still dies because it's weak, but overall better than both dying. Could also bounce H1 instead if H3 is more valuable.

**Decision Point**: Bouncing weak heroes before Exorcism is smart when you can replace them with stronger heroes. The new hero takes the damage, but if it has enough HP (4+), it survives.

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

### Scenario C2: RW Positioning with Low-Health Heroes (Suboptimal)

**Situation**: UBG is in slot 2. RW player has low-health heroes but still needs to pressure.

```
BATTLEFIELD A (Exorcism Target)
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │ H3  │     │  Tower: 15 │
│  │ 3/5 │ 2/4 │ 2/4 │     │             │
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
- 3 damage to H1 (3/5 → 3/2, survives)
- 3 damage to H2 (2/4 → 2/1, survives)
- 3 damage to H3 (2/4 → 2/1, survives)
- 3 damage to tower (15 → 12)
- All heroes survive but are very low
```

**Decision Point**: RW player should consider bouncing the 2/4 heroes before Exorcism, or deploying more high-health heroes to this lane. The 3-damage distribution is still better than 2 units (4+4) or 1 unit (6+6).

---

### Scenario C3: RW Split Positioning (Pressure Both Lanes)

**Situation**: UBG is in slot 1 on Battlefield A. RW player splits heroes between lanes to maintain pressure while minimizing Exorcism damage.

```
BATTLEFIELD A (Exorcism Target)
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 18 │
│  │ 5/8 │ 4/7 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

BATTLEFIELD B (RW Pressure Lane)
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H3  │ H4  │     │     │  Tower: 20 │
│  │ 4/6 │ 3/5 │     │     │             │
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │     │     │     │     │  Tower: 18 │
│  │     │     │     │     │             │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range on Battlefield A: UBG in slot 1 affects opponent slots 1, 2
Result: 2 units in range
- 4 damage to H1 (5/8 → 5/4)
- 4 damage to H2 (4/7 → 4/3)
- 4 damage to tower (18 → 14)
- Both heroes survive
- RW maintains pressure on Battlefield B
```

**Decision Point**: RW player splits forces to maintain pressure on both lanes while minimizing Exorcism damage. This is a balanced approach. Note: Can't get 3 units in range when UBG is in slot 1 or 4, so 2 units is the maximum.

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

### Scenario D2: Exorcism Kills Low-Health Heroes (1 Unit in Range)

**Situation**: UBG is in slot 1. RW player has one low-health hero in the splash zone, Exorcism kills it and damages tower.

```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │     │     │     │  Tower: 15 │
│  │ 2/4 │     │     │     │             │
│  │[S1] │     │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2
Result: 1 unit in range
- 6 damage to H1 (2/4 → 2/-2, DIES)
- 6 damage to tower (15 → 9)
- RW loses hero AND takes significant tower damage
- Hero goes to base with 2-turn cooldown
```

**What Went Wrong**: RW player left a low-health hero alone in the splash zone. Should have either:
1. Bounced it and replaced with a high-health hero (5+ health can survive 6 damage)
2. Deployed another hero in slot 2 to spread damage (2 units = 4+4 instead of 6+6)
3. Positioned hero outside splash zone (slot 3 or 4) to save hero (but tower takes full 12)

---

### Scenario D3: Exorcism Kills Multiple Low-Health Heroes (2 Units in Range)

**Situation**: UBG is in slot 1. RW player has two low-health heroes in the splash zone, Exorcism kills both.

```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 18 │
│  │ 2/4 │ 2/4 │     │     │             │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2
Result: 2 units in range
- 4 damage to H1 (2/4 → 2/0, DIES)
- 4 damage to H2 (2/4 → 2/0, DIES)
- 4 damage to tower (18 → 14)
- RW loses BOTH heroes AND takes tower damage
- Both heroes go to base with 2-turn cooldown
```

**What Went Wrong**: RW player deployed two low-health heroes (2/4) that both die to 4 damage. Should have:
1. Bounced one or both and replaced with higher-health heroes (4+ health can survive 4 damage)
2. Deployed higher-health heroes initially (4+ health can survive 4 damage)
3. **Note**: Can't deploy a third hero when UBG is in slot 1 (only slots 1-2 are in range). Would need UBG in slot 2 to get 3 units in range (slots 1-3)

---

### Scenario D4: Exorcism on Already-Damaged Heroes

**Situation**: UBG is in slot 1. RW player's heroes are already damaged and in the splash zone, Exorcism finishes them off.

```
BATTLEFIELD A
┌─────────────────────────────────────────┐
│  RW Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ H1  │ H2  │     │     │  Tower: 12 │
│  │ 3/5 │ 3/5 │     │     │             │
│  │(2/5)│(2/5)│     │     │  (damaged) │
│  │[S1] │[S2] │     │     │  (in range)│
│  └─────┴─────┴─────┴─────┘             │
│                                         │
│  UBG Player                              │
│  ┌─────┬─────┬─────┬─────┐             │
│  │ UBG │     │     │     │  Tower: 18 │
│  │ 3/8 │     │     │     │             │
│  │[S1] │     │     │     │  (slot 1)  │
│  └─────┴─────┴─────┴─────┘             │
└─────────────────────────────────────────┘

Range: UBG in slot 1 affects opponent slots 1, 2
Result: 2 units in range
- 4 damage to H1 (2/5 → 2/1, survives barely)
- 4 damage to H2 (2/5 → 2/1, survives barely)
- 4 damage to tower (12 → 8)
- Both heroes at 1 HP, very vulnerable
```

**What Went Wrong**: RW player didn't bounce damaged heroes before Exorcism. They should have bounced them and replaced with full-health heroes that can survive the damage, or positioned them outside the splash zone.

---

## E. Strategic Decisions Throughout the Game

### Early Game Decisions (Turns 1-3)

**Decision 1: Deploy High-Health Heroes to Key Lanes**
- **Why**: High-health heroes (5+ health) can survive Exorcism damage
- **Trade-off**: May sacrifice early pressure for survivability
- **Example**: Deploy 5/8 hero to lane where Exorcism might be cast

**Decision 2: Spread Heroes Across Lanes**
- **Why**: Forces opponent to choose which lane to target with Exorcism
- **Trade-off**: Less concentrated pressure
- **Example**: 2 heroes on Battlefield A, 2 heroes on Battlefield B

**Decision 3: Save Mana for Bounce**
- **Why**: Need mana available to bounce heroes if Exorcism is coming
- **Trade-off**: Can't play other cards
- **Example**: Keep 3-4 mana open when opponent has 8 mana (Exorcism cost)

---

### Mid Game Decisions (Turns 4-6)

**Decision 4: Read Opponent's Hand/Deck**
- **Why**: Predict when Exorcism is coming
- **How**: Track opponent's mana, colors on board, cards played
- **Example**: Opponent has UBG hero on board + 8 mana = Exorcism likely

**Decision 5: Bounce Weak Heroes Before Exorcism**
- **Why**: Replace weak heroes with strong ones that can survive Exorcism damage
- **Trade-off**: New hero takes the damage, but if it has enough HP, everyone survives
- **Example**: Bounce a 2/4 hero and replace it with a 5/8 hero before Exorcism. The 5/8 hero takes 4 damage and survives, while the 2/4 hero is safe in base.

**Decision 6: Deploy Extra Heroes to Spread Damage**
- **Why**: More units in splash zone = less damage per unit and to tower
- **Trade-off**: Overcommits to one lane
- **Example**: Deploy 3 heroes in the splash zone (slots 1-3 if UBG is in slot 2) to minimize tower damage to 3
- **Key**: Must predict UBG's slot position to maximize units in range

---

### Late Game Decisions (Turns 7+)

**Decision 7: Protect Tower vs. Protect Heroes**
- **Why**: Must choose what to prioritize
- **Options**:
  - Deploy many heroes to spread Exorcism damage (protect tower)
  - Bounce weak heroes and replace with strong ones (protect weak heroes, strong ones take damage)
- **Example**: If tower is at 5 HP, deploy heroes to spread damage. If heroes are weak (2-3 health), bounce them and replace with strong heroes (5+ health) that can survive.

**Decision 8: Pressure Opponent's Tower**
- **Why**: Force opponent to use Exorcism defensively
- **Trade-off**: May overcommit and get blown out
- **Example**: Go all-in on one lane to force Exorcism, then bounce heroes

**Decision 9: Maintain Board Presence**
- **Why**: Need heroes on board to pressure and block
- **Trade-off**: Vulnerable to Exorcism
- **Example**: Keep 2-3 heroes on board, ready to bounce if needed

---

### Key Tactical Principles

1. **Health Thresholds Matter**
   - Heroes with 4+ health can survive 3-4 damage from Exorcism
   - Heroes with 2-3 health will die to Exorcism (4+ damage kills them)
   - Deploy high-health heroes to lanes where Exorcism might be cast

2. **Positioning and Range is Critical**
   - Exorcism affects units **adjacent to or directly in front** of the caster
   - UBG in slot 1 or 4: Only affects 2 slots (1-2 or 3-4)
   - UBG in slot 2 or 3: Affects 3 slots (1-3 or 2-4)
   - Units outside the splash zone are **completely safe** from Exorcism damage
   - To minimize tower damage to 3, need exactly 3 units in range (requires UBG in slot 2 or 3)

3. **Damage Distribution is Key**
   - 0 units in range = 12 to tower (worst for tower)
   - 1 unit in range = 6 to unit, 6 to tower (bad for both)
   - 2 units in range = 4 to each, 4 to tower (better)
   - 3 units in range = 3 to each, 3 to tower (best distribution - minimal tower damage!)
   - 4 units in range = 3 to each, 0 to tower (best for tower, but requires UBG in slot 2 with all 4 slots filled)

4. **Bouncing is a Tool, Not Always the Answer**
   - Bouncing **replaces** a hero with a new hero - the new hero takes the slot and will be affected by Exorcism
   - Bounce weak heroes (2-3 health) and replace with strong heroes (5+ health) that can survive
   - The new hero takes the damage, but if it has enough HP, it survives
   - Sometimes better to let weak heroes die if you don't have strong replacements
   - Sometimes better to deploy more heroes to spread damage
   - **Key**: Only bounce if you have a stronger replacement! Bouncing a 2/4 hero and replacing it with another 2/4 hero doesn't help.

5. **Predict Opponent's Plays**
   - Track opponent's mana and colors
   - Read their deck archetype (UBG = Exorcism likely)
   - **Predict UBG's slot position** to maximize units in splash zone
   - Position proactively, not reactively

6. **Tower HP vs. Hero Health**
   - Low tower HP = prioritize protecting tower (deploy heroes in splash zone)
   - Low hero health = prioritize protecting heroes (bounce them or position outside splash zone)
   - Balance both throughout the game

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
- Bounce low-health heroes (2-3 health) before Exorcism and replace with high-health heroes (5+ health)
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

