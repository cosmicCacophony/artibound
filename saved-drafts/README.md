# Saved Drafts

This directory contains saved draft decks in JSON format for reference, analysis, and future import functionality.

## Format

All saved drafts follow the `SavedDraft` format defined in `src/game/draftExport.ts`:

```typescript
{
  metadata: {
    timestamp: string
    version: string
    strategy?: string
    archetype?: string
  },
  summary: {
    heroes: number
    artifacts: number
    spells: number
    units: number
    totalCards: number
    colors: Color[]
    totalPicks: number
  },
  deck: {
    heroes: Hero[]
    artifacts: ArtifactCard[]
    spells: SpellCard[]
    units: GenericUnit[]
  }
}
```

## Current Drafts

### `gu-splash-ubgw-example.json`
**Archetype**: GU Spell Damage with UBGW Splash  
**Strategy**: Started with blue, found spell damage artifacts, prioritized spell damage, then moved into more colors for Exorcism and a big green unit as finisher.

**Key Cards**:
- **Heroes**: Battle Sorcerer (U), Arcane Paladin (UW) x2, Void Druid (UBG)
- **Artifacts**: Divine Wrath x3 (spell damage), Void Generator, Unbreakable Column, Nature's Revenge
- **Spells**: Arcane Removal x3, Light Strike Array, Arcane Burst x2, Necromantic Rite, Titan's Wrath, Arcane Denial
- **Units**: Cloud Sprite, Colossus, Nature's Guardian, Mana Bloom

**Colors**: Blue, White, Black, Green (UBGW)

## Usage

### Exporting Drafts
When you complete a draft in the roguelike draft mode, click "Export Draft (JSON)" to download your deck. The file will be automatically named based on colors and timestamp.

### Importing Drafts (Future)
Import functionality is planned for future development. The `parseSavedDraft()` function in `src/game/draftExport.ts` can be used to load saved drafts.

### Manual Creation
You can manually create saved draft files by:
1. Using the `exportDraftToJSON()` function from `src/game/draftExport.ts`
2. Creating a JSON file following the `SavedDraft` format
3. Placing it in this directory

## Naming Convention

Suggested naming: `{archetype}-{colors}-{timestamp}.json`

Examples:
- `gu-splash-ubgw-example.json` - GU base with UBGW splash
- `rw-legion-2024-12-15.json` - RW Legion deck
- `ubg-control-exorcism-2024-12-15.json` - UBG control with Exorcism

## Related Documentation
- `docs/design/GU_SPLASH_ARCHETYPES.md` - GU + splash archetype guide
- `src/game/draftExport.ts` - Export/import utilities




