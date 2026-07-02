import './CarouselPreview.css'
import {
  Carousel,
  CarouselItem,
  type CarouselItemT,
} from '../../themis/Carousel'

import { VideoPlayer } from '../../themis/VideoPlayer'

const carouselTitles = [
  'Whispers of Ipsum',
  'Forest of Lorem Ipsum',
  'Lorem Ipsum in the Wilderness',
  'The Ipsum Tide',
  'Echoes of Ipsum',
  'Golden Hour Motion',
  'Slow Light Study',
  'Stillwater Drift',
  'Daybreak Notes',
  'Signal in the Quiet',
  'Soft Focus Story',
  'Into the Haze',
  'Small Wonder',
  'Blue Hour Frames',
  'Last Light Archive',
]

const carouselItems: CarouselItemT[] = carouselTitles.map((title, index) => {
  const assetIndex = index + 1

  return {
    id: `carousel-video-${assetIndex}`,
    title,
    desktopSrc: `/assets/carousel/${assetIndex}-lg.mp4`,
    mobileSrc: `/assets/carousel/${assetIndex}-sm.mp4`,
  }
})

export function CarouselPreview() {
  return (
    <div className="app-shell">
      <Carousel
        title="A day in the life"
        cardWidth={300}
      >
        {
          carouselItems.map((item)=> (
            <CarouselItem
              key={item.id}
              render={({ isActive }) => (
                <article className="video-card">
                  <div className="video-card__media">
                    <VideoPlayer
                      src={item.desktopSrc}
                      mobileSrc={item.mobileSrc}
                      isPlayerActive={isActive}
                      label={item.title}
                    />
                  </div>

                  <p className="video-card__caption">{item.title}</p>
                </article>
              )}
            />
          ))
        }
      </Carousel>
    </div>
  )
}
