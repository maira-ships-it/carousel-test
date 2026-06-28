import chevronLeftCircle from '../icons/svgs/chevron-left-circle.svg'
import chevronRightCircle from '../icons/svgs/chevron-right-circle.svg'

const iconMap = {
  chevronLeftCircle,
  chevronRightCircle,
} as const

export type IconName = keyof typeof iconMap

type IconProps = {
  name: IconName
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const iconSrc = iconMap[name]
  const classes = ['icon', className].filter(Boolean).join(' ')

  return <img className={classes} src={iconSrc} alt="" aria-hidden="true" />
}
