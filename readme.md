# Readme

A small React + Vite app built around an infinite, looping media carousel. The demo (`CarouselPreview`) fills it with a handful of video clips — but the carousel itself doesn't care what you put in it.

## Running it

You'll need Node and npm. Then:

```bash
npm install
npm run dev
```

Vite will print a local URL (usually http://localhost:5173) — open that.

## How the carousel works

The carousel lives in `src/themis/Carousel`. It's content-agnostic: it lays out and animates whatever you hand it and tells each item whether it's the active (centered) one. The demo happens to use videos, but nothing in the carousel knows about video.

A few ideas make it tick:

**Stable identity.** Every slot carries a fixed key that travels with it as the list rotates, so React *moves* the existing DOM nodes rather than recreating them in the DOM.

**It measures itself.** You pass in the `cardWidth`; the component measures its own viewport to work out how far to slide and how many cards fit. If the whole set already fits at once, it drops the looping entirely and just shows everything.

**Infinite scrolling.** Internally it keeps a logical list three times the length of your items (`3N`) and parks the active index in the middle. Each step slides the track by one card; when the slide finishes, it rotates the list by one and snaps the active index back to center — with the transition switched off so that reset is invisible. The upshot is you can page forward or backward forever without ever hitting an edge.

**DOM only contains elements that the user can see.** Even though the logical list is `3N`, only the cards that can actually be on screen (plus a little overscan on each side) get rendered to the DOM. So the number of `<video>` elements in the DOM stay small no matter how long your list is. This is especially great for mobile screens when performance is a bottleneck.

For how to actually use it in your own code, see the component's readme: [`src/themis/Carousel/README.md`](src/themis/Carousel/README.md).

## Wish list
- More accessible navigation by making the components respect device's "Reduce Motion" settings to avoid animations when user has configured their device to see less animations. I could have respected this by having device specific settings and make "transform: none" whenever possible.
- I could have triggered navigating to right/left as user swipes on trackpad (i.e. two finger swipe on MAC trackpad) or on mouse wheel movement. Currently the navigation only works with either the visual button components, or through pointer events, basically supporting touch screen devices.
- I would rewrite the logic in the component to not even have 3N logical array and somehow work with only N array items. But I couldnt spend much time here.
- I could have created more generic css classes or styling components to arange UI elements in a component. Instead of relying on seperate inline css classes on each component that controls the positioning of the elements in a component.
- I did not setup universal linter through out the project (guilty)
- In a prod app media files (.mp4) should be hosted on a CDN, but I kept them in the repo.
  
## Choice of vite
- Lean + Fast
- https://react.dev/learn/build-a-react-app-from-scratch#vite
