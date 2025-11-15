import { useState } from 'react'
import { Card, Location, BATTLEFIELD_SLOT_LIMIT, GenericUnit } from '../game/types'
import { createInitialGameState, createCardLibrary, createCardFromTemplate } from '../game/sampleData'
import { HeroCard } from './HeroCard'

export function Board() {
  const cardLibrary = createCardLibrary()
  const [gameState, setGameState] = useState(createInitialGameState())
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [activePlayer, setActivePlayer] = useState<'player1' | 'player2'>('player1')

  // Get cards for current view
  const player1Hand = gameState.player1Hand
  const player2Hand = gameState.player2Hand
  const player1Base = gameState.player1Base
  const player2Base = gameState.player2Base
  const battlefieldAP1 = gameState.battlefieldA.player1
  const battlefieldAP2 = gameState.battlefieldA.player2
  const battlefieldBP1 = gameState.battlefieldB.player1
  const battlefieldBP2 = gameState.battlefieldB.player2

  const selectedCard = selectedCardId
    ? [...player1Hand, ...player2Hand, ...player1Base, ...player2Base, 
       ...battlefieldAP1, ...battlefieldAP2, ...battlefieldBP1, ...battlefieldBP2]
        .find(c => c.id === selectedCardId)
    : null

  const getAvailableSlots = (battlefield: Card[]) => {
    // Count actual cards (not stacked ones count as 1)
    const uniqueCards = battlefield.filter(card => 
      card.cardType !== 'generic' || !('stackedWith' in card && (card as GenericUnit).stackedWith)
    )
    return BATTLEFIELD_SLOT_LIMIT - uniqueCards.length
  }

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  const handleAddToHand = (templateIndex: number, player: 'player1' | 'player2') => {
    const template = cardLibrary[templateIndex]
    const newCard = createCardFromTemplate(template, player, 'hand')
    
    setGameState(prev => ({
      ...prev,
      [`${player}Hand`]: [...prev[`${player}Hand` as keyof typeof prev] as Card[], newCard],
    }))
  }

  const handleDeploy = (location: Location) => {
    if (!selectedCardId || !selectedCard) return

    // Check if deploying to battlefield and slots are full
    if ((location === 'battlefieldA' || location === 'battlefieldB')) {
      const battlefield = location === 'battlefieldA' 
        ? gameState.battlefieldA[selectedCard.owner as 'player1' | 'player2']
        : gameState.battlefieldB[selectedCard.owner as 'player1' | 'player2']
      
      const availableSlots = getAvailableSlots(battlefield)
      
      if (selectedCard.cardType !== 'generic' && availableSlots <= 0) {
        alert('Battlefield is full! Maximum 5 slots.')
        return
      }

      // Handle generic unit stacking
      if (selectedCard.cardType === 'generic' && battlefield.length > 0) {
        // Try to stack with another generic unit
        const stackableGeneric = battlefield.find(c => 
          c.cardType === 'generic' && 
          !('stackedWith' in c && c.stackedWith) &&
          c.id !== selectedCard.id
        ) as GenericUnit | undefined

        if (stackableGeneric && selectedCard.cardType === 'generic') {
          // Stack the new card with existing generic
          const selectedGeneric = selectedCard as GenericUnit
          const newStackPower = (stackableGeneric.attack || 0) + (selectedGeneric.attack || 0)
          const newStackHealth = (stackableGeneric.health || 0) + (selectedGeneric.health || 0)

          setGameState(prev => {
            const newBattlefield = prev[location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']
            const playerField = selectedCard.owner as 'player1' | 'player2'
            
            return {
              ...prev,
              [location === 'battlefieldA' ? 'battlefieldA' : 'battlefieldB']: {
                ...newBattlefield,
                [playerField]: newBattlefield[playerField].map(c =>
                  c.id === stackableGeneric.id
                    ? { ...c, stackPower: newStackPower, stackHealth: newStackHealth, stackedWith: selectedCard.id } as GenericUnit
                    : c
                ).concat([{
                  ...selectedGeneric,
                  location,
                  stackedWith: stackableGeneric.id,
                  stackPower: newStackPower,
                  stackHealth: newStackHealth,
                }] as GenericUnit[]),
              },
              [`${selectedCard.owner}Hand`]: (prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[])
                .filter((c: Card) => c.id !== selectedCard.id),
              [`${selectedCard.owner}Base`]: (prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[])
                .filter((c: Card) => c.id !== selectedCard.id),
            }
          })
          setSelectedCardId(null)
          return
        }
      }
    }

    // Regular deployment
    setGameState(prev => {
      // Remove from current location
      const removeFromLocation = (cards: Card[]) => cards.filter(c => c.id !== selectedCardId)
      
      // Add to new location
      if (location === 'base') {
        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: [...prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[], { ...selectedCard, location }],
          battlefieldA: {
            ...prev.battlefieldA,
            [selectedCard.owner]: removeFromLocation(prev.battlefieldA[selectedCard.owner as 'player1' | 'player2']),
          },
          battlefieldB: {
            ...prev.battlefieldB,
            [selectedCard.owner]: removeFromLocation(prev.battlefieldB[selectedCard.owner as 'player1' | 'player2']),
          },
        }
      } else if (location === 'battlefieldA' || location === 'battlefieldB') {
        const battlefieldKey = location
        return {
          ...prev,
          [`${selectedCard.owner}Hand`]: removeFromLocation(prev[`${selectedCard.owner}Hand` as keyof typeof prev] as Card[]),
          [`${selectedCard.owner}Base`]: removeFromLocation(prev[`${selectedCard.owner}Base` as keyof typeof prev] as Card[]),
          [battlefieldKey]: {
            ...prev[battlefieldKey],
            [selectedCard.owner]: [
              ...prev[battlefieldKey][selectedCard.owner as 'player1' | 'player2'],
              { ...selectedCard, location }
            ],
          },
        }
      }
      return prev
    })
    setSelectedCardId(null)
  }

  const handleRemoveFromBattlefield = (card: Card, location: 'battlefieldA' | 'battlefieldB') => {
    // If stacked, unstack it
    if (card.cardType === 'generic') {
      const genericCard = card as GenericUnit
      if (genericCard.stackedWith) {
        setGameState(prev => {
          const battlefield = prev[location][card.owner as 'player1' | 'player2']
          const otherCard = battlefield.find(c => 
            c.id === genericCard.stackedWith || 
            (c.cardType === 'generic' && (c as GenericUnit).stackedWith === card.id)
          )
          
          const updatedBattlefield = battlefield
            .filter(c => c.id !== card.id && c.id !== otherCard?.id)
            .map(c => {
              if (c.id === otherCard?.id && c.cardType === 'generic') {
                // Remove stacking info from the other card
                const { stackedWith, stackPower, stackHealth, ...rest } = c as GenericUnit
                return rest as GenericUnit
              }
              return c
            })

          // Create a clean version of the card without stacking
          const { stackedWith, stackPower, stackHealth, ...cleanCard } = genericCard
          
          return {
            ...prev,
            [location]: {
              ...prev[location],
              [card.owner]: updatedBattlefield,
            },
            [`${card.owner}Base`]: [...prev[`${card.owner}Base` as keyof typeof prev] as Card[], { ...cleanCard, location: 'base' }],
          }
        })
        return
      }
    }
    
    // Regular removal
    setGameState(prev => ({
      ...prev,
      [location]: {
        ...prev[location],
        [card.owner]: prev[location][card.owner as 'player1' | 'player2'].filter(c => c.id !== card.id),
      },
      [`${card.owner}Base`]: [...prev[`${card.owner}Base` as keyof typeof prev] as Card[], { ...card, location: 'base' }],
    }))
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh' }}>
      {/* Sidebar - Card Library */}
      <div
        style={{
          width: '250px',
          borderRight: '2px solid #ddd',
          padding: '20px',
          overflowY: 'auto',
          backgroundColor: '#fafafa',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>Card Library</h2>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setActivePlayer(activePlayer === 'player1' ? 'player2' : 'player1')}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: activePlayer === 'player1' ? '#4a90e2' : '#9c27b0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            Adding to: {activePlayer === 'player1' ? 'Player 1' : 'Player 2'}
          </button>
        </div>
        
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Click a card to add to hand
        </div>
        
        {cardLibrary.map((template, index) => (
          <div
            key={index}
            onClick={() => handleAddToHand(index, activePlayer)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '8px',
              cursor: 'pointer',
              backgroundColor: '#fff',
              fontSize: '12px',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#666' }}>
              {template.cardType.toUpperCase()}
            </div>
            <div style={{ fontWeight: 'bold' }}>{template.name}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>{template.description}</div>
            {'attack' in template && 'health' in template && (
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                ⚔️ {(template as { attack: number; health: number }).attack} ❤️ {(template as { attack: number; health: number }).health}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Board */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h1 style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>
          Artibound - Hero Card Game
        </h1>

        {/* Player 2 Area (Top) */}
        <div
          style={{
            border: '2px solid #9c27b0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f3e5f5',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Player 2</h2>
          
          {/* Player 2 Base */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Base ({player2Base.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '60px' }}>
              {player2Base.length > 0 ? (
                player2Base.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={false}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
          </div>

          {/* Player 2 Hand */}
          <div>
            <h3>Hand ({player2Hand.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {player2Hand.length > 0 ? (
                player2Hand.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={true}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
          </div>
        </div>

        {/* Battlefields (Middle) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {/* Battlefield A */}
          <div
            style={{
              border: '2px solid #4a90e2',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#e3f2fd',
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Battlefield A
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>
                ({getAvailableSlots([...battlefieldAP1, ...battlefieldAP2])} slots available)
              </span>
            </h2>
            
            {/* Player 2 side */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 2</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '80px' }}>
                {battlefieldAP2.length > 0 ? (
                  battlefieldAP2.map(card => (
                    <HeroCard
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card.id)}
                      isSelected={selectedCardId === card.id}
                      showStats={true}
                      onRemove={() => handleRemoveFromBattlefield(card, 'battlefieldA')}
                    />
                  ))
                ) : (
                  <p style={{ color: '#999', fontSize: '12px', width: '100%' }}>Empty</p>
                )}
              </div>
            </div>

            {/* Player 1 side */}
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 1</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '80px' }}>
                {battlefieldAP1.length > 0 ? (
                  battlefieldAP1.map(card => (
                    <HeroCard
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card.id)}
                      isSelected={selectedCardId === card.id}
                      showStats={true}
                      onRemove={() => handleRemoveFromBattlefield(card, 'battlefieldA')}
                    />
                  ))
                ) : (
                  <p style={{ color: '#999', fontSize: '12px', width: '100%' }}>Empty</p>
                )}
              </div>
            </div>

            {selectedCard && (
              <button
                onClick={() => handleDeploy('battlefieldA')}
                disabled={selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                  selectedCard.owner === 'player1' ? battlefieldAP1 : battlefieldAP2
                ) <= 0}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                    selectedCard.owner === 'player1' ? battlefieldAP1 : battlefieldAP2
                  ) <= 0 ? 0.5 : 1,
                }}
              >
                Deploy {selectedCard.name} to Lane A
              </button>
            )}
          </div>

          {/* Battlefield B */}
          <div
            style={{
              border: '2px solid #ff9800',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff3e0',
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Battlefield B
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>
                ({getAvailableSlots([...battlefieldBP1, ...battlefieldBP2])} slots available)
              </span>
            </h2>
            
            {/* Player 2 side */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 2</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '80px' }}>
                {battlefieldBP2.length > 0 ? (
                  battlefieldBP2.map(card => (
                    <HeroCard
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card.id)}
                      isSelected={selectedCardId === card.id}
                      showStats={true}
                      onRemove={() => handleRemoveFromBattlefield(card, 'battlefieldB')}
                    />
                  ))
                ) : (
                  <p style={{ color: '#999', fontSize: '12px', width: '100%' }}>Empty</p>
                )}
              </div>
            </div>

            {/* Player 1 side */}
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Player 1</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '80px' }}>
                {battlefieldBP1.length > 0 ? (
                  battlefieldBP1.map(card => (
                    <HeroCard
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card.id)}
                      isSelected={selectedCardId === card.id}
                      showStats={true}
                      onRemove={() => handleRemoveFromBattlefield(card, 'battlefieldB')}
                    />
                  ))
                ) : (
                  <p style={{ color: '#999', fontSize: '12px', width: '100%' }}>Empty</p>
                )}
              </div>
            </div>

            {selectedCard && (
              <button
                onClick={() => handleDeploy('battlefieldB')}
                disabled={selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                  selectedCard.owner === 'player1' ? battlefieldBP1 : battlefieldBP2
                ) <= 0}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: selectedCard && selectedCard.cardType !== 'generic' && getAvailableSlots(
                    selectedCard.owner === 'player1' ? battlefieldBP1 : battlefieldBP2
                  ) <= 0 ? 0.5 : 1,
                }}
              >
                Deploy {selectedCard.name} to Lane B
              </button>
            )}
          </div>
        </div>

        {/* Player 1 Area (Bottom) */}
        <div
          style={{
            border: '2px solid #4a90e2',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#e3f2fd',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Player 1</h2>

          {/* Player 1 Base */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Base ({player1Base.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '60px' }}>
              {player1Base.length > 0 ? (
                player1Base.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={false}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
            {selectedCard && (
              <button
                onClick={() => handleDeploy('base')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Move {selectedCard.name} to Base
              </button>
            )}
          </div>

          {/* Player 1 Hand */}
          <div>
            <h3>Hand ({player1Hand.length})</h3>
            {selectedCard && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fff9c4',
                  borderRadius: '4px',
                  marginBottom: '15px',
                }}
              >
                <strong>Selected: {selectedCard.name}</strong> - Choose a deployment location above
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {player1Hand.length > 0 ? (
                player1Hand.map(card => (
                  <HeroCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isSelected={selectedCardId === card.id}
                    showStats={true}
                  />
                ))
              ) : (
                <p style={{ color: '#999' }}>Empty</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
