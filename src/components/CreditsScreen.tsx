import React from 'react'

type Props = {
  visible: boolean
}

const CreditsScreen: React.FC<Props> = ({ visible }) => {
  if (!visible) return null
  return (
    <div>
      TODO: Credits
    </div>
  )
}

export default CreditsScreen
