import React from 'react'

type Props = {
  visible: boolean
}

const CreditsScreen: React.FC<Props> = ({ visible }) => {
  if (!visible) return null
  return (
    <div>
      TODO:
        - Thanks for playing
        - Link to GitHub repo
        - "Play Again" button
        - "Reset Scores" button
        - Animated background and link for https://en.wikipedia.org/wiki/Super_Mario_Clouds
        - "Falling" music loop X times, fade out via web audio?
    </div>
  )
}

export default CreditsScreen
