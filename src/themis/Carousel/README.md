# Carousel

An infinite, looping carousel that works with any content. It owns the layout, the sliding animation, and the looping; you render each slide and it tells you which one is active.

See the [repo readme](../../../README.md) for a higher-level overview of how it's built.

## Usage

```tsx
import { Carousel, CarouselItem } from '../../themis/Carousel'

<Carousel title="A day in the life" cardWidth={300}>
  {items.map((item) => (
    <CarouselItem
      key={item.id}
      render={({ isActive }) => (
        <MyCard data={item} isActive={isActive} />
      )}
    />
  ))}
</Carousel>
```

## `Carousel` props

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | Heading shown above the track, and the carousel's accessible label. |
| `cardWidth` | `number` | Width of each card, in px. You are responsible for sizing your card content to match this — the carousel uses the number to work out how far to slide and how many cards fit. |
| `children` | `CarouselItem[]` | One `<CarouselItem>` per slide. |

## `CarouselItem`

`CarouselItem` takes a single `render` prop: a function that receives `{ isActive }` and returns the slide's content. `isActive` is `true` for the centered card — it's how the demo decides which video plays.

```tsx
<CarouselItem
  key={item.id}
  render={({ isActive }) => (
    <VideoPlayer src={item.src} isPlayerActive={isActive} />
  )}
/>
```

## Good to know
- **Size your card content to `cardWidth`.** This should be the width of a card/media wrapper in your carousel.
- **What happens if all items in the carousel fits the viewport?** When all the card/media items fits in the viewport at once, the carousel renders the items as-is, hides the navigation buttons, and skips any animation. In this mode isActive will always be true.
