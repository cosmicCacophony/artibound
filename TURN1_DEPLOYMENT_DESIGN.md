# Turn 1 Deployment Design - Artifact-Style Counter-Deployment

## Overview

Turn 1 deployment follows Artifact Foundry's counter-deployment pattern, creating natural combat interactions and meaningful early game decisions.

## Deployment Sequence

### Phase 1: Player 1 Deploys to Lane 1
- **Player 1** deploys a hero to **Battlefield A (Lane 1)**
- This hero will face Player 2's hero in the same slot
- Creates natural combat interaction

### Phase 2: Player 2 Counter-Deploys to Lane 1 (Optional)
- **Player 2** can choose to:
  - **Counter-deploy** a hero to **Battlefield A** (same lane, potentially same slot)
  - **Pass** (skip counter-deployment)
- If counter-deploying, Player 2 can position to:
  - Face Player 1's hero (combat)
  - Avoid Player 1's hero (tower damage)
- Strategic decision: combat vs. tower pressure

### Phase 3: Player 2 Deploys to Lane 2
- **Player 2** deploys a hero to **Battlefield B (Lane 2)**
- This hero will face Player 1's hero in the same slot

### Phase 4: Player 1 Counter-Deploys to Lane 2 (Optional)
- **Player 1** can choose to:
  - **Counter-deploy** a hero to **Battlefield B** (same lane, potentially same slot)
  - **Pass** (skip counter-deployment)
- Same strategic decisions as Phase 2

### Phase 5: Deployment Complete
- Turn 1 deployment is complete
- Normal play phase begins
- Player 1 gets action and initiative

## Design Goals

### 1. Natural Combat Interactions
- Heroes face each other automatically
- Creates immediate combat decisions
- Enables combat tricks on turn 1

### 2. Meaningful Early Decisions
- **Which hero to deploy first?** (needs to be strong enough to open)
- **Where to position?** (combat vs. tower pressure)
- **Counter-deploy or pass?** (commit to combat or avoid it)
- **Which lane to prioritize?** (lane 1 vs. lane 2)

### 3. Draft Considerations
- Players need **1 hero strong enough to open deploy**
- Or draft **protection spells** (invulnerable, stun, etc.)
- Or be **fine losing early combat** (plan for mid/late game)

### 4. Early Game Balance
- **Losing a hero early is a setback, not devastating**
- Early gold leads are strong if maneuvered well
- Behind player can catch up in mid/late game
- Skilled players can apply pressure and deny "back breaking plays"

## Strategic Implications

### Opening Hero Selection
- **Strong stats** (can win combat)
- **Good abilities** (can turn the tide)
- **Protection** (can survive counter-deployment)

### Counter-Deployment Decisions
- **Counter-deploy if:**
  - You have a stronger hero
  - You have combat tricks (stun, invulnerable, etc.)
  - You want to force combat
- **Pass if:**
  - Opponent's hero is stronger
  - You want to avoid combat
  - You want to save hero for later

### Positioning Strategy
- **Same slot** = combat (kill units, get gold)
- **Different slot** = tower pressure (deal damage, avoid combat)
- **Adjacent positioning** = set up for AOE/combat tricks

## Combat Tricks Enabled

With natural combat on turn 1, these become relevant:
- **Stun** (prevent enemy from attacking)
- **Invulnerable + Reflect** (turn losing trade into winning trade)
- **Extra damage** (secure kill)
- **Temporary HP** (survive combat)
- **Combat buffs** (win trades)

## Implementation Details

### Phase Tracking
- `p1_lane1`: Player 1 deploys to Battlefield A
- `p2_lane1`: Player 2 can counter-deploy to Battlefield A
- `p2_lane2`: Player 2 deploys to Battlefield B
- `p1_lane2`: Player 1 can counter-deploy to Battlefield B
- `complete`: Deployment done, normal play begins

### Validation
- Enforces correct player for each phase
- Enforces correct battlefield for each phase
- Allows passing during counter-deployment phases

### UI Considerations
- Clear indication of current deployment phase
- Show which player can deploy
- Show which battlefield is active
- Allow passing during counter-deployment

## Benefits

1. **Solves early game flatness** - Creates immediate decisions
2. **Enables combat tricks** - Makes 3-mana combat setup cards relevant
3. **Natural positioning** - Forces meaningful slot choices
4. **Strategic depth** - Multiple decision points on turn 1
5. **Feels like Artifact** - Familiar pattern for players

## Future Considerations

- **Passing during counter-deployment** - Should this be a button or automatic?
- **Multiple heroes per lane** - Can players deploy multiple heroes to same lane?
- **Combat resolution timing** - When does combat resolve? After deployment or during play phase?

---

*This design creates natural combat interactions on turn 1, solving the early game flatness problem while maintaining strategic depth.*

