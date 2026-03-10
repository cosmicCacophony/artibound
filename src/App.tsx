import { useEffect, useState } from 'react'
import { Board } from './components/Board'
import { GameProvider, useGameContext } from './context/GameContext'
import './App.css'

function AppContent() {
  const { initializeRunePrototype } = useGameContext()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) {
      initializeRunePrototype()
      setStarted(true)
    }
  }, [started, initializeRunePrototype])

  if (!started) return null

  return (
    <div className="App">
      <Board />
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
