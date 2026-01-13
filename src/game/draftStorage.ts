/**
 * Draft Storage System
 * 
 * Saves drafts to localStorage so players can play against their previous drafts.
 * Keeps only the latest 2 drafts, automatically cleaning up older ones.
 */

import { FinalDraftSelection } from './types'

const STORAGE_KEY_PREFIX = 'artibound_draft_'
const MAX_DRAFTS = 2

interface StoredDraft {
  timestamp: number
  selection: FinalDraftSelection
}

/**
 * Save a draft to localStorage
 * Automatically cleans up old drafts, keeping only the latest 2
 */
export function saveDraft(selection: FinalDraftSelection): void {
  try {
    // Get all existing drafts
    const allDrafts: StoredDraft[] = []
    for (let i = 0; i < MAX_DRAFTS; i++) {
      const key = `${STORAGE_KEY_PREFIX}${i}`
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const draft = JSON.parse(stored) as StoredDraft
          allDrafts.push(draft)
        } catch (e) {
          // Invalid draft, skip it
          localStorage.removeItem(key)
        }
      }
    }

    // Add the new draft
    const newDraft: StoredDraft = {
      timestamp: Date.now(),
      selection: JSON.parse(JSON.stringify(selection)), // Deep clone to remove any runtime properties
    }

    allDrafts.push(newDraft)

    // Sort by timestamp (newest first) and keep only the latest MAX_DRAFTS
    allDrafts.sort((a, b) => b.timestamp - a.timestamp)
    const draftsToKeep = allDrafts.slice(0, MAX_DRAFTS)

    // Clear all storage keys first
    for (let i = 0; i < MAX_DRAFTS; i++) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${i}`)
    }

    // Save the drafts we're keeping
    draftsToKeep.forEach((draft, index) => {
      const key = `${STORAGE_KEY_PREFIX}${index}`
      localStorage.setItem(key, JSON.stringify(draft))
    })
  } catch (error) {
    console.error('Failed to save draft to localStorage:', error)
  }
}

/**
 * Get the most recent previous draft (the one before the current one)
 * Returns null if no previous draft exists
 */
export function getPreviousDraft(): FinalDraftSelection | null {
  try {
    // The most recent draft is at index 0, so the previous one is at index 1
    const previousDraftKey = `${STORAGE_KEY_PREFIX}1`
    const stored = localStorage.getItem(previousDraftKey)
    
    if (!stored) {
      return null
    }

    const draft = JSON.parse(stored) as StoredDraft
    return draft.selection
  } catch (error) {
    console.error('Failed to load previous draft from localStorage:', error)
    return null
  }
}

/**
 * Get the most recent draft (the current/latest one)
 * Returns null if no draft exists
 */
export function getLatestDraft(): FinalDraftSelection | null {
  try {
    const latestDraftKey = `${STORAGE_KEY_PREFIX}0`
    const stored = localStorage.getItem(latestDraftKey)
    
    if (!stored) {
      return null
    }

    const draft = JSON.parse(stored) as StoredDraft
    return draft.selection
  } catch (error) {
    console.error('Failed to load latest draft from localStorage:', error)
    return null
  }
}

/**
 * Clear all stored drafts
 */
export function clearAllDrafts(): void {
  for (let i = 0; i < MAX_DRAFTS; i++) {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${i}`)
  }
}

