import React, { useEffect } from 'react'
import { playGameOverSound } from '../sound-system'

type Props = {
  visible: boolean
}

const CreditsScreen: React.FC<Props> = ({ visible }) => {
  if (!visible) return null
  useEffect(() => {
    if (visible) {
      playGameOverSound()
    }
  }, [visible])
  const handleOnClickPlayAgain = () => {
  }
  const handleOnClickResetScores = () => {
  }
  return (
    <div className="credits-screen">
      <p>game over<br />thanks for playing</p>
        <button className="list-button" onClick={handleOnClickPlayAgain}>
          play again
        </button>
        <button className="list-button" onClick={handleOnClickResetScores}>
          view on github&#x2197;
        </button>
        <button className="list-button" onClick={handleOnClickResetScores}>
          reset scores
        </button>
    </div>
  )
}

export default CreditsScreen
