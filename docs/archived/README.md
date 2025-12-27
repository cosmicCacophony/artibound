# Archived Documentation

> **Archived:** 2025-12-25  
> **Reason:** Content consolidated into master guides

## Why These Files Were Archived

These documentation files have been **fully consolidated** into the 3 master guides:
- [`DESIGN_PHILOSOPHY_GUIDE.md`](../DESIGN_PHILOSOPHY_GUIDE.md)
- [`CARD_CREATION_MASTER_GUIDE.md`](../CARD_CREATION_MASTER_GUIDE.md)
- [`ARCHETYPE_DESIGN_GUIDE.md`](../ARCHETYPE_DESIGN_GUIDE.md)

The master guides now provide:
- **Complete workflows** instead of fragmented information
- **PVE roguelike focus** (removed PVP concepts)
- **Updated design standards** (3-mana = dual-color, rune death mechanic)
- **Boss matchups** for all archetypes

## Archived Files

### From `core/` (3 files)
- `MULTICOLOR_DESIGN.md` → Bouncing philosophy in DESIGN_PHILOSOPHY_GUIDE
- `DRAFT_PHILOSOPHY_AND_DEVELOPMENT_APPROACH.md` → Development approach in DESIGN_PHILOSOPHY_GUIDE
- `CARD_DESIGN_AND_COUNTERPLAY.md` → Counterplay in CARD_CREATION_MASTER_GUIDE

### From `design/` (8 files)
- `THREE_COLOR_CARD_DESIGN_PRINCIPLES.md` → 3-color section in CARD_CREATION_MASTER_GUIDE
- `RUNE_ARTIFACT_DESIGN.md` → Rune artifacts in CARD_CREATION_MASTER_GUIDE
- `RUNE_TENSION_DESIGN.md` → Rune cost philosophy in CARD_CREATION_MASTER_GUIDE
- `COLOR_IDENTITY_DESIGN.md` → Heavy color requirements in CARD_CREATION_MASTER_GUIDE
- `RPS_ARCHETYPE_SYSTEM.md` → Archetypes (no PVP) in ARCHETYPE_DESIGN_GUIDE
- `GU_SPLASH_ARCHETYPES.md` → GU section in ARCHETYPE_DESIGN_GUIDE
- `RGW_BIG_DUMB_CREATURES.md` → RGW section in ARCHETYPE_DESIGN_GUIDE
- `FIVE_COLOR_ARCHETYPE.md` → 5-color section in ARCHETYPE_DESIGN_GUIDE

## Content Preserved

✅ All content has been preserved and improved in the master guides  
✅ PVP-specific content (tier systems, hate-drafting) was intentionally removed  
✅ PVE focus added throughout (boss matchups, viable archetypes)  
✅ Updated design standards (rune death mechanic, 3-mana = dual-color)

## Can These Be Deleted?

**Yes, after 1-2 months** if you don't need to reference them.

These files are kept temporarily as a safety net. If you haven't needed to reference them by February 2026, they can be safely deleted.

## Rollback

If you need to restore these files:
```bash
# Move files back
mv docs/archived/core/* docs/core/
mv docs/archived/design/* docs/design/
# Update DESIGN_INDEX.md
```

---

**For current documentation, always refer to the 3 master guides in `docs/`.**



