import { useRef, useState, type PointerEvent } from 'react'
import { Icon } from '../Icon'
import { RoundButton } from '../RoundButton'
import { VideoPlayer } from '../VideoPlayer'
import './Carousel.css'

export type CarouselItem = {
  id: string
  title: string
  desktopSrc: string
  mobileSrc?: string
  stableKey?: string
}

type CarouselProps = {
  title: string
  items: CarouselItem[]
}

// Minimum horizontal travel before a swipe/drag counts as navigation.
const SWIPE_THRESHOLD = 40

// Card width (px) plus the inter-card gap (px); the distance the track shifts
// per active index. Keep in sync with .carousel__card width / .carousel__track
// gap in Carousel.css.
const CARD_WIDTH = 300
const CARD_GAP = 20
const CARD_STEP = CARD_WIDTH + CARD_GAP

const LEFT = -1
const RIGHT = 1
type NavigationDirection = -1 | 1


const buildWithStableKey = (items: CarouselItem[]): CarouselItem[] =>
  [...items, ...items, ...items].map((item, index) => ({
    ...item,
    stableKey: item.stableKey || String(index)
  }))

// Rotate the array by steps: positive moves items off the front and onto the
// back (left rotation), negative does the reverse. Keys move with their items.
const rotate = (items: CarouselItem[], steps: number): CarouselItem[] => {
  const length = items.length
  const offset = ((steps % length) + length) % length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

export function Carousel(props: CarouselProps) {
  const N = props.items.length

  const [items, setItems] = useState<CarouselItem[]>(() => buildWithStableKey(props.items))
  // Starts at N, and adjusts at transition end to stay at N so there are N cards behind and ahead.
  const [activeIndex, setActiveIndex] = useState(N)

  const [isAnimating, setIsAnimating] = useState(false)

  const isPointerDownRef = useRef(false)
  // Pointer x captured at pointerdown; the gesture's origin, used to measure
  // how far the pointer has travelled horizontally.
  const xAtPointerDownRef = useRef(0)
  const isCurrentlyNavigatingRef = useRef(false)

  if (N === 0) {
    return null
  }

  // True when a drag is too small to count as an intentional swipe.
  const isUnintentionalTouch = (xDifference: number) =>
    Math.abs(xDifference) < SWIPE_THRESHOLD

  // Slide one card in the given direction. The activeIndex is allowed to drift past the
  // N here, the transition-end handler rotates the array and auto corrects
  // the active index back to N.
  const navigate = (direction: NavigationDirection) => {
    setIsAnimating(true)
    setActiveIndex((current) => current + direction)
  }

  // After the slide finishes, rotate an item from the start of the array to the end
  // or from end to the start by the rotate method. This is to never run out of videos.
  // Bring active index back to N to not go out of index.
  const handleTransitionEnd = () => {
    // In practice we would always move 1 step as we disable buttons when animating.
    const steps = activeIndex - N
    if (steps === 0) return

    setItems((current) => rotate(current, steps))
    setActiveIndex(N)
    setIsAnimating(false)
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
    <section className="carousel" aria-label={props.title}>
      <div className="carousel__header">
        <h1 className="carousel__title">{props.title}</h1>

        <div className="carousel__controls" aria-label="Carousel navigation">
          <RoundButton
            isDisabled={isAnimating}
            ariaLabel="Show previous video"
            onClick={() => navigate(LEFT)}
          >
            <Icon name="chevronLeftCircle" className="round-button__icon" />
          </RoundButton>
          <RoundButton
            isDisabled={isAnimating}
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
        <ol
          className={`carousel__track${isAnimating ? ' is-animating' : ''}`}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${-activeIndex * CARD_STEP}px)`,
          }}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex

            return (
              <li
                key={item.stableKey}
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
