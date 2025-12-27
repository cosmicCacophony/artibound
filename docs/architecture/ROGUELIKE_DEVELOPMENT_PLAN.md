# Roguelike Development Plan: Iterative Card Design Approach

> **Created:** 2025-01-XX  
> **Status:** Active  
> **Purpose:** Phased approach to building roguelike mode through iterative playtesting and card design

## Development Philosophy

**Core Principle:** Learn what cards are needed through actual playtesting, not theoretical design.

**Approach:**
1. Start simple: Manual boss (you play as boss), basic draft
2. Playtest extensively to identify card gaps
3. Add cards iteratively based on what's missing
4. Eventually move to AI bosses once card pool is solid

---

## Phase 1: Manual Playtesting Setup (Week 1)

### Goal
Get to a playable state where you can draft decks and play against a manual boss.

### Tasks

#### 1.1: Solo Draft System (Simplified)
**Files:**
- `src/game/roguelikeTypes.ts` - Types for roguelike mode
- `src/game/roguelikeDraft.ts` - Solo draft logic
- `src/components/RoguelikeDraftView.tsx` - Draft UI
- `src/hooks/useRoguelikeDraft.ts` - Draft state management

**Implementation:**
- Pick 2 cards from pack → new randomized pack → repeat
- Continue until player has enough cards (e.g., 20-30 cards)
- Track drafted deck (heroes, cards, battlefields)
- Simple validation: Must have 2-5 colors

**Draft Pool:**
- **Start with ALL existing cards** (dump everything into draft pool)
- No filtering by archetype initially
- Let player discover what works

#### 1.2: Manual Boss System
**Files:**
- `src/game/bossData.ts` - Boss definitions
- `src/components/BossBattleView.tsx` - Boss battle UI

**Boss Design:**
- **Boss 1: Pure Red Aggro**
  - Use existing RW heroes (but only red ones)
  - Use existing red cards
  - You manually play as boss (no AI yet)
  - Boss gets buffs: +2 starting mana, +5 tower HP
  - Boss cards are slightly stronger (e.g., +1/+1 to all units)

**Why Pure Red:**
- Simplest archetype
- Red-heavy already (RW is mostly red)
- Easy to play manually as boss
- Tests basic combat

#### 1.3: Remove PVP Complexity
**Files to modify:**
- `src/hooks/useTurnManagement.ts` - Remove initiative/passing
- `src/hooks/useDeployment.ts` - Simplify turn 1 deployment
- `src/game/types.ts` - Remove unused fields (or make optional)

**Changes:**
- Remove initiative system
- Remove passing mechanics
- Simplify turn 1: Both deploy → Start game
- Remove item shop (keep code, just don't use)

#### 1.4: Basic Run State
**Files:**
- `src/game/roguelikeState.ts` - Run state management
- `src/components/RoguelikeRunView.tsx` - Main roguelike UI

**Features:**
- Track current boss
- Track player deck
- Track bosses defeated
- Simple run flow: Draft → Boss → Next Boss

### Success Criteria
- ✅ Can start a roguelike run
- ✅ Can draft a deck (pick 2 cards per pack)
- ✅ Can fight manual boss (you play as boss)
- ✅ Run tracks progression

---

## Phase 2: Card Discovery Through Playtesting (Week 2-3)

### Goal
Playtest extensively to identify what cards are missing.

### Playtesting Process

#### 2.1: Draft & Play Sessions
**Process:**
1. Start a roguelike run
2. Draft a deck (pick 2 cards per pack)
3. Try to build different color combinations:
   - Pure Red
   - Red/White
   - Red/Blue
   - Red/Black
   - Red/Green
   - 3-color combinations
   - 4-5 color combinations
4. Play against Red boss
5. Note what's missing:
   - "I need more red rune generators"
   - "I need late-game red payoffs"
   - "I can't build a good blue deck"
   - "I need more generic cards"

#### 2.2: Card Gaps to Identify

**Rune Generators:**
- Cards that add runes to your pool
- Needed for each color
- Examples:
  - "Add 1 red rune to your pool" (artifact)
  - "When this enters, add 1 blue rune" (unit)
  - "Seal: Generate 1 white rune each turn" (artifact)

**Late-Game Payoffs:**
- Expensive cards (7-9 mana + rune costs)
- Needed for each color
- Examples:
  - "8 mana, 3RRR: Deal 10 damage to target tower" (red)
  - "7 mana, 3UUU: Draw 5 cards" (blue)
  - "9 mana, 3WWW: All your units gain +5/+5" (white)

**Generic/Bad Cards:**
- Cards that are playable but not amazing
- Needed so players don't always have perfect decks
- Examples:
  - "3 mana, 2/2, no abilities" (vanilla units)
  - "4 mana, 3/3, minor ability" (slightly overcosted)
  - "5 mana, 4/4, situational ability" (not always good)

**Color Payoffs:**
- Cards that reward committing to a color
- Needed for each color
- Examples:
  - "If you control 3+ red heroes, this costs 2 less" (red)
  - "If you have 5+ blue runes, draw 2 cards" (blue)
  - "If you control 4+ white units, all units gain +2/+2" (white)

#### 2.3: Document Findings
**Create:**
- `docs/playtesting/CARD_GAPS.md` - List of missing cards
- `docs/playtesting/DECK_BUILDING_NOTES.md` - What works/doesn't work
- `docs/playtesting/COLOR_BALANCE.md` - Which colors need more cards

**Format:**
```
## Red Cards Needed

### Rune Generators
- [ ] Red Seal (artifact, generates 1 red rune per turn)
- [ ] Red Mana Rock (artifact, 2 mana, adds 1 red rune)

### Late-Game Payoffs
- [ ] Red Finisher (8 mana, 3RRR, deal 10 damage to tower)
- [ ] Red Overrun (7 mana, 2RR, all units gain +3/+0)

### Generic Cards
- [ ] Red Vanilla (3 mana, 2/2, no abilities)
- [ ] Red Filler (4 mana, 3/3, minor ability)
```

---

## Phase 3: Iterative Card Addition (Week 3-5)

### Goal
Add cards based on playtesting findings.

### Process

#### 3.1: Add Cards in Batches
**Approach:**
- Add 5-10 cards at a time
- Focus on one color at a time
- Test after each batch

**Priority Order:**
1. **Rune Generators** (highest priority - needed for all colors)
2. **Late-Game Payoffs** (needed for all colors)
3. **Generic/Bad Cards** (needed for draft balance)
4. **Color Payoffs** (nice to have, but can wait)

#### 3.2: Card Templates

**Rune Generator Template:**
```typescript
{
  id: 'red-seal-1',
  name: 'Red Seal',
  description: 'Seal: Generate 1 red rune each turn',
  cardType: 'artifact',
  colors: ['red'],
  manaCost: 3,
  // Special: Generates rune each turn (implement as Seal)
}
```

**Late-Game Payoff Template:**
```typescript
{
  id: 'red-finisher-1',
  name: 'Inferno Blast',
  description: 'Deal 10 damage to target tower',
  cardType: 'spell',
  colors: ['red'],
  manaCost: 8,
  consumesRunes: true,
  runeCost: ['red', 'red', 'red'], // 3RRR
}
```

**Generic Card Template:**
```typescript
{
  id: 'red-vanilla-1',
  name: 'Red Warrior',
  description: 'Basic warrior unit',
  cardType: 'generic',
  colors: ['red'],
  manaCost: 3,
  attack: 2,
  health: 2,
  maxHealth: 2,
  currentHealth: 2,
  // No special abilities - just a body
}
```

#### 3.3: Test After Each Batch
**Process:**
1. Add 5-10 cards
2. Draft a new deck
3. Try to use the new cards
4. Note if they help or if more are needed
5. Repeat

---

## Phase 4: Boss System Expansion (Week 5-6)

### Goal
Add more bosses and eventually move to AI.

### Boss Design

#### 4.1: Single-Color Bosses (Easy AI)
**Design:**
- Each boss is **pure single color**
- Boss gets buffs: +2 starting mana, +5 tower HP
- Boss cards are **slightly stronger** (+1/+1 to all units)
- Boss **doesn't use runes** (all cards are mana-only, or runes are free)
- Makes AI decisions easier (no rune management)

**Bosses:**
1. **Red Boss** (Pure Red Aggro) - Manual for now
2. **Blue Boss** (Pure Blue Control) - Manual for now
3. **White Boss** (Pure White Go-Wide) - Manual for now
4. **Black Boss** (Pure Black Removal) - Manual for now
5. **Green Boss** (Pure Green Ramp) - Manual for now

**Boss Deck Structure:**
- 4 heroes (all same color)
- 20-25 cards (all same color)
- Stronger versions of existing cards
- No rune costs (or runes are free)

#### 4.2: Boss Selection
**Options:**
- **Option A:** Beat all 5 bosses (one of each color)
- **Option B:** Random 3 bosses (shorter runs)
- **Option C:** Progressive (boss 1 = random color, boss 2 = different color, etc.)

**Recommendation:** **Option B** (Random 3 bosses)
- Shorter runs = more playtesting
- Variety without being too long
- Can adjust later

#### 4.3: Manual Boss Playtesting
**Process:**
1. Draft a deck
2. Fight boss (you play as boss)
3. Try different strategies as boss
4. Note what works/doesn't work
5. Adjust boss deck if needed

---

## Phase 5: Post-Boss Rewards (Week 6-7)

### Goal
Add progression between bosses.

### Reward System

#### 5.1: Reward Types
**Option A: Draft More Cards**
- After beating boss, get new pack
- Pick 2 cards
- Can replace existing cards in deck
- Deck management UI

**Option B: Choose Upgrade**
- Hero Upgrade: +1/+1 to all heroes
- Card Upgrade: +1/+1 to all units
- Battlefield Upgrade: +1 tower HP
- Bonus: +1 starting mana next battle
- Bonus: +5 tower HP next battle

**Recommendation:** **Both Options**
- Player chooses: Draft cards OR choose upgrade
- Gives strategic decisions
- Deck evolves throughout run

#### 5.2: Implementation
**Files:**
- `src/components/PostBossRewards.tsx` - Reward selection UI
- `src/game/roguelikeProgression.ts` - Reward logic
- `src/components/DeckManager.tsx` - Deck viewing/editing UI

**Features:**
- Show current deck
- Show new pack (if choosing draft)
- Show upgrade options (if choosing upgrade)
- Allow card replacement
- Save deck state

---

## Phase 6: AI Bosses (Week 7-9)

### Goal
Replace manual boss play with AI.

### AI Design

#### 6.1: Simple AI (Good Enough)
**Rules:**
- Play cards on curve (use mana efficiently)
- Attack towers when safe
- Kill enemy units that threaten towers
- Basic positioning (put units in front of enemy units)
- Use hero abilities when beneficial

**Why Simple AI Works:**
- Boss gets buffs (compensates for weaker AI)
- Boss cards are stronger (compensates for weaker AI)
- Boss doesn't use runes (simpler decisions)
- "Good enough" is fine for roguelike

#### 6.2: AI Implementation
**Files:**
- `src/game/aiSystem.ts` - AI decision making
- `src/hooks/useAIBoss.ts` - AI boss state management

**AI Functions:**
- `aiPlayCards()` - Decide which cards to play
- `aiChooseTargets()` - Decide combat targets
- `aiDeployHeroes()` - Decide hero deployment
- `aiUseAbilities()` - Decide when to use hero abilities

#### 6.3: Test AI
**Process:**
1. Implement basic AI
2. Play against AI boss
3. Note if AI is too easy/hard
4. Adjust boss buffs if needed
5. Improve AI gradually

---

## Card Design Guidelines for Roguelike

### Required Card Types (Per Color)

#### 1. Rune Generators (High Priority)
**Needed:** 2-3 per color
- Artifacts that generate runes (Seals)
- Units that add runes when they enter
- Spells that add temporary runes

**Examples:**
- Red Seal (artifact, 3 mana, generates 1 red rune per turn)
- Blue Mana Rock (artifact, 2 mana, adds 1 blue rune)
- White Banner (unit, 2/2, when this enters add 1 white rune)

#### 2. Late-Game Payoffs (High Priority)
**Needed:** 2-3 per color
- Expensive cards (7-9 mana)
- High rune costs (3+ runes)
- Powerful effects

**Examples:**
- Red: "8 mana, 3RRR: Deal 10 damage to tower"
- Blue: "7 mana, 3UUU: Draw 5 cards, opponent discards 2"
- White: "9 mana, 3WWW: All units gain +5/+5"

#### 3. Generic/Bad Cards (Medium Priority)
**Needed:** 5-10 per color
- Vanilla units (no abilities)
- Slightly overcosted units
- Situational cards (not always good)

**Examples:**
- "3 mana, 2/2, no abilities" (vanilla)
- "4 mana, 3/3, minor ability" (slightly overcosted)
- "5 mana, 4/4, situational" (not always good)

#### 4. Color Payoffs (Low Priority)
**Needed:** 2-3 per color
- Cards that reward committing to a color
- Synergy cards

**Examples:**
- "If you control 3+ red heroes, this costs 2 less"
- "If you have 5+ blue runes, draw 2 cards"

---

## Development Timeline

### Week 1: Manual Playtesting Setup
- Solo draft system
- Manual boss (Red)
- Remove PVP complexity
- Basic run state

### Week 2-3: Card Discovery
- Extensive playtesting
- Document card gaps
- Identify missing cards

### Week 3-5: Iterative Card Addition
- Add rune generators (all colors)
- Add late-game payoffs (all colors)
- Add generic cards (all colors)
- Test after each batch

### Week 5-6: Boss Expansion
- Add 4 more bosses (Blue, White, Black, Green)
- Manual boss playtesting
- Boss selection (random 3)

### Week 6-7: Post-Boss Rewards
- Draft more cards option
- Upgrade options
- Deck management UI

### Week 7-9: AI Bosses
- Simple AI implementation
- Test AI difficulty
- Adjust boss buffs
- Polish

**Total: 7-9 weeks** (with 10+ hours/week)

---

## Success Metrics

### MVP (Week 1-3)
- ✅ Can draft a deck solo
- ✅ Can play against manual boss
- ✅ Identified card gaps
- ✅ Added basic cards (rune generators, payoffs)

### Polish (Week 4-9)
- ✅ 5 bosses (one per color)
- ✅ Post-boss rewards
- ✅ AI bosses
- ✅ Balanced difficulty
- ✅ Fun deck building

---

## Next Steps

1. **Start with Phase 1** - Get manual playtesting working
2. **Playtest extensively** - Identify what's missing
3. **Add cards iteratively** - Based on playtesting
4. **Expand gradually** - More bosses, then AI

The key is to **learn through playtesting**, not theoretical design. Start simple, play a lot, add what's needed.





