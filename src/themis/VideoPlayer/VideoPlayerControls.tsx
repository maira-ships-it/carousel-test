import { useEffect, useState, type RefObject } from 'react'
import { Icon } from '../Icon'
import './VideoPlayerControls.css'

// Event listeners we read from.
const VIDEO_EVENT_LISTENERS = {
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  MUTED: 'volumechange'
}

export type VideoPlayerControlsProps = {
  /** Ref to the video element these controls drive. */
  videoRef: RefObject<HTMLVideoElement | null>
  /** Imperative play/pause toggle owned by the VideoPlayer. */
  togglePlayPause: () => void
  /** Imperative mute/unmute toggle owned by the VideoPlayer. */
  toggleMuteUnmute: () => void
}

export function VideoPlayerControls({
  videoRef,
  togglePlayPause,
  toggleMuteUnmute
}: VideoPlayerControlsProps) {
  // isPlaying and isMuted determine which button icons to show.
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Video element acts as the source of truth for actual player state, so its important
  // to read directly from it to update the local state for the button/icons.
  // Sets up event listeners to read from the video element and sync local state with it.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const syncMuteState = () => setIsMuted(video.muted || video.volume === 0)
    const syncPlayState = () => setIsPlaying(!video.paused)

    video.addEventListener(VIDEO_EVENT_LISTENERS.PLAY, syncPlayState)
    video.addEventListener(VIDEO_EVENT_LISTENERS.PAUSE, syncPlayState)
    video.addEventListener(VIDEO_EVENT_LISTENERS.ENDED, syncPlayState)
    video.addEventListener(VIDEO_EVENT_LISTENERS.MUTED, syncMuteState)

    // Its important to sync with current state of the video element.
    // So we fire these callbacks once onMount.
    syncPlayState()
    syncMuteState()

    return () => {
      video.removeEventListener(VIDEO_EVENT_LISTENERS.PLAY, syncPlayState)
      video.removeEventListener(VIDEO_EVENT_LISTENERS.PAUSE, syncPlayState)
      video.removeEventListener(VIDEO_EVENT_LISTENERS.ENDED, syncPlayState)
      video.removeEventListener(VIDEO_EVENT_LISTENERS.MUTED, syncMuteState)
    }
  }, [videoRef])

  return (
    <div className="video-player__controls">
      <button
        type="button"
        className="video-player__control"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        aria-pressed={isMuted}
        onClick={toggleMuteUnmute}
      >
        <Icon
          name={isMuted ? 'soundOff' : 'soundOn'}
          className="video-player__icon"
        />
      </button>

      <button
        type="button"
        className="video-player__control"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlayPause}
      >
        <Icon
          name={isPlaying ? 'pause' : 'play'}
          className="video-player__icon"
        />
      </button>
    </div>
  )
}
