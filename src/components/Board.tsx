import { useGameContext } from '../context/GameContext'
import { GameHeader } from './GameHeader.tsx'
import { PlayerArea } from './PlayerArea.tsx'
import { BattlefieldView } from './BattlefieldView.tsx'
import { CommandZone } from './CommandZone'
import { CombatSummaryModal } from './CombatSummaryModal'
import { VictoryModal } from './VictoryModal.tsx'
import { ResourceChoiceModal } from './ResourceChoiceModal'

export function Board() {
  const {
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    metadata,
    initializePrototype,
  } = useGameContext()

  const resourceChoices = metadata.resourceChoicesMade || { player1: false, player2: false }
  const showResourceModal = metadata.currentPhase === 'resource' && !resourceChoices[metadata.activePlayer]

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', padding: '15px', overflowY: 'auto' }}>
      <GameHeader />

      {showResourceModal && (
        <ResourceChoiceModal
          player={metadata.activePlayer}
          onComplete={() => {}}
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

      {metadata.gameOver && metadata.winner && (
        <VictoryModal
          isOpen={true}
          winner={metadata.winner}
          winReason={metadata.winReason || null}
          metadata={metadata}
          onRestart={initializePrototype}
        />
      )}

      <PlayerArea player="player2" />
      <CommandZone player="player2" />

      <div style={{ marginBottom: '15px' }}>
        <BattlefieldView battlefieldId="battlefieldA" />
      </div>

      <CommandZone player="player1" />
      <PlayerArea player="player1" />
    </div>
  )
}
