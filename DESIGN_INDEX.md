# Artibound Design Documentation Index

## Core Design Documents

### **MULTICOLOR_DESIGN.md** ⭐
**Purpose**: Core system design - 3-4 color decks, bouncing mechanics, strategic hero rotation
**When to reference**: Understanding the fundamental game system, bouncing decisions, multicolor strategy
**Key concepts**: Bouncing, hero rotation, 2-battlefield structure, color requirements

### **CARD_DESIGN_AND_COUNTERPLAY.md**
**Purpose**: Counterplay mechanics, items, hero abilities, deployment strategy
**When to reference**: Designing cards with counterplay, understanding skill expression
**Key concepts**: Counterplay items, hero abilities, secret deployment, initiative

---

## Card Design & Analysis

### **ARTIFACT_CARD_ANALYSIS.md** ⭐ (to be recreated)
**Purpose**: Analysis of Artifact Foundry cards for porting, organized by power level and color requirements
**When to reference**: Designing new cards, understanding power level → color system
**Key concepts**: 
- Power level → color system (1-3 mana = single, 4-5 = dual, 6-8 = triple)
- Specific card recommendations with mana costs and colors
- AOE spells, removal, combat tricks, enchantments

### **RW_UB_CARDS.md**
**Purpose**: Specific card designs for RW and UB archetypes
**When to reference**: Implementing RW/UB cards, understanding archetype identity

### **MULTICOLOR_CARD_EXAMPLES.md**
**Purpose**: Examples of multicolor card designs
**When to reference**: Designing multicolor cards, understanding color combinations

---

## Strategic Analysis

### **EXORCISM_BOARD_STATES.md** ⭐ (to be recreated)
**Purpose**: Visual board state analysis for Exorcism positioning and counterplay
**When to reference**: Understanding Exorcism positioning, bounce decisions, RW positioning
**Key concepts**:
- Adjacency mechanics (slot positioning)
- Damage distribution (0-4 units in range)
- Bounce scenarios (replacing weak heroes with strong ones)
- Optimal positioning strategies

### **EARLY_GAME_DECISIONS.md** ⭐ (to be recreated)
**Purpose**: Early game decision points, initiative play, mana management
**When to reference**: Understanding early game strategy, initiative value, combat setup
**Key concepts**:
- Initiative and passing decisions
- Mana management (pass vs cast)
- Combat setup spells (invulnerable + reflect)
- Board position and tempo

---

## Testing & Workflow

### **TESTING_PLAN.md**
**Purpose**: Comprehensive testing approach, scenarios, checklists
**When to reference**: Planning playtest sessions, documenting results

### **FAST_TESTING_AND_DESIGN.md** ⭐ (to be recreated)
**Purpose**: Faster playtesting approaches, design workflow, power level system
**When to reference**: Improving testing efficiency, understanding design workflow
**Key concepts**:
- Scenario-based testing (vs full games)
- Power level → color system
- How diagrams help card suggestions
- Testing templates

### **TURN1_TESTING_CHECKLIST.md**
**Purpose**: Specific turn 1 testing checklist
**When to reference**: Testing early game flow

---

## Design Principles Summary

### Power Level → Color Requirements
- **1-3 mana**: Single color (easier to cast early, less powerful)
- **4-5 mana**: Dual color (requires some setup, medium power)
- **6-8 mana**: Triple color (requires positioning/bouncing, high power)
- **9+ mana**: Triple color or special (very powerful)

### Core Mechanics
- **Bouncing**: Replace hero with new hero (weak → strong before Exorcism)
- **Initiative**: Passing keeps initiative, creates pressure
- **Positioning**: Adjacency matters (Exorcism affects adjacent + directly in front)
- **Counterplay**: Every strategy should have counterplay options

### Archetype Design
- **RW (2 colors)**: Aggro, go-wide, board presence
- **UB/UBG (2-3 colors)**: Control, removal, card advantage, late game

---

## Quick Reference: Which Doc to Use?

**Designing a new card?**
→ `ARTIFACT_CARD_ANALYSIS.md` (power level system)
→ `CARD_DESIGN_AND_COUNTERPLAY.md` (counterplay principles)
→ `RW_UB_CARDS.md` or `MULTICOLOR_CARD_EXAMPLES.md` (examples)

**Understanding Exorcism positioning?**
→ `EXORCISM_BOARD_STATES.md`

**Understanding early game decisions?**
→ `EARLY_GAME_DECISIONS.md`

**Understanding bouncing?**
→ `MULTICOLOR_DESIGN.md`

**Planning a playtest?**
→ `FAST_TESTING_AND_DESIGN.md` (efficient approach)
→ `TESTING_PLAN.md` (comprehensive scenarios)

**Understanding the core system?**
→ `MULTICOLOR_DESIGN.md`

---

## New: Game State Design

### **INTERESTING_GAME_STATES.md** ⭐
**Purpose**: Catalog interesting game states and decision points to guide card design
**When to reference**: Designing new cards, deciding what to port, understanding what makes decisions fun
**Key concepts**: 
- Define fun moments first, then design cards to create them
- Port cards that enable interesting game states
- Remove cards that don't contribute to meaningful decisions
- Template for documenting new game states

### **MASTERY_MOMENTS.md** ⭐ NEW
**Purpose**: Analyze mastery moments from Artifact Foundry - decisions that create skill expression
**When to reference**: Understanding what makes games skill-intensive, designing cards that reward mastery
**Key concepts**:
- Early vs late value decisions (Homunculus)
- Efficiency vs maximum value (spell timing)
- Close games where skill matters more than luck
- How to port/adapt mastery moments to Artibound

---

## Document Status

⭐ = Important document

**Current Status:**
- ✅ MULTICOLOR_DESIGN.md
- ✅ CARD_DESIGN_AND_COUNTERPLAY.md
- ✅ TESTING_PLAN.md
- ✅ ARTIFACT_CARD_ANALYSIS.md (recreated)
- ✅ EXORCISM_BOARD_STATES.md (recreated)
- ✅ EARLY_GAME_DECISIONS.md (recreated)
- ✅ FAST_TESTING_AND_DESIGN.md (recreated)
- ✅ INTERESTING_GAME_STATES.md (new!)

---

*This index helps navigate the design documentation. Each document has a specific purpose and should be referenced when working on related topics.*

