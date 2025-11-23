import { useCallback } from 'react'
import { Card, BaseCard } from '../game/types'
import { useGameContext } from '../context/GameContext'
import { createCardFromTemplate } from '../game/sampleData'

export function useCardLibrary() {
  const { 
    gameState, 
    setGameState, 
    player1SidebarCards, 
    setPlayer1SidebarCards, 
    player2SidebarCards, 
    setPlayer2SidebarCards,
  } = useGameContext()

  const handleAddToHand = useCallback((templateIndex: number, player: 'player1' | 'player2') => {
    const sidebar = player === 'player1' ? player1SidebarCards : player2SidebarCards
    const setSidebar = player === 'player1' ? setPlayer1SidebarCards : setPlayer2SidebarCards
    const template = sidebar[templateIndex]
    if (!template) return
    
    const newCard = createCardFromTemplate(template, player, 'hand')
    
    // Remove the card from the sidebar
    setSidebar(prev => prev.filter((_, index) => index !== templateIndex))
    
    setGameState(prev => ({
      ...prev,
      [`${player}Hand`]: [...prev[`${player}Hand` as keyof typeof prev] as Card[], newCard],
    }))
  }, [player1SidebarCards, player2SidebarCards, setPlayer1SidebarCards, setPlayer2SidebarCards, setGameState])

  const handleMoveCardToLibrary = useCallback((card: Card) => {
    // Create a template from the card - strip instance-specific fields
    const template: BaseCard & Partial<{ attack: number, health: number, supportEffect?: string, effect?: string, baseBuff?: string, heroName?: string }> = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: card.name,
      description: card.description,
      cardType: card.cardType,
    }

    // Preserve stats and abilities based on card type
    if ('attack' in card && card.attack !== undefined) {
      template.attack = card.attack
    }
    if ('health' in card && card.health !== undefined) {
      template.health = card.health
    }
    if (card.cardType === 'hero' && 'supportEffect' in card && card.supportEffect) {
      template.supportEffect = card.supportEffect
    } else if (card.cardType === 'signature' && 'effect' in card && card.effect) {
      template.effect = card.effect
      if ('heroName' in card) {
        template.heroName = (card as any).heroName
      }
    } else if (card.cardType === 'hybrid' && 'baseBuff' in card && card.baseBuff) {
      template.baseBuff = card.baseBuff
    }
    
    // Add to sidebar at the bottom
    const setSidebar = card.owner === 'player1' ? setPlayer1SidebarCards : setPlayer2SidebarCards
    setSidebar(prev => [...prev, template as BaseCard])
    
    // Remove from hand
    setGameState(prev => ({
      ...prev,
      [`${card.owner}Hand`]: (prev[`${card.owner}Hand` as keyof typeof prev] as Card[])
        .filter(c => c.id !== card.id),
    }))
  }, [setPlayer1SidebarCards, setPlayer2SidebarCards, setGameState])

  return {
    handleAddToHand,
    handleMoveCardToLibrary,
  }
}

