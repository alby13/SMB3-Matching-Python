import { useEffect, useState } from 'react'
import musicUrl from '../assets/music.ogg'

const Controls = () => {
  const [waitingForMusicLoad, setWaitingForMusicLoad] = useState(true)
  const [music, setMusic] = useState<HTMLAudioElement>(new Audio(musicUrl))
  const [musicPlayingIndicator, setMusicPlayingIndicator] = useState(false)
  useEffect(() => {
    music.loop = true
    music.addEventListener('canplaythrough', () => {
      setWaitingForMusicLoad(false)
    })
    return () => {
      music.pause()
      setMusicPlayingIndicator(false)
    }
  }, [])
  const toggleMusic = () => {
    if (music.paused) {
      music.play()
      setMusicPlayingIndicator(true)
    } else {
      music.pause()
      setMusicPlayingIndicator(false)
    }
  }
  return (
    <div>
      Controls
      <button onClick={toggleMusic} disabled={waitingForMusicLoad}>
        {musicPlayingIndicator ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}

export default Controls
