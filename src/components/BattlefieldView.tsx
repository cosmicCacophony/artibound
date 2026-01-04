import { useState, useEffect } from 'react'
import { Card, Hero, HeroAbility } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { useDeployment } from '../hooks/useDeployment'
import { useCombat } from '../hooks/useCombat'
import { useHeroAbilities } from '../hooks/useHeroAbilities'
import { useTurnManagement } from '../hooks/useTurnManagement'
import { HeroCard } from './HeroCard'
import { HeroAbilityEditor } from './HeroAbilityEditor'
import { resolveSimultaneousCombat } from '../game/combatSystem'
import { createCardFromTemplate } from '../game/sampleData'

interface BattlefieldViewProps {
  battlefieldId: 'battlefieldA' | 'battlefieldB'
}

export function BattlefieldView({ battlefieldId }: BattlefieldViewProps) {
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
    player1SidebarCards,
    player2SidebarCards,
    setPlayer1SidebarCards,
    setPlayer2SidebarCards,
  } = useGameContext()
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null)
  // Track which slot is currently being dragged over (player + slotNum)
  const [dragOverSlot, setDragOverSlot] = useState<{ player: 'player1' | 'player2', slotNum: number } | null>(null)
  const { handleDeploy, handleChangeSlot, handleRemoveFromBattlefield, handleEquipItem } = useDeployment()
  
  // Clear drag over state when drag ends
  useEffect(() => {
    if (!draggedCardId) {
      setDragOverSlot(null)
    }
  }, [draggedCardId])
  const { handleDecreaseHealth, handleIncreaseHealth, handleDecreaseAttack, handleIncreaseAttack } = useCombat()
  const { handleAbilityClick } = useHeroAbilities()
  const { handleToggleStun, handleSpawnCreep } = useTurnManagement()

  const battlefield = gameState[battlefieldId]
  const battlefieldAP1 = gameState.battlefieldA.player1
  const battlefieldAP2 = gameState.battlefieldA.player2
  const battlefieldBP1 = gameState.battlefieldB.player1
  const battlefieldBP2 = gameState.battlefieldB.player2
  
  const allCards = battlefieldId === 'battlefieldA' 
    ? [...battlefieldAP1, ...battlefieldAP2]
    : [...battlefieldBP1, ...battlefieldBP2]
  
  const towerP1HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player1_HP : metadata.towerB_player1_HP
  const towerP2HP = battlefieldId === 'battlefieldA' ? metadata.towerA_player2_HP : metadata.towerB_player2_HP
  const borderColor = battlefieldId === 'battlefieldA' ? '#4a90e2' : '#ff9800'
  const bgColor = battlefieldId === 'battlefieldA' ? '#e3f2fd' : '#fff3e0'
  const battlefieldName = battlefieldId === 'battlefieldA' ? 'A' : 'B'

  const handleCardClick = (cardId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
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
    
    // Get dragged card if any
    const draggedCard = draggedCardId ? 
      [...gameState.player1Hand, ...gameState.player2Hand, ...gameState.player1Base, ...gameState.player2Base, ...gameState.player1DeployZone, ...gameState.player2DeployZone].find(c => c.id === draggedCardId) :
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
    
    const playerColor = player === 'player1' ? '#f44336' : '#4a90e2'
    const playerBgColor = player === 'player1' ? '#ffebee' : '#e3f2fd'
    // Check if this specific slot is being dragged over - highlight if dragging and over this slot
    const isDragOver = draggedCardId && 
                       dragOverSlot?.player === player && 
                       dragOverSlot?.slotNum === slotNum &&
                       draggedCard?.owner === player

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Try both formats
      let cardId = e.dataTransfer.getData('cardId')
      if (!cardId) {
        cardId = e.dataTransfer.getData('text/plain')
      }
      if (!cardId) {
        return
      }
      
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
      
      if (!droppedCard) return
      
      // Check if equipping item to hero
      if (droppedCard.cardType === 'item' && cardInSlot && cardInSlot.cardType === 'hero' && droppedCard.owner === player && cardInSlot.owner === player) {
        handleEquipItem(cardInSlot as Hero, droppedCard as import('../game/types').ItemCard, battlefieldId)
        setDraggedCardId(null)
        return
      }
      
      // Use the same deployment logic as clicking - set selected card and call handleDeploy
      if (droppedCard.owner === player) {
        // Set the card as selected first
        setSelectedCardId(cardId)
        setDraggedCardId(null)
        
        // Use requestAnimationFrame to ensure state update happens before deployment
        requestAnimationFrame(() => {
          // Check if moving within same battlefield (slot change) or deploying to new location
          if (droppedCard.location === battlefieldId) {
            handleChangeSlot(droppedCard, slotNum, battlefieldId)
          } else {
            handleDeploy(battlefieldId, slotNum)
          }
        })
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault() // Always prevent default to allow drop
      e.stopPropagation()
      // If we're dragging a card that belongs to this player, highlight the slot
      if (draggedCardId && draggedCard?.owner === player) {
        e.dataTransfer.dropEffect = 'move'
        // Always update drag over state when dragging over this slot
        if (dragOverSlot?.player !== player || dragOverSlot?.slotNum !== slotNum) {
          setDragOverSlot({ player, slotNum })
        }
      } else {
        e.dataTransfer.dropEffect = 'none'
      }
    }
    
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      // Set drag over state when entering this slot (if card belongs to this player)
      if (draggedCardId && draggedCard?.owner === player) {
        setDragOverSlot({ player, slotNum })
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
        style={{
          minHeight: '100px',
          border: isDragOver ? `3px solid ${playerColor}` : (canMoveHere || canEquipItem) ? `2px dashed ${playerColor}` : '1px solid #ddd',
          borderRadius: '4px',
          padding: '4px',
          backgroundColor: isDragOver ? playerBgColor : (canMoveHere || canEquipItem) ? '#f0f0f0' : '#f9f9f9',
          position: 'relative',
          transition: 'all 0.2s',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: isDragOver ? `0 0 10px ${playerColor}40` : 'none',
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
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
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Slot {slotNum}</div>
        {cardInSlot ? (
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', pointerEvents: 'auto' }}>
            <HeroCard
              card={cardInSlot}
              onClick={(e) => handleCardClick(cardInSlot.id, e)}
              isSelected={isSelected}
              showStats={true}
              onRemove={() => handleRemoveFromBattlefield(cardInSlot, battlefieldId)}
              onDecreaseHealth={() => handleDecreaseHealth(cardInSlot)}
              onIncreaseHealth={() => handleIncreaseHealth(cardInSlot)}
              onDecreaseAttack={() => handleDecreaseAttack(cardInSlot)}
              onIncreaseAttack={() => handleIncreaseAttack(cardInSlot)}
              showCombatControls={true}
              isDead={!!metadata.deathCooldowns[cardInSlot.id]}
              isStunned={cardInSlot.cardType === 'hero' && Boolean(metadata.stunnedHeroes?.[cardInSlot.id])}
              onToggleStun={cardInSlot.cardType === 'hero' ? () => handleToggleStun(cardInSlot) : undefined}
              onAbilityClick={(heroId, ability) => handleAbilityClick(heroId, ability, cardInSlot.owner)}
              onEditAbility={cardInSlot.cardType === 'hero' ? (heroId) => setEditingHeroId(heroId) : undefined}
            />
          </div>
        ) : (
          <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'center', paddingTop: '20px', pointerEvents: 'none' }}>
            {canEquipItem ? 'Equip Item' : canMoveHere ? 'Drop here' : 'Empty'}
          </div>
        )}
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
        style={{
        border: `2px solid ${borderColor}`,
        borderRadius: '6px',
        padding: '12px',
        backgroundColor: bgColor,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>
            Battlefield {battlefieldName}
            <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '8px', color: '#666' }}>
              ({getAvailableSlots(allCards)} slots)
            </span>
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a90e2' }}>
              P2 Tower: {towerP2HP} HP
            </div>
            <button
              onClick={() => handleTowerDamage(-1, 'player2')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Deal 1 damage to P2 Tower ${battlefieldName}`}
            >
              -1
            </button>
            <button
              onClick={() => handleTowerDamage(1, 'player2')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Heal 1 HP to P2 Tower ${battlefieldName}`}
            >
              +1
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f44336' }}>
              P1 Tower: {towerP1HP} HP
            </div>
            <button
              onClick={() => handleTowerDamage(-1, 'player1')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Deal 1 damage to P1 Tower ${battlefieldName}`}
            >
              -1
            </button>
            <button
              onClick={() => handleTowerDamage(1, 'player1')}
              style={{
                padding: '2px 6px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '10px',
              }}
              title={`Heal 1 HP to P1 Tower ${battlefieldName}`}
            >
              +1
            </button>
          </div>
        </div>
        {/* Manual Creep Spawn Button */}
        {metadata.currentPhase === 'play' && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {(() => {
              // Use actionPlayer if available, otherwise fall back to activePlayer
              const currentActionPlayer = metadata.actionPlayer || metadata.activePlayer
              const isPlayer1Turn = currentActionPlayer === 'player1'
              const isPlayer2Turn = currentActionPlayer === 'player2'
              
              return (
                <>
                  <button
                    onClick={() => handleSpawnCreep(battlefieldId, 'player1')}
                    disabled={!isPlayer1Turn}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isPlayer1Turn ? '#4caf50' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isPlayer1Turn ? 'pointer' : 'not-allowed',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      opacity: isPlayer1Turn ? 1 : 0.6,
                    }}
                    title="Spawn a 1/1 creep in the first empty slot for Player 1"
                  >
                    Spawn P1 Creep
                  </button>
                  <button
                    onClick={() => handleSpawnCreep(battlefieldId, 'player2')}
                    disabled={!isPlayer2Turn}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isPlayer2Turn ? '#f44336' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isPlayer2Turn ? 'pointer' : 'not-allowed',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      opacity: isPlayer2Turn ? 1 : 0.6,
                    }}
                    title="Spawn a 1/1 creep in the first empty slot for Player 2"
                  >
                    Spawn P2 Creep
                  </button>
                </>
              )
            })()}
          </div>
        )}
        {/* Go to Combat Button - Resolves Both Battlefields Simultaneously */}
        {metadata.currentPhase === 'play' && battlefieldId === 'battlefieldA' && (
          <button
            onClick={() => {
              // Check if both players passed, if so resolve combat for both battlefields
              if (metadata.player1Passed && metadata.player2Passed) {
                // Resolve simultaneous combat for both battlefields
                const initialTowerHP = {
                  towerA_player1: metadata.towerA_player1_HP,
                  towerA_player2: metadata.towerA_player2_HP,
                  towerB_player1: metadata.towerB_player1_HP,
                  towerB_player2: metadata.towerB_player2_HP,
                }
                
                const initialTowerArmor = {
                  towerA_player1: metadata.towerA_player1_Armor,
                  towerA_player2: metadata.towerA_player2_Armor,
                  towerB_player1: metadata.towerB_player1_Armor,
                  towerB_player2: metadata.towerB_player2_Armor,
                }
                
                // Resolve combat for both battlefields simultaneously
                const resultA = resolveSimultaneousCombat(
                  gameState.battlefieldA,
                  'battlefieldA',
                  initialTowerHP,
                  metadata.stunnedHeroes || {},
                  initialTowerArmor,
                  gameState
                )
                
                const resultB = resolveSimultaneousCombat(
                  gameState.battlefieldB,
                  'battlefieldB',
                  resultA.updatedTowerHP,
                  metadata.stunnedHeroes || {},
                  initialTowerArmor,
                  gameState
                )
                
                // Process killed heroes for both battlefields - separate by player
                // Draw cards for opponent when heroes are killed
                const processKilledHeroes = (
                  originalBattlefield: typeof gameState.battlefieldA,
                  updatedBattlefield: typeof gameState.battlefieldA,
                  player1Base: Card[],
                  player2Base: Card[],
                  deathCooldowns: Record<string, number>
                ) => {
                  const newP1Base = [...player1Base]
                  const newP2Base = [...player2Base]
                  const newCooldowns = { ...deathCooldowns }
                  
                  // Process player1 heroes
                  originalBattlefield.player1.forEach(originalCard => {
                    if (originalCard.cardType === 'hero') {
                      const stillAlive = updatedBattlefield.player1.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        const hero = originalCard as import('../game/types').Hero
                        newP1Base.push({
                          ...hero,
                          location: 'base' as const,
                          currentHealth: 0,
                          slot: undefined,
                        })
                        newCooldowns[hero.id] = 2
                      }
                    }
                  })
                  
                  // Process player2 heroes
                  originalBattlefield.player2.forEach(originalCard => {
                    if (originalCard.cardType === 'hero') {
                      const stillAlive = updatedBattlefield.player2.some(c => c.id === originalCard.id)
                      if (!stillAlive) {
                        const hero = originalCard as import('../game/types').Hero
                        newP2Base.push({
                          ...hero,
                          location: 'base' as const,
                          currentHealth: 0,
                          slot: undefined,
                        })
                        newCooldowns[hero.id] = 2
                      }
                    }
                  })
                  
                  return { newP1Base, newP2Base, newCooldowns }
                }
                
                const { newP1Base: newP1BaseA, newP2Base: newP2BaseA, newCooldowns: newCooldownsA } = processKilledHeroes(
                  gameState.battlefieldA,
                  resultA.updatedBattlefield,
                  gameState.player1Base,
                  gameState.player2Base,
                  metadata.deathCooldowns
                )
                
                const { newP1Base: newP1BaseB, newP2Base: newP2BaseB, newCooldowns: newCooldownsB } = processKilledHeroes(
                  gameState.battlefieldB,
                  resultB.updatedBattlefield,
                  newP1BaseA,
                  newP2BaseA,
                  newCooldownsA
                )
                
                // Apply combat results
                // Calculate total overflow damage TO each player's nexus
                // overflowDamage.player1 = damage dealt BY player1 (goes TO player2's nexus)
                // overflowDamage.player2 = damage dealt BY player2 (goes TO player1's nexus)
                const totalDamageToP1Nexus = resultA.overflowDamage.player2 + resultB.overflowDamage.player2
                const totalDamageToP2Nexus = resultA.overflowDamage.player1 + resultB.overflowDamage.player1
                
                setGameState(prev => {
                  const newP1NexusHP = Math.max(0, prev.metadata.player1NexusHP - totalDamageToP1Nexus)
                  const newP2NexusHP = Math.max(0, prev.metadata.player2NexusHP - totalDamageToP2Nexus)
                  
                  return {
                    ...prev,
                    battlefieldA: resultA.updatedBattlefield,
                    battlefieldB: resultB.updatedBattlefield,
                    player1Base: newP1BaseB,
                    player2Base: newP2BaseB,
                    metadata: {
                      ...prev.metadata,
                      towerA_player1_HP: resultA.updatedTowerHP.towerA_player1,
                      towerA_player2_HP: resultA.updatedTowerHP.towerA_player2,
                      towerB_player1_HP: resultB.updatedTowerHP.towerB_player1,
                      towerB_player2_HP: resultB.updatedTowerHP.towerB_player2,
                      player1NexusHP: newP1NexusHP,
                      player2NexusHP: newP2NexusHP,
                      deathCooldowns: newCooldownsB,
                      player1Passed: false,
                      player2Passed: false,
                    },
                  }
                })
                
                // Show combat summary modal
                setCombatSummaryData({
                  battlefieldA: {
                    name: 'Battlefield A',
                    combatLog: resultA.combatLog,
                    towerHP: {
                      player1: resultA.updatedTowerHP.towerA_player1,
                      player2: resultA.updatedTowerHP.towerA_player2,
                    },
                    overflowDamage: resultA.overflowDamage,
                  },
                  battlefieldB: {
                    name: 'Battlefield B',
                    combatLog: resultB.combatLog,
                    towerHP: {
                      player1: resultB.updatedTowerHP.towerB_player1,
                      player2: resultB.updatedTowerHP.towerB_player2,
                    },
                    overflowDamage: resultB.overflowDamage,
                  },
                })
                setShowCombatSummary(true)
              } else {
                alert('Both players must pass before going to combat')
              }
            }}
            disabled={!(metadata.player1Passed && metadata.player2Passed)}
            style={{
              padding: '8px 16px',
              backgroundColor: (metadata.player1Passed && metadata.player2Passed) ? '#4caf50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (metadata.player1Passed && metadata.player2Passed) ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft: '12px',
            }}
            title={(metadata.player1Passed && metadata.player2Passed) 
              ? 'Resolve Combat for Both Battlefields (units in front attack each other simultaneously)'
              : 'Both players must pass before combat'}
          >
            ⚔️ Resolve Combat (Both Battlefields)
          </button>
        )}
      </div>
      
      {/* Player 2 side */}
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ fontSize: '12px', marginBottom: '6px' }}>Player 2</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}>
          {[1, 2, 3, 4, 5].map(slotNum => renderSlot(slotNum, 'player2'))}
        </div>
      </div>

      {/* Player 1 side */}
      <div>
        <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 1</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map(slotNum => renderSlot(slotNum, 'player1'))}
        </div>
      </div>

      {selectedCard && (
        <button
          onClick={() => handleDeploy(battlefieldId)}
          disabled={selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
            selectedCard.owner === 'player1' ? battlefield[selectedCard.owner] : battlefield[selectedCard.owner]
          ) <= 0}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: borderColor,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
              selectedCard.owner === 'player1' ? battlefield[selectedCard.owner] : battlefield[selectedCard.owner]
            ) <= 0 ? 0.5 : 1,
          }}
        >
          Deploy {selectedCard.name} to Lane {battlefieldName}
        </button>
      )}
    </div>
    </>
  )
}

