import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { PlayerArea } from './PlayerArea'
import { BattlefieldView } from './BattlefieldView'
import { ItemShopModal } from './ItemShopModal'
import { CardLibraryView } from './CardLibraryView'
import { CombatSummaryModal } from './CombatSummaryModal'
import { TopBar } from './TopBar'
import { CombatPreviewOverlay } from './CombatPreviewOverlay'
import { TemporaryGameZone } from './TemporaryGameZone'
import { drawCards } from '../game/effectResolver'
import { PlayerId } from '../game/types'

export function Board() {
  const { 
    gameState,
    showCombatSummary,
    setShowCombatSummary,
    combatSummaryData,
    selectedCardId,
    temporaryZone,
    setTemporaryZone,
    pendingEffect,
    setPendingEffect,
    setGameState,
  } = useGameContext()
  
  const [showDebug, setShowDebug] = useState(false)
  const [isOpponentExpanded, setIsOpponentExpanded] = useState(false)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null)

  return (
    <div className="board-root">
      <TopBar
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(prev => !prev)}
        onTogglePreview={() => setIsPreviewActive(prev => !prev)}
        isPreviewActive={isPreviewActive}
      />

      <ItemShopModal />
      <CardLibraryView />
      {temporaryZone && (
        <TemporaryGameZone
          zone={temporaryZone}
          onConfirm={(selection) => {
            if (temporaryZone?.type === 'ritualist_discard' && selection) {
              setGameState(prev => {
                const owner: PlayerId = temporaryZone.owner
                const otherPlayer: PlayerId = owner === 'player1' ? 'player2' : 'player1'
                const manaKey = `${owner}Mana` as keyof typeof prev.metadata
                const tokenId = temporaryZone.tokenId
                let nextState = {
                  ...prev,
                  player1Hand: owner === 'player1' ? prev.player1Hand.filter(card => card.id !== selection) : prev.player1Hand,
                  player2Hand: owner === 'player2' ? prev.player2Hand.filter(card => card.id !== selection) : prev.player2Hand,
                  battlefieldA: {
                    player1: prev.battlefieldA.player1.filter(card => card.id !== tokenId),
                    player2: prev.battlefieldA.player2.filter(card => card.id !== tokenId),
                  },
                  battlefieldB: {
                    player1: prev.battlefieldB.player1.filter(card => card.id !== tokenId),
                    player2: prev.battlefieldB.player2.filter(card => card.id !== tokenId),
                  },
                  metadata: {
                    ...prev.metadata,
                    [manaKey]: Math.max(0, (prev.metadata as any)[manaKey] - 1),
                    actionPlayer: otherPlayer,
                    initiativePlayer: otherPlayer,
                  },
                }
                nextState = drawCards(nextState, owner, 1)
                return nextState
              })
              setPendingEffect(null)
              setTemporaryZone(null)
              return
            }
            if (pendingEffect?.cardId === 'black-artifact-rix-altar' && selection) {
              setGameState(prev => {
                const removeCard = (cards: typeof prev.player1Hand) => cards.filter(card => card.id !== selection)
                const targetBattlefield = window.confirm('Deal damage to Tower A? (Cancel = Tower B)') ? 'battlefieldA' : 'battlefieldB'
                const enemy = pendingEffect.owner === 'player1' ? 'player2' : 'player1'
                const towerKey = targetBattlefield === 'battlefieldA'
                  ? (enemy === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP')
                  : (enemy === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP')

                return {
                  ...prev,
                  player1Hand: removeCard(prev.player1Hand),
                  player2Hand: removeCard(prev.player2Hand),
                  player1Base: removeCard(prev.player1Base),
                  player2Base: removeCard(prev.player2Base),
                  player1DeployZone: removeCard(prev.player1DeployZone),
                  player2DeployZone: removeCard(prev.player2DeployZone),
                  battlefieldA: {
                    player1: removeCard(prev.battlefieldA.player1),
                    player2: removeCard(prev.battlefieldA.player2),
                  },
                  battlefieldB: {
                    player1: removeCard(prev.battlefieldB.player1),
                    player2: removeCard(prev.battlefieldB.player2),
                  },
                  metadata: {
                    ...prev.metadata,
                    [towerKey]: Math.max(0, (prev.metadata as any)[towerKey] - (pendingEffect.effect.damage || 4)),
                  },
                }
              })
              setPendingEffect(null)
            }
            setTemporaryZone(null)
          }}
          onCancel={() => {
            setPendingEffect(null)
            setTemporaryZone(null)
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

      <div
        className={`player-zone player-zone--opponent ${isOpponentExpanded ? 'player-zone--expanded' : 'player-zone--collapsed'}`}
        onMouseEnter={() => setIsOpponentExpanded(true)}
        onMouseLeave={() => setIsOpponentExpanded(false)}
      >
        <PlayerArea player="player2" mode={isOpponentExpanded ? 'expanded' : 'collapsed'} showDebugControls={showDebug} />
      </div>

      <div className="battlefield-arena">
        <CombatPreviewOverlay
          gameState={gameState}
          hoveredUnitId={hoveredUnitId}
          selectedUnitId={selectedCardId}
          isPreviewActive={isPreviewActive}
        />
        <div className="battlefield-grid">
          <BattlefieldView
            battlefieldId="battlefieldA"
            showDebugControls={showDebug}
            onHoverUnit={setHoveredUnitId}
          />
          <BattlefieldView
            battlefieldId="battlefieldB"
            showDebugControls={showDebug}
            onHoverUnit={setHoveredUnitId}
          />
        </div>
      </div>

      <div className="player-zone player-zone--self">
        <PlayerArea player="player1" mode="expanded" showDebugControls={showDebug} />
      </div>
    </div>
  )
}
