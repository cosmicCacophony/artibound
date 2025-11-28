# Deployment Mechanics Design Document

## Problem Statement

Currently, players can deploy heroes and units freely during the play phase. This creates a balance issue: **RW (Red/White) heroes have better stats**, so if they can always deploy in front of enemy heroes, it becomes too strong. The player who goes first or has better stats can always position advantageously, creating an unfair advantage.

**Key Constraints:**
- Game has **2 battlefields** (A and B) instead of Artifact's 3 lanes
- Each player has **4 heroes** total
- Turn 1 deployment is critical for establishing board presence
- Later deployments (turns 2+) also need consideration

---

## Artifact's Solution (Reference)

### How Artifact Handles Deployment

**Turn 1 Deployment:**
1. **1 hero placed randomly** (by game system)
2. **Remaining 2 heroes deployed with alternating initiative:**
   - Player A moves red hero to left lane
   - Player B moves their hero to that lane (or another)
   - Player A moves hero to lane 3
   - Player B moves hero to lane 3 (or another)

**Key Features:**
- Random placement prevents perfect positioning
- Alternating initiative creates counter-play opportunities
- Players can respond to opponent's deployment
- Initiative continues to matter for later deployments

**Why It Works:**
- Prevents "always deploy in front" advantage
- Creates strategic depth (do you match their lane or go elsewhere?)
- Random element adds variance without being too swingy

---

## Proposed Solutions for Artibound

### Option 1: Alternating Initiative Deployment (Artifact-Inspired)

**Turn 1 Deployment:**
- **Player A** deploys 1 hero anywhere
- **Player B** deploys 1 hero anywhere
- **Player A** deploys 1 hero anywhere
- **Player B** deploys 1 hero anywhere
- (Each player deploys 2 heroes on turn 1)

**Later Deployments (Turns 2+):**
- Continue using initiative system
- Player with initiative deploys first
- Initiative alternates after each deployment
- Or: Initiative passes to opponent after deployment

**Pros:**
- ✅ Prevents "always deploy in front" advantage
- ✅ Creates counter-play opportunities
- ✅ Uses existing initiative system
- ✅ Simple to understand
- ✅ Works for both turn 1 and later turns

**Cons:**
- ❌ Player B always gets last deployment (could be advantage or disadvantage)
- ❌ Doesn't fully solve the RW stat advantage (just mitigates it)
- ❌ Requires tracking initiative state

**Variation: Random First Deployment**
- First hero placement is random (by system)
- Then alternating initiative for remaining 3 heroes
- **Pros:** More variance, prevents perfect positioning
- **Cons:** Random element might feel bad

---

### Option 2: Asymmetric Deployment Pattern

**Turn 1 Deployment:**
- **Player A** deploys 1 hero anywhere
- **Player B** deploys 2 heroes anywhere (back-to-back)
- **Player A** deploys 1 hero anywhere
- (Player A: 2 heroes, Player B: 2 heroes)

**Later Deployments:**
- Use initiative system (whoever has initiative deploys first)
- Initiative alternates after each deployment

**Pros:**
- ✅ Player B gets to deploy twice in a row (compensates for going second)
- ✅ Creates interesting decision: do you deploy both heroes to same lane or split?
- ✅ Player A must commit first, Player B can react
- ✅ Works for later turns with initiative

**Cons:**
- ❌ Asymmetric pattern might feel unfair to Player A
- ❌ Player B's double deployment could be too strong
- ❌ Doesn't fully solve RW stat advantage

**Variation: Reverse Pattern**
- **Player A** deploys 2 heroes anywhere (back-to-back)
- **Player B** deploys 1 hero anywhere
- **Player A** deploys 1 hero anywhere
- **Player B** deploys 1 hero anywhere
- **Pros:** Player A gets early advantage, Player B gets last word
- **Cons:** More complex pattern

---

### Option 3: Simultaneous Deployment (Blind Bidding)

**Turn 1 Deployment:**
- Both players secretly choose where to deploy their 2 heroes
- Reveal simultaneously
- Resolve conflicts (if both deploy to same slot, use initiative or random)

**Later Deployments:**
- Use initiative system (whoever has initiative deploys first)

**Pros:**
- ✅ No "react to opponent" advantage
- ✅ Creates interesting mind games
- ✅ Prevents perfect counter-positioning
- ✅ Feels fair to both players

**Cons:**
- ❌ Requires UI for secret selection (more complex)
- ❌ Simultaneous reveal might be confusing
- ❌ Conflict resolution adds complexity
- ❌ Less strategic depth (can't react)

---

### Option 4: Deployment Slots with Restrictions

**Turn 1 Deployment:**
- Each battlefield has "deployment slots" (e.g., slots 1-3 for player 1, slots 4-5 for player 2)
- Players can only deploy to their slots initially
- After turn 1, normal deployment rules apply

**Later Deployments:**
- Normal deployment (can deploy anywhere)

**Pros:**
- ✅ Prevents "always deploy in front" completely
- ✅ Simple to understand
- ✅ Clear separation of deployment zones

**Cons:**
- ❌ Feels artificial/restrictive
- ❌ Doesn't solve the problem for later turns
- ❌ Might make some battlefields feel "locked"

---

### Option 5: Initiative-Based with Deployment Costs

**Turn 1 Deployment:**
- Use alternating initiative (Option 1)
- **Additional rule:** Deploying to a slot directly in front of an enemy hero costs +1 mana
- Or: Deploying to a slot with no enemy hero costs -1 mana

**Later Deployments:**
- Continue using initiative system

**Pros:**
- ✅ Adds resource management dimension
- ✅ Makes aggressive positioning cost mana
- ✅ Rewards strategic positioning
- ✅ Works for both turn 1 and later turns

**Cons:**
- ❌ More complex rules
- ❌ Mana costs might feel arbitrary
- ❌ Could slow down early game

---

### Option 6: Random Slot Assignment with Initiative

**Turn 1 Deployment:**
- System randomly assigns each hero to a battlefield (A or B)
- Players then use initiative to choose which slot within that battlefield
- Or: System randomly assigns slot, players use initiative to swap/change

**Later Deployments:**
- Normal deployment with initiative

**Pros:**
- ✅ Prevents perfect positioning completely
- ✅ Adds variance
- ✅ Uses initiative for meaningful choices

**Cons:**
- ❌ Too much randomness (might feel bad)
- ❌ Less player agency
- ❌ Random assignment might create unfair situations

---

## Recommended Approach: Option 1 (Alternating Initiative Deployment)

### Rationale

1. **Uses Existing System:** Initiative already exists in the codebase (for spells)
2. **Simple to Understand:** Easy to explain and implement
3. **Creates Counter-Play:** Players can react to opponent's deployment
4. **Works for All Turns:** Same system for turn 1 and later turns
5. **Mitigates RW Advantage:** Prevents "always deploy in front" without being too restrictive

### Implementation Details

**Turn 1 Deployment:**
```
1. Player A (has initiative) deploys 1 hero anywhere
2. Initiative passes to Player B
3. Player B deploys 1 hero anywhere
4. Initiative passes to Player A
5. Player A deploys 1 hero anywhere
6. Initiative passes to Player B
7. Player B deploys 1 hero anywhere
```

**Later Deployments (Turns 2+):**
- Player with initiative deploys first
- Initiative passes to opponent after deployment
- Continue alternating for all deployments

**Initiative Rules:**
- Initiative is tracked in `GameMetadata.initiativePlayer`
- Initiative passes after each hero/unit deployment
- Initiative can also be gained from spells (existing mechanic)
- At start of new turn, initiative resets to Player 1 (or keep from previous turn?)

### Code Changes Required

1. **Update `useDeployment.ts`:**
   - Check initiative before allowing deployment
   - Pass initiative after deployment
   - Block deployment if player doesn't have initiative

2. **Update `GameMetadata`:**
   - Ensure `initiativePlayer` is properly initialized
   - Track initiative state throughout game

3. **Update UI:**
   - Show who has initiative
   - Disable deployment buttons if player doesn't have initiative
   - Visual indicator for initiative player

4. **Turn 1 Special Rules:**
   - On turn 1, force deployment phase before play phase
   - Or: Allow deployment during play phase but require initiative

---

## Alternative: Hybrid Approach (Option 1 + Option 5)

### Concept

Combine alternating initiative with deployment costs:

**Turn 1 Deployment:**
- Use alternating initiative (Option 1)
- **Additional rule:** Deploying to a slot directly opposite an enemy hero costs +1 mana
- This makes aggressive positioning more expensive

**Later Deployments:**
- Continue using initiative
- Keep deployment cost rule

**Pros:**
- ✅ Prevents "always deploy in front" advantage
- ✅ Adds resource management
- ✅ Makes positioning decisions more interesting

**Cons:**
- ❌ More complex rules
- ❌ Might slow down early game
- ❌ Mana costs need careful balancing

---

## Testing Considerations

### Questions to Answer

1. **Does alternating initiative solve the RW stat advantage?**
   - Test: RW vs UB matchups with initiative system
   - Measure: Win rate, deployment patterns, player satisfaction

2. **Is Player B's last deployment too strong?**
   - Test: Does getting last deployment create unfair advantage?
   - Measure: Win rate by going first vs second

3. **Does the system feel fair?**
   - Test: Player feedback on deployment mechanics
   - Measure: Perceived fairness, strategic depth

4. **Is the system too complex?**
   - Test: New player experience
   - Measure: Time to understand, confusion points

5. **Does it work for later turns?**
   - Test: Turn 2+ deployments with initiative
   - Measure: Gameplay flow, strategic decisions

### Metrics to Track

- Deployment patterns (which slots are chosen most?)
- Win rate by deployment order (first vs second)
- Average mana spent on deployments
- Player satisfaction with deployment system

---

## Implementation Priority

### Phase 1: Basic Initiative Deployment
1. Implement alternating initiative for turn 1 deployment
2. Update UI to show initiative
3. Block deployment without initiative
4. Test with current card sets

### Phase 2: Later Turn Deployment
1. Extend initiative system to all deployments
2. Ensure initiative passes correctly
3. Test full game flow

### Phase 3: Refinements (If Needed)
1. Add deployment costs (if Option 5 is chosen)
2. Add random first deployment (if variance is needed)
3. Balance adjustments based on testing

---

## Open Questions

1. **Should initiative reset at start of each turn?**
   - **Option A:** Reset to Player 1 each turn
   - **Option B:** Keep initiative from previous turn
   - **Recommendation:** Reset to Player 1 for consistency

2. **Should units (non-heroes) also require initiative?**
   - **Option A:** Yes, all deployments require initiative
   - **Option B:** No, only heroes require initiative
   - **Recommendation:** Start with heroes only, expand if needed

3. **What happens if a player can't deploy (no mana, no cards)?**
   - **Option A:** Initiative passes automatically
   - **Option B:** Player must pass explicitly
   - **Recommendation:** Auto-pass if no valid deployments

4. **Should there be a "deployment phase" separate from "play phase"?**
   - **Option A:** Yes, dedicated deployment phase
   - **Option B:** No, deployment happens during play phase
   - **Recommendation:** Start with play phase, add separate phase if needed

---

## Comparison Table

| Option | Complexity | Fairness | Strategic Depth | Implementation Effort |
|--------|-----------|----------|----------------|----------------------|
| Option 1: Alternating Initiative | Low | High | Medium | Low |
| Option 2: Asymmetric Pattern | Medium | Medium | High | Low |
| Option 3: Simultaneous | High | High | Low | High |
| Option 4: Slot Restrictions | Low | Medium | Low | Medium |
| Option 5: Initiative + Costs | Medium | High | High | Medium |
| Option 6: Random Assignment | Low | Low | Low | Medium |

---

## Next Steps

1. **Decide on approach:** Choose Option 1 or hybrid
2. **Implement basic system:** Alternating initiative for turn 1
3. **Test with playtesters:** Get feedback on fairness and fun
4. **Iterate:** Adjust based on testing results
5. **Extend to later turns:** Apply system to all deployments
6. **Balance:** Fine-tune based on win rates and player feedback

---

*Document created: 2025-01-XX*
*Status: Design exploration - ready for implementation*

