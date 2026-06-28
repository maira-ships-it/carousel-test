import chevronLeftCircle from '../icons/svgs/chevron-left-circle.svg'
import chevronRightCircle from '../icons/svgs/chevron-right-circle.svg'
import play from '../icons/svgs/play.svg'
import pause from '../icons/svgs/pause.svg'
import soundOn from '../icons/svgs/sound-on.svg'
import soundOff from '../icons/svgs/sound-off.svg'

const iconMap = {
  chevronLeftCircle,
  chevronRightCircle,
  play,
  pause,
  soundOn,
  soundOff,
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
