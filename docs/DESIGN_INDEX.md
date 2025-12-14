# Artibound Design Documentation Index

> **Last Updated:** 2024-12-XX  
> **Purpose:** Central index of all design documentation with metadata for tracking relevance and cleanup

## Document Metadata System

All documentation files should include a metadata header with:
- **Created:** Date created
- **Last Updated:** Date last modified
- **Status:** `Active` | `Reference` | `Archived` | `Deprecated`
- **Relevance:** `High` | `Medium` | `Low`
- **Category:** `Design` | `Testing` | `Architecture` | `Analysis` | `Workflow`
- **Notes:** Optional notes about current relevance

**Status Definitions:**
- **Active:** Currently being used/updated, relevant to current development
- **Reference:** Useful reference material, but not actively maintained
- **Archived:** Historical record, kept for context but not actively used
- **Deprecated:** Superseded by other docs, can be deleted after review

**Relevance Definitions:**
- **High:** Core to understanding the game, frequently referenced
- **Medium:** Useful for specific tasks, occasionally referenced
- **Low:** Historical context, rarely referenced, candidate for cleanup

---

## Core Design Documents

### **core/MULTICOLOR_DESIGN.md** ⭐
**Purpose**: Core system design - 3-4 color decks, bouncing mechanics, strategic hero rotation
**When to reference**: Understanding the fundamental game system, bouncing decisions, multicolor strategy
**Key concepts**: Bouncing, hero rotation, 2-battlefield structure, color requirements

### **core/CARD_DESIGN_AND_COUNTERPLAY.md**
**Purpose**: Counterplay mechanics, items, hero abilities, deployment strategy
**When to reference**: Designing cards with counterplay, understanding skill expression
**Key concepts**: Counterplay items, hero abilities, secret deployment, initiative

### **core/DRAFT_PHILOSOPHY_AND_DEVELOPMENT_APPROACH.md** ⭐
**Purpose**: Core philosophy for archetype development and future draft environment
**When to reference**: Making design decisions, understanding development approach, planning archetypes
**Key concepts**: Gameplay-first development, archetype power tiers, draft skill expression, build-around design

---

## Card Design & Analysis

### **design/ARTIFACT_CARD_ANALYSIS.md** ⭐ (to be recreated)
**Purpose**: Analysis of Artifact Foundry cards for porting, organized by power level and color requirements
**When to reference**: Designing new cards, understanding power level → color system
**Key concepts**: 
- Power level → color system (1-3 mana = single, 4-5 = dual, 6-8 = triple)
- Specific card recommendations with mana costs and colors
- AOE spells, removal, combat tricks, enchantments

### **design/RW_UB_CARDS.md**
**Purpose**: Specific card designs for RW and UB archetypes
**When to reference**: Implementing RW/UB cards, understanding archetype identity

### **design/MULTICOLOR_CARD_EXAMPLES.md**
**Purpose**: Examples of multicolor card designs
**When to reference**: Designing multicolor cards, understanding color combinations

### **design/CARD_BRAINSTORM.md**
**Purpose**: Card brainstorming and design ideas
**When to reference**: Generating new card ideas, exploring design space

### **design/BATTLEFIELD_DESIGN.md**
**Purpose**: Battlefield design and static abilities
**When to reference**: Designing battlefields, understanding battlefield effects

### **design/ITEMS_AND_BATTLEFIELD_UPGRADES.md**
**Purpose**: Items and battlefield upgrade systems
**When to reference**: Designing items, understanding upgrade mechanics

### **design/THREE_COLOR_CARD_DESIGN_PRINCIPLES.md** ⭐
**Purpose**: Design principles for 3-color cards based on gameplay testing
**When to reference**: Designing 3-color cards, understanding commitment vs value trade-offs
**Key concepts**: 3-color cards at 4-5 mana should be reactive, generate card advantage, create multiple bodies, or have cross-lane interaction

---

## Strategic Analysis

### **analysis/EXORCISM_BOARD_STATES.md** ⭐ (to be recreated)
**Purpose**: Visual board state analysis for Exorcism positioning and counterplay
**When to reference**: Understanding Exorcism positioning, bounce decisions, RW positioning
**Key concepts**:
- Adjacency mechanics (slot positioning)
- Damage distribution (0-4 units in range)
- Bounce scenarios (replacing weak heroes with strong ones)
- Optimal positioning strategies

### **analysis/EARLY_GAME_DECISIONS.md** ⭐ (to be recreated)
**Purpose**: Early game decision points, initiative play, mana management
**When to reference**: Understanding early game strategy, initiative value, combat setup
**Key concepts**:
- Initiative and passing decisions
- Mana management (pass vs cast)
- Combat setup spells (invulnerable + reflect)
- Board position and tempo

### **analysis/INTERESTING_GAME_STATES.md** ⭐
**Purpose**: Catalog interesting game states and decision points to guide card design
**When to reference**: Designing new cards, deciding what to port, understanding what makes decisions fun
**Key concepts**: 
- Define fun moments first, then design cards to create them
- Port cards that enable interesting game states
- Remove cards that don't contribute to meaningful decisions
- Template for documenting new game states

### **analysis/MASTERY_MOMENTS.md** ⭐
**Purpose**: Analyze mastery moments from Artifact Foundry - decisions that create skill expression
**When to reference**: Understanding what makes games skill-intensive, designing cards that reward mastery
**Key concepts**:
- Early vs late value decisions (Homunculus)
- Efficiency vs maximum value (spell timing)
- Close games where skill matters more than luck
- How to port/adapt mastery moments to Artibound

### **analysis/BALANCE_ANALYSIS_RW_VS_UBG.md**
**Purpose**: Balance analysis for RW vs UBG matchup
**When to reference**: Understanding balance issues, testing matchups

---

## Testing & Workflow

### **testing/TESTING_PLAN.md**
**Purpose**: Comprehensive testing approach, scenarios, checklists
**When to reference**: Planning playtest sessions, documenting results

### **testing/FAST_TESTING_AND_DESIGN.md** ⭐ (to be recreated)
**Purpose**: Faster playtesting approaches, design workflow, power level system
**When to reference**: Improving testing efficiency, understanding design workflow
**Key concepts**:
- Scenario-based testing (vs full games)
- Power level → color system
- How diagrams help card suggestions
- Testing templates

### **testing/STRATEGY_TESTING.md**
**Purpose**: Focused strategy testing for specific archetypes
**When to reference**: Testing specific strategies, documenting test results

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
→ `design/ARTIFACT_CARD_ANALYSIS.md` (power level system)
→ `core/CARD_DESIGN_AND_COUNTERPLAY.md` (counterplay principles)
→ `design/RW_UB_CARDS.md` or `design/MULTICOLOR_CARD_EXAMPLES.md` (examples)

**Designing a 3-color card?**
→ `design/THREE_COLOR_CARD_DESIGN_PRINCIPLES.md` (commitment vs value principles)

**Understanding Exorcism positioning?**
→ `analysis/EXORCISM_BOARD_STATES.md`

**Understanding early game decisions?**
→ `analysis/EARLY_GAME_DECISIONS.md`

**Understanding bouncing?**
→ `core/MULTICOLOR_DESIGN.md`

**Planning a playtest?**
→ `testing/FAST_TESTING_AND_DESIGN.md` (efficient approach)
→ `testing/TESTING_PLAN.md` (comprehensive scenarios)

**Understanding the core system?**
→ `core/MULTICOLOR_DESIGN.md`

**Understanding draft philosophy and development approach?**
→ `core/DRAFT_PHILOSOPHY_AND_DEVELOPMENT_APPROACH.md`

**Understanding technical architecture?**
→ `architecture/ARCHITECTURE.md`
→ `architecture/DEVELOPMENT.md`

---

## Technical Architecture

### **architecture/ARCHITECTURE.md**
**Purpose**: Technical architecture and system design
**When to reference**: Understanding code structure, system architecture
**Key concepts**: Module organization, type system, component structure

### **architecture/DEVELOPMENT.md**
**Purpose**: Development notes, roadmap, and implementation decisions
**When to reference**: Understanding development progress, planned features
**Key concepts**: Feature roadmap, implementation notes, change log

### **architecture/IMPLEMENTATION_SUMMARY.md**
**Purpose**: Implementation summaries and change logs
**When to reference**: Understanding recent changes, implementation details

---

## Document Metadata Tracking

| Document | Status | Relevance | Category | Last Updated | Notes |
|----------|--------|-----------|----------|--------------|-------|
| **architecture/ARCHITECTURE.md** | Active | High | Architecture | 2024-12-XX | Technical architecture |
| **architecture/DEVELOPMENT.md** | Active | High | Architecture | 2024-12-XX | Living document - update existing sections |
| **architecture/IMPLEMENTATION_SUMMARY.md** | Active | Medium | Architecture | TBD | Implementation summaries |
| **core/MULTICOLOR_DESIGN.md** | Active | High | Design | 2024-12-XX | Core system design |
| **core/CARD_DESIGN_AND_COUNTERPLAY.md** | Active | High | Design | TBD | Counterplay mechanics |
| **core/DRAFT_PHILOSOPHY_AND_DEVELOPMENT_APPROACH.md** | Active | High | Design | 2025-01-XX | Draft philosophy & development approach |
| **design/ARTIFACT_CARD_ANALYSIS.md** | Reference | High | Analysis | TBD | Artifact Foundry card analysis |
| **design/RW_UB_CARDS.md** | Reference | Medium | Design | TBD | Specific RW/UB card designs |
| **design/MULTICOLOR_CARD_EXAMPLES.md** | Reference | Medium | Design | TBD | Multicolor card examples |
| **design/CARD_BRAINSTORM.md** | Active | Medium | Design | 2024-12-XX | RW/UBG card brainstorming |
| **design/BATTLEFIELD_DESIGN.md** | Reference | Medium | Design | TBD | Battlefield design |
| **design/ITEMS_AND_BATTLEFIELD_UPGRADES.md** | Reference | Medium | Design | TBD | Items and upgrades |
| **design/THREE_COLOR_CARD_DESIGN_PRINCIPLES.md** | Active | High | Design | 2025-01-XX | 3-color card design principles |
| **analysis/EXORCISM_BOARD_STATES.md** | Reference | Medium | Analysis | TBD | Exorcism positioning analysis |
| **analysis/EARLY_GAME_DECISIONS.md** | Reference | Medium | Analysis | TBD | Early game strategy |
| **analysis/INTERESTING_GAME_STATES.md** | Active | High | Design | TBD | Game state catalog |
| **analysis/MASTERY_MOMENTS.md** | Active | Medium | Design | TBD | Skill expression analysis |
| **analysis/BALANCE_ANALYSIS_RW_VS_UBG.md** | Active | High | Analysis | TBD | Balance analysis |
| **testing/TESTING_PLAN.md** | Active | High | Testing | 2024-12-XX | Comprehensive testing approach |
| **testing/FAST_TESTING_AND_DESIGN.md** | Active | High | Workflow | 2024-12-XX | Efficient testing approaches |
| **testing/STRATEGY_TESTING.md** | Active | High | Testing | 2024-12-XX | Focused RW strategy tests |
| **DOCUMENTATION_METADATA.md** | Active | High | Workflow | 2024-12-XX | Metadata system guide |

**Legend:**
- ⭐ = Important document (High relevance)
- Status: Active = in use, Reference = useful but not maintained, Archived = historical, Deprecated = can delete
- Relevance: High = core, Medium = useful, Low = candidate for cleanup

### Recently Cleaned Up
The following low-relevance documents have been removed:
- ✅ `TURN1_TESTING_CHECKLIST.md` - Redundant with TESTING_PLAN.md
- ✅ `TURN1_DEPLOYMENT_DESIGN.md` - Covered in other design docs
- ✅ `EARLY_GAME_PROBLEM_AND_SOLUTIONS.md` - Redundant with EARLY_GAME_DECISIONS.md
- ✅ `UB_BATTLEFIELD_DESIGN.md` - Covered in BATTLEFIELD_DESIGN.md
- ✅ `THREE_COLOR_DECKLISTS.md` - Outdated
- ✅ `CARD_DESIGN_AUDIT.md` - Outdated
- ✅ `CARD_EDITING_GUIDE.md` - Outdated

---

*This index helps navigate the design documentation. Each document has a specific purpose and should be referenced when working on related topics. Update metadata as documents are created, updated, or deprecated.*

