import type { ReactNode } from 'react'
import './RoundButton.css'

type RoundButtonProps = {
  ariaLabel: string
  children: ReactNode
  onClick: () => void
  isDisabled?: boolean
}

export function RoundButton({
  ariaLabel,
  children,
  onClick,
  isDisabled = false,
}: RoundButtonProps) {
  return (
    <button
      type="button"
      className="round-button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
