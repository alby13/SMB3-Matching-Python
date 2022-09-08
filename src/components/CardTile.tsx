import React, { useEffect, useState } from 'react'
import cardsUrl from '../assets/cards.png'
import selectorUrl from '../assets/selector.png'
import { Card } from '../domain/Card'
import { playSelectSound } from '../SoundSystem'

type Props = {
  card: Card
  flipCardHandler: (card: Card) => boolean
  checkMatch: (key: number) => void
}

const CardTile: React.FC<Props> = ({ card, flipCardHandler, checkMatch }) => {
  const [animationClass, setAnimationClass] = useState('card-tile-hidden')
  const [selected, setSelected] = useState(false)
  const clickHandler = () => {
    if (!card.visible) {
      playSelectSound()
      if (flipCardHandler(card)) {
        console.log('TODO: Something')
      }
      setAnimationClass('card-tile-flip-forward')
    }
  }
  const animationEndHandler = () => {
    setAnimationClass(`card-tile-${card.cardType}`)
  }
  const mouseOverHandler = () => {
    setSelected(true)
  }
  const mouseOutHandler = () => {
    setSelected(false)
  }
  return (
    <div
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
      onClick={clickHandler}
    >
      <img
        src={selectorUrl}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          display: selected ? 'inline' : 'none'
        }}
      />
      <img
        draggable="false"
        className={`card-tile ${animationClass}`}
        src={cardsUrl}
        onAnimationEnd={animationEndHandler}
      />
    </div>
  )
}

export default CardTile
