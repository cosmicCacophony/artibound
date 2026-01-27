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
import { drawCards, resolveSpellEffect } from '../game/effectResolver'
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
            if (temporaryZone?.type === 'target_select' && pendingEffect?.targeting && selection) {
              if (pendingEffect.cardId === 'black-sig-shadow-strike') {
                const confirmed = window.confirm('Cast Shadow Strike on this target?')
                if (!confirmed) {
                  return
                }
              }
              setGameState(prev => {
                const spellData = pendingEffect.spellData || {}
                const spell = {
                  id: pendingEffect.cardId,
                  name: pendingEffect.cardId,
                  description: '',
                  cardType: 'spell',
                  location: 'base',
                  owner: pendingEffect.owner,
                  effect: pendingEffect.effect,
                  colors: spellData.colors || [],
                  consumesRunes: spellData.consumesRunes || false,
                  manaCost: spellData.manaCost || 0,
                  refundMana: spellData.refundMana || 0,
                } as import('../game/types').SpellCard
                
                // Find and remove the spell card from hand/base using instance ID
                const instanceId = pendingEffect.instanceId
                const removeSpellFromZones = (cards: import('../game/types').Card[]) => 
                  cards.filter(card => card.id !== instanceId)
                
                // Pay costs and resolve effect
                const runePoolKey = `${pendingEffect.owner}RunePool` as keyof typeof prev.metadata
                const manaKey = `${pendingEffect.owner}Mana` as keyof typeof prev.metadata
                let updatedRunePool = prev.metadata[runePoolKey] as import('../game/types').RunePool
                let updatedMana = prev.metadata[manaKey] as number
                
                // Pay mana cost
                if (spell.manaCost) {
                  updatedMana = updatedMana - spell.manaCost
                }
                
                // Consume runes if needed
                if (spell.consumesRunes && spell.colors) {
                  const newTempRunes = [...(updatedRunePool.temporaryRunes || [])]
                  const newPermRunes = [...updatedRunePool.runes]
                  for (const color of spell.colors) {
                    const tempIdx = newTempRunes.indexOf(color as import('../game/types').RuneColor)
                    if (tempIdx !== -1) {
                      newTempRunes.splice(tempIdx, 1)
                    } else {
                      const permIdx = newPermRunes.indexOf(color as import('../game/types').RuneColor)
                      if (permIdx !== -1) {
                        newPermRunes.splice(permIdx, 1)
                      }
                    }
                  }
                  updatedRunePool = { runes: newPermRunes, temporaryRunes: newTempRunes }
                }
                
                // Apply refund
                if (spell.refundMana) {
                  updatedMana = updatedMana + spell.refundMana
                }
                
                const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
                
                // Resolve the spell effect with target
                const result = resolveSpellEffect({
                  gameState: prev,
                  spell,
                  owner: pendingEffect.owner,
                  targetId: selection,
                })
                
                return {
                  ...result.nextState,
                  [`${pendingEffect.owner}Hand`]: removeSpellFromZones(result.nextState[`${pendingEffect.owner}Hand` as keyof typeof result.nextState] as import('../game/types').Card[]),
                  [`${pendingEffect.owner}Base`]: removeSpellFromZones(result.nextState[`${pendingEffect.owner}Base` as keyof typeof result.nextState] as import('../game/types').Card[]),
                  [`${pendingEffect.owner}DeployZone`]: removeSpellFromZones(result.nextState[`${pendingEffect.owner}DeployZone` as keyof typeof result.nextState] as import('../game/types').Card[]),
                  metadata: {
                    ...result.nextState.metadata,
                    [runePoolKey]: updatedRunePool,
                    [manaKey]: updatedMana,
                    actionPlayer: otherPlayer,
                    initiativePlayer: otherPlayer,
                    activePlayer: otherPlayer,
                    player1Passed: false,
                    player2Passed: false,
                  },
                }
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
