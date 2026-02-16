import { useState, useEffect, useRef } from 'react'
import { Card, Hero, HeroAbility, GameMetadata } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { HeroCard } from './HeroCard'
import { HeroAbilityEditor } from './HeroAbilityEditor'
import { KeywordBadge } from './KeywordBadge'
import { getTemplateId, isValidTargetForContext, resolveSpellEffect } from '../game/effectResolver'
import { getTribeBuff } from '../game/combatSystem'
import { RunePoolDisplay } from './RunePoolDisplay'

interface BattlefieldViewProps {
  battlefieldId: 'battlefieldA' | 'battlefieldB'
  showDebugControls?: boolean
  onHoverUnit?: (cardId: string | null) => void
}

// Icon menu for creep spawning
function CreepSpawnMenu({ battlefieldId, metadata, onSpawnCreep }: {
  battlefieldId: 'battlefieldA' | 'battlefieldB'
  metadata: GameMetadata
  onSpawnCreep: (battlefieldId: 'battlefieldA' | 'battlefieldB', player: 'player1' | 'player2') => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const currentActionPlayer = metadata.actionPlayer || metadata.activePlayer
  const isPlayer1Turn = currentActionPlayer === 'player1'
  const isPlayer2Turn = currentActionPlayer === 'player2'

  return (
    <div style={{ position: 'relative', marginBottom: '4px' }}>
      <button
        onClick={() => {
          setShowMenu(!showMenu)
        }}
        style={{
          padding: '2px 6px',
          backgroundColor: '#9c27b0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '10px',
        }}
        title="Spawn Creeps"
      >
        👾
      </button>
      {showMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
            }}
            onClick={() => setShowMenu(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '6px',
              zIndex: 1001,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              marginTop: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { onSpawnCreep(battlefieldId, 'player1'); setShowMenu(false) }}
              disabled={!isPlayer1Turn}
              style={{
                padding: '4px 8px',
                backgroundColor: isPlayer1Turn ? '#4caf50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isPlayer1Turn ? 'pointer' : 'not-allowed',
                fontSize: '11px',
                marginRight: '4px',
                opacity: isPlayer1Turn ? 1 : 0.6,
              }}
            >
              Spawn P1 Creep
            </button>
            <button
              onClick={() => { onSpawnCreep(battlefieldId, 'player2'); setShowMenu(false) }}
              disabled={!isPlayer2Turn}
              style={{
                padding: '4px 8px',
                backgroundColor: isPlayer2Turn ? '#f44336' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isPlayer2Turn ? 'pointer' : 'not-allowed',
                fontSize: '11px',
                opacity: isPlayer2Turn ? 1 : 0.6,
              }}
            >
              Spawn P2 Creep
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Icon menu for combat resolution
export function BattlefieldView({ battlefieldId, showDebugControls = false, onHoverUnit }: BattlefieldViewProps) {
  const { 
    gameState, 
    selectedCard, 
    selectedCardId, 
    setSelectedCardId,
    draggedCardId,
    setDraggedCardId,
    metadata,
    getAvailableSlots,
    setGameState,
    setShowCombatSummary,
    setCombatSummaryData,
    pendingEffect,
    setPendingEffect,
    temporaryZone,
    setTemporaryZone,
  } = useGameContext()

  const getDisplayedStats = (card: Card) => {
    if (!('attack' in card) || !('health' in card)) {
      return null
    }
    const baseAttack = card.cardType === 'generic' && 'stackPower' in card && card.stackPower !== undefined
      ? card.stackPower
      : card.attack
    const baseHealth = card.cardType === 'generic' && 'stackHealth' in card && card.stackHealth !== undefined
      ? card.stackHealth
      : card.health
    const tempAttack = (card.cardType === 'hero' || card.cardType === 'generic') && 'temporaryAttack' in card
      ? (card.temporaryAttack || 0)
      : 0
    const tempHP = (card.cardType === 'hero' || card.cardType === 'generic') && 'temporaryHP' in card
      ? (card.temporaryHP || 0)
      : 0
    const tribeBuff = 'tribe' in card
      ? getTribeBuff(gameState, battlefieldId, card.owner, (card as any).tribe, card.id)
      : { attack: 0, health: 0 }
    return {
      attack: baseAttack + tempAttack + tribeBuff.attack,
      health: baseHealth + tempHP + tribeBuff.health,
      tribeBuff,
    }
  }
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null)
  // Track which slot is currently being dragged over (player + slotNum)
  const [dragOverSlot, setDragOverSlot] = useState<{ player: 'player1' | 'player2', slotNum: number } | null>(null)
  // Track hovered card in battlefield for full details popup
  const [hoveredBattlefieldCard, setHoveredBattlefieldCard] = useState<string | null>(null)
  const [hoveredBattlefieldPosition, setHoveredBattlefieldPosition] = useState<{ x: number, y: number } | null>(null)
  const pendingDropRef = useRef<{
    cardId: string
    battlefieldId: 'battlefieldA' | 'battlefieldB'
    slotNum: number
  } | null>(null)
  const { handleDeploy, handleChangeSlot, handleRemoveFromBattlefield, handleEquipItem } = useDeployment()
  
  // Clear drag over state when drag ends
  useEffect(() => {
    if (!draggedCardId) {
      setDragOverSlot(null)
    }
  }, [draggedCardId])

  useEffect(() => {
    const pending = pendingDropRef.current
    if (!pending) return

    if (selectedCardId !== pending.cardId || !selectedCard) {
      return
    }

    if (selectedCard.location === pending.battlefieldId) {
      handleChangeSlot(selectedCard, pending.slotNum, pending.battlefieldId)
    } else {
      handleDeploy(pending.battlefieldId, pending.slotNum)
    }

    pendingDropRef.current = null
  }, [selectedCardId, selectedCard, handleDeploy, handleChangeSlot])
  const { handleToggleStun, handleSpawnCreep } = useTurnManagement()

  const battlefield = gameState[battlefieldId]
  const handleBattlefieldDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const tokenData = e.dataTransfer.getData('tokenData') || e.dataTransfer.getData('text/token')
    if (tokenData) {
      return
    }

    let cardId = e.dataTransfer.getData('cardId') || e.dataTransfer.getData('text/plain')
    if (!cardId) {
      return
    }
    if (cardId.startsWith('token:')) {
      return
    }

    const allCards = [
      ...gameState.player1Hand,
      ...gameState.player2Hand,
      ...gameState.player1Base,
      ...gameState.player2Base,
      ...gameState.player1DeployZone,
      ...gameState.player2DeployZone,
      ...gameState.battlefieldA.player1,
      ...gameState.battlefieldA.player2,
      ...gameState.battlefieldB.player1,
      ...gameState.battlefieldB.player2,
    ]
    const droppedCard = allCards.find(c => c.id === cardId)
    if (!droppedCard || droppedCard.cardType !== 'spell') {
      return
    }
    setSelectedCardId(cardId)
    setDraggedCardId(null)
    handleDeploy(battlefieldId)
  }
  const battlefieldAP1 = gameState.battlefieldA.player1
  const battlefieldAP2 = gameState.battlefieldA.player2
  const battlefieldBP1 = gameState.battlefieldB.player1
  const battlefieldBP2 = gameState.battlefieldB.player2
  
  const allCards = battlefieldId === 'battlefieldA' 
    ? [...battlefieldAP1, ...battlefieldAP2]
    : [...battlefieldBP1, ...battlefieldBP2]
  
  const towerP1HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player1_HP : metadata.towerB_player1_HP
  const towerP2HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player2_HP : metadata.towerB_player2_HP
  const borderColor = battlefieldId === 'battlefieldA' ? '#4169e1' : '#daa520'
  const bgColor = battlefieldId === 'battlefieldA' ? '#e6f2ff' : '#fff8dc'
  const battlefieldName = battlefieldId === 'battlefieldA' ? 'A' : 'B'

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    const clickedCard = allCards.find(card => card.id === cardId)
    if (clickedCard && clickedCard.owner === metadata.actionPlayer) {
      // Artifact Forger: sacrifice artifact in base -> create 5/1 token in this lane.
      if (clickedCard.id.startsWith('rb-unit-artifact-forger')) {
        const ownerBase = clickedCard.owner === 'player1' ? gameState.player1Base : gameState.player2Base
        const artifacts = ownerBase.filter(card => card.cardType === 'artifact')
        if (artifacts.length === 0) {
          alert('No artifact to sacrifice.')
        } else if (window.confirm('Sacrifice an artifact to create a 5/1 token?')) {
          const artifact = artifacts[0]
          setGameState(prev => {
            const owner = clickedCard.owner as 'player1' | 'player2'
            const slot = [1, 2, 3, 4, 5].find(s => !prev[battlefieldId][owner].some(c => c.slot === s))
            if (!slot) return prev
            const token = {
              id: `forged-token-${Date.now()}-${Math.random()}`,
              name: 'Forged Token',
              description: '5/1 token created by Artifact Forger',
              cardType: 'generic' as const,
              colors: [],
              manaCost: 0,
              attack: 5,
              health: 1,
              maxHealth: 1,
              currentHealth: 1,
              location: battlefieldId,
              owner,
              slot,
            }
            return {
              ...prev,
              [`${owner}Base`]: (prev[`${owner}Base` as keyof typeof prev] as Card[]).filter(c => c.id !== artifact.id),
              [battlefieldId]: {
                ...prev[battlefieldId],
                [owner]: [...prev[battlefieldId][owner], token].sort((a, b) => (a.slot || 0) - (b.slot || 0)),
              },
            }
          })
        }
      }

      // Token Ritualist: sacrifice a token in this lane -> create a 4-damage spell in hand.
      if (clickedCard.id.startsWith('rb-unit-token-ritualist')) {
        const owner = clickedCard.owner as 'player1' | 'player2'
        const laneCards = gameState[battlefieldId][owner]
        const token = laneCards.find(
          card =>
            card.cardType === 'generic' &&
            card.id !== clickedCard.id &&
            (card.name.toLowerCase().includes('token') || card.description.toLowerCase().includes('token'))
        )
        if (!token) {
          alert('No token available to sacrifice in this lane.')
        } else if (window.confirm('Sacrifice a token to create a free 4-damage spell in hand?')) {
          setGameState(prev => {
            const spell = {
              id: `ritual-bolt-${Date.now()}-${Math.random()}`,
              name: 'Ritual Bolt',
              description: 'Deal 4 damage to target unit, hero, or tower.',
              cardType: 'spell' as const,
              colors: ['black'] as const,
              manaCost: 0,
              location: 'hand' as const,
              owner,
              effect: {
                type: 'targeted_damage' as const,
                damage: 4,
                affectsUnits: true,
                affectsHeroes: true,
                canTargetTowers: true,
              },
              initiative: true,
            }
            return {
              ...prev,
              [battlefieldId]: {
                ...prev[battlefieldId],
                [owner]: prev[battlefieldId][owner].filter(card => card.id !== token.id),
              },
              [`${owner}Hand`]: [...(prev[`${owner}Hand` as keyof typeof prev] as Card[]), spell as Card],
            }
          })
        }
      }
    }

    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  const handleTowerDamage = (amount: number, player: 'player1' | 'player2') => {
    const towerKey = battlefieldId === 'battlefieldA' 
      ? (player === 'player1' ? 'towerA_player1_HP' : 'towerA_player2_HP')
      : (player === 'player1' ? 'towerB_player1_HP' : 'towerB_player2_HP')
    setGameState(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [towerKey]: Math.max(0, Math.min(20, (prev.metadata[towerKey] as number) + amount)),
      },
    }))
  }

  const renderSlot = (slotNum: number, player: 'player1' | 'player2') => {
    const cardInSlot = battlefield[player].find(c => c.slot === slotNum)
    const isSelected = selectedCard && selectedCard.id === cardInSlot?.id
    const isTargetable = Boolean(
      pendingEffect?.targeting &&
      cardInSlot &&
      isValidTargetForContext(gameState, cardInSlot.id, pendingEffect.targeting, pendingEffect.owner)
    )
    
    // Get dragged card if any - also check battlefields in case card is being moved
    const draggedCard = draggedCardId ? 
      [...gameState.player1Hand, ...gameState.player2Hand, ...gameState.player1Base, ...gameState.player2Base, ...gameState.player1DeployZone, ...gameState.player2DeployZone, ...gameState.battlefieldA.player1, ...gameState.battlefieldA.player2, ...gameState.battlefieldB.player1, ...gameState.battlefieldB.player2].find(c => c.id === draggedCardId) :
      null
    
    // Check if we can move here - prioritize dragged card if dragging, otherwise selected card
    const canMoveHere = draggedCardId && draggedCard
      ? (draggedCard.owner === player && 
          (draggedCard.location === 'hand' || draggedCard.location === 'base' || draggedCard.location === 'deployZone' || 
           draggedCard.location === battlefieldId || draggedCard.location === 'battlefieldA' || draggedCard.location === 'battlefieldB'))
      : (selectedCard && selectedCard.owner === player && 
          (selectedCard.location === battlefieldId || selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB' || selectedCard.location === 'hand' || selectedCard.location === 'base' || selectedCard.location === 'deployZone'))
    
    // Check if we can equip an item to a hero
    const canEquipItem = (selectedCard && 
      selectedCard.cardType === 'item' && 
      selectedCard.owner === player &&
      cardInSlot && 
      cardInSlot.cardType === 'hero' &&
      cardInSlot.owner === player) ||
      (draggedCard &&
        draggedCard.cardType === 'item' &&
        draggedCard.owner === player &&
        cardInSlot &&
        cardInSlot.cardType === 'hero' &&
        cardInSlot.owner === player)
    
    const playerColor = player === 'player1' ? '#c41e3a' : '#1e90ff'
    const playerBgColor = player === 'player1' ? '#ffe4e1' : '#e0f6ff'
    // Check if this specific slot is being dragged over - highlight if dragging and over this slot
    // Also check dataTransfer as fallback since draggedCardId might not be set in context yet
    const isDragOver = dragOverSlot?.player === player && dragOverSlot?.slotNum === slotNum

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      let tokenData = e.dataTransfer.getData('tokenData') || e.dataTransfer.getData('text/token')
      if (!tokenData) {
        const textPayload = e.dataTransfer.getData('text/plain')
        if (textPayload.startsWith('token:')) {
          tokenData = textPayload.slice('token:'.length)
        }
      }
      if (tokenData) {
        try {
          const token = JSON.parse(tokenData) as { id: string; name: string; attack: number; health: number; keywords?: string[]; owner: 'player1' | 'player2' }
          if (token.owner !== player) {
            alert('You can only deploy your own tokens.')
            return
          }
          if (cardInSlot) {
            alert('That slot is occupied.')
            return
          }
          if (getAvailableSlots(battlefield[player]) <= 0) {
            alert('Battlefield is full.')
            return
          }

          setGameState(prev => ({
            ...prev,
            [battlefieldId]: {
              ...prev[battlefieldId],
              [player]: [
                ...prev[battlefieldId][player],
                {
                  id: token.id,
                  name: token.name,
                  description: `${token.name} token`,
                  cardType: 'generic',
                  colors: [],
                  manaCost: 0,
                  attack: token.attack,
                  health: token.health,
                  maxHealth: token.health,
                  currentHealth: token.health,
                  location: battlefieldId,
                  owner: token.owner,
                  slot: slotNum,
                  tribe: token.tribe,
                },
              ].sort((a, b) => (a.slot || 0) - (b.slot || 0)),
            },
          }))

          if (temporaryZone?.tokens) {
            const remainingTokens = temporaryZone.tokens.filter(t => t.id !== token.id)
            setTemporaryZone(remainingTokens.length > 0 ? { ...temporaryZone, tokens: remainingTokens } : null)
          }
        } catch (error) {
          console.error('Failed to parse token data', error)
        }
        return
      }
      
      console.log(`[BattlefieldView] handleDrop - Slot ${slotNum}, Player ${player}`)
      console.log(`[BattlefieldView] handleDrop - draggedCardId from context:`, draggedCardId)
      console.log(`[BattlefieldView] handleDrop - dataTransfer types:`, Array.from(e.dataTransfer.types))
      
      // Try both formats
      let cardId = e.dataTransfer.getData('cardId')
      console.log(`[BattlefieldView] handleDrop - cardId from 'cardId':`, cardId)
      if (!cardId) {
        cardId = e.dataTransfer.getData('text/plain')
        console.log(`[BattlefieldView] handleDrop - cardId from 'text/plain':`, cardId)
      }
      if (!cardId) {
        console.log(`[BattlefieldView] handleDrop - ERROR: No cardId found in dataTransfer!`)
        return
      }
      
      console.log(`[BattlefieldView] handleDrop - Found cardId:`, cardId)
      
      // Find the card being dropped
      const allCards = [
        ...gameState.player1Hand,
        ...gameState.player2Hand,
        ...gameState.player1Base,
        ...gameState.player2Base,
        ...gameState.player1DeployZone,
        ...gameState.player2DeployZone,
        ...gameState.battlefieldA.player1,
        ...gameState.battlefieldA.player2,
        ...gameState.battlefieldB.player1,
        ...gameState.battlefieldB.player2,
      ]
      const droppedCard = allCards.find(c => c.id === cardId)
      
      console.log(`[BattlefieldView] handleDrop - droppedCard found:`, droppedCard?.name, 'owner:', droppedCard?.owner, 'expected player:', player)
      
      if (!droppedCard) {
        console.log(`[BattlefieldView] handleDrop - ERROR: droppedCard not found!`)
        return
      }
      
      // Check if equipping item to hero
      if (droppedCard.cardType === 'item' && cardInSlot && cardInSlot.cardType === 'hero' && droppedCard.owner === player && cardInSlot.owner === player) {
        handleEquipItem(cardInSlot as Hero, droppedCard as import('../game/types').ItemCard, battlefieldId)
        setDraggedCardId(null)
        return
      }
      
        // Use direct deployment for heroes (we have the card); fallback to handleDeploy for others
        if (droppedCard.owner === player) {
          console.log(`[BattlefieldView] handleDrop - Card owner matches, proceeding with deployment`)
          console.log(`[BattlefieldView] handleDrop - droppedCard.location:`, droppedCard.location, 'battlefieldId:', battlefieldId)
          console.log(`[BattlefieldView] handleDrop - droppedCard.cardType:`, droppedCard.cardType, 'currentPhase:', metadata.currentPhase)

          setDraggedCardId(null)

          if (droppedCard.location === battlefieldId) {
            handleChangeSlot(droppedCard, slotNum, battlefieldId)
            setSelectedCardId(null)
            return
          }

          // For heroes, deploy directly via setGameState (no async selectedCard dependency)
          if (droppedCard.cardType === 'hero') {
            const isDeployPhase = metadata.currentPhase === 'deploy'
            const isPlayPhase = metadata.currentPhase === 'play'
            if (!isDeployPhase && !isPlayPhase) {
              alert(`Cannot deploy during ${metadata.currentPhase} phase!`)
              return
            }
            const battlefieldKey = battlefieldId as 'battlefieldA' | 'battlefieldB'
            const playerKey = player

            if (isPlayPhase && metadata.currentTurn === 1) {
              const deploymentPhase = metadata.turn1DeploymentPhase || 'p1_lane1'
              if (deploymentPhase === 'p1_lane1' && (playerKey !== 'player1' || battlefieldKey !== 'battlefieldA')) {
                if (playerKey !== 'player1') alert('Player 1 must deploy first hero to lane 1 (Battlefield A)')
                else alert('Player 1 must deploy to lane 1 (Battlefield A) first')
                return
              }
              if (deploymentPhase === 'p2_lane1' && playerKey === 'player2' && battlefieldKey !== 'battlefieldA') {
                alert('Player 2 can only counter-deploy to lane 1 (Battlefield A) or pass')
                return
              }
              if (deploymentPhase === 'p2_lane2' && (playerKey !== 'player2' || battlefieldKey !== 'battlefieldB')) {
                if (playerKey !== 'player2') alert('Player 2 must deploy hero to lane 2 (Battlefield B)')
                else alert('Player 2 must deploy to lane 2 (Battlefield B)')
                return
              }
              if (deploymentPhase === 'p1_lane2' && playerKey === 'player1' && battlefieldKey !== 'battlefieldB') {
                alert('Player 1 can only counter-deploy to lane 2 (Battlefield B) or pass')
                return
              }
            } else if (isPlayPhase && metadata.actionPlayer !== playerKey) {
              alert("It's not your turn to act!")
              return
            }

            if (isDeployPhase && (droppedCard.location === 'base' || droppedCard.location === 'deployZone')) {
              const cooldownCounter = metadata.deathCooldowns[droppedCard.id]
              if (cooldownCounter !== undefined && cooldownCounter > 0) {
                alert(`Hero is on cooldown! ${cooldownCounter} turn${cooldownCounter !== 1 ? 's' : ''} remaining.`)
                return
              }
            }

            setGameState(prev => {
              const battlefield = prev[battlefieldKey][playerKey]
              const existingHeroInSlot = battlefield.find((c: Card) => (c as { slot?: number }).slot === slotNum && c.cardType === 'hero') as Hero | undefined
              const newHand = (prev[`${playerKey}Hand` as keyof typeof prev] as Card[]).filter(c => c.id !== droppedCard.id)
              const newBase = (prev[`${playerKey}Base` as keyof typeof prev] as Card[]).filter(c => c.id !== droppedCard.id)
              const newDeployZone = (prev[`${playerKey}DeployZone` as keyof typeof prev] as Card[]).filter(c => c.id !== droppedCard.id)
              const otherBattlefieldKey = battlefieldKey === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
              const otherBattlefield = prev[otherBattlefieldKey][playerKey].filter(c => c.id !== droppedCard.id)
              let updatedBase = newBase
              const updatedCooldowns = { ...prev.metadata.deathCooldowns }
              if (existingHeroInSlot) {
                updatedBase = [...updatedBase, { ...existingHeroInSlot, location: 'base' as const, slot: undefined }]
                updatedCooldowns[existingHeroInSlot.id] = 1
              }
              const heroColors = (droppedCard as Hero).colors || []
              const currentRunePool = prev.metadata[`${playerKey}RunePool` as keyof typeof prev.metadata] as { runes: string[]; temporaryRunes?: string[] } | undefined
              const updatedRunePool = {
                runes: [...(currentRunePool?.runes ?? []), ...heroColors],
                temporaryRunes: currentRunePool?.temporaryRunes ?? [],
              }
              const updatedBattlefield = battlefield
                .filter(c => c.id !== droppedCard.id && (existingHeroInSlot ? c.id !== existingHeroInSlot.id : true))
              const deployedHero = { ...droppedCard, location: battlefieldKey, slot: slotNum } as Hero
              let newDeploymentPhase = prev.metadata.turn1DeploymentPhase || 'p1_lane1'
              let updatedActionPlayer = prev.metadata.actionPlayer
              let updatedInitiativePlayer = prev.metadata.initiativePlayer
              if (prev.metadata.currentTurn === 1) {
                const dp = prev.metadata.turn1DeploymentPhase || 'p1_lane1'
                if (dp === 'p1_lane1') newDeploymentPhase = 'p2_lane1'
                else if (dp === 'p2_lane1' && playerKey === 'player2') newDeploymentPhase = 'p2_lane2'
                else if (dp === 'p2_lane2') newDeploymentPhase = 'p1_lane2'
                else if (dp === 'p1_lane2' && playerKey === 'player1') newDeploymentPhase = 'complete'
                if (newDeploymentPhase === 'complete') {
                  updatedActionPlayer = 'player1'
                  updatedInitiativePlayer = 'player1'
                } else {
                  updatedActionPlayer = null
                  updatedInitiativePlayer = null
                }
              } else {
                const otherPlayer = prev.metadata.actionPlayer === 'player1' ? 'player2' : 'player1'
                updatedActionPlayer = otherPlayer
                updatedInitiativePlayer = otherPlayer
              }
              return {
                ...prev,
                [battlefieldKey]: { ...prev[battlefieldKey], [playerKey]: [...updatedBattlefield, deployedHero].sort((a, b) => ((a as { slot?: number }).slot || 0) - ((b as { slot?: number }).slot || 0)) },
                [`${playerKey}Hand`]: newHand,
                [`${playerKey}Base`]: updatedBase,
                [`${playerKey}DeployZone`]: newDeployZone,
                [otherBattlefieldKey]: { ...prev[otherBattlefieldKey], [playerKey]: otherBattlefield },
                metadata: {
                  ...prev.metadata,
                  [`${playerKey}RunePool`]: updatedRunePool,
                  deathCooldowns: updatedCooldowns,
                  [`${playerKey}HeroesDeployedThisTurn`]: ((prev.metadata[`${playerKey}HeroesDeployedThisTurn` as keyof typeof prev.metadata] as number) || 0) + 1,
                  turn1DeploymentPhase: newDeploymentPhase,
                  actionPlayer: updatedActionPlayer,
                  initiativePlayer: updatedInitiativePlayer,
                  player1Passed: false,
                  player2Passed: false,
                  currentPhase: newDeploymentPhase === 'complete' ? 'play' : prev.metadata.currentPhase,
                },
              }
            })
            setSelectedCardId(null)
            return
          }

          pendingDropRef.current = { cardId, battlefieldId, slotNum }
          setSelectedCardId(cardId)
        } else {
          console.log(`[BattlefieldView] handleDrop - ERROR: Card owner doesn't match! droppedCard.owner:`, droppedCard.owner, 'expected:', player)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault() // Always prevent default to allow drop
      e.stopPropagation()
      
      // Note: dataTransfer.getData() can't be read during dragover (browser security)
      // We must rely on draggedCardId from context or drag types
      const dragTypes = Array.from(e.dataTransfer.types)
      console.log(`[BattlefieldView] handleDragOver - Slot ${slotNum}, Player ${player}, draggedCardId:`, draggedCardId, 'draggedCard:', draggedCard?.name, 'owner:', draggedCard?.owner, 'dragOverSlot:', dragOverSlot, 'types:', dragTypes)
      
      // If we have a dragged card that belongs to this player, allow drop
      const isTokenDrag = dragTypes.includes('tokenData') || dragTypes.includes('text/token')
      const hasCardData = dragTypes.includes('cardId') || dragTypes.includes('text/plain')
      if (isTokenDrag) {
        e.dataTransfer.dropEffect = 'move'
        setDragOverSlot({ player, slotNum })
        return
      }
      if (draggedCardId && draggedCard?.owner === player) {
        e.dataTransfer.dropEffect = 'move'
        // Always update drag over state when dragging over this slot
        if (dragOverSlot?.player !== player || dragOverSlot?.slotNum !== slotNum) {
          console.log(`[BattlefieldView] handleDragOver - Setting dragOverSlot to ${player}, ${slotNum}`)
          setDragOverSlot({ player, slotNum })
        }
      } else if (hasCardData) {
        setDragOverSlot({ player, slotNum })
      } else if (draggedCardId) {
        // We're dragging something, but it doesn't belong to this player
        console.log(`[BattlefieldView] handleDragOver - Card doesn't belong to this player`)
        e.dataTransfer.dropEffect = 'none'
        // Clear drag over if it was set
        if (dragOverSlot?.player === player && dragOverSlot?.slotNum === slotNum) {
          setDragOverSlot(null)
        }
      } else {
        // No drag in progress, but allow the event to continue (might be from another component)
        console.log(`[BattlefieldView] handleDragOver - No draggedCardId in context`)
        e.dataTransfer.dropEffect = 'none'
      }
    }
    
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Note: dataTransfer.getData() can't be read during dragenter (browser security)
      // We must rely on draggedCardId from context
      // However, if draggedCardId isn't set yet (async state update), check if dataTransfer has the types
      // If it has 'cardId' or 'text/plain' types, we know a card is being dragged
      const hasCardData = e.dataTransfer.types.includes('cardId') || e.dataTransfer.types.includes('text/plain')
      const isTokenDrag = e.dataTransfer.types.includes('tokenData') || e.dataTransfer.types.includes('text/token')
      console.log(`[BattlefieldView] handleDragEnter - Slot ${slotNum}, Player ${player}, draggedCardId:`, draggedCardId, 'draggedCard:', draggedCard?.name, 'hasCardData:', hasCardData, 'types:', Array.from(e.dataTransfer.types))
      
      // Set drag over state if:
      // 1. We have draggedCardId in context AND it belongs to this player, OR
      // 2. We detect card data in dataTransfer (will validate on drop)
      if (isTokenDrag || (draggedCardId && draggedCard?.owner === player)) {
        console.log(`[BattlefieldView] handleDragEnter - Setting dragOverSlot (context has draggedCardId)`)
        setDragOverSlot({ player, slotNum })
      } else if (hasCardData && !draggedCardId) {
        // Card is being dragged but context hasn't updated yet - set drag over optimistically
        // Will be validated on drop
        console.log(`[BattlefieldView] handleDragEnter - Setting dragOverSlot (optimistic, context not updated yet)`)
        setDragOverSlot({ player, slotNum })
      } else {
        console.log(`[BattlefieldView] handleDragEnter - NOT setting dragOverSlot`)
      }
    }
    
    const handleDragLeave = (e: React.DragEvent) => {
      // Only clear if we're actually leaving the slot element (not just moving to a child)
      const currentTarget = e.currentTarget as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement | null
      
      // Check if relatedTarget is outside the current target
      // If it's null or not a descendant, we're leaving
      if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
        // Use requestAnimationFrame to check after DOM updates
        requestAnimationFrame(() => {
          // Verify mouse is actually outside the slot bounds
          const rect = currentTarget.getBoundingClientRect()
          // Use the last known mouse position from the event
          const x = e.clientX || 0
          const y = e.clientY || 0
          
          // Only clear if mouse is truly outside
          if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            if (dragOverSlot?.player === player && dragOverSlot?.slotNum === slotNum) {
              setDragOverSlot(null)
            }
          }
        })
      }
    }

    return (
      <div
        key={slotNum}
        className="battlefield-slot"
        data-battlefield={battlefieldId}
        data-player={player}
        data-slot={slotNum}
        style={{
          border: isDragOver ? `2px solid ${playerColor}` : (canMoveHere || canEquipItem) ? `1px dashed ${playerColor}` : '1px solid #d3d3d3',
          backgroundColor: isDragOver ? playerBgColor : (canMoveHere || canEquipItem) ? '#f5f5dc' : '#fafafa',
          boxShadow: isDragOver ? `0 0 8px ${playerColor}60` : '0 1px 2px rgba(0,0,0,0.1)',
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleDrop(e)
          // Clear drag over state when dropping
          setDragOverSlot(null)
        }}
        onClick={() => {
          // Check if equipping item to hero
          if (canEquipItem && selectedCard && cardInSlot) {
            handleEquipItem(cardInSlot as import('../game/types').Hero, selectedCard as import('../game/types').ItemCard, battlefieldId)
            return
          }
          
          // Normal deployment logic
          if (selectedCard && canMoveHere && selectedCard.owner === player) {
            if (selectedCard.location === battlefieldId) {
              handleChangeSlot(selectedCard, slotNum, battlefieldId)
            } else if (selectedCard.location === 'battlefieldA' || selectedCard.location === 'battlefieldB') {
              // Move from other battlefield
              handleDeploy(battlefieldId, slotNum)
            } else {
              // Deploy to this battlefield with specific slot
              handleDeploy(battlefieldId, slotNum)
            }
          }
        }}
      >
        <div className="battlefield-slot__label">
          Slot {slotNum}
        </div>
        <div
          className="battlefield-slot__content"
          onDragEnter={(e) => {
            // Forward drag enter to parent - always forward, let parent decide
            e.preventDefault()
            e.stopPropagation()
            handleDragEnter(e)
          }}
          onDragOver={(e) => {
            // Allow drag events to bubble up to parent slot - always forward
            e.preventDefault()
            e.stopPropagation()
            handleDragOver(e)
          }}
        >
          {cardInSlot ? (
            <div
              className={`unit-card ${isSelected ? 'unit-card--selected' : ''}`}
              style={{
                border: `2px solid ${isSelected ? '#ffd700' : isTargetable ? '#4caf50' : (cardInSlot.cardType === 'hero' ? ((cardInSlot as Hero).colors?.[0] === 'red' ? '#c41e3a' : (cardInSlot as Hero).colors?.[0] === 'blue' ? '#0078d4' : (cardInSlot as Hero).colors?.[0] === 'green' ? '#228b22' : (cardInSlot as Hero).colors?.[0] === 'black' ? '#2d2d2d' : (cardInSlot as Hero).colors?.[0] === 'white' ? '#f0e68c' : '#8b7355') : '#8b7355')}`,
                backgroundColor: isSelected ? '#fffacd' : '#f5f5dc',
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick(cardInSlot.id, e)
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                // Right-click for quick actions - could show menu or toggle stun
                if (cardInSlot.cardType === 'hero' && handleToggleStun) {
                  handleToggleStun(cardInSlot)
                }
              }}
              onMouseEnter={(e) => {
                setHoveredBattlefieldCard(cardInSlot.id)
                setHoveredBattlefieldPosition({ x: e.clientX, y: e.clientY })
                onHoverUnit?.(cardInSlot.id)
              }}
              onMouseMove={(e) => {
                setHoveredBattlefieldPosition({ x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => {
                setHoveredBattlefieldCard(null)
                setHoveredBattlefieldPosition(null)
                onHoverUnit?.(null)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.dataTransfer.dropEffect = 'move'
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const droppedCardId = e.dataTransfer.getData('cardId') || e.dataTransfer.getData('text/plain')
                console.log('[spell-targeting] drop on unit', {
                  droppedCardId,
                  targetId: cardInSlot.id,
                  targetName: cardInSlot.name,
                  battlefieldId,
                })
                if (!droppedCardId || droppedCardId.startsWith('token:')) {
                  return
                }
                const allCards = [
                  ...gameState.player1Hand,
                  ...gameState.player2Hand,
                  ...gameState.player1Base,
                  ...gameState.player2Base,
                  ...gameState.player1DeployZone,
                  ...gameState.player2DeployZone,
                  ...gameState.battlefieldA.player1,
                  ...gameState.battlefieldA.player2,
                  ...gameState.battlefieldB.player1,
                  ...gameState.battlefieldB.player2,
                ]
                const droppedCard = allCards.find(c => c.id === droppedCardId)
                console.log('[spell-targeting] dropped card lookup', {
                  found: Boolean(droppedCard),
                  cardType: droppedCard?.cardType,
                  cardName: droppedCard?.name,
                })
                if (!droppedCard || droppedCard.cardType !== 'spell') {
                  return
                }
                setSelectedCardId(droppedCardId)
                setDraggedCardId(null)
                handleDeploy(battlefieldId)
              }}
            >
              <div className="unit-card__name">
                {cardInSlot.name}
              </div>
              {cardInSlot.cardType === 'hero' && (cardInSlot as Hero).colors && (cardInSlot as Hero).colors!.length > 0 && (
                <div style={{ display: 'flex', gap: '2px', marginBottom: '2px', justifyContent: 'center' }}>
                  {(cardInSlot as Hero).colors!.map((color, i) => {
                    const COLOR_MAP: Record<string, string> = {
                      red: '#c41e3a',
                      blue: '#0078d4',
                      white: '#f0e68c',
                      black: '#2d2d2d',
                      green: '#228b22',
                    }
                    return (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: COLOR_MAP[color],
                          border: '1px solid rgba(0,0,0,0.3)',
                        }}
                        title={color}
                      />
                    )
                  })}
                </div>
              )}
              {(() => {
                const displayedStats = getDisplayedStats(cardInSlot)
                if (!displayedStats) return null
                const isTribeBuffed = displayedStats.tribeBuff.attack !== 0 || displayedStats.tribeBuff.health !== 0
                return (
                  <div
                    className="unit-card__stats"
                    style={{ color: isTribeBuffed ? '#2e7d32' : undefined }}
                    title={isTribeBuffed ? 'Tribe buff active' : undefined}
                  >
                    {displayedStats.attack}/{displayedStats.health}
                  </div>
                )
              })()}
              <div className="unit-card__status">
                {!!metadata.deathCooldowns[cardInSlot.id] && (
                  <span style={{ color: '#8b0000' }}>⏱{metadata.deathCooldowns[cardInSlot.id]}</span>
                )}
                {cardInSlot.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[cardInSlot.id]) && (
                  <span style={{ color: '#4b0082' }}>⚡</span>
                )}
                {metadata.barrierUnits?.[cardInSlot.id] && (
                  <span style={{ color: '#1976d2' }}>🛡️</span>
                )}
              </div>
              <div className="unit-card__keywords">
                {cardInSlot.cardType === 'hero' && (cardInSlot as Hero).crossStrike && (
                  <KeywordBadge keyword="crossStrike" />
                )}
                {cardInSlot.cardType === 'hero' && (cardInSlot as Hero).assassinate && (
                  <KeywordBadge keyword="assassinate" />
                )}
                {(cardInSlot as any).specialEffects?.includes('cleave') && (
                  <KeywordBadge keyword="cleave" />
                )}
                {metadata.barrierUnits?.[cardInSlot.id] && (
                  <KeywordBadge keyword="barrier" />
                )}
              </div>
            </div>
          ) : (
            <div className="battlefield-slot__placeholder">
              {canEquipItem ? 'Equip' : canMoveHere ? 'Drop' : ''}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSaveAbility = (heroId: string, ability: HeroAbility | undefined) => {
    setGameState(prev => {
      // Find the hero in all possible locations
      const findAndUpdateHero = (cards: Card[]): Card[] => {
        return cards.map(card => {
          if (card.id === heroId && card.cardType === 'hero') {
            return {
              ...card,
              ability: ability,
            } as Hero
          }
          return card
        })
      }

      return {
        ...prev,
        player1Hand: findAndUpdateHero(prev.player1Hand),
        player2Hand: findAndUpdateHero(prev.player2Hand),
        player1Base: findAndUpdateHero(prev.player1Base),
        player2Base: findAndUpdateHero(prev.player2Base),
        player1DeployZone: findAndUpdateHero(prev.player1DeployZone),
        player2DeployZone: findAndUpdateHero(prev.player2DeployZone),
        battlefieldA: {
          player1: findAndUpdateHero(prev.battlefieldA.player1),
          player2: findAndUpdateHero(prev.battlefieldA.player2),
        },
        battlefieldB: {
          player1: findAndUpdateHero(prev.battlefieldB.player1),
          player2: findAndUpdateHero(prev.battlefieldB.player2),
        },
      }
    })
    setEditingHeroId(null)
  }

  const editingHero = editingHeroId 
    ? [
        ...gameState.player1Hand,
        ...gameState.player2Hand,
        ...gameState.player1Base,
        ...gameState.player2Base,
        ...gameState.player1DeployZone,
        ...gameState.player2DeployZone,
        ...gameState.battlefieldA.player1,
        ...gameState.battlefieldA.player2,
        ...gameState.battlefieldB.player1,
        ...gameState.battlefieldB.player2,
      ].find(c => c.id === editingHeroId && c.cardType === 'hero') as Hero | undefined
    : undefined

  return (
    <>
      {editingHero && (
        <HeroAbilityEditor
          hero={editingHero}
          onSave={handleSaveAbility}
          onClose={() => setEditingHeroId(null)}
        />
      )}
      <div
        className="battlefield-container"
        style={{
          border: `2px solid ${borderColor}`,
          backgroundColor: bgColor,
        }}
        onDragOver={(e) => {
          const types = Array.from(e.dataTransfer.types)
          if (types.includes('tokenData') || types.includes('text/token') || types.includes('cardId') || types.includes('text/plain')) {
            e.preventDefault()
          }
        }}
        onDrop={handleBattlefieldDrop}
      >
      <div className="battlefield-header">
        <div className="battlefield-title">
          Battlefield {battlefieldName}
          <span className="battlefield-subtitle">({getAvailableSlots(allCards)})</span>
        </div>
        {showDebugControls && metadata.currentPhase === 'play' && (
          <CreepSpawnMenu 
            battlefieldId={battlefieldId}
            metadata={metadata}
            onSpawnCreep={handleSpawnCreep}
          />
        )}
      </div>
      <div className="tower-row tower-row--top">
        <div
          className="tower-display"
          data-battlefield={battlefieldId}
          data-player="player2"
          data-tower="true"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>🏰 P2 {towerP2HP}</span>
          <RunePoolDisplay
            runePool={metadata.player2RunePool}
            playerName="P2"
            player="player2"
            seals={metadata.player2Seals || []}
          />
          {showDebugControls && (
            <div className="tower-display__controls">
              <button onClick={() => handleTowerDamage(-1, 'player2')}>-</button>
              <button onClick={() => handleTowerDamage(1, 'player2')}>+</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Player 2 side */}
      <div className="battlefield-row">
        <div className="battlefield-row__label">P2</div>
        <div className="battlefield-row__grid">
          {[1, 2, 3, 4, 5].map(slotNum => renderSlot(slotNum, 'player2'))}
        </div>
      </div>

      {/* Player 1 side */}
      <div className="battlefield-row">
        <div className="battlefield-row__label">P1</div>
        <div className="battlefield-row__grid">
          {[1, 2, 3, 4, 5].map(slotNum => renderSlot(slotNum, 'player1'))}
        </div>
      </div>
      <div className="tower-row tower-row--bottom">
        <div
          className="tower-display"
          data-battlefield={battlefieldId}
          data-player="player1"
          data-tower="true"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>🏰 P1 {towerP1HP}</span>
          <RunePoolDisplay
            runePool={metadata.player1RunePool}
            playerName="P1"
            player="player1"
            seals={metadata.player1Seals || []}
          />
          {showDebugControls && (
            <div className="tower-display__controls">
              <button onClick={() => handleTowerDamage(-1, 'player1')}>-</button>
              <button onClick={() => handleTowerDamage(1, 'player1')}>+</button>
            </div>
          )}
        </div>
      </div>

      {/* Hover popup for battlefield cards */}
      {hoveredBattlefieldCard && hoveredBattlefieldPosition && (() => {
        const allBattlefieldCards = [...battlefield.player1, ...battlefield.player2]
        const card = allBattlefieldCards.find(c => c.id === hoveredBattlefieldCard)
        if (!card) return null
        return (
          <div
            style={{
              position: 'fixed',
              left: `${Math.min(hoveredBattlefieldPosition.x + 20, window.innerWidth - 320)}px`,
              top: `${Math.min(hoveredBattlefieldPosition.y + 20, window.innerHeight - 400)}px`,
              zIndex: 2000,
              pointerEvents: 'none',
            }}
          >
            <HeroCard
              card={card}
              onClick={() => {}}
              isSelected={false}
              showStats={true}
              isDead={!!metadata.deathCooldowns[card.id]}
              cooldownCounter={metadata.deathCooldowns[card.id]}
              isPlayed={false}
              onTogglePlayed={() => {}}
              isStunned={card.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[card.id])}
              onToggleStun={undefined}
              onAbilityClick={() => {}}
            />
          </div>
        )
      })()}
    </div>
    </>
  )
}

