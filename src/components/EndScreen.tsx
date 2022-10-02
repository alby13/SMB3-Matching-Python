import React, { useEffect, useRef, useState } from 'react'
import { END_REVEAL_BEST_DELAY, END_REVEAL_MOVES_DELAY, END_REVEAL_MUSIC_DELAY, END_REVEAL_TIME_DELAY } from '../constants'
import { Puzzle } from '../domain/Puzzle'
import { submitScore } from '../high-scores'
import { playClearSound, stopClearSound } from '../sound-system'

type Props = {
  puzzle: Puzzle
  visible: boolean
  onContinue: () => void
}

const EndScreen: React.FC<Props> = ({ puzzle, visible, onContinue }) => {
  const didMount = useRef(false)
  const [animationClass, setAnimationClass] = useState('')
  // These are "any" because React typing doesn't recognize strings for visibility (?)
  const [movesVisibility, setMovesVisibility] = useState<any>('hidden')
  const [timeVisibility, setTimeVisibility] = useState<any>('hidden')
  const [bestVisibility, setBestVisibility] = useState<any>('hidden')
  const [bestMoves, setBestMoves] = useState('TBD')
  const [bestTime, setBestTime] = useState('TBD')
  const visibleRef = useRef(visible)
  useEffect(() => {
    visibleRef.current = visible
    if (visible) {
      setAnimationClass('end-frame-reveal')
      setTimeout(() => playClearSound(), END_REVEAL_MUSIC_DELAY)
      // Read these timeouts as "if the EndScreen is still visible when the timeout occurs, then it is safe to set it element to visible"
      // This is ok because the timeout is shorter than the amount of time it takes for a user to get from one EndScreen to another EndScreen
      setTimeout(() => {
        if (visibleRef.current) {
          setMovesVisibility('visible')
        }
      }, END_REVEAL_MOVES_DELAY)
      setTimeout(() => {
        if (visibleRef.current) {
          setTimeVisibility('visible')
        }
      }, END_REVEAL_TIME_DELAY)
      setTimeout(() => {
        if (visibleRef.current) {
          setBestVisibility('visible')
        }
      }, END_REVEAL_BEST_DELAY)
    } else {
      setAnimationClass('')
      setMovesVisibility('hidden')
      setTimeVisibility('hidden')
      setBestVisibility('hidden')
    }
  }, [visible])
  const secondsElapsed = Math.floor((puzzle.endTime - puzzle.startTime) / 1000)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return // Do not run on first run
    }
    if (puzzle.startTime > 0) { // Hack to prevent storing zero as the best scores when the next pattern is loaded
      setTimeout(() => { // Async to prevent unhandleable exception if user has storage turned off
        submitScore(puzzle.pattern.name, puzzle.moves, secondsElapsed, (recordedBestMoves, recordedBestTime) => {
          setBestMoves(`${recordedBestMoves}`)
          setBestTime(`${recordedBestTime}`)
        })
      }, 1)
    }
  }, [puzzle.endTime])
  if (!visible) return null
  const handleOnClick = () => {
    stopClearSound()
    onContinue()
  }
  return (
    <div className={`end-screen ${animationClass}`}>
      <div className="end-screen-header">
        pattern
        <span
          style={{
            marginLeft: '6px',
            marginRight: '6px',
            color: puzzle.pattern.cardBackgroundColor
          }}
        >
          {puzzle.pattern.name}
        </span>
        of
        <span
          style={{
            marginLeft: '6px',
            marginRight: '6px',
            color: puzzle.pattern.cardBackgroundColor
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
              <td style={{ visibility: movesVisibility }}>moves</td>
              <td style={{ visibility: movesVisibility }}>{puzzle.moves}</td>
              <td style={{
                visibility: bestVisibility,
                color: puzzle.pattern.cardBackgroundColor
              }}>
                {bestMoves}
              </td>
            </tr>
            <tr>
              <td style={{ visibility: timeVisibility }}>time</td>
              <td style={{ visibility: timeVisibility }}>{secondsElapsed}</td>

              <td style={{
                visibility: bestVisibility,
                color: puzzle.pattern.cardBackgroundColor
              }}>
                {bestTime}
              </td>
            </tr>
          </tbody>
        </table>
        <button className="list-button" onClick={handleOnClick}>
          continue
        </button>
      </div>
    </div>
  )
}

export default EndScreen
