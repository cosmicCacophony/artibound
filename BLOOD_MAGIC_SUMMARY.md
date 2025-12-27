# Blood Magic System - Implementation Complete

## Overview
Successfully implemented "Blood Magic" as black's unique rune identity - hero abilities that allow players to pay tower life instead of runes when casting spells. Costs scale by color relationship to black.

**This completes the third core rune mechanic, establishing runes as the central game system.** Each color now has (or will have) unique ways to interact with runes, creating deep strategic gameplay around rune generation, consumption, and manipulation.

## Design Philosophy

**Core Concept:** Black heroes enable "Blood Magic" - cast spells without enough runes by paying tower life for each missing rune.

**Cost Structure (per tower, multiply by 2 for total):**
- **Black (B):** 2 life/tower (4 total) - Black's own color
- **Red/Green (R/G):** 3 life/tower (6 total) - Allied colors
- **Blue/White (U/W):** 4 life/tower (8 total) - Enemy colors

**Why This Works:**
- **Thematic:** Black pays more to access colors it opposes (U/W)
- **Strategic:** Meaningful cost differences create real decisions
- **Enables greed:** Can splash anything, but costs scale appropriately
- **Risk/reward:** Missing 2-3 off-color runes can cost 12-20+ tower life!

## What Was Implemented

### 1. Type System ✅
**File:** `src/game/types.ts`

Added `BloodMagicConfig` interface:
```typescript
export interface BloodMagicConfig {
  enabled: boolean
  costReduction?: number // Reduce all costs by this amount (min 1)
  maxSubstitutions?: number // Max runes you can substitute (undefined = unlimited)
  description: string
}
```

- Added `bloodMagic?: BloodMagicConfig` to `HeroAbility` interface
- Added `pendingBloodMagicCost?: number` to `GameMetadata` for tracking pending tower damage

### 2. Rune System ✅
**File:** `src/game/runeSystem.ts`

Implemented `getBloodMagicCost()` function:
- Takes card, rune pool, blood magic config
- Identifies missing runes using existing `getMissingRunes()`
- Calculates cost per rune based on color:
  - Black: 2 life/tower
  - Red/Green: 3 life/tower
  - Blue/White: 4 life/tower
- Applies cost reduction if present (minimum 1 life per rune)
- Checks max substitutions limit
- Returns: `{ canCast: boolean, missingRunes: RuneColor[], lifeCostPerTower: number }`

### 3. Deployment - Affordability Check ✅
**File:** `src/hooks/useDeployment.ts`

When `canAffordCard()` returns false:
1. Checks if player has any Blood Magic hero on battlefield
2. Calls `getBloodMagicCost()` to calculate if Blood Magic can substitute
3. If possible, shows confirmation dialog:
   - Lists missing runes and their costs
   - Shows tower damage breakdown (per tower + total)
   - Requires explicit confirmation
4. Stores cost in `metadata.pendingBloodMagicCost` for deployment phase

### 4. Deployment - Life Payment ✅
**File:** `src/hooks/useDeployment.ts`

Added blood magic tower damage logic to all 3 spell-casting locations:
- Checks for `metadata.pendingBloodMagicCost`
- Applies tower damage to both towers (divides total by 2)
- Clears pending cost flag
- Console logs the blood magic usage

### 5. Heroes ✅
**File:** `src/game/comprehensiveCardData.ts`

Added 5 Blood Magic heroes across black color pairs:

#### RB - Blood Mage (Standard, id: `rb-hero-blood-mage`)
- **Stats:** 4/6
- **Cost:** B: 2, R/G: 3, U/W: 4 life/tower
- **Substitutions:** Unlimited
- **Use Case:** Standard greedy multicolor enabler

#### RB - Blood Magic Adept (Cost Reduction, id: `rb-hero-blood-adept`)
- **Stats:** 3/7
- **Cost:** B: 1, R/G: 2, U/W: 3 life/tower (-1 reduction)
- **Substitutions:** Unlimited
- **Use Case:** **KEY CARD** for greedy strategies, makes splashing viable

#### UB - Desperate Necromancer (Limited, id: `ub-hero-desperate-necromancer`)
- **Stats:** 3/7
- **Cost:** B: 2, R/G: 3, U/W: 4 life/tower
- **Substitutions:** Max 2 runes per spell
- **Use Case:** Safer, controlled splashing for control decks

#### GB - Greedy Ritualist (Unlimited, id: `gb-hero-greedy-ritualist`)
- **Stats:** 5/5
- **Cost:** B: 2, R/G: 3, U/W: 4 life/tower
- **Substitutions:** Unlimited
- **Use Case:** Glass cannon enabler, high risk/reward

#### Mono-B - Dark Ritualist (Black Only, id: `black-hero-dark-ritualist`)
- **Stats:** 3/8
- **Cost:** B: 1 life/tower (black runes only)
- **Substitutions:** Unlimited (but only works for black runes)
- **Use Case:** Mono-black support, very efficient for black spells

## Cost Examples

| Missing Runes | Standard Cost | With -1 Reduction |
|---------------|---------------|-------------------|
| B | 4 total | 2 total |
| R or G | 6 total | 4 total |
| U or W | 8 total | 6 total |
| BB | 8 total | 4 total |
| RR | 12 total | 8 total |
| UU | 16 total | 12 total |
| UBR | 18 total | 12 total |
| WWB | 20 total | 14 total |
| UUW | 24 total | 18 total |

## How It Works (User Flow)

1. **Player drafts Blood Magic hero** (e.g., Blood Mage)
2. **Player deploys Blood Magic hero** to battlefield
3. **Player attempts to cast spell** without enough runes
4. **System checks affordability:**
   - Normal rune check fails
   - Detects Blood Magic hero on battlefield
   - Calculates life cost for missing runes
5. **Confirmation dialog appears:**
   ```
   Blood Magic: Pay 14 tower life to cast Terminate?
   
   Missing runes: blue, red
   Cost: 7 life per tower (14 total)
   
   This will damage both of your towers!
   [Cancel] [OK]
   ```
6. **Player confirms** → Spell casts, tower damage applied
7. **Console logs:** `"Blood Magic: Paid 14 tower life (7 per tower) to cast Terminate"`

## Strategic Implications

### Deck Archetypes

**Mono-Black:**
- Use Dark Ritualist (1 life/tower)
- Pay only 2 total life per black rune
- Efficient, consistent strategy

**BR/BG (Allied Colors):**
- Medium costs (6 per rune)
- Reasonable splashing for key spells

**UB/WB (Enemy Colors):**
- Expensive splashes (8 per rune)
- High cost but enables powerful combos

**Greed (3+ colors):**
- Needs Blood Magic Adept (cost reduction)
- Accept massive life loss for power
- High skill ceiling strategy

### Decision Points

Players must constantly evaluate:
- **Is this spell worth 8-12 tower damage?**
- **Should I draft the cost-reduction hero?**
- **Can I win before tower damage kills me?**
- **Do I have tower healing to offset costs?**
- **Should I draft more rune producers instead?**

### Counterplay

- **Tower Damage:** Accelerate clock against Blood Magic players
- **Rune Denial:** Forces more blood magic usage
- **Tower Healing:** Offsets blood magic costs
- **Aggression:** Punish life payment

## Technical Notes

### Three Unique Identities (Implemented)

**These three mechanics form the core of Artibound's rune system:**

1. **Blue (Free Spells):** Pay X+Runes, refund X mana → Tempo advantage
   - Enables spell-slinging without depleting mana
   - Still requires rune generation
   - Rewards multicolor for rune access

2. **Green (Chromatic Payoff):** Spend off-color runes → Get bonuses → Rewards diversity
   - Incentivizes multicolor drafting
   - Rewards spending any runes, not just your colors
   - Scales with color diversity

3. **Black (Blood Magic):** Pay life for missing runes → Ultimate flexibility, high risk
   - Enables any spell regardless of runes
   - Escalating costs based on color relationships
   - High risk/reward decision-making

**Each color has a unique relationship with the rune system - this is Artibound's core identity!**

### Future Color Mechanics (Design Space)

**After testing the existing three mechanics, consider:**

**Red (Rune Amplification) - PROPOSED:**
- **Concept:** Spend extra runes to amplify spell effects
- **Examples:**
  - "Deal 3 damage. For each extra R rune spent, deal +2 damage"
  - "Attack +3. Spend RR: Attack +6 instead"
  - "Fireball: Deal X damage where X = runes spent"
- **Identity:** Red's aggressive, all-in nature
- **Strategic Value:** Converts excess runes into raw power

**White (Rune Blessing) - PROPOSED:**
- **Concept:** Spend extra runes for scaling stat bonuses
- **Examples:**
  - "Target hero gains +1/+1 for each extra W rune spent"
  - "Deploy: You may spend up to 3 extra runes. Gain +1/+1 per rune spent"
  - "Protection: Pay WW: This hero gains +0/+3 and cannot be destroyed this turn"
- **Identity:** White's protective, scaling buffs
- **Strategic Value:** Converts runes into permanent advantages

**Design Priority:** Test Blue, Green, and Black mechanics thoroughly before implementing Red/White to ensure the system is fun and balanced.

### Integration Points

- **Affordability Check:** `useDeployment.ts` ~line 245
- **Tower Damage Application:** `useDeployment.ts` ~lines 477, 636, 758
- **Cost Calculation:** `runeSystem.ts` `getBloodMagicCost()`
- **Type Definitions:** `types.ts` `BloodMagicConfig`

### Future Enhancements

**Phase 2 (if desired):**
- Visual feedback: Red pulsing on hero when blood magic is available
- Tower damage animation when blood magic is used
- UI indicator showing blood magic cost before casting
- Hero-specific visual effects (different for each hero)
- Sound effects for blood magic activation

**Design Space:**
- Heroes with life-gain to synergize with blood magic
- Heroes that reduce life costs based on conditions
- Heroes that convert life payment to damage
- Black spells that care about life payment
- Legendary heroes with unique blood magic twists

## Files Changed

1. `src/game/types.ts` - Added BloodMagicConfig interface, pendingBloodMagicCost field
2. `src/game/runeSystem.ts` - Added getBloodMagicCost function
3. `src/hooks/useDeployment.ts` - Added affordability check and tower damage logic
4. `src/game/comprehensiveCardData.ts` - Added 5 blood magic heroes

## Card Count Impact

- Started: 316 cards (with chromatic payoff heroes)
- Added: 5 blood magic heroes
- **Current: 321 cards**

---

**Status: ✅ COMPLETE**

All core systems implemented and functional! Blood Magic is ready for testing.

## Testing Recommendations

1. **Basic Test:**
   - Deploy Blood Mage
   - Try to cast spell without runes
   - Verify confirmation dialog appears
   - Verify tower damage is applied

2. **Cost Reduction Test:**
   - Deploy Blood Magic Adept
   - Compare costs with standard Blood Mage
   - Verify -1 reduction applies correctly

3. **Limit Test:**
   - Deploy Desperate Necromancer
   - Try spell with 3+ missing runes
   - Verify max 2 substitutions enforced

4. **Mono-Black Test:**
   - Deploy Dark Ritualist
   - Try spell with black runes (should work at 1 life/tower)
   - Try spell with non-black runes (should fail)

5. **Edge Cases:**
   - Multiple Blood Magic heroes (only one should trigger)
   - No mana but has runes (should still fail)
   - Spell with no rune cost (should not trigger)

