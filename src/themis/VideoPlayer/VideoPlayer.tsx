import { useEffect, useRef, type KeyboardEvent } from 'react'
import { VideoPlayerControls } from './VideoPlayerControls'
import './VideoPlayer.css'

// Keyboard shortcuts for interacting with media player.
const PLAY_TOGGLE_INPUT_KEYS = [' ', 'p']
const MUTE_TOGGLE_INPUT_KEYS = ['m']

export type VideoPlayerProps = {
  src: string
  /** Optional source served for smaller screen sizes. */
  mobileSrc?: string
  /**
   * When false the player is inert, and not active. It just shows thumbnail and is paused and controls are
   * hidden and is not part of the tab order.
   */
  isPlayerActive?: boolean
  /** Accessible label for the video. */
  label?: string
  /** Loop playback. Defaults to true. */
  loop?: boolean
}

export function VideoPlayer({
  src,
  mobileSrc,
  isPlayerActive = true,
  label,
  loop = true
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // This is responsible to autoplay video and does so on mute to not interrupt
  // the user.
  useEffect(() => {
    const video = videoRef.current as HTMLVideoElement

    if (isPlayerActive) {
      video.muted = true
      video.play()
    } else {
      video.pause()
      video.muted = true
    }
  }, [isPlayerActive])

  // Toggles play/pause method on video element.
  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video || !isPlayerActive) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  // Toggles mute/unmute on video element.
  const toggleMuteUnmute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
  }

  // For accessibility reads from keyDown event and fires related action on video element.
  const handleKeyDown = (event: KeyboardEvent<HTMLVideoElement>) => {
    if (!isPlayerActive) return

    if (PLAY_TOGGLE_INPUT_KEYS.includes(event.key)) {
      event.preventDefault()
      togglePlayPause()
    } else if (MUTE_TOGGLE_INPUT_KEYS.includes(event.key)) {
      event.preventDefault()
      toggleMuteUnmute()
    }
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        className="video-player__video"
        playsInline
        muted
        loop={loop}
        preload="metadata"
        tabIndex={isPlayerActive ? 0 : -1}
        aria-label={label}
        onClick={togglePlayPause}
        onKeyDown={handleKeyDown}
      >
        {mobileSrc ? (
          <source src={mobileSrc} media="(max-width: 640px)" type="video/mp4" />
        ) : null}
        <source src={src} type="video/mp4" />
      </video>

      {isPlayerActive ? (
        <VideoPlayerControls
          videoRef={videoRef}
          togglePlayPause={togglePlayPause}
          toggleMuteUnmute={toggleMuteUnmute}
        />
      ) : null}
    </div>
  )
}
