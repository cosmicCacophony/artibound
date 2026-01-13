import { useGameContext } from '../context/GameContext'
import { GameHeader } from './GameHeader'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibraryView } from './CardLibraryView'
import { CombatSummaryModal } from './CombatSummaryModal'

export function Board() {
  const { 
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
  } = useGameContext()
  
  const { showCardLibrary, setShowCardLibrary } = useGameContext()

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh', overflow: 'hidden' }}>
      {/* Main Board */}
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto', position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <GameHeader />

        <ItemShopModal />
        <CardLibraryView />
        {combatSummaryData && (
          <CombatSummaryModal
            isOpen={showCombatSummary}
            onClose={() => setShowCombatSummary(false)}
            battlefieldA={combatSummaryData.battlefieldA}
            battlefieldB={combatSummaryData.battlefieldB}
          />
        )}

        {/* Floating Library Button */}
        <button
          onClick={() => setShowCardLibrary(!showCardLibrary)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '12px 16px',
            backgroundColor: showCardLibrary ? '#4a90e2' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          title="Toggle Card Library"
        >
          📚 Library
        </button>

        {/* Player 2 Area (Top) - Compact */}
        <div style={{ flexShrink: 0, marginBottom: '8px' }}>
          <PlayerArea player="player2" />
        </div>

        {/* Battlefields (Middle) - Main Focus */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '8px',
            flex: '1 1 auto',
            minHeight: '500px',
            overflowY: 'auto',
            alignContent: 'start',
          }}
        >
          <div style={{ minHeight: '400px' }}>
            <BattlefieldView battlefieldId="battlefieldA" />
          </div>
          <div style={{ minHeight: '400px' }}>
            <BattlefieldView battlefieldId="battlefieldB" />
          </div>
        </div>

        {/* Player 1 Area (Bottom) - Compact */}
        <div style={{ flexShrink: 0 }}>
          <PlayerArea player="player1" />
        </div>
      </div>
    </div>
  )
}
