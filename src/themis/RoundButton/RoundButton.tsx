import type { ReactNode } from 'react'
import './RoundButton.css'

type RoundButtonProps = {
  ariaLabel: string
  children: ReactNode
  onClick: () => void
}

export function RoundButton({
  ariaLabel,
  children,
  onClick,
}: RoundButtonProps) {
  return (
    <button
      type="button"
      className="round-button"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
