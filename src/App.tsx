import { useState } from 'react'
import { Board } from './components/Board'
import { RoguelikeDraftView } from './components/RoguelikeDraftView'
import { HeroBrowserView } from './components/HeroBrowserView'
import { CardBrowserView } from './components/CardBrowserView'
import { GameProvider, useGameContext } from './context/GameContext'
import { stockDecks } from './game/stockDecks'
import './App.css'

function AppContent() {
  const [view, setView] = useState<'game' | 'roguelike' | 'heroes' | 'cards'>('roguelike')
  const [selectedStockDeckId, setSelectedStockDeckId] = useState<string>(
    stockDecks[0]?.id ?? ''
  )
  const { initializeRandomGame, initializeStockDeckGame } = useGameContext()

  const handleStartRandomGame = () => {
    initializeRandomGame()
    setView('game')
  }

  const handleStartStockDeckGame = () => {
    if (!selectedStockDeckId) return
    initializeStockDeckGame(selectedStockDeckId)
    setView('game')
  }

  return (
    <div className="App">
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => setView('roguelike')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'roguelike' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Roguelike Draft
        </button>
        <button
          onClick={() => setView('game')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'game' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Game
        </button>
        <button
          onClick={() => setView('heroes')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'heroes' ? '#9C27B0' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📖 Browse Heroes
        </button>
        <button
          onClick={() => setView('cards')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'cards' ? '#9C27B0' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🃏 Browse Cards
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <select
            value={selectedStockDeckId}
            onChange={event => setSelectedStockDeckId(event.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginRight: '8px',
            }}
          >
            {stockDecks.map(deck => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleStartStockDeckGame}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '8px',
            }}
            title="Start a game with a stock archetype deck vs RW boss"
          >
            Start Stock Deck
          </button>
          <button
            onClick={handleStartRandomGame}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            title="Start a game with randomly generated decks (for quick testing)"
          >
            🎲 Start Random Game
          </button>
        </div>
      </div>
      {view === 'roguelike' ? (
        <RoguelikeDraftView onStartGame={() => setView('game')} />
      ) : view === 'heroes' ? (
        <HeroBrowserView onClose={() => setView('roguelike')} />
      ) : view === 'cards' ? (
        <CardBrowserView onClose={() => setView('roguelike')} />
      ) : (
        <Board />
      )}
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App

