import React from 'react'
import { DraftedItems } from '../game/types'

interface DraftPicksProps {
  player1Drafted: DraftedItems
  player2Drafted: DraftedItems
}

export default function DraftPicks({ player1Drafted, player2Drafted }: DraftPicksProps) {
  return (
    <div>
      <h2>Drafted Items</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Player 1 */}
        <div style={{ border: '2px solid #4CAF50', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ color: '#4CAF50', marginTop: 0 }}>Player 1 (You)</h3>
          <div style={{ marginBottom: '12px' }}>
            <strong>Heroes:</strong> {player1Drafted.heroes.length}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {player1Drafted.heroes.map(h => h.name).join(', ') || 'None'}
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Cards:</strong> {player1Drafted.cards.length}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {player1Drafted.cards.slice(0, 5).map(c => c.name).join(', ')}
              {player1Drafted.cards.length > 5 && '...'}
            </div>
          </div>
          <div>
            <strong>Battlefields:</strong> {player1Drafted.battlefields.length}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {player1Drafted.battlefields.map(b => b.name).join(', ') || 'None'}
            </div>
          </div>
        </div>

        {/* Player 2 */}
        <div style={{ border: '2px solid #f44336', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ color: '#f44336', marginTop: 0 }}>Player 2 (Opponent)</h3>
          <div style={{ marginBottom: '12px' }}>
            <strong>Heroes:</strong> {player2Drafted.heroes.length}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {player2Drafted.heroes.map(h => h.name).join(', ') || 'None'}
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Cards:</strong> {player2Drafted.cards.length}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {player2Drafted.cards.slice(0, 5).map(c => c.name).join(', ')}
              {player2Drafted.cards.length > 5 && '...'}
            </div>
          </div>
          <div>
            <strong>Battlefields:</strong> {player2Drafted.battlefields.length}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {player2Drafted.battlefields.map(b => b.name).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

