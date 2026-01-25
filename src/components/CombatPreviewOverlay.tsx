import { useEffect, useMemo, useState } from 'react'
import { Card, GameState, PlayerId } from '../game/types'
import { getDefaultTarget } from '../game/combatSystem'

type ArrowType = 'normal' | 'tower' | 'crossStrike' | 'cleave' | 'assassinate'

interface Point {
  x: number
  y: number
}

interface AttackLine {
  id: string
  from: Point
  to: Point
  type: ArrowType
  player: PlayerId
  damage: number
  lethal: boolean
}

interface CombatPreviewOverlayProps {
  gameState: GameState
  hoveredUnitId: string | null
  selectedUnitId: string | null
  isPreviewActive: boolean
}

const getAttackPower = (unit: Card): number => {
  if (unit.cardType === 'generic' && 'stackPower' in unit && unit.stackPower !== undefined) {
    return unit.stackPower
  }
  const baseAttack = 'attack' in unit ? unit.attack : 0
  const tempAttack = (unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryAttack' in unit
    ? (unit.temporaryAttack || 0)
    : 0
  return baseAttack + tempAttack
}

const getUnitEffectiveHealth = (unit: Card): number => {
  if (!('currentHealth' in unit)) return 0
  const tempHP = (unit.cardType === 'hero' || unit.cardType === 'generic') && 'temporaryHP' in unit
    ? (unit.temporaryHP || 0)
    : 0
  return unit.currentHealth + tempHP
}

const getArrowColor = (type: ArrowType, player: PlayerId) => {
  if (type === 'crossStrike') return '#9c27b0'
  if (type === 'cleave') return '#ff9800'
  if (type === 'assassinate') return '#880e4f'
  return player === 'player1' ? '#dc3545' : '#0d6efd'
}

export function CombatPreviewOverlay({
  gameState,
  hoveredUnitId,
  selectedUnitId,
  isPreviewActive,
}: CombatPreviewOverlayProps) {
  const [slotCenters, setSlotCenters] = useState<Record<string, Point>>({})
  const [towerCenters, setTowerCenters] = useState<Record<string, Point>>({})

  useEffect(() => {
    const updatePositions = () => {
      const slots: Record<string, Point> = {}
      const towers: Record<string, Point> = {}

      document.querySelectorAll<HTMLElement>('[data-slot][data-battlefield][data-player]').forEach((el) => {
        const battlefield = el.dataset.battlefield
        const player = el.dataset.player
        const slot = el.dataset.slot
        if (!battlefield || !player || !slot) return
        const rect = el.getBoundingClientRect()
        slots[`${battlefield}-${player}-${slot}`] = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      })

      document.querySelectorAll<HTMLElement>('[data-tower="true"][data-battlefield][data-player]').forEach((el) => {
        const battlefield = el.dataset.battlefield
        const player = el.dataset.player
        if (!battlefield || !player) return
        const rect = el.getBoundingClientRect()
        towers[`${battlefield}-${player}`] = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      })

      setSlotCenters(slots)
      setTowerCenters(towers)
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [])

  const lines = useMemo(() => {
    if (!isPreviewActive && !hoveredUnitId && !selectedUnitId) {
      return []
    }

    const allUnits = [
      ...gameState.battlefieldA.player1,
      ...gameState.battlefieldA.player2,
      ...gameState.battlefieldB.player1,
      ...gameState.battlefieldB.player2,
    ].filter(unit => unit.slot !== undefined)

    const focusIds = new Set<string>()
    if (isPreviewActive) {
      allUnits.forEach(unit => focusIds.add(unit.id))
    } else {
      if (hoveredUnitId) focusIds.add(hoveredUnitId)
      if (selectedUnitId) focusIds.add(selectedUnitId)
    }

    const buildLinesForUnit = (unit: Card, battlefieldId: 'battlefieldA' | 'battlefieldB'): AttackLine[] => {
      if (!unit.slot) return []
      if (!focusIds.has(unit.id)) return []

      const battlefield = gameState[battlefieldId]
      const target = getDefaultTarget(unit, unit.slot, battlefield)
      const player = unit.owner
      const opponent = player === 'player1' ? 'player2' : 'player1'

      const fromKey = `${battlefieldId}-${player}-${unit.slot}`
      const from = slotCenters[fromKey]
      if (!from) return []

      const lines: AttackLine[] = []

      if (target.type === 'unit' && target.targetId) {
        const targetUnit = battlefield[opponent].find(u => u.id === target.targetId)
        if (!targetUnit || targetUnit.slot === undefined) return []
        const toKey = `${battlefieldId}-${opponent}-${targetUnit.slot}`
        const to = slotCenters[toKey]
        if (!to) return []

        const damage = getAttackPower(unit)
        const lethal = damage >= getUnitEffectiveHealth(targetUnit)
        const arrowType: ArrowType = unit.assassinate && !battlefield[opponent].some(u => u.slot === unit.slot)
          ? 'assassinate'
          : 'normal'

        lines.push({
          id: `${unit.id}-primary`,
          from,
          to,
          type: arrowType,
          player,
          damage,
          lethal,
        })

        const hasCleave = (unit as any).specialEffects?.includes('cleave')
        if (hasCleave && targetUnit.slot !== undefined) {
          const adjacentSlots = [targetUnit.slot - 1, targetUnit.slot + 1].filter(s => s >= 1 && s <= 5)
          adjacentSlots.forEach(slot => {
            const adjUnit = battlefield[opponent].find(u => u.slot === slot)
            if (!adjUnit) return
            const adjKey = `${battlefieldId}-${opponent}-${slot}`
            const adjPoint = slotCenters[adjKey]
            if (!adjPoint) return
            const adjDamage = getAttackPower(unit)
            const adjLethal = adjDamage >= getUnitEffectiveHealth(adjUnit)
            lines.push({
              id: `${unit.id}-cleave-${slot}`,
              from,
              to: adjPoint,
              type: 'cleave',
              player,
              damage: adjDamage,
              lethal: adjLethal,
            })
          })
        }
      } else {
        const towerPoint = towerCenters[`${battlefieldId}-${opponent}`]
        if (!towerPoint) return []
        const damage = getAttackPower(unit)
        lines.push({
          id: `${unit.id}-tower`,
          from,
          to: towerPoint,
          type: 'tower',
          player,
          damage,
          lethal: false,
        })

        if (unit.crossStrike) {
          const otherBattlefieldId = battlefieldId === 'battlefieldA' ? 'battlefieldB' : 'battlefieldA'
          const otherBattlefield = gameState[otherBattlefieldId]
          const mirroredUnit = otherBattlefield[opponent].find(u => u.slot === unit.slot)
          const crossTarget = mirroredUnit?.slot
            ? slotCenters[`${otherBattlefieldId}-${opponent}-${mirroredUnit.slot}`]
            : towerCenters[`${otherBattlefieldId}-${opponent}`]
          if (crossTarget) {
            const crossDamage = unit.crossStrike
            const crossLethal = mirroredUnit ? crossDamage >= getUnitEffectiveHealth(mirroredUnit) : false
            lines.push({
              id: `${unit.id}-cross`,
              from,
              to: crossTarget,
              type: 'crossStrike',
              player,
              damage: crossDamage,
              lethal: crossLethal,
            })
          }
        }
      }

      return lines
    }

    const linesA = allUnits
      .filter(u => gameState.battlefieldA.player1.some(c => c.id === u.id) || gameState.battlefieldA.player2.some(c => c.id === u.id))
      .flatMap(u => buildLinesForUnit(u, 'battlefieldA'))

    const linesB = allUnits
      .filter(u => gameState.battlefieldB.player1.some(c => c.id === u.id) || gameState.battlefieldB.player2.some(c => c.id === u.id))
      .flatMap(u => buildLinesForUnit(u, 'battlefieldB'))

    return [...linesA, ...linesB]
  }, [gameState, hoveredUnitId, selectedUnitId, isPreviewActive, slotCenters, towerCenters])

  if (!isPreviewActive && !hoveredUnitId && !selectedUnitId) {
    return null
  }

  return (
    <div className={`combat-preview ${isPreviewActive ? 'combat-preview--active' : ''}`}>
      <svg className="combat-preview__svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#fff" />
          </marker>
        </defs>
        {lines.map(line => (
          <line
            key={line.id}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke={getArrowColor(line.type, line.player)}
            strokeWidth={line.type === 'normal' || line.type === 'tower' ? 3 : 2}
            strokeDasharray={line.type === 'crossStrike' ? '5,5' : line.type === 'tower' ? '6,4' : 'none'}
            markerEnd="url(#arrowhead)"
            opacity={isPreviewActive ? 0.85 : 0.6}
          />
        ))}
      </svg>
      {lines.map(line => (
        <div
          key={`${line.id}-label`}
          className={`combat-preview__label ${line.lethal ? 'combat-preview__label--lethal' : ''}`}
          style={{
            left: `${line.to.x + 6}px`,
            top: `${line.to.y - 10}px`,
          }}
        >
          -{line.damage}
          {line.lethal && <span className="combat-preview__skull">☠</span>}
        </div>
      ))}
    </div>
  )
}
