# Draft Philosophy & Development Approach

> **Created:** 2025-01-XX  
> **Last Updated:** 2025-12-22  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Core philosophy for archetype development and future draft environment

## Development Philosophy: Gameplay-First, Draft-Later

### The Approach

**Current Focus:** Build distinct, fun archetypes through 1v1 gameplay testing. Draft tuning comes later.

**Rationale:**
- If gameplay isn't fun, draft won't matter
- Distinct gameplay identities will naturally create draft incentives
- Testing 1v1 archetypes allows deep understanding of each archetype
- Draft environment will emerge from strong archetype identities

### Development Phases

#### Phase 1: RW vs UGB (Current)
**Goal:** Establish baseline archetype identity and balance

**Focus:**
- RW: Go-wide, tower-focused, Legion synergies
- UGB: Control, hero-killing, Exorcism as build-around
- Ensure late pivots are punished (RW cards don't work in UGB)
- Test that Exorcism enables UGB archetype

**Success Criteria:**
- Archetypes feel distinct and fun
- Cards don't cross-pollinate well
- Exorcism is a clear pivot point
- Matchup is balanced and skill-testing

#### Phase 2: RW vs WB (Strong vs Strong)
**Goal:** Test archetype differentiation with two strong archetypes

**Focus:**
- WB: Sacrifice synergies, different from RW go-wide
- Ensure RW cards don't work in WB (and vice versa)
- Test late pivot punishment
- Test hate-drafting decisions

**Success Criteria:**
- RW and WB feel meaningfully different
- Late pivots are clearly punished
- Hate-drafting decisions are interesting
- Both archetypes are viable

#### Phase 3: WB vs UGR (Strong vs Strong)
**Goal:** Test strong archetype vs strong archetype dynamic

**Focus:**
- UGR: High threat density, good stats
- Both archetypes strong without build-arounds
- Test matchup balance
- Test that strong archetypes can coexist

**Success Criteria:**
- UGR feels distinct and strong
- WB vs UGR is balanced
- Both archetypes work without specific cards
- Draft decisions are interesting

#### Phase 4: WBG vs RGBW (Build-Around vs Greedy)
**Goal:** Test build-around and greedy archetypes

**Focus:**
- WBG: Needs specific cards to function
- RGBW: Needs multiple pieces, high risk/reward
- Test that build-arounds are weak without key cards
- Test that greedy archetypes are high risk/reward

**Success Criteria:**
- Build-around archetypes feel weak without key cards
- Build-around archetypes feel competitive with key cards
- Greedy archetypes are high risk/reward
- Matchups are balanced

#### Phase 5: Draft Tuning (Future)
**Goal:** Combine all archetypes and tune draft environment

**Focus:**
- Draft pool size and distribution
- Archetype power levels (strong vs build-around)
- Rock-paper-scissors balance
- Draft skill expression

**Success Criteria:**
- All archetypes are viable
- Draft skill is rewarded
- Games are fun and balanced
- Archetypes feel distinct

---

## Draft Environment Vision

### Archetype Power Tiers

#### Tier 1: Strong Baseline Archetypes
**Archetypes:** RW Legion, WB, UGR, RBG

**Characteristics:**
- Higher card quality on average
- Cards are good individually
- Harder to hate-draft effectively
- More consistent even when countered
- Don't require specific build-around cards
- **RW Legion**: Tier 1 - Strong baseline aggro deck with Legion synergies, consistent board presence

**Draft Incentives:**
- Players can commit early
- Cards work in multiple contexts
- Less risky to draft
- Good for players learning the game

#### Tier 2: Build-Around Archetypes
**Archetypes:** UGB (Exorcism), UBW (control finisher), RGW (buff/protect engine), **UB AOE Damage (2 colors)**

**Characteristics:**
- Need 1-2 key cards to function
- Weak without key cards
- Competitive with key cards
- Clear pivot points in draft
- Obvious hate-draft targets
- **UB AOE Damage (2 colors)**: Tier 2-3 - Can clear one lane effectively but lacks big finishers. Needs 3-4 colors to become Tier 1 (access to Exorcism or other powerful finishers)

**Draft Incentives:**
- Players can pivot if they see key cards
- Opponents can hate-draft key cards
- Rewards recognizing archetype signals
- Higher risk/reward
- **UB AOE Damage**: To reach Tier 1, must commit to 3-4 colors to access powerful finishers (Exorcism, etc.)

#### Tier 3: Greedy Archetypes
**Archetypes:** RGWB (needs multiple pieces), **UB AOE Damage (2 colors, no finisher)**

**Characteristics:**
- Need 2+ key cards to function
- Very weak without key cards
- Very strong with key cards
- High risk/reward
- Easy to disrupt
- **UB AOE Damage (2 colors)**: Tier 2-3 - Lacks big finishers, struggles to close games. Can control one lane but loses to stat-based decks like RW Legion. Needs to expand to 3-4 colors for Tier 1 power level.

**Draft Incentives:**
- Players can gamble on getting multiple pieces
- Opponents can easily disrupt
- Rewards deep archetype knowledge
- Highest risk/reward
- **UB AOE Damage**: Must decide whether to commit to 3-4 colors for finishers or accept Tier 2-3 power level

### Rock-Paper-Scissors Balance

**Example Framework:**
- **RW (aggro)** beats **UBW (control)** - too fast
- **UBW (control)** beats **UGB (midrange)** - better answers
- **UGB (midrange)** beats **RW (aggro)** - Exorcism punishes overcommitment

**Design Goals:**
- Create meta-reading: "opponent is RW, I should pivot to UGB"
- Enable sideboarding considerations: "I need to hate-draft Exorcism"
- Multiple viable paths: "I can go RW or pivot to UGB if Exorcism comes"
- Prevent one archetype from dominating

### Draft Skill Expression

**Skills to Reward:**
1. **Archetype Recognition:** "They took 2 RW cards, they're going RW"
2. **Pivot Timing:** "Should I pivot to UGB now or wait?"
3. **Hate-Draft Decisions:** "Is denying Exorcism worth taking a weaker card?"
4. **Archetype Knowledge:** "UGB beats RW, so I should pivot if they're RW"
5. **Build-Around Recognition:** "I see Exorcism, should I pivot to UGB?"

**How Gameplay Creates Draft Incentives:**
- **Distinct Synergies:** "Buff all Legion" only works in RW
- **Different Win Conditions:** Tower-focused vs hero-killing vs stalling
- **Incompatible Strategies:** Cards that work in one archetype don't work in others
- **Clear Build-Arounds:** Exorcism clearly enables UGB

---

## Design Principles for Current Development

### When Creating Cards

**Ask These Questions:**
1. **Archetype Identity:** Does this card reinforce the archetype's identity?
2. **Cross-Pollination:** Would this card work in other archetypes? (Should be "no" for most cards)
3. **Synergy Clarity:** Is it obvious which archetype this card belongs to?
4. **Build-Around Potential:** Could this be a build-around card? (For Tier 2/3 archetypes)
5. **Hate-Draft Value:** Is this card worth hate-drafting? (For build-around cards)

**Examples:**
- ✅ **"Buff all Legion"** - Clearly RW, doesn't work elsewhere
- ✅ **"Deal damage when hero dies"** - Could be WB sacrifice, doesn't work in RW
- ❌ **"+2/+2 to all units"** - Too generic, works everywhere
- ✅ **Exorcism** - Clearly UGB, powerful enough to enable archetype

### When Balancing Matchups

**Focus On:**
1. **Distinct Playstyles:** Each archetype should feel different
2. **Meaningful Decisions:** Games should reward skill
3. **Counterplay:** Every strategy should have counterplay options
4. **Late Pivot Punishment:** Cards from one archetype shouldn't work in another

**Avoid:**
- Making cards too generic (works everywhere)
- Making archetypes too similar
- Removing counterplay options
- Allowing easy pivots between archetypes

### When Testing Gameplay

**Test For:**
1. **Archetype Identity:** Does this archetype feel distinct?
2. **Synergy Strength:** Do archetype synergies feel powerful?
3. **Cross-Pollination:** Do cards from other archetypes feel weak here?
4. **Build-Around Impact:** Do build-around cards enable their archetypes?
5. **Matchup Balance:** Is the matchup fun and skill-testing?

**Document:**
- What makes each archetype unique
- Which cards are build-arounds
- How archetypes interact with each other
- What draft incentives emerge from gameplay

---

## Design Considerations for Future Draft

### Card Distribution

**For Strong Archetypes (Tier 1):**
- 60-70% of cards should be playable
- Cards should be good individually
- Fewer build-around dependencies
- More flexible card choices

**For Build-Around Archetypes (Tier 2):**
- 40-50% of cards should be playable
- 1-2 key cards that enable the archetype
- Clear pivot points
- Obvious hate-draft targets

**For Greedy Archetypes (Tier 3):**
- 30-40% of cards should be playable
- 2+ key cards required
- High risk/reward
- Easy to disrupt

### Build-Around Card Design

**Each build-around should:**
- Be clearly archetype-specific (obvious what it enables)
- Be weak outside its archetype (hate-drafting has a cost)
- Be powerful enough to justify pivoting
- Have 1-2 backup enablers (so hate-drafting one doesn't kill the archetype)

**Example for UGB:**
- **Exorcism** (rare, primary enabler) - 8 mana UBG, game-changing effect
- **Secondary enabler** (uncommon, less powerful but still enables UGB)
- **Supporting cards** (common, playable but not exciting)

### Draft Flow Considerations

**Early Picks (1-10):**
- Take best cards, read opponent's direction
- "They're going RW, I should look for UGB cards"

**Mid Picks (11-20):**
- Pivot if you see build-around cards
- Hate-draft if you're committed to a different archetype
- "They took Exorcism, I should pivot to UGB or hate-draft UGB cards"

**Late Picks (21-30):**
- Fill out your deck
- Continue hate-drafting if needed
- "I'm RW, they're UGB, I should hate-draft their supporting cards"

---

## Expert Design Guidance

### Is This Approach Correct?

**Yes, with caveats:**

✅ **Strengths:**
- Gameplay-first ensures fun core experience
- Distinct identities will naturally create draft incentives
- 1v1 testing allows deep understanding
- Prevents over-optimizing for draft before gameplay is solid

⚠️ **Considerations:**
- Must ensure cards don't cross-pollinate too much
- Must test that late pivots are punished
- Must ensure build-around cards are clearly identifiable
- Must ensure archetypes have distinct win conditions

### What If We Consider...

**1. Synergy Density**
- **Question:** How many "Legion" cards does RW need to feel distinct?
- **Consideration:** Too few = archetype doesn't feel cohesive. Too many = archetype becomes too narrow.
- **Guidance:** Aim for 40-50% of cards having archetype-specific synergies. Rest can be generically good.

**2. Build-Around Power Level**
- **Question:** How powerful should Exorcism be to enable UGB?
- **Consideration:** Too weak = archetype unplayable. Too strong = archetype dominates.
- **Guidance:** Build-around should make archetype competitive, not dominant. Test with and without build-around.

**3. Cross-Pollination Prevention**
- **Question:** How do we ensure RW cards don't work in WB?
- **Consideration:** Some generic cards are fine, but archetype-specific cards should be weak elsewhere.
- **Guidance:** Use clear keywords ("Legion", "Sacrifice") and archetype-specific effects. Test that mixing archetypes feels bad.

**4. Late Pivot Punishment**
- **Question:** How do we ensure late pivots are punished?
- **Consideration:** If cards work everywhere, pivots are easy. If cards are too narrow, pivots are impossible.
- **Guidance:** Cards should work best in their archetype, but be playable (weakly) elsewhere. Late pivots should feel suboptimal.

**5. Draft Signal Clarity**
- **Question:** How do we ensure players recognize archetype signals?
- **Consideration:** If signals are unclear, draft skill expression is reduced.
- **Guidance:** Use clear card names, effects, and keywords. Make build-around cards obviously powerful.

---

## Testing Checklist for Each Phase

### Phase Completion Criteria

- [ ] Archetypes feel distinct and fun
- [ ] Cards don't cross-pollinate well
- [ ] Late pivots are punished
- [ ] Build-around cards are clearly identifiable
- [ ] Matchup is balanced and skill-testing
- [ ] Draft incentives emerge naturally from gameplay

### Ongoing Questions to Ask

1. **Identity:** Does this archetype feel unique?
2. **Synergy:** Do archetype synergies feel powerful?
3. **Incompatibility:** Do other archetype's cards feel weak here?
4. **Build-Around:** Do build-around cards enable their archetypes?
5. **Balance:** Is the matchup fun and skill-testing?

---

## Documentation Requirements

**For Every Archetype:**
1. **Identity:** What makes this archetype unique?
2. **Win Condition:** How does this archetype win?
3. **Key Cards:** Which cards are build-arounds?
4. **Synergies:** What synergies define this archetype?
5. **Weaknesses:** What counters this archetype?
6. **Draft Incentives:** What draft decisions does this create?

**For Every Build-Around Card:**
1. **Archetype:** Which archetype does this enable?
2. **Power Level:** How powerful is this card?
3. **Hate-Draft Value:** Is this worth hate-drafting?
4. **Backup Plans:** Are there alternative enablers?
5. **Draft Signal:** How obvious is the signal?

---

*This document should be referenced when making design decisions. The goal is to create distinct, fun archetypes that will naturally create a skill-testing draft environment.*

