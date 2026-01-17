import { ReactNode } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="tooltip">
      {children}
      <span className="tooltip__content">{text}</span>
    </span>
  )
}
