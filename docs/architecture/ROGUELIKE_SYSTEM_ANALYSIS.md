# Roguelike System Analysis: Existing Systems Compatibility

> **Created:** 2025-01-XX  
> **Status:** Analysis  
> **Purpose:** Evaluate existing game systems for roguelike mode compatibility

## Executive Summary

**Overall Assessment:** Your existing systems are **mostly well-suited** for roguelike mode. The core gameplay loop works great, but some PVP-specific systems should be simplified or removed for solo play.

**Key Recommendations:**
1. **Keep Core Systems** ✅ - Combat, turn phases, runes, colors, heroes
2. **Simplify PVP Systems** ⚠️ - Initiative, turn 1 deployment, action passing
3. **Tweak Resource Systems** ⚠️ - Gold/item shop needs roguelike-specific design
4. **Remove/Simplify Complex Systems** ❌ - Some battlefield buffs, secret deployment

---

## System-by-System Analysis

### ✅ **KEEP AS-IS** - Core Systems That Work Great

#### 1. **Combat System** ✅
**Status:** Perfect for roguelike

**Why:**
- Positional combat works well for AI
- Tower/unit targeting is clear
- Combat resolution is straightforward
- No changes needed

**Recommendation:** Keep exactly as-is

---

#### 2. **Turn Phase System** ✅
**Status:** Perfect for roguelike

**Phases:** `deploy` → `play` → `combatA` → `adjust` → `combatB`

**Why:**
- Clear structure works for solo play
- AI can follow phase structure easily
- Player gets clear sense of game flow
- Strategic depth from dual battlefield combat

**Recommendation:** Keep exactly as-is

---

#### 3. **Rune System** ✅
**Status:** Excellent for roguelike deck building

**How it works:**
- Heroes generate runes when deployed
- Runes required for colored spells/cards
- Seals generate runes each turn
- Temporary runes from spells

**Why it's great for roguelike:**
- Creates interesting deck building constraints
- "Pick 2 cards" decisions become more strategic
- Color synergy matters (2-5 color deck goal)
- Rune management adds depth without complexity

**Recommendation:** Keep exactly as-is - this is a key differentiator!

---

#### 4. **Color System** ✅
**Status:** Perfect for roguelike

**How it works:**
- Max 4 colors per deck
- Cards require matching hero colors in battlefield
- Multicolor cards exist

**Why it's great:**
- Natural deck building constraint
- "Build 2-5 color deck" goal fits perfectly
- Color synergy decisions in draft
- Works well with rune system

**Recommendation:** Keep exactly as-is

---

#### 5. **Hero System** ✅
**Status:** Great for roguelike

**Features:**
- Heroes have abilities (cooldowns)
- Heroes generate runes
- Heroes can die and respawn (cooldown)
- Hero stats matter

**Why it works:**
- Heroes are key draft picks
- Hero abilities add strategic depth
- Death/respawn creates interesting decisions
- AI can use heroes effectively

**Recommendation:** Keep, but consider simplifying death cooldowns (see below)

---

#### 6. **Dual Battlefield System** ✅
**Status:** Works for roguelike (with AI considerations)

**Why:**
- Core to your game's identity
- Creates interesting strategic decisions
- AI can handle it (deploy to both battlefields)
- Adds depth without too much complexity

**Consideration:**
- AI needs to understand battlefield priorities
- Might want to simplify for early AI (focus one battlefield)
- But keep the system - it's what makes your game unique

**Recommendation:** Keep, but ensure AI can handle it

---

### ⚠️ **SIMPLIFY** - PVP-Specific Systems

#### 7. **Initiative System** ⚠️
**Status:** Too complex for roguelike

**How it works:**
- `actionPlayer`: Who can act right now
- `initiativePlayer`: Who acts first next turn
- Passing keeps initiative
- Spells can give initiative

**Why it's problematic:**
- Designed for PVP mind games
- AI doesn't need initiative (just plays when it's their turn)
- Adds complexity without value for solo play
- Hard to explain to players

**Recommendation:**
- **Remove for roguelike mode**
- Simplify to: Player acts → AI acts → Next turn
- Keep `activePlayer` for turn tracking
- Remove `initiativePlayer` and passing mechanics

**Implementation:**
```typescript
// Simplified for roguelike
actionPlayer: PlayerId // Just track whose turn it is
// Remove: initiativePlayer, passing mechanics
```

---

#### 8. **Turn 1 Deployment Phase** ⚠️
**Status:** Too complex for roguelike

**How it works:**
- Turn 1: P1 deploys to lane 1 → P2 counter-deploys → P2 deploys to lane 2 → P1 counter-deploys
- Artifact-style counter-deployment
- Creates strategic PVP decisions

**Why it's problematic:**
- Designed for PVP counterplay
- AI doesn't need counter-deployment
- Adds complexity without value
- Confusing for solo players

**Recommendation:**
- **Simplify for roguelike**
- Turn 1: Player deploys heroes → AI deploys heroes → Start game
- No counter-deployment phase
- Keep deployment phase for other turns (but simpler)

**Implementation:**
```typescript
// Remove: turn1DeploymentPhase
// Simplify: Both players deploy simultaneously on turn 1
```

---

#### 9. **Action Passing System** ⚠️
**Status:** Remove for roguelike

**How it works:**
- Players can pass to keep initiative
- Both players pass → combat triggers
- Creates timing decisions

**Why it's problematic:**
- PVP-specific mechanic
- AI doesn't need to pass strategically
- Adds UI complexity
- Not needed for roguelike

**Recommendation:**
- **Remove for roguelike**
- Player acts → AI acts automatically
- No passing needed
- Combat triggers after both players have acted

---

#### 10. **Secret Deployment (Future)** ⚠️
**Status:** Not implemented yet, but planned

**Planned feature:**
- Turn 2+: Both players deploy simultaneously
- Reveal at same time
- Creates bluffing/mind games

**Why it's problematic for roguelike:**
- PVP-specific (bluffing doesn't work vs AI)
- Adds complexity
- Not needed for solo play

**Recommendation:**
- **Don't implement for roguelike**
- Keep for PVP mode if you add it later
- Roguelike: Simple deployment (player → AI)

---

### ⚠️ **TWEAK** - Resource Systems

#### 11. **Gold & Item Shop System** ⚠️
**Status:** Needs roguelike-specific design

**Current system:**
- Gold from kills (5g for heroes, 2g for units)
- Gold per turn (5g)
- Item shop with items
- Items equip to heroes

**Issues for roguelike:**
- Gold from kills might be too much/little
- Item shop might be too complex
- When do you shop? (between bosses?)
- Items might not fit roguelike progression

**Recommendations:**

**Option A: Simplify Gold System**
- Remove gold from kills (too complex)
- Give fixed gold per turn (5g is fine)
- Or: Remove gold entirely, give items as post-boss rewards

**Option B: Roguelike-Specific Item Shop**
- Shop appears after each boss (not during combat)
- Limited items available
- Items as progression rewards (not just gold purchases)
- Simpler item pool

**Option C: Remove Item Shop Entirely**
- Items become post-boss rewards only
- No gold system needed
- Simpler progression

**My Recommendation:** **Option C** (remove item shop, items as rewards)
- Simpler for roguelike
- Items become meaningful rewards
- No gold management needed
- Focus on deck building instead

---

#### 12. **Death Cooldown System** ⚠️
**Status:** Consider simplifying

**Current system:**
- Heroes die → 1-2 turn cooldown → can redeploy
- Cooldown decreases each turn
- Heroes heal in base after cooldown

**Why it might be too complex:**
- Adds tracking overhead
- Might be frustrating in roguelike (hero stuck in base)
- AI needs to handle it

**Recommendations:**

**Option A: Keep as-is**
- Works fine, just needs AI support
- Adds strategic depth

**Option B: Simplify**
- Remove cooldown, heroes can redeploy immediately
- Or: Cooldown only 1 turn (instead of 1-2)

**My Recommendation:** **Keep as-is, but ensure AI handles it**
- Adds strategic depth
- Not too complex
- Just make sure AI redeploys heroes when cooldown expires

---

### ❌ **REMOVE/SIMPLIFY** - Complex Systems

#### 13. **Battlefield Buffs** ❌
**Status:** Too complex for roguelike MVP

**How it works:**
- Players can buy battlefield upgrades
- Permanent buffs to units in that battlefield
- Multiple effect types

**Why remove:**
- Adds complexity
- Not core to roguelike experience
- Can add later if needed
- Focus on deck building instead

**Recommendation:**
- **Remove for roguelike MVP**
- Can add later if roguelike needs more progression
- Keep code, just don't use it

---

#### 14. **Battlefield Death Counters** ❌
**Status:** Archetype-specific, might not be needed

**How it works:**
- RW-bf2: Death counter → draw card
- Tracks deaths per battlefield

**Why remove:**
- Archetype-specific mechanic
- Might not be in roguelike decks
- Adds tracking complexity

**Recommendation:**
- **Keep code, but don't use unless needed**
- Only activate if roguelike deck has that battlefield
- Otherwise ignore

---

#### 15. **Stun System** ⚠️
**Status:** Keep but simplify

**How it works:**
- Heroes can be stunned
- Stunned heroes don't deal damage, only receive it
- Manual toggle in UI

**Why it's fine:**
- Simple mechanic
- AI can use it
- Adds strategic depth

**Recommendation:**
- **Keep as-is**
- AI can stun enemy heroes (threat assessment)
- Simple enough for roguelike

---

### ✅ **ADD** - Roguelike-Specific Systems

#### 16. **Run State Management** ✅
**Status:** Need to add

**What's needed:**
- Track current boss number
- Track deck state (heroes, cards, battlefields)
- Track active bonuses
- Persist run state (localStorage)
- Run end conditions

**Recommendation:**
- Create `RoguelikeRun` type (see plan)
- Persist to localStorage
- Track progression

---

#### 17. **Boss System** ✅
**Status:** Need to add

**What's needed:**
- Boss definitions (decks, abilities, difficulty)
- Boss AI (simpler than general AI)
- Boss introductions/descriptions
- Difficulty scaling

**Recommendation:**
- Create `Boss` type (see plan)
- Start with 5-10 bosses
- Each boss has tuned deck
- Difficulty scales with boss number

---

#### 18. **Post-Boss Rewards** ✅
**Status:** Need to add

**What's needed:**
- Draft more cards (replace existing)
- Choose bonuses (extra mana, HP, etc.)
- Deck management UI
- Reward selection UI

**Recommendation:**
- Create reward system (see plan)
- Two options: Draft cards OR choose bonus
- Allow card replacement in deck

---

## Summary: What to Change

### Systems to Remove/Simplify:
1. ❌ **Initiative system** - Remove for roguelike
2. ❌ **Turn 1 deployment phase** - Simplify to normal deployment
3. ❌ **Action passing** - Remove, AI acts automatically
4. ❌ **Item shop** - Remove, items as rewards instead
5. ❌ **Battlefield buffs** - Remove for MVP
6. ⚠️ **Gold system** - Simplify or remove (if removing item shop)

### Systems to Keep:
1. ✅ **Combat system** - Perfect as-is
2. ✅ **Turn phases** - Perfect as-is
3. ✅ **Rune system** - Excellent for deck building
4. ✅ **Color system** - Perfect for deck building
5. ✅ **Hero system** - Great, keep
6. ✅ **Dual battlefields** - Core identity, keep
7. ✅ **Death cooldowns** - Keep, but ensure AI handles it
8. ✅ **Stun system** - Keep, simple enough

### Systems to Add:
1. ✅ **Run state management**
2. ✅ **Boss system**
3. ✅ **Post-boss rewards**
4. ✅ **Solo draft system**

---

## Implementation Priority

### Phase 1: Core Roguelike (MVP)
1. ✅ Keep: Combat, turns, runes, colors, heroes, battlefields
2. ❌ Remove: Initiative, turn 1 deployment, passing, item shop
3. ✅ Add: Run state, boss system, solo draft

### Phase 2: Polish
1. ⚠️ Add back: Simplified gold system (if needed)
2. ⚠️ Add back: Battlefield buffs (if needed)
3. ✅ Improve: AI decision making
4. ✅ Add: More bosses, difficulty scaling

---

## Code Changes Needed

### Minimal Changes (MVP):
1. **Remove initiative/passing:**
   - Simplify `GameMetadata` (remove `initiativePlayer`, `player1Passed`, `player2Passed`)
   - Simplify turn management (no passing logic)
   - AI acts automatically after player

2. **Simplify turn 1:**
   - Remove `turn1DeploymentPhase`
   - Simple deployment: Player → AI → Start

3. **Remove item shop:**
   - Keep item code, just don't use it
   - Or: Items become post-boss rewards only

4. **Add roguelike systems:**
   - `RoguelikeRun` type
   - `Boss` type
   - Solo draft logic
   - Post-boss rewards

### Estimated Effort:
- **Removing systems:** 1-2 days
- **Adding roguelike systems:** 2-3 weeks (as planned)
- **Total:** ~3 weeks for MVP

---

## Conclusion

**Your existing systems are 80% compatible with roguelike mode.** The core gameplay (combat, turns, runes, colors) works perfectly. You just need to:

1. **Remove PVP-specific complexity** (initiative, passing, turn 1 deployment)
2. **Simplify resource systems** (gold/item shop)
3. **Add roguelike-specific systems** (bosses, run state, rewards)

The result will be a **cleaner, more focused roguelike** that showcases your core game mechanics without PVP complexity getting in the way.

