# Cross-Guild Synergy Design Philosophy

> **Created:** 2025-01-XX  
> **Status:** Active  
> **Purpose:** Document design philosophy for cards that work across guild boundaries

---

## Core Philosophy

**Strong synergy effects can enable cards to work outside their primary guild if the synergy is powerful enough.**

### Key Principle

**If a card has a strong enough synergy effect, players should be able to splash it into unsupported guilds if they can enable the synergy.**

**Example:** Shadowfiend (Black hero) wants protection/barrier (White), so it can work in:
- **Esper (WUB)** - Primary home (has white for barrier)
- **GWB** - Not supported, but can splash if you have white for barrier
- **WBR** - Not supported, but can splash if you have white for barrier

---

## Shadowfiend as Test Case

### Shadowfiend Design

**Stats:** 2/6 Black Hero
**Ability:** Gains +1/+1 counters when adjacent units die
**Synergy Need:** Protection/barrier to keep it alive

### Why Shadowfiend Works Cross-Guild

1. **Strong Synergy Effect**
   - Gains counters from adjacent deaths
   - Scales well if protected
   - Strong payoff if you can keep it alive

2. **Clear Synergy Requirement**
   - Needs protection/barrier (White)
   - Needs units to die (any color)
   - Needs to stay alive to scale

3. **Works in Multiple Guilds**
   - **Esper (WUB)**: Primary home - has white for barrier
   - **GWB**: Can splash if you have white for barrier
   - **WBR**: Can splash if you have white for barrier

### Design Rationale

**Shadowfiend is strong if you can keep him alive, weak if you can't.**

This creates interesting deck-building decisions:
- Do you commit to white for barrier?
- Do you draft protection spells?
- Is the payoff worth the splash?

---

## Design Guidelines for Cross-Guild Cards

### When to Allow Cross-Guild Synergy

1. **Strong Synergy Effect**
   - Card must be powerful if synergy is enabled
   - Payoff must be worth the deck-building cost
   - Should feel rewarding when it works

2. **Clear Synergy Requirement**
   - Card needs specific support (barrier, counters, etc.)
   - Requirement is clear and achievable
   - Not too restrictive (can be enabled in multiple ways)

3. **Interesting Deck-Building Decisions**
   - Creates meaningful choices
   - Rewards creative deck-building
   - Doesn't break game balance

### When NOT to Allow Cross-Guild Synergy

1. **Too Generic**
   - Card works everywhere without support
   - No interesting deck-building decisions
   - Just becomes "goodstuff"

2. **Too Restrictive**
   - Requires very specific support
   - Can't be enabled in multiple ways
   - Not worth the deck-building cost

3. **Breaks Balance**
   - Too powerful when enabled
   - Creates unfun gameplay
   - Dominates meta

---

## Shadowfiend Implementation

### Current Design

```typescript
{
  id: 'black-hero-shadowfiend',
  name: 'Shadowfiend',
  description: '2/6. Whenever an adjacent unit dies, this hero gains +1/+1 counter. When this hero dies, it loses half its counters (rounded down).',
  cardType: 'hero',
  colors: ['black'],
  attack: 2,
  health: 6,
  maxHealth: 6,
  currentHealth: 6,
  supportEffect: 'Gains +1/+1 counters from adjacent deaths',
  ability: {
    name: 'Necro Mastery',
    description: 'Deal 1 damage to a random enemy unit for each +1/+1 counter on this hero. Costs 2B.',
    manaCost: 2,
    cooldown: 2,
    effectType: 'shadowfiend_ability',
    effectValue: 1,
    runeCost: ['black'],
  },
}
```

### Synergy Enablers

**Protection/Barrier (White):**
- Barrier spells (grant barrier to units)
- Protection spells (prevent damage)
- White heroes with barrier abilities

**Unit Death (Any Color):**
- Combat (units die in combat)
- Removal spells (kill units)
- Sacrifice effects (sacrifice units)

### Guild Compatibility

**Primary Home:**
- **Esper (WUB)**: Has white for barrier, black for Shadowfiend, blue for control

**Splashable Into:**
- **GWB**: Not supported, but can splash if you have white for barrier
- **WBR**: Not supported, but can splash if you have white for barrier

**Why It Works:**
- Shadowfiend is strong if protected
- White provides barrier/protection
- Any deck with white can enable the synergy
- Payoff is worth the splash if you can keep it alive

---

## Design Philosophy: B-Tier Decks

### Allowing Unsupported Guilds

**Philosophy:** Players should be able to experiment with unsupported guilds if they have strong synergy effects.

**Example:** GWB or WBR with Shadowfiend
- Not fully supported (not a primary guild)
- Can be B-tier (weaker than supported guilds)
- But viable if you enable the synergy
- Creates interesting deck-building challenges

### Benefits

1. **Deck-Building Variety**
   - More options for creative players
   - Rewards understanding synergies
   - Allows experimentation

2. **Skill Expression**
   - Better players can identify synergies
   - Rewards deck-building skill
   - Creates interesting decisions

3. **Meta Diversity**
   - Not all decks need to be top-tier
   - B-tier decks can be fun and viable
   - Prevents meta from being too narrow

### Risks

1. **Balance Concerns**
   - Unsupported guilds might be too weak
   - Or too strong if synergy is too easy
   - Need careful tuning

2. **Complexity**
   - More options can be overwhelming
   - Harder to balance
   - Need clear guidelines

3. **Player Confusion**
   - Players might not understand synergies
   - Need clear communication
   - UI should help identify synergies

---

## Future Applications

### Other Cross-Guild Synergy Cards

**Potential Examples:**

1. **Counter-Moving Units (GBR)**
   - Want to move counters to other units
   - Could work in GWB if you have green for counters
   - Strong synergy if enabled

2. **Spell-Synergy Heroes (RB)**
   - Want to cast many spells
   - Could work in UBR if you have blue for spells
   - Strong payoff if enabled

3. **Barrier/Stun Units (GW)**
   - Want protection and control
   - Could work in WUB if you have white for barrier
   - Strong synergy if enabled

### Design Process

1. **Identify Strong Synergy**
   - Card has powerful effect
   - Requires specific support
   - Payoff is worth the cost

2. **Test Cross-Guild Compatibility**
   - Can it work in unsupported guilds?
   - Is the synergy achievable?
   - Is it balanced?

3. **Document and Communicate**
   - Explain the synergy
   - Show how to enable it
   - Make it discoverable

---

## Implementation Notes

### For Shadowfiend Specifically

**Current Status:**
- ✅ Strong synergy effect (gains counters)
- ✅ Clear requirement (needs protection)
- ✅ Works in multiple guilds (Esper, GWB, WBR)
- ✅ Interesting deck-building decisions

**Potential Improvements:**
- Make barrier/protection more accessible
- Ensure white cards provide enough barrier
- Test in unsupported guilds (GWB, WBR)
- Balance if too strong or too weak

### For Future Cross-Guild Cards

**Design Checklist:**
- [ ] Strong synergy effect?
- [ ] Clear synergy requirement?
- [ ] Works in multiple guilds?
- [ ] Interesting deck-building decisions?
- [ ] Balanced when enabled?
- [ ] Not too generic?
- [ ] Not too restrictive?

---

## Summary

**Core Philosophy:**
- Strong synergy effects can enable cards to work across guild boundaries
- Shadowfiend is a test case - strong if protected, weak if not
- Allows experimentation with unsupported guilds (GWB, WBR)
- Creates interesting deck-building decisions

**Design Principles:**
- Card must be powerful if synergy is enabled
- Requirement must be clear and achievable
- Should create meaningful deck-building choices
- B-tier decks are okay if they're fun and viable

**Next Steps:**
- Test Shadowfiend in unsupported guilds (GWB, WBR)
- Ensure barrier/protection is accessible
- Balance if needed
- Consider other cross-guild synergy cards

---

*This philosophy allows for more creative deck-building while maintaining clear guild identities. Shadowfiend is a good test case because it's strong if you can enable the synergy, but weak if you can't.*
