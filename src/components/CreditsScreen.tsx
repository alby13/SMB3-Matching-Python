import React, { useEffect, useState } from 'react'
import { resetScores } from '../high-scores'
import { playGameOverSound, stopGameOverSound } from '../sound-system'

type Props = {
  visible: boolean
  onPlayAgain: () => void
}

const CreditsScreen: React.FC<Props> = ({ visible, onPlayAgain }) => {
  const [scoresWereReset, setScoresWereReset] = useState(false)
  useEffect(() => {
    setScoresWereReset(false)
    if (visible) {
      playGameOverSound()
    }
  }, [visible])
  if (!visible) return null
  const handleOnClickPlayAgain = () => {
    stopGameOverSound()
    onPlayAgain()
  }
  const handleOnClickResetScores = () => {
    const handler = setTimeout(() => {
      resetScores()
      setScoresWereReset(true)
    }, 1)
    return () => {
      clearTimeout(handler)
    }
  }
  return (
    <div className="credits-screen">
      <div className="credits-screen-section">
        <p>game over</p>
        <p>thanks for playing</p>
      </div>
      <div className="credits-screen-section">
        <button
          className="list-button"
          onClick={handleOnClickPlayAgain}
        >
          play again
        </button>
      </div>
      <div className="credits-screen-section credits-screen-actions">
        <div>
          {scoresWereReset ? (
            <div>reset complete<span className="hidden-arrow">&#x2197;</span></div>
          ) : (
            <button className="list-button" onClick={handleOnClickResetScores}>
            reset scores
            </button>
          )}
        </div>
        <a
          className="list-link"
          target="_blank"
          href="https://github.com/hiddenwaffle/matching"
        >
          code @github&#x2197;
        </a>
      </div>
    </div>
  )
}

export default CreditsScreen
