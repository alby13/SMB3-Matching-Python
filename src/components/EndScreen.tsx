import React, { useEffect, useRef, useState } from 'react'
import { END_REVEAL_BEST_DELAY, END_REVEAL_MUSIC_DELAY } from '../constants'
import { Puzzle } from '../domain/Puzzle'
import { playClearSound, stopClearSound } from '../SoundSystem'

type Props = {
  puzzle: Puzzle
  visible: boolean
  onContinue: () => void
}

const EndScreen: React.FC<Props> = ({ puzzle, visible, onContinue }) => {
  const [animationClass, setAnimationClass] = useState('')
  const [bestVisibility, setBestVisibility] = useState<any>('hidden') // "any" because React typing doesn't recognize the string
  const visibleRef = useRef(visible)
  useEffect(() => {
    visibleRef.current = visible
    if (visible) {
      setAnimationClass('end-frame-reveal')
      setTimeout(() => playClearSound(), END_REVEAL_MUSIC_DELAY)
      // TODO: setTimeout() for showing num of moves
      // TODO: setTimeout() for showing amt of time
      setTimeout(() => {
        // Read this as "if the EndScreen is still visible when the timeout occurs, then it is safe to set it to visible"
        // This is ok because it the timeout is shorter than the amount of time it takes for a user to get from one EndScreen to another EndScreen
        if (visibleRef.current) {
          setBestVisibility('visible')
        }
      }, END_REVEAL_BEST_DELAY)
    } else {
      setAnimationClass('')
      setBestVisibility('hidden')
    }
  }, [visible])
  if (!visible) return null
  const handleOnClick = () => {
    stopClearSound()
    onContinue()
  }
  const secondsElapsed = Math.floor((puzzle.endTime - puzzle.startTime) / 1000)
  return (
    <div className={`end-screen ${animationClass}`}>
      <div className="end-screen-header">
        pattern
        <span
          style={{
            marginLeft: '6px',
            marginRight: '6px',
            color: puzzle.pattern.cardBackgroundColor,
            textShadow: '-1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff'
          }}
        >
          {puzzle.pattern.name}
        </span>
        of
        <span
          style={{
            marginLeft: '6px',
            marginRight: '6px',
            color: puzzle.pattern.cardBackgroundColor,
            textShadow: '-1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff'
          }}
        >
          8
        </span>
      </div>
      <div className="end-screen-detail">
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th style={{ visibility: bestVisibility }}>best</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>moves</td>
              <td>{puzzle.moves}</td>
              <td style={{ visibility: bestVisibility }}>TBD</td>
            </tr>
            <tr>
              <td>time</td>
              <td>{secondsElapsed}</td>
              <td style={{ visibility: bestVisibility }}>TBD</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={handleOnClick}
          style={{
            color: '#3fbfff',
            fontFamily: 'inherit',
            fontSize: '1em',
            marginTop: '11px'
          }}
        >
          continue
        </button>
      </div>
    </div>
  )
}

export default EndScreen
