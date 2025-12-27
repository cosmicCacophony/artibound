# Rune Mechanics Quick Reference

## Color Identities at a Glance

| Color | Mechanic | What It Does | Strategic Value |
|-------|----------|--------------|-----------------|
| **Blue** | Free Spells | Spells refund their mana cost | Tempo advantage, enables spell-slinging |
| **Green** | Chromatic Payoff | Triggers when spending off-color runes | Rewards multicolor diversity |
| **Black** | Blood Magic | Pay life for missing runes | Ultimate flexibility, high risk |
| **Red** | Rune Amplification* | Spend extra runes for more power | All-in aggression |
| **White** | Rune Blessing* | Spend extra runes for permanent buffs | Scaling growth |

*Proposed - Not yet implemented

---

## Blue: Free Spells

**Format:** "XU" costs X mana + U rune, refunds X mana → Net cost: U rune only

**Examples:**
- `2U: Swap Units` - Free tempo play
- `3UU: Draw 2, Heal 3` - Free card advantage
- `4UB: Draw 2, Gain 2 Mana` - Net +2 mana!

**Key Cards:**
- 10 free spell cards (see `freeSpells` in comprehensiveCardData.ts)

**Strategy:**
- Draft blue heroes for U runes
- Cast multiple spells per turn
- Control/combo archetype

---

## Green: Chromatic Payoff

**Format:** Hero abilities that trigger when you spend specific rune colors they don't produce

**Payoff Types:**
- Damage, Healing, +Attack, Card Draw, Mana, Runes
- Per spell OR per rune spent

**Examples:**
- `Chromatic Brawler (RG)`: +2 attack when you spend U/B runes
- `Chromatic Healer (GW)`: Heal 2 when you spend R/B runes
- `Chromatic Destroyer (GB)`: Deal 1 damage per U/W rune spent
- `Chromatic Sage (GU)`: +1 mana when you spend R/W runes

**Key Heroes:**
- `rg-hero-chromatic-brawler`
- `gw-hero-chromatic-healer`
- `gb-hero-chromatic-destroyer`
- `gu-hero-chromatic-sage`

**Strategy:**
- Draft diverse colors for rune access
- Build around specific payoff heroes
- Cast spells with varied rune costs
- Synergizes with blue's free spells

---

## Black: Blood Magic

**Format:** When you lack runes, pay tower life instead (requires Blood Magic hero on battlefield)

**Life Costs (per tower × 2 for total):**
- Black rune: 2 life/tower (4 total)
- Red/Green rune: 3 life/tower (6 total)
- Blue/White rune: 4 total/tower (8 total)

**Examples:**
- Missing `UBR` = 4 + 2 + 3 = 9 life per tower = **18 total life**
- Missing `WW` with cost reduction = 3 + 3 = 6 life per tower = **12 total life**

**Key Heroes:**
| Hero | Stats | Special | Use Case |
|------|-------|---------|----------|
| Blood Mage (RB) | 4/6 | Unlimited | Standard greedy enabler |
| Blood Magic Adept (RB) | 3/7 | -1 cost reduction | **KEY CARD** for greed |
| Desperate Necromancer (UB) | 3/7 | Max 2 runes/spell | Safer control option |
| Greedy Ritualist (GB) | 5/5 | Unlimited | Glass cannon |
| Dark Ritualist (Mono-B) | 3/8 | Black only, 1 life/tower | Mono-black support |

**Hero IDs:**
- `rb-hero-blood-mage`
- `rb-hero-blood-adept`
- `ub-hero-desperate-necromancer`
- `gb-hero-greedy-ritualist`
- `black-hero-dark-ritualist`

**Strategy:**
- Draft Blood Magic hero early
- Splash powerful off-color spells
- Manage life total carefully
- Synergizes with tower healing

---

## Red: Rune Amplification (PROPOSED - NOT IMPLEMENTED)

**Format:** "Deal X damage. Spend extra R runes: Deal +Y per rune"

**Concept Examples:**
```
Fireball - 3R
Deal 3 damage. +2 per extra R rune spent.

Berserker Rage - 2RR
+3 attack. Spend RR: +6 attack + First Strike instead.

Chain Lightning - 4R
Deal X damage where X = runes spent casting this.
```

**Strategy (if implemented):**
- Bank runes for big explosive turns
- All-in aggressive plays
- Variable power based on runes available

**DO NOT IMPLEMENT YET** - Test existing mechanics first!

---

## White: Rune Blessing (PROPOSED - NOT IMPLEMENTED)

**Format:** "Target gains +X/+X. Spend extra W runes: +1/+1 per rune (max Y)"

**Concept Examples:**
```
Divine Blessing - 2W
+1/+1 permanently. +1/+1 per extra W rune (max 3).

Consecration - 3WW
Deploy: Spend up to 3 runes. +1/+1 per rune spent.

Shield of Faith - WW
+0/+3, indestructible this turn. Spend WW: Permanent.
```

**Strategy (if implemented):**
- Save runes for key blessing turns
- Build fortress heroes over time
- Permanent advantages compound

**DO NOT IMPLEMENT YET** - Test existing mechanics first!

---

## Synergies

**Blue + Green:**
- Free spells trigger chromatic payoffs for free bonuses
- Cast multiple spells → multiple triggers

**Black + Green:**
- Use Blood Magic to cast off-color spells → Triggers chromatic payoffs
- Life payment enables payoff triggers

**Blue + Black:**
- Free spells reduce mana constraints
- Blood Magic enables any spell regardless of runes
- Control/combo archetype

**All Three:**
- Draft diverse colors
- Use Blood Magic for impossible casts
- Trigger chromatic payoffs constantly
- Cast free spells to multiply advantages

---

## Testing Checklist

Before adding Red/White mechanics:

- [ ] Are rune mechanics fun and engaging?
- [ ] Is multicolor drafting viable?
- [ ] Are the three identities balanced?
- [ ] Does Blood Magic feel fair (not too strong/weak)?
- [ ] Do chromatic payoffs trigger enough?
- [ ] Are free spells too strong?
- [ ] Is the complexity level appropriate?
- [ ] Do players understand the mechanics?

**Only proceed to Red/White if all checks pass!**

---

**Quick Card Count:**
- Total Cards: ~321
- Blue Free Spells: 10
- Green Chromatic Heroes: 4
- Black Blood Magic Heroes: 5

**Last Updated:** December 26, 2025



