import { useCallback } from 'react'
import { BaseCard, CardType } from '../game/types'
import { useGameContext } from '../context/GameContext'

export function useCardManagement() {
  const {
    player1SidebarCards,
    setPlayer1SidebarCards,
    player2SidebarCards,
    setPlayer2SidebarCards,
    archivedCards,
    setArchivedCards,
  } = useGameContext()

  const getAllCards = useCallback((): BaseCard[] => {
    // Combine and deduplicate by ID (same card might exist in both libraries)
    const allCards = [...player1SidebarCards, ...player2SidebarCards]
    const seen = new Set<string>()
    return allCards.filter(card => {
      if (seen.has(card.id)) {
        return false
      }
      seen.add(card.id)
      return true
    })
  }, [player1SidebarCards, player2SidebarCards])

  const updateCard = useCallback((oldCard: BaseCard, updatedCard: BaseCard, archiveOld: boolean) => {
    // Archive or delete old version
    if (archiveOld) {
      setArchivedCards(prev => [...prev, { ...oldCard, id: `${oldCard.id}_archived_${Date.now()}` }])
    }

    // Preserve the original ID
    const finalUpdatedCard = { ...updatedCard, id: oldCard.id }

    // Update in both player libraries (card might exist in either or both)
    setPlayer1SidebarCards(prev => prev.map(c => c.id === oldCard.id ? finalUpdatedCard : c))
    setPlayer2SidebarCards(prev => prev.map(c => c.id === oldCard.id ? finalUpdatedCard : c))
  }, [setPlayer1SidebarCards, setPlayer2SidebarCards, setArchivedCards])

  const deleteCard = useCallback((card: BaseCard) => {
    setPlayer1SidebarCards(prev => prev.filter(c => c.id !== card.id))
    setPlayer2SidebarCards(prev => prev.filter(c => c.id !== card.id))
  }, [setPlayer1SidebarCards, setPlayer2SidebarCards])

  const restoreArchivedCard = useCallback((archivedCard: BaseCard) => {
    // Remove from archived
    setArchivedCards(prev => prev.filter(c => c.id !== archivedCard.id))
    
    // Add to player1 library (can be moved later)
    setPlayer1SidebarCards(prev => [...prev, { ...archivedCard, id: `restored_${Date.now()}_${archivedCard.id}` }])
  }, [setArchivedCards, setPlayer1SidebarCards])

  const getCardsByType = useCallback((cardType: CardType | 'all'): BaseCard[] => {
    const allCards = getAllCards()
    if (cardType === 'all') return allCards
    return allCards.filter(c => c.cardType === cardType)
  }, [getAllCards])

  return {
    getAllCards,
    updateCard,
    deleteCard,
    restoreArchivedCard,
    getCardsByType,
    archivedCards,
  }
}

