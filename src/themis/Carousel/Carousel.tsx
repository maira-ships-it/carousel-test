import React, {
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { Icon } from '../Icon'
import { RoundButton } from '../RoundButton'
import './Carousel.css'

export type CarouselItemT = {
  id: string
  title: string
  desktopSrc: string
  mobileSrc?: string
  stableKey?: string
}

type CarouselProps = {
  title: string,
  children: React.ReactNode,
  cardWidth: number,
}

// Minimum horizontal travel before a swipe/drag counts as navigation.
const SWIPE_THRESHOLD = 40

const CARD_GAP = 20

const OVER_SCAN = 2

const LEFT = -1
const RIGHT = 1
type NavigationDirection = -1 | 1


// Rotate the array by steps: positive moves items off the front and onto the
// back (left rotation), negative does the reverse. Keys move with their items.
const rotate = <T,>(items: T[], steps: number): T[] => {
  const length = items.length
  const offset = ((steps % length) + length) % length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

type CarouselItemRenderProp = (state: { isActive: boolean }) => React.ReactNode

type CarouselItemProps = {
  render: CarouselItemRenderProp
  // Injected by <Carousel>: whether this slide is the active (centered) one.
  isActive?: boolean
}

export const CarouselItem = ({ render, isActive = false }: CarouselItemProps) => (
  <>{render({ isActive })}</>
)

type CarouselItemElement = React.ReactElement<CarouselItemProps>

type CarouselItemWithStableKeyT = {
  item: CarouselItemElement
  stableKey: string
}

 // Builds a list of size 3N and assigns unique stable key to each item.
const buildPaddedList = (
  children: React.ReactNode,
): CarouselItemWithStableKeyT[] => {
  const base = React.Children.toArray(children).filter(
    React.isValidElement,
  ) as CarouselItemElement[]

  return [0, 1, 2].flatMap((copy) =>
    base.map((item, index) => ({
      item,
      stableKey: `${copy}:${item.key ?? index}`,
    })),
  )
}

export const Carousel = (props: CarouselProps) => {
  const { cardWidth } = props
  const step = cardWidth + CARD_GAP

  // The full 3N list lives in state and is rotated as a whole, so each slot's
  // baked key travels with its content across a recenter.
  const [paddedList, setPaddedList] = useState(() =>
    buildPaddedList(props.children),
  )

  // Gets original items length N
  const N = paddedList.length / 3 

  // Starts at N, and adjusts at transition end to stay at N so there are N cards behind and ahead.
  const [activeIndex, setActiveIndex] = useState(N)

  const [isAnimating, setIsAnimating] = useState(false)

  const isPointerDownRef = useRef(false)
  // Pointer x captured at pointerdown; the gesture's origin, used to measure
  // how far the pointer has travelled horizontally.
  const xAtPointerDownRef = useRef(0)
  const isCurrentlyNavigatingRef = useRef(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)

  // Responsible to keep the total available width of carousel component in sync on window resize.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const measure = () => setViewportWidth(viewport.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  if (N === 0) {
    return null
  }

  // Only renders the media elements that can be visible on the screen,
  // plus 2 additional elements on each side (covers the one-step drift
  // and any partially-visible card) from the paddedList.
  // The full 3N padded list stays unmounted.

  // However, if the items can fit in the viewport there's nothing to loop
  // through: skip the padding/rotation and just render the original N items.
  const allItemsWidth = N * cardWidth + (N - 1) * CARD_GAP
  const fitsAll = viewportWidth > 0 && allItemsWidth <= viewportWidth

  // Mount only the cards that can be visible (plus overscan) from the 3N list.
  // In fits-all mode we render the N originals as-is with no offset.
  const visibleCount = Math.ceil(viewportWidth / step)
  const windowStart = fitsAll ? 0 : Math.max(0, N - OVER_SCAN)
  const windowEnd = fitsAll
    ? N
    : Math.min(paddedList.length, N + visibleCount + OVER_SCAN)
  const windowItems = paddedList.slice(windowStart, windowEnd)

  // True when a drag is too small to count as an intentional swipe.
  const isUnintentionalTouch = (xDifference: number) =>
    Math.abs(xDifference) < SWIPE_THRESHOLD

  // Slide one card in the given direction. The activeIndex is allowed to drift past the
  // N here, the transition-end handler rotates the array and auto corrects
  // the active index back to N.
  const navigate = (direction: NavigationDirection) => {
    if (fitsAll) return

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

    setPaddedList((current) => rotate(current, steps))
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
    <section
      className="carousel"
      aria-label={props.title}
    >
      <div className="carousel__header">
        <h1 className="carousel__title">{props.title}</h1>

        {!fitsAll && (
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
        )}
      </div>

      <div
        ref={viewportRef}
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
            gap: CARD_GAP,
            transform: fitsAll ? 'none' : `translateX(${-(activeIndex - windowStart) * step}px)`,
          }}
        >
          {windowItems.map(({ item, stableKey }, i) => {
            const index = windowStart + i
            const isActive = (fitsAll) || index === activeIndex

            return (
              <li
                key={stableKey}
                className={`carousel__card${isActive ? ' is-active' : ''}`}
                aria-current={isActive}
              >
                {React.cloneElement(item, { isActive })}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
