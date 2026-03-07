import { useEffect } from 'react'
import { useGameContext } from '../context/GameContext'
import { GameHeader } from './GameHeader'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibrarySidebar } from './CardLibrarySidebar'
import { CardLibraryView } from './CardLibraryView'
import { CombatSummaryModal } from './CombatSummaryModal'
import { ResourceChoiceModal } from './ResourceChoiceModal'
import { getNextPhase } from '../game/turnStateMachine'

export function Board() {
  const { 
    setGameState,
    player1SidebarCards, 
    setPlayer1SidebarCards, 
    player2SidebarCards, 
    setPlayer2SidebarCards,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    metadata,
  } = useGameContext()

  const isPrototype = metadata.isRunePrototype
  const resourceChoices = metadata.resourceChoicesMade || { player1: false, player2: false }
  const actionPlayer = metadata.actionPlayer
  const showResourceModal = isPrototype
    && metadata.currentPhase === 'resource'
    && actionPlayer
    && !resourceChoices[actionPlayer]

  // Auto-advance from resource phase to play phase when both players have made choices
  useEffect(() => {
    if (isPrototype && metadata.currentPhase === 'resource' &&
        resourceChoices.player1 && resourceChoices.player2) {
      const nextPhase = getNextPhase('resource', 'RESOURCE_COMPLETE', true)
      setGameState(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          currentPhase: nextPhase,
        },
      }))
    }
  }, [isPrototype, metadata.currentPhase, resourceChoices.player1, resourceChoices.player2, setGameState])
  
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh' }}>
      {/* Left Sidebar - Player 1 */}
      <CardLibrarySidebar 
        player="player1" 
        cards={player1SidebarCards} 
        setCards={setPlayer1SidebarCards} 
      />

      {/* Main Board */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', position: 'relative', minWidth: 0 }}>
        <GameHeader />

        <ItemShopModal />
        <CardLibraryView />
        
        {showResourceModal && actionPlayer && (
          <ResourceChoiceModal
            player={actionPlayer}
            onComplete={() => {
              // After this player's choice, if opponent hasn't chosen yet, pass to them
              const other = actionPlayer === 'player1' ? 'player2' : 'player1'
              if (!resourceChoices[other]) {
                setGameState(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    actionPlayer: other,
                  },
                }))
              }
            }}
          />
        )}
        {combatSummaryData && (
          <CombatSummaryModal
            isOpen={showCombatSummary}
            onClose={() => setShowCombatSummary(false)}
            battlefieldA={combatSummaryData.battlefieldA}
            battlefieldB={combatSummaryData.battlefieldB}
          />
        )}

        {/* Player 2 Area (Top) */}
        <PlayerArea player="player2" />

        {/* Battlefields (Middle) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          <BattlefieldView battlefieldId="battlefieldA" />
          <BattlefieldView battlefieldId="battlefieldB" />
        </div>

        {/* Player 1 Area (Bottom) */}
        <PlayerArea player="player1" />
      </div>

      {/* Right Sidebar - Player 2 */}
      <CardLibrarySidebar 
        player="player2" 
        cards={player2SidebarCards} 
        setCards={setPlayer2SidebarCards} 
      />
    </div>
  )
}
