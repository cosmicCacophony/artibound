import { Tooltip } from './Tooltip'

type Keyword = 'crossStrike' | 'assassinate' | 'cleave' | 'barrier'

const KEYWORD_MAP: Record<Keyword, { label: string; icon: string; description: string }> = {
  crossStrike: {
    label: 'Cross-Strike',
    icon: '✣',
    description: 'If attacking an empty slot, strike the mirrored slot on the other battlefield.',
  },
  assassinate: {
    label: 'Assassinate',
    icon: '🗡️',
    description: 'If no unit in front, retargets the weakest enemy unit instead of the tower.',
  },
  cleave: {
    label: 'Cleave',
    icon: '///',
    description: 'Deals damage to adjacent enemies when attacking.',
  },
  barrier: {
    label: 'Barrier',
    icon: '🛡️',
    description: 'Immune to damage this turn.',
  },
}

interface KeywordBadgeProps {
  keyword: Keyword
}

export function KeywordBadge({ keyword }: KeywordBadgeProps) {
  const data = KEYWORD_MAP[keyword]
  return (
    <Tooltip text={`${data.label}: ${data.description}`}>
      <span className={`keyword-badge keyword-badge--${keyword}`} aria-label={data.label}>
        {data.icon}
      </span>
    </Tooltip>
  )
}
