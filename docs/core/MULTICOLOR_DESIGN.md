# Multicolor Design Philosophy

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Core system design document - fundamental to understanding the game

## Core System: 3-4 Color Decks with Strategic Hero Rotation

### The Foundation

Artibound is designed around a **3-4 color deck system** (with 1-2 viable 2-color decks like RW). This is enabled by our unique **2-battlefield, 4-slot-each structure**, which creates a fundamentally different strategic landscape compared to games with more battlefields.

### Why 3-4 Colors Work Here

In Artifact Foundry, players have 3 lanes and 5 heroes. The temptation is to spread all 5 heroes across lanes for maximum damage, but this makes them vulnerable to:
- Combat damage and death
- Spell removal when damaged
- Loss of flexibility to respond to threats in other lanes
- Overcommitting to a lane when you want fewer heroes there

**Artibound's 2-battlefield structure makes multicolor play more viable** because:
- Fewer battlefields means **hero rotation is more obvious and necessary**
- You need heroes of different colors in different lanes to cast your spells
- The cost of a hero dying (1-round cooldown) is more painful in a 2-battlefield system
- Strategic bouncing becomes a core mechanic, not just an advanced technique

### The Bouncing Mechanic

**Bouncing** = Deploying a hero on top of another hero in the same slot, causing the original hero to return to base.

#### Why Bounce?

1. **Enable Spell Casting**
   - You have a UG (Blue/Green) hero in Lane 1, but need to cast a Blue spell in Lane 2
   - Bounce the UG hero, redeploy it to Lane 2 next turn when you have enough mana
   - This is essential for multicolor decks to function

2. **Protect Multicolor Heroes**
   - Your key multicolor hero (e.g., UBG) is damaged and vulnerable
   - Bounce it to base to heal it, protecting it from death and the painful cooldown
   - Deny your opponent gold by preventing the kill

3. **Strategic Positioning**
   - You want fewer heroes in a lane to avoid overcommitting
   - Bounce a hero to create space for better positioning
   - Respond to threats in other lanes by freeing up deployment options

#### The Trade-offs

**Costs of Bouncing:**
- **Less damage output** - Fewer heroes on the battlefield means less tower damage
- **Mana investment** - Bouncing costs mana (the deployment cost)
- **Tempo loss** - Hero is out of action for a turn
- **Vulnerability to aggro** - RW decks can run you over if you bounce too much

**Benefits of Bouncing:**
- **Hero protection** - Avoids death cooldown (2 turns)
- **Spell access** - Enables casting spells in the right lanes
- **Flexibility** - Better positioning and response options
- **Gold denial** - Prevents opponent from getting kill gold

### The Balancing Act

**The core tension:** Bounce too much, and RW aggro decks will run you over by just focusing on towers. Bounce too little, and your multicolor heroes die, you can't cast your spells, and you lose flexibility.

**This creates meaningful decisions:**
- Do I bounce my damaged UBG hero now, or risk it dying?
- Can I afford to bounce this turn, or do I need the damage?
- Is my opponent going to punish me for bouncing by going all-in on towers?
- Should I bounce to set up a big spell next turn, or deploy now for pressure?

**No obvious correct plays** - The game rewards reading the board state, understanding your opponent's deck, and making calculated risks.

### Design Implications

#### Hero Design
- **Multicolor heroes should be valuable** - They enable your deck, so losing them hurts
- **Hero abilities should reward positioning** - Make bouncing strategically interesting
- **Hero stats should reflect their role** - Control heroes can be more fragile (they bounce more), aggro heroes should be more resilient (they stay on board)

#### Spell Design
- **Spells should reward proper positioning** - Make bouncing to enable spells feel rewarding
- **High-impact spells** - If bouncing costs tempo, the spells you enable should be worth it
- **Color requirements matter** - Multicolor spells should be powerful enough to justify the complexity

#### Card Design
- **Bouncing is already valuable** - Protection, gold denial, and flexibility are benefit enough
- **Bounce synergies should be niche** - Not ubiquitous bonuses that make bouncing always correct
- **Cards that punish over-bouncing** - Aggro tools that punish passive play
- **Situational bounce interactions** - Cards that create interesting decisions, not general bonuses

### Archetype Examples

#### 3-4 Color Control (UBG)
- **Playstyle:** Bounce heroes frequently to protect them and enable spell casting
- **Win condition:** Outvalue with card draw and removal, finish with big threats
- **Weakness:** Can lose to RW if bouncing too much early game

#### 3-4 Color Midrange (RWG)
- **Playstyle:** Balance bouncing with pressure, use bouncing to set up big turns
- **Win condition:** Overwhelm with buffed units after setting up properly
- **Weakness:** Needs to find the right balance between aggression and protection

#### 2 Color Aggro (RW)
- **Playstyle:** Minimal bouncing, focus on damage and pressure
- **Win condition:** Run over opponents who bounce too much
- **Weakness:** Less flexible, vulnerable to control if game goes long

### Future Design Space

- **Niche bounce synergies** - Very specific, situational cards that interact with bouncing (not ubiquitous)
- **Battlefield effects** - Battlefields that make bouncing more or less attractive (but not always better)
- **Items** - Items that make heroes better at staying on board vs. better at bouncing
- **Cards that create interesting bounce decisions** - Not rewards, but interesting interactions

## Card & Hero Ideas Supporting Bouncing

### Design Philosophy: Bouncing is Already Valuable

**Bouncing provides inherent benefits:**
- Protects heroes from death (avoids 2-turn cooldown)
- Denies opponent gold (prevents kill)
- Provides flexibility (can deploy to either lane next turn)

**Therefore, bounce synergies should be:**
- **Niche and situational** - Not ubiquitous bonuses
- **Create interesting decisions** - Not make bouncing always correct
- **Support specific strategies** - Not general power boosts

### Heroes with Interesting Bounce Interactions

#### 1. **Tactical Strategist** (Blue/White)
- **Stats:** 3/7
- **Support Effect:** "Spells you cast in this lane cost 1 less mana"
- **Ability:** "Return target hero to base" (1 mana, 2 cooldown)
- **Design Intent:** The ability lets you bounce OTHER heroes, creating interesting tactical decisions. The support effect makes this lane valuable for spells, but bouncing still costs tempo.

#### 2. **Elusive Mage** (Blue)
- **Stats:** 2/6 (very fragile)
- **Support Effect:** "Spells you cast in this lane cost 1 less mana"
- **Ability:** "Return this hero to base" (0 mana, 3 cooldown)
- **Design Intent:** Designed to be bounced frequently due to fragility, but the ability is situational (maybe you want to bounce to avoid a spell, or to reposition). Not a general bonus.

#### 3. **Resilient Guardian** (Green/White)
- **Stats:** 4/10 (tanky)
- **Support Effect:** "Allies gain +0/+1"
- **Ability:** "Heal this hero to full health" (1 mana, 2 cooldown)
- **Design Intent:** Tanky hero that you might bounce when damaged, but bouncing is still a tempo cost. The ability helps if you keep it on board, creating a decision.

#### 4. **Mana Channeler** (Green/Blue)
- **Stats:** 3/8
- **Support Effect:** "Gain +1 max mana each turn"
- **Ability:** "Gain +1 max mana this turn" (1 mana, 2 cooldown)
- **Design Intent:** Ramp hero. Bouncing it loses you the ramp for a turn, but might be necessary to protect it or reposition. Creates tension.

### Spells Worth Bouncing For

#### 1. **Convergence Spell** (3-4 colors required)
- **Cost:** 6-8 mana
- **Effect:** "Deal X damage to all enemy units. Draw cards equal to the number of different colors among your heroes."
- **Design Intent:** High-impact spell that rewards having multicolor heroes in the right lanes. Worth bouncing to enable, but bouncing still costs tempo - the spell needs to be powerful enough to justify it.

#### 2. **Tactical Repositioning** (Blue/Green)
- **Cost:** 2 mana
- **Effect:** "Return target hero to base. It can be deployed this turn without paying mana cost."
- **Design Intent:** Situational spell that makes bouncing cheaper, but costs a card and mana. Only worth it in specific scenarios.

#### 3. **Multicolor Surge** (3+ colors)
- **Cost:** 5 mana
- **Effect:** "All your units gain +X/+X this turn, where X is the number of different colors among your heroes."
- **Design Intent:** Rewards having heroes of different colors in play. Bouncing to set this up is a strategic choice, not always correct.

### Units with Situational Bounce Interactions

#### 1. **Tactical Support** (White/Blue)
- **Stats:** 2/3
- **Cost:** 3 mana
- **Effect:** "When a hero returns to base, this gains +1/+1."
- **Design Intent:** Niche unit that benefits from bouncing, but you still need to decide if bouncing is worth it. The unit itself is weak, so it's a build-around, not a general bonus.

#### 2. **Flexible Mercenary** (Red/Blue)
- **Stats:** 3/4
- **Cost:** 4 mana
- **Effect:** "When you bounce a hero, this can attack immediately this turn."
- **Design Intent:** Situational - only matters if you're bouncing AND have this unit. Creates interesting decisions but doesn't make bouncing always correct.

### Cards That Punish Over-Bouncing

#### 1. **Relentless Assault** (Red/White)
- **Cost:** 3 mana
- **Effect:** "If opponent has fewer heroes on the battlefield than you, all your units gain +2 attack this turn."
- **Design Intent:** Punishes opponents who bounce too much by giving you a damage boost.

#### 2. **Tower Focus** (Red)
- **Cost:** 2 mana
- **Effect:** "Target unit can attack towers directly this turn. If opponent has 2 or fewer heroes on the battlefield, it gains +3 attack."
- **Design Intent:** Rewards going all-in on towers when opponent bounces too much.

### Battlefield Ideas

#### 1. **Tactical Command Center** (Blue/White)
- **Effect:** "Heroes in this lane have +0/+1. When a hero returns to base from this lane, draw a card."
- **Design Intent:** Makes bouncing from this specific lane slightly more attractive, but still situational. The defensive bonus helps heroes survive, reducing need to bounce.

#### 2. **War Front** (Red/White)
- **Effect:** "If you have more heroes on the battlefield than your opponent, all your units gain +1 attack."
- **Design Intent:** Punishes bouncing, rewards aggressive play. Creates tension - opponent bouncing gives you an advantage.

### Hero Updates to Existing Heroes

**Note:** Existing heroes are fine as-is. Bouncing is already valuable without additional bonuses. If we add bounce interactions, they should be:
- Very niche and situational
- Create interesting decisions, not make bouncing always correct
- Support specific strategies, not general power

**Example of a niche interaction (not recommended for all heroes):**
- **Void Druid** (UBG) - Maybe: "When this hero returns to base, if you control 3+ different colors, draw a card."
  - Very situational, only triggers in specific board states
  - Doesn't make bouncing always correct, just adds a consideration

### Implementation Notes

- **Bouncing is already valuable** - Protection, gold denial, and flexibility are benefit enough
- **Bounce synergies should be niche** - Not ubiquitous bonuses that make bouncing always correct
- **Create interesting decisions** - Bounce interactions should add strategic depth, not remove it
- **Aggro needs tools to punish** - RW and other aggro decks need ways to punish excessive bouncing
- **Multicolor spells should be powerful** - If bouncing costs tempo, the spells you enable should be worth it
- **Balance the tension** - The game should reward both bouncing strategically AND staying on board aggressively
