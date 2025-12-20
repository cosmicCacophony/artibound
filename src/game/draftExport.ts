import { RoguelikeDraftState } from './roguelikeTypes'
import { Hero, ArtifactCard, SpellCard, GenericUnit, Color } from './types'

/**
 * Saved Draft Format
 * 
 * JSON format for saving interesting drafts for analysis, sharing, or replay.
 * Includes metadata, strategy notes, and full card data.
 */
export interface SavedDraft {
  // Metadata
  metadata: {
    timestamp: string // ISO 8601 timestamp
    version: string // Format version for future compatibility
    strategy?: string // Optional strategy notes/description
    archetype?: string // Optional archetype label (e.g., "Blue Spell Damage", "Multicolor Control")
  }
  
  // Summary statistics
  summary: {
    heroes: number
    artifacts: number
    spells: number
    units: number
    totalCards: number
    colors: Color[]
    totalPicks: number
  }
  
  // Full card data (organized by type)
  deck: {
    heroes: Omit<Hero, 'location' | 'owner'>[]
    artifacts: Omit<ArtifactCard, 'location' | 'owner'>[]
    spells: Omit<SpellCard, 'location' | 'owner'>[]
    units: Omit<GenericUnit, 'location' | 'owner'>[]
  }
}

/**
 * Export a roguelike draft to JSON format
 * 
 * @param draftState - The current draft state
 * @param strategy - Optional strategy notes/description
 * @param archetype - Optional archetype label
 * @returns JSON string of the saved draft
 */
export function exportDraftToJSON(
  draftState: RoguelikeDraftState,
  strategy?: string,
  archetype?: string
): string {
  const totalCards = 
    draftState.draftedArtifacts.length +
    draftState.draftedSpells.length +
    draftState.draftedUnits.length

  const savedDraft: SavedDraft = {
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      strategy,
      archetype,
    },
    summary: {
      heroes: draftState.draftedHeroes.length,
      artifacts: draftState.draftedArtifacts.length,
      spells: draftState.draftedSpells.length,
      units: draftState.draftedUnits.length,
      totalCards,
      colors: draftState.playerColors,
      totalPicks: draftState.totalPicks,
    },
    deck: {
      heroes: draftState.draftedHeroes,
      artifacts: draftState.draftedArtifacts,
      spells: draftState.draftedSpells,
      units: draftState.draftedUnits,
    },
  }

  return JSON.stringify(savedDraft, null, 2)
}

/**
 * Download a draft as a JSON file
 * 
 * @param draftState - The current draft state
 * @param strategy - Optional strategy notes/description
 * @param archetype - Optional archetype label
 * @param filename - Optional custom filename (defaults to timestamp-based)
 */
export function downloadDraftAsJSON(
  draftState: RoguelikeDraftState,
  strategy?: string,
  archetype?: string,
  filename?: string
): void {
  const json = exportDraftToJSON(draftState, strategy, archetype)
  
  // Generate filename if not provided
  if (!filename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const colorStr = draftState.playerColors.length > 0 
      ? draftState.playerColors.join('-') 
      : 'colorless'
    filename = `draft-${colorStr}-${timestamp}.json`
  }

  // Create blob and download
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Parse a saved draft from JSON
 * 
 * @param json - JSON string of a saved draft
 * @returns Parsed SavedDraft object
 * @throws Error if JSON is invalid or format is incompatible
 */
export function parseSavedDraft(json: string): SavedDraft {
  try {
    const draft = JSON.parse(json) as SavedDraft
    
    // Basic validation
    if (!draft.metadata || !draft.summary || !draft.deck) {
      throw new Error('Invalid draft format: missing required fields')
    }
    
    if (!draft.metadata.version) {
      throw new Error('Invalid draft format: missing version')
    }
    
    return draft
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`)
    }
    throw error
  }
}

