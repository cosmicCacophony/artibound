import { useState, useEffect, useCallback } from 'react'
import { GameState } from '../game/types'
import { useGameContext } from '../context/GameContext'

export function useGamePersistence() {
  const { gameState, setGameState, setActivePlayer } = useGameContext()
  const [savedStates, setSavedStates] = useState<Array<{ key: string, timestamp: number, display: string }>>([])

  const loadSavedStates = useCallback(() => {
    const states: Array<{ key: string, timestamp: number, display: string }> = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('artibound_state_')) {
        const timestamp = parseInt(key.replace('artibound_state_', ''))
        states.push({
          key,
          timestamp,
          display: new Date(timestamp).toLocaleString(),
        })
      }
    }
    states.sort((a, b) => b.timestamp - a.timestamp)
    setSavedStates(states)
  }, [])

  useEffect(() => {
    loadSavedStates()
  }, [loadSavedStates])

  const exportGameState = useCallback(() => {
    const timestamp = Date.now()
    const exportData = {
      ...gameState,
      exportedAt: timestamp,
    }
    const key = `artibound_state_${timestamp}`
    localStorage.setItem(key, JSON.stringify(exportData))
    loadSavedStates()
    alert(`Game state exported! Timestamp: ${new Date(timestamp).toLocaleString()}`)
  }, [gameState, loadSavedStates])

  const importGameState = useCallback((key: string) => {
    const saved = localStorage.getItem(key)
    if (!saved) {
      alert('Saved state not found!')
      return
    }
    
    try {
      const imported = JSON.parse(saved) as GameState & { exportedAt?: number }
      delete imported.exportedAt
      setGameState(imported)
      setActivePlayer(imported.metadata.activePlayer)
      alert('Game state imported successfully!')
    } catch (e) {
      alert('Error importing game state!')
      console.error(e)
    }
  }, [setGameState, setActivePlayer])

  return {
    savedStates,
    exportGameState,
    importGameState,
  }
}











