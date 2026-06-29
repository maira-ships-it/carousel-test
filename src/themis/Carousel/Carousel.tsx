import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Icon } from '../Icon'
import { RoundButton } from '../RoundButton'
import { VideoPlayer } from '../VideoPlayer'
import './Carousel.css'

export type CarouselItem = {
  id: string
  title: string
  desktopSrc: string
  mobileSrc?: string
}

type CarouselProps = {
  title: string
  items: CarouselItem[]
}

// Minimum horizontal travel before a swipe/drag counts as navigation.
const SWIPE_THRESHOLD = 40

const LEFT = -1
const RIGHT = 1
type NavigationDirection = -1 | 1

export function Carousel({ title, items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef<Array<HTMLLIElement | null>>([])

  const isPointerDownRef = useRef(false)
  // Pointer x captured at pointerdown; the gesture's origin, used to measure
  // how far the pointer has travelled horizontally.
  const xAtPointerDownRef = useRef(0)
  const isCurrentlyNavigatingRef = useRef(false)

  // activeIndex is the single source of truth; scroll the active card into view
  // whenever it changes (works even though the viewport disables user scroll).
  useEffect(() => {
    cardRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }, [activeIndex])

  if (items.length === 0) {
    return null
  }

  // True when a drag is too small to count as an intentional swipe.
  const isUnintentionalTouch = (xDifference: number) =>
    Math.abs(xDifference) < SWIPE_THRESHOLD

  // Advance exactly one card.
  const navigate = (direction: NavigationDirection) => {
    setActiveIndex(
      (current) => (current + direction + items.length) % items.length,
    )
  }

  // Pointer events cover mouse, touch and pen with one code path, so dragging
  // works on desktop (click-drag) as well as touch devices.
  const startCurrentNavigation = (event: PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true
    isCurrentlyNavigatingRef.current = false
    xAtPointerDownRef.current = event.clientX
  }

  // Advance once when the drag first passes the horizontal threshold; the rest
  // of the gesture is ignored until the pointer is released.
  const handleNavigation = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || isCurrentlyNavigatingRef.current) return

    const xDifference = event.clientX - xAtPointerDownRef.current
    if (isUnintentionalTouch(xDifference)) return

    isCurrentlyNavigatingRef.current = true

    navigate(xDifference < 0 ? RIGHT : LEFT)
  }

  const endCurrentNavigation = () => {
    isPointerDownRef.current = false
    isCurrentlyNavigatingRef.current = false
  }

  return (
    <section className="carousel" aria-label={title}>
      <div className="carousel__header">
        <h1 className="carousel__title">{title}</h1>

        <div className="carousel__controls" aria-label="Carousel navigation">
          <RoundButton
            ariaLabel="Show previous video"
            onClick={() => navigate(LEFT)}
          >
            <Icon name="chevronLeftCircle" className="round-button__icon" />
          </RoundButton>
          <RoundButton
            ariaLabel="Show next video"
            onClick={() => navigate(RIGHT)}
          >
            <Icon name="chevronRightCircle" className="round-button__icon" />
          </RoundButton>
        </div>
      </div>

      <div
        className="carousel__viewport"
        onPointerDown={startCurrentNavigation}
        onPointerMove={handleNavigation}
        onPointerUp={endCurrentNavigation}
        onPointerCancel={endCurrentNavigation}
        onPointerLeave={endCurrentNavigation}
      >
        <ol className="carousel__track">
          {items.map((item, index) => {
            const isActive = index === activeIndex

            return (
              <li
                key={item.id}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                className={`carousel__card${isActive ? ' is-active' : ''}`}
                aria-current={isActive}
              >
                <article className="carousel__panel">
                  <div className="carousel__media-frame">
                    <VideoPlayer
                      src={item.desktopSrc}
                      mobileSrc={item.mobileSrc}
                      isPlayerActive={isActive}
                      label={item.title}
                    />
                  </div>

                  <p className="carousel__caption">{item.title}</p>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
