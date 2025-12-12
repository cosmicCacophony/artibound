# Documentation Metadata Guide

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Workflow  
> **Notes:** Guide for using the documentation metadata system

## Purpose

This guide explains the metadata system for tracking documentation relevance and managing cleanup. As the project evolves, many documents may become outdated or redundant. This system helps identify which documents are still relevant and which can be archived or deleted.

---

## Metadata Header Format

Add this header to the top of every documentation file (after the title, before the first section):

```markdown
# Document Title

> **Created:** YYYY-MM-DD  
> **Last Updated:** YYYY-MM-DD  
> **Status:** Active | Reference | Archived | Deprecated  
> **Relevance:** High | Medium | Low  
> **Category:** Design | Testing | Architecture | Analysis | Workflow  
> **Notes:** Optional notes about current relevance or purpose

## Content starts here...
```

---

## Status Values

### Active
- Currently being used/updated
- Relevant to current development
- Should be kept up-to-date

**Example:** `DEVELOPMENT.md`, `TESTING_PLAN.md`, `STRATEGY_TESTING.md`

### Reference
- Useful reference material
- Not actively maintained but still valuable
- May contain historical context or examples

**Example:** `ARTIFACT_CARD_ANALYSIS.md`, `EXORCISM_BOARD_STATES.md`

### Archived
- Historical record
- Kept for context but not actively used
- May contain outdated information

**Example:** Old design documents that have been superseded

### Deprecated
- Superseded by other documents
- Can be deleted after review
- Information has been moved elsewhere

**Example:** Documents that have been consolidated into other files

---

## Relevance Values

### High
- Core to understanding the game
- Frequently referenced
- Essential for development

**Examples:**
- Core system design (`MULTICOLOR_DESIGN.md`)
- Architecture docs (`ARCHITECTURE.md`, `DEVELOPMENT.md`)
- Active testing docs (`TESTING_PLAN.md`, `STRATEGY_TESTING.md`)

### Medium
- Useful for specific tasks
- Occasionally referenced
- Valuable but not essential

**Examples:**
- Specific analysis documents (`EXORCISM_BOARD_STATES.md`)
- Card design examples (`MULTICOLOR_CARD_EXAMPLES.md`)
- Workflow guides (`FAST_TESTING_AND_DESIGN.md`)

### Low
- Historical context
- Rarely referenced
- Candidate for cleanup or consolidation

**Examples:**
- Very specific checklists that may be redundant
- Early design documents that have been superseded
- Documents that duplicate information in other files

---

## Category Values

### Design
- Game design documents
- Card design
- Mechanic design
- Archetype design

**Examples:** `MULTICOLOR_DESIGN.md`, `CARD_BRAINSTORM.md`, `BATTLEFIELD_DESIGN.md`

### Testing
- Testing plans
- Testing checklists
- Playtesting documentation
- Test results

**Examples:** `TESTING_PLAN.md`, `STRATEGY_TESTING.md`, `TURN1_TESTING_CHECKLIST.md`

### Architecture
- Technical architecture
- Code structure
- System design
- Development practices

**Examples:** `ARCHITECTURE.md`, `DEVELOPMENT.md`

### Analysis
- Analysis of existing games
- Analysis of game states
- Strategic analysis
- Card analysis

**Examples:** `ARTIFACT_CARD_ANALYSIS.md`, `EXORCISM_BOARD_STATES.md`, `MASTERY_MOMENTS.md`

### Workflow
- Development workflows
- Testing workflows
- Design processes
- Efficiency guides

**Examples:** `FAST_TESTING_AND_DESIGN.md`, `CARD_EDITING_GUIDE.md`

---

## When to Update Metadata

### Update "Last Updated" when:
- You modify the document's content
- You add new information
- You clarify existing information

### Update "Status" when:
- Document becomes outdated → Change to `Reference` or `Deprecated`
- Document is superseded → Change to `Deprecated`
- Document is no longer used → Change to `Archived`
- Document becomes relevant again → Change to `Active` or `Reference`

### Update "Relevance" when:
- Document becomes less important → Lower relevance
- Document becomes more important → Raise relevance
- Document is rarely used → Lower to `Low` (candidate for cleanup)

### Update "Notes" when:
- Document's purpose changes
- Document has specific use cases
- Document has known limitations
- Document is part of a series or related to other docs

---

## Cleanup Process

### Quarterly Review
1. Review `DESIGN_INDEX.md` metadata table
2. Identify documents with:
   - `Status: Deprecated`
   - `Relevance: Low` + `Status: Reference` or `Archived`
3. Review each candidate:
   - Is information duplicated elsewhere?
   - Is information still valuable?
   - Can it be consolidated?
4. Take action:
   - **Consolidate:** Merge into active document
   - **Archive:** Move to archive folder (if keeping for history)
   - **Delete:** Remove if truly redundant

### Before Deleting
- Check if document is referenced in other docs
- Check if document has unique information
- Consider if information should be preserved elsewhere
- Update `DESIGN_INDEX.md` to remove entry

---

## Examples

### Active High-Relevance Document
```markdown
# Multicolor Design Philosophy

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Active  
> **Relevance:** High  
> **Category:** Design  
> **Notes:** Core system design document - fundamental to understanding the game
```

### Reference Medium-Relevance Document
```markdown
# Artifact Card Analysis

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Reference  
> **Relevance:** High  
> **Category:** Analysis  
> **Notes:** Useful reference for card design, but not actively maintained
```

### Low-Relevance Candidate for Cleanup
```markdown
# Turn 1 Testing Checklist

> **Created:** 2024-12-XX  
> **Last Updated:** 2024-12-XX  
> **Status:** Reference  
> **Relevance:** Low  
> **Category:** Testing  
> **Notes:** May be redundant with TESTING_PLAN.md - candidate for consolidation
```

---

## Integration with DESIGN_INDEX.md

The `DESIGN_INDEX.md` file maintains a metadata tracking table that should be updated whenever:
- A new document is created
- A document's metadata changes
- A document is deprecated or deleted

Keep the table in `DESIGN_INDEX.md` synchronized with the actual document metadata headers.

---

## Benefits

1. **Easy Cleanup:** Quickly identify documents that can be removed
2. **Clear Purpose:** Understand what each document is for
3. **Maintenance Tracking:** Know which documents need updates
4. **Historical Context:** Track when documents were created/updated
5. **Relevance Tracking:** Identify which documents are most important

---

*This metadata system helps keep documentation lean and relevant as the project evolves.*

