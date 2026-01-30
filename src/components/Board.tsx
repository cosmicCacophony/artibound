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
import { drawCards, getTemplateId, resolveSpellEffect } from '../game/effectResolver'
import { PlayerId } from '../game/types'
import { onSpellCast } from '../game/spellcasterSystem'

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
            if (temporaryZone?.type === 'target_select' && pendingEffect?.cardId === 'rb-unit-artifact-forger' && selection) {
              const forgerId = pendingEffect.sourceId
              const owner = pendingEffect.owner
              const forgerInA = forgerId
                ? gameState.battlefieldA[owner].some(card => card.id === forgerId)
                : false
              const forgerInB = forgerId
                ? gameState.battlefieldB[owner].some(card => card.id === forgerId)
                : false

              if (!forgerId || (!forgerInA && !forgerInB)) {
                setPendingEffect(null)
                setTemporaryZone(null)
                return
              }

              const lane = forgerInA ? 'battlefieldA' : 'battlefieldB'
              const laneCards = lane === 'battlefieldA'
                ? gameState.battlefieldA[owner]
                : gameState.battlefieldB[owner]
              const occupiedSlots = laneCards
                .map(card => ('slot' in card ? card.slot : undefined))
                .filter((slot): slot is number => typeof slot === 'number')
              const availableSlot = [1, 2, 3, 4, 5].find(slot => !occupiedSlots.includes(slot))

              if (!availableSlot) {
                alert('No space available in this lane for the forged token.')
                return
              }

              setGameState(prev => {
                const tokenId = `artifact-forger-token-${Date.now()}-${Math.random()}`
                const token = {
                  id: tokenId,
                  name: 'Forged Token',
                  description: 'Forged token',
                  cardType: 'generic',
                  colors: [],
                  manaCost: 0,
                  attack: 5,
                  health: 1,
                  maxHealth: 1,
                  currentHealth: 1,
                  location: lane,
                  owner,
                  slot: availableSlot,
                } as import('../game/types').Card

                const baseKey = `${owner}Base` as keyof typeof prev
                const updatedBase = (prev[baseKey] as import('../game/types').Card[]).filter(card => card.id !== selection)

                return {
                  ...prev,
                  [baseKey]: updatedBase,
                  [lane]: {
                    ...prev[lane],
                    [owner]: [...prev[lane][owner], token].sort((a, b) => {
                      const aSlot = 'slot' in a && typeof a.slot === 'number' ? a.slot : 0
                      const bSlot = 'slot' in b && typeof b.slot === 'number' ? b.slot : 0
                      return aSlot - bSlot
                    }),
                  },
                }
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
              const isMultiTarget = pendingEffect.effect.type === 'multi_target_damage'
              if (isMultiTarget) {
                const previousTargets = pendingEffect.selectedTargetIds || []
                if (previousTargets.includes(selection)) {
                  return
                }
                const maxTargets = pendingEffect.effect.maxTargets || 1
                const nextTargets = [...previousTargets, selection]
                const isFirstTarget = previousTargets.length === 0

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

                  const result = resolveSpellEffect({
                    gameState: prev,
                    spell,
                    owner: pendingEffect.owner,
                    targetId: selection,
                  })

                  if (!isFirstTarget) {
                    return result.nextState
                  }

                  const instanceId = pendingEffect.instanceId
                  const removeSpellFromZones = (cards: import('../game/types').Card[]) =>
                    cards.filter(card => card.id !== instanceId)

                  const runePoolKey = `${pendingEffect.owner}RunePool` as keyof typeof prev.metadata
                  const manaKey = `${pendingEffect.owner}Mana` as keyof typeof prev.metadata
                  let updatedRunePool = prev.metadata[runePoolKey] as import('../game/types').RunePool
                  let updatedMana = prev.metadata[manaKey] as number

                  if (spell.manaCost) {
                    updatedMana = updatedMana - spell.manaCost
                  }

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

                  const refundTemplateId = getTemplateId(spell.id)
                  const isConditionalRefund = refundTemplateId === 'rb-spell-spell-storm'
                  if (spell.refundMana && !isConditionalRefund) {
                    updatedMana = updatedMana + spell.refundMana
                  }

                  const otherPlayer: PlayerId = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
                  const castLocation = pendingEffect.targeting?.allowBattlefield
                  const laneLocation = castLocation === 'battlefieldA' || castLocation === 'battlefieldB'
                    ? castLocation
                    : undefined

                  const finalState = {
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

                  return onSpellCast(pendingEffect.owner, spell, finalState, laneLocation)
                })

                const remainingCards = temporaryZone?.selectableCards
                  ? temporaryZone.selectableCards.filter(card => !nextTargets.includes(card.id))
                  : []

                if (nextTargets.length < maxTargets && remainingCards.length > 0) {
                  setPendingEffect({ ...pendingEffect, selectedTargetIds: nextTargets })
                  setTemporaryZone(temporaryZone ? { ...temporaryZone, selectableCards: remainingCards } : null)
                  return
                }

                setPendingEffect(null)
                setTemporaryZone(null)
                return
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
                const refundTemplateId = getTemplateId(spell.id)
                const isConditionalRefund = refundTemplateId === 'rb-spell-spell-storm'
                if (spell.refundMana && !isConditionalRefund) {
                  updatedMana = updatedMana + spell.refundMana
                }
                
                const otherPlayer: PlayerId = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
                
                const castLocation = pendingEffect.targeting?.allowBattlefield
                const laneLocation = castLocation === 'battlefieldA' || castLocation === 'battlefieldB'
                  ? castLocation
                  : undefined

                // Resolve the spell effect with target
                const result = resolveSpellEffect({
                  gameState: prev,
                  spell,
                  owner: pendingEffect.owner,
                  targetId: selection,
                })
                
                console.log('[spell-target-confirm] after resolveSpellEffect', {
                  deathCooldowns: result.nextState.metadata.deathCooldowns,
                  player1BaseCount: result.nextState.player1Base.length,
                  player2BaseCount: result.nextState.player2Base.length,
                  player1BaseHeroes: result.nextState.player1Base.filter(c => c.cardType === 'hero').map(c => c.name),
                  player2BaseHeroes: result.nextState.player2Base.filter(c => c.cardType === 'hero').map(c => c.name),
                })
                
                const finalState = {
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
                
                console.log('[spell-target-confirm] final state', {
                  deathCooldowns: finalState.metadata.deathCooldowns,
                  player1BaseCount: (finalState.player1Base as import('../game/types').Card[]).length,
                  player2BaseCount: (finalState.player2Base as import('../game/types').Card[]).length,
                })
                
                return onSpellCast(pendingEffect.owner, spell, finalState, laneLocation)
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
