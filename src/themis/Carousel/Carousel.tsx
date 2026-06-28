import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { RoundButton } from '../RoundButton'
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

export function Carousel({ title, items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const activeCard = cardRefs.current[activeIndex]

    activeCard?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }, [activeIndex])

  if (items.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? items.length - 1 : currentIndex - 1,
    )
  }

  const goToNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === items.length - 1 ? 0 : currentIndex + 1,
    )
  }

  return (
    <section className="carousel" aria-label={title}>
      <div className="carousel__header">
        <h1 className="carousel__title">{title}</h1>

        <div className="carousel__controls" aria-label="Carousel navigation">
          <RoundButton
            ariaLabel="Show previous video"
            onClick={goToPrevious}
          >
            <Icon name="chevronLeftCircle" className="round-button__icon" />
          </RoundButton>
          <RoundButton
            ariaLabel="Show next video"
            onClick={goToNext}
          >
            <Icon name="chevronRightCircle" className="round-button__icon" />
          </RoundButton>
        </div>
      </div>

      <div className="carousel__viewport">
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
                    <video
                      className="carousel__video"
                      playsInline
                      muted
                      loop
                      preload="metadata"
                      controls={isActive}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {item.mobileSrc ? (
                        <source
                          src={item.mobileSrc}
                          media="(max-width: 767px)"
                          type="video/mp4"
                        />
                      ) : null}
                      <source src={item.desktopSrc} type="video/mp4" />
                    </video>
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
