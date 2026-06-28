import './CarouselPreview.css'
import {
  Carousel,
  type CarouselItem,
} from '../../themis/Carousel'

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

const carouselItems: CarouselItem[] = carouselTitles.map((title, index) => {
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
        items={carouselItems}
      />
    </div>
  )
}
