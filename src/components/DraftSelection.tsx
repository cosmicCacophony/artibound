import React, { useState } from 'react'
import { DraftState, Hero, BaseCard, BattlefieldDefinition, HEROES_REQUIRED, CARDS_REQUIRED, Color } from '../game/types'
import { allHeroes } from '../game/cardData'
import { defaultHeroes } from '../game/draftData'

interface DraftSelectionProps {
  draftState: DraftState
  onFinalSelection: (player: 'player1' | 'player2', selection: {
    heroes: Hero[]
    cards: BaseCard[]
    battlefield: BattlefieldDefinition
  }) => void
  autoFillDefaults: (player: 'player1' | 'player2') => {
    heroes: Hero[]
    cards: BaseCard[]
    battlefield: BattlefieldDefinition
  }
}

export default function DraftSelection({ draftState, onFinalSelection, autoFillDefaults }: DraftSelectionProps) {
  const [activePlayer, setActivePlayer] = useState<'player1' | 'player2'>('player1')
  const [player1Selection, setPlayer1Selection] = useState<{
    heroes: Set<string>
    cards: Set<string>
    battlefield: string | null
  }>({
    heroes: new Set(),
    cards: new Set(),
    battlefield: null,
  })
  const [player2Selection, setPlayer2Selection] = useState<{
    heroes: Set<string>
    cards: Set<string>
    battlefield: string | null
  }>({
    heroes: new Set(),
    cards: new Set(),
    battlefield: null,
  })

  const player1Drafted = draftState.player1Drafted
  const player2Drafted = draftState.player2Drafted
  const currentDrafted = activePlayer === 'player1' ? player1Drafted : player2Drafted
  const currentSelection = activePlayer === 'player1' ? player1Selection : player2Selection
  const setCurrentSelection = activePlayer === 'player1' ? setPlayer1Selection : setPlayer2Selection

  // Track default heroes being added (color -> hero)
  const [player1DefaultHeroes, setPlayer1DefaultHeroes] = useState<Map<Color, Hero>>(new Map())
  const [player2DefaultHeroes, setPlayer2DefaultHeroes] = useState<Map<Color, Hero>>(new Map())
  const currentDefaultHeroes = activePlayer === 'player1' ? player1DefaultHeroes : player2DefaultHeroes
  const setCurrentDefaultHeroes = activePlayer === 'player1' ? setPlayer1DefaultHeroes : setPlayer2DefaultHeroes

  // Available colors for default heroes
  const availableColors: Color[] = ['red', 'blue', 'white', 'black', 'green']
  const COLOR_MAP: Record<Color, string> = {
    red: '#d32f2f',
    blue: '#1976d2',
    white: '#f5f5f5',
    black: '#424242',
    green: '#388e3c',
  }
  
  const COLOR_LIGHT_MAP: Record<Color, string> = {
    red: '#ffebee',
    blue: '#e3f2fd',
    white: '#ffffff',
    black: '#fafafa',
    green: '#e8f5e9',
  }
  
  const getColorStyles = (colors?: Color[]) => {
    if (!colors || colors.length === 0) {
      return {
        borderColor: '#757575',
        backgroundColor: '#fafafa',
        borderWidth: '2px',
      }
    } else if (colors.length === 1) {
      const color = colors[0]
      return {
        borderColor: COLOR_MAP[color],
        backgroundColor: COLOR_LIGHT_MAP[color],
        borderWidth: '3px',
      }
    } else {
      // Multicolor - create gradient background
      const primaryColor = colors[0]
      return {
        borderColor: COLOR_MAP[primaryColor],
        backgroundColor: COLOR_LIGHT_MAP[primaryColor],
        background: colors.length === 2
          ? `linear-gradient(to right, ${COLOR_LIGHT_MAP[colors[0]]} 50%, ${COLOR_LIGHT_MAP[colors[1]]} 50%)`
          : `linear-gradient(135deg, ${colors.map((c, i) => {
              const percent = (i / colors.length) * 100
              return `${COLOR_LIGHT_MAP[c]} ${percent}%`
            }).join(', ')})`,
        borderWidth: '3px',
      }
    }
  }

  const heroesNeeded = HEROES_REQUIRED - (currentDrafted.heroes.length + currentDefaultHeroes.size)
  const canAddDefaultHero = heroesNeeded > 0

  const addDefaultHero = (color: Color) => {
    if (!canAddDefaultHero) return
    
    // Use specific default hero for this color
    const defaultHero = [...defaultHeroes.passable, ...defaultHeroes.disappointing].find(
      h => h.colors[0] === color
    )
    if (!defaultHero) return

    // Create a new hero instance with unique ID
    const newHero: Hero = {
      ...defaultHero,
      id: `default-${activePlayer}-${color}-${Date.now()}`,
      location: 'hand',
      owner: activePlayer,
    }

    const newMap = new Map(currentDefaultHeroes)
    newMap.set(color, newHero)
    setCurrentDefaultHeroes(newMap)
  }

  const removeDefaultHero = (color: Color) => {
    const newMap = new Map(currentDefaultHeroes)
    newMap.delete(color)
    setCurrentDefaultHeroes(newMap)
  }

  const toggleHero = (heroId: string) => {
    const newSet = new Set(currentSelection.heroes)
    if (newSet.has(heroId)) {
      newSet.delete(heroId)
    } else {
      if (newSet.size < HEROES_REQUIRED) {
        newSet.add(heroId)
      }
    }
    setCurrentSelection({ ...currentSelection, heroes: newSet })
  }

  const toggleCard = (cardId: string) => {
    const newSet = new Set(currentSelection.cards)
    if (newSet.has(cardId)) {
      newSet.delete(cardId)
    } else {
      if (newSet.size < CARDS_REQUIRED) {
        newSet.add(cardId)
      }
    }
    setCurrentSelection({ ...currentSelection, cards: newSet })
  }

  const selectBattlefield = (battlefieldId: string) => {
    setCurrentSelection({ ...currentSelection, battlefield: battlefieldId })
  }

  const handleConfirm = (player: 'player1' | 'player2') => {
    const selection = player === 'player1' ? player1Selection : player2Selection
    const drafted = player === 'player1' ? player1Drafted : player2Drafted
    const defaultHeroes = player === 'player1' ? player1DefaultHeroes : player2DefaultHeroes
    
    // Filter heroes by selected IDs - only take the first match for each ID to handle duplicates
    const selectedHeroIds = Array.from(selection.heroes)
    const selectedHeroes: Hero[] = []
    const usedIds = new Set<string>()
    for (const hero of drafted.heroes) {
      if (selectedHeroIds.includes(hero.id) && !usedIds.has(hero.id)) {
        selectedHeroes.push(hero)
        usedIds.add(hero.id)
      }
    }
    // Add default heroes
    const allSelectedHeroes = [...selectedHeroes, ...Array.from(defaultHeroes.values())]
    const selectedCards = drafted.cards.filter(c => selection.cards.has(c.id))
    const selectedBattlefield = drafted.battlefields.find(b => b.id === selection.battlefield)

    // Validate heroes - check selection size first, then actual count
    if (selection.heroes.size + defaultHeroes.size !== HEROES_REQUIRED) {
      alert(`Please select exactly ${HEROES_REQUIRED} heroes (you have ${selection.heroes.size + defaultHeroes.size}, need ${HEROES_REQUIRED})`)
      return
    }
    if (allSelectedHeroes.length !== HEROES_REQUIRED) {
      // Check if some selected hero IDs don't exist in drafted.heroes
      const missingHeroIds = selectedHeroIds.filter(id => !drafted.heroes.some(h => h.id === id))
      if (missingHeroIds.length > 0) {
        alert(`Error: Some selected heroes are missing from your draft. Missing IDs: ${missingHeroIds.join(', ')}`)
      } else {
        alert(`Please select exactly ${HEROES_REQUIRED} heroes (you have ${allSelectedHeroes.length}, need ${HEROES_REQUIRED})`)
      }
      return
    }
    
    // Validate cards - check selection size first, then actual count
    if (selection.cards.size !== CARDS_REQUIRED) {
      alert(`Please select exactly ${CARDS_REQUIRED} cards (you have ${selection.cards.size}, need ${CARDS_REQUIRED})`)
      return
    }
    if (selectedCards.length !== CARDS_REQUIRED) {
      // This means some selected card IDs don't exist in drafted.cards
      const missingIds = Array.from(selection.cards).filter(id => !drafted.cards.some(c => c.id === id))
      alert(`Error: Some selected cards are missing from your draft. Missing IDs: ${missingIds.join(', ')}`)
      return
    }
    
    if (!selectedBattlefield) {
      alert('Please select a battlefield')
      return
    }

    onFinalSelection(player, {
      heroes: allSelectedHeroes,
      cards: selectedCards,
      battlefield: selectedBattlefield,
    })
  }

  const handleAutoFill = (player: 'player1' | 'player2') => {
    const drafted = player === 'player1' ? player1Drafted : player2Drafted
    
    // Only select items that actually exist in drafted items
    // Select all heroes up to required (or all if less)
    const validHeroIds = drafted.heroes
      .slice(0, HEROES_REQUIRED)
      .map(h => h.id)
    
    // Select all cards up to required (or all if less)
    const validCardIds = drafted.cards
      .slice(0, CARDS_REQUIRED)
      .map(c => c.id)
    
    // Select first battlefield if available
    const validBattlefieldId = drafted.battlefields.length > 0 
      ? drafted.battlefields[0].id 
      : null
    
    if (player === 'player1') {
      setPlayer1Selection({
        heroes: new Set(validHeroIds),
        cards: new Set(validCardIds),
        battlefield: validBattlefieldId,
      })
    } else {
      setPlayer2Selection({
        heroes: new Set(validHeroIds),
        cards: new Set(validCardIds),
        battlefield: validBattlefieldId,
      })
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Final Selection Phase</h1>
      <p>Choose final decks for both players: {HEROES_REQUIRED} heroes, {CARDS_REQUIRED} cards, 1 battlefield each</p>

      {/* Player Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #ccc' }}>
        <button
          onClick={() => setActivePlayer('player1')}
          style={{
            padding: '12px 24px',
            backgroundColor: activePlayer === 'player1' ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Player 1 {draftState.player1Final ? '✓' : ''}
        </button>
        <button
          onClick={() => setActivePlayer('player2')}
          style={{
            padding: '12px 24px',
            backgroundColor: activePlayer === 'player2' ? '#f44336' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Player 2 {draftState.player2Final ? '✓' : ''}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleAutoFill(activePlayer)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '12px',
          }}
        >
          Auto-Fill Defaults for {activePlayer === 'player1' ? 'Player 1' : 'Player 2'}
        </button>
        <button
          onClick={() => handleConfirm(activePlayer)}
          disabled={activePlayer === 'player1' ? draftState.player1Final !== null : draftState.player2Final !== null}
          style={{
            padding: '8px 16px',
            backgroundColor: (activePlayer === 'player1' ? draftState.player1Final : draftState.player2Final) ? '#ccc' : (activePlayer === 'player1' ? '#4CAF50' : '#f44336'),
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (activePlayer === 'player1' ? draftState.player1Final : draftState.player2Final) ? 'not-allowed' : 'pointer',
          }}
        >
          {(activePlayer === 'player1' ? draftState.player1Final : draftState.player2Final) ? 'Selection Confirmed' : `Confirm ${activePlayer === 'player1' ? 'Player 1' : 'Player 2'} Selection`}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Heroes */}
        <div>
          <h3>Heroes ({currentSelection.heroes.size + currentDefaultHeroes.size} / {HEROES_REQUIRED})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
            {currentDrafted.heroes.map(hero => (
              <div
                key={hero.id}
                onClick={() => toggleHero(hero.id)}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  border: currentSelection.heroes.has(hero.id) ? '2px solid #4CAF50' : '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentSelection.heroes.has(hero.id) ? '#E8F5E9' : '#fff',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{hero.name}</div>
                <div style={{ fontSize: '12px' }}>{hero.description}</div>
              </div>
            ))}
            {/* Show default heroes that have been added */}
            {Array.from(currentDefaultHeroes.values()).map(hero => (
              <div
                key={hero.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  border: '2px solid #FF9800',
                  borderRadius: '4px',
                  backgroundColor: '#FFF3E0',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => removeDefaultHero(hero.colors[0])}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
                <div style={{ fontWeight: 'bold', color: COLOR_MAP[hero.colors[0]] }}>
                  {hero.name} (Default)
                </div>
                <div style={{ fontSize: '12px' }}>{hero.description}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                  {hero.attack} / {hero.health}
                </div>
              </div>
            ))}
            {/* Add default hero section */}
            {canAddDefaultHero && (
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#FFF9C4', borderRadius: '4px', border: '1px dashed #FFC107' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#F57F17' }}>
                  Add Default Hero ({heroesNeeded} needed)
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {availableColors.map(color => {
                    const alreadyAdded = currentDefaultHeroes.has(color)
                    // Use first hero of this color from allHeroes as fallback
                    const defaultHero = allHeroes.find(h => h.colors[0] === color)
                    if (!defaultHero) return null
                    
                    return (
                      <button
                        key={color}
                        onClick={() => alreadyAdded ? removeDefaultHero(color) : addDefaultHero(color)}
                        disabled={alreadyAdded}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          backgroundColor: alreadyAdded ? '#ccc' : COLOR_MAP[color],
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: alreadyAdded ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          opacity: alreadyAdded ? 0.5 : 1,
                        }}
                        title={alreadyAdded ? 'Already added' : `Add ${color} default hero (${defaultHero.attack}/${defaultHero.health})`}
                      >
                        {color} {alreadyAdded ? '✓' : '+'}
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                  Default heroes are weaker (0.75x strength) but available if you need to fill your roster
                </div>
              </div>
            )}
            {currentDrafted.heroes.length === 0 && currentDefaultHeroes.size === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No heroes drafted. Add default heroes above.</div>
            )}
          </div>
        </div>

        {/* Cards */}
        <div>
          <h3>Cards ({currentSelection.cards.size} / {CARDS_REQUIRED})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
            {currentDrafted.cards.map(card => {
              const cardColors = card.colors || []
              const colorStyles = getColorStyles(cardColors)
              const isSelected = currentSelection.cards.has(card.id)
              
              return (
                <div
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  style={{
                    padding: '8px',
                    marginBottom: '8px',
                    border: isSelected ? '3px solid #2196F3' : `${colorStyles.borderWidth} solid ${colorStyles.borderColor}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    // Apply color background similar to draft phase
                    ...(cardColors.length === 1
                      ? {
                          backgroundColor: isSelected ? '#E3F2FD' : COLOR_LIGHT_MAP[cardColors[0]],
                        }
                      : cardColors.length > 1
                        ? {
                            backgroundColor: isSelected ? '#E3F2FD' : COLOR_LIGHT_MAP[cardColors[0]],
                            background: isSelected ? undefined : colorStyles.background,
                          }
                        : {
                            backgroundColor: isSelected ? '#E3F2FD' : (colorStyles.backgroundColor || '#fff'),
                          }),
                    boxShadow: cardColors.length > 0 ? `0 2px 8px rgba(0,0,0,0.15)` : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Color indicator bar */}
                  {cardColors.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      height: '4px', 
                      marginBottom: '6px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      {cardColors.map((color, idx) => (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            backgroundColor: COLOR_MAP[color],
                            borderRight: idx < cardColors.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                  <div style={{ fontWeight: 'bold' }}>{card.name}</div>
                  <div style={{ fontSize: '12px' }}>{card.description}</div>
                  {card.manaCost && (
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                      {card.manaCost} Mana
                    </div>
                  )}
                </div>
              )
            })}
            {currentDrafted.cards.length === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No cards drafted</div>
            )}
          </div>
        </div>

        {/* Battlefields */}
        <div>
          <h3>Battlefield</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', borderRadius: '4px' }}>
            {currentDrafted.battlefields.map(battlefield => (
              <div
                key={battlefield.id}
                onClick={() => selectBattlefield(battlefield.id)}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  border: currentSelection.battlefield === battlefield.id ? '2px solid #9C27B0' : '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentSelection.battlefield === battlefield.id ? '#F3E5F5' : '#fff',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#9C27B0' }}>{battlefield.name}</div>
                <div style={{ fontSize: '12px' }}>{battlefield.description}</div>
                <div style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '4px' }}>
                  {battlefield.staticAbility}
                </div>
              </div>
            ))}
            {currentDrafted.battlefields.length === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No battlefields drafted</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

