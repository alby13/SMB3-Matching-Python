import React, { useEffect } from 'react'
import { playGameOverSound } from '../sound-system'

type Props = {
  visible: boolean
}

const CreditsScreen: React.FC<Props> = ({ visible }) => {
  useEffect(() => {
    if (visible) {
      playGameOverSound()
    }
  }, [visible])
  if (!visible) return null
  const handleOnClickPlayAgain = () => {
  }
  const handleOnClickResetScores = () => {
  }
  return (
    <div className="credits-screen">
      <div className="credits-screen-section">
        <p>game over</p>
        <p>thanks for playing</p>
      </div>
      <div className="credits-screen-section">
        <button className="list-button" onClick={handleOnClickPlayAgain}>
          play again
        </button>
      </div>
      <div className="credits-screen-section credits-screen-actions">
        <div>
          <button className="list-button" onClick={handleOnClickResetScores}>
            reset scores
          </button>
        </div>
        <div>
          <button className="list-button" onClick={handleOnClickResetScores}>
            view on github&#x2197;
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreditsScreen
