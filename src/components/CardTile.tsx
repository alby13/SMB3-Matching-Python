import React, { useEffect, useRef, useState } from 'react'
import cardsUrl from '../assets/cards.png'
import selectorUrl from '../assets/selector.png'
import { FLIP_DURATION } from '../constants'
import { Card } from '../domain/Card'

type Props = {
  card: Card
  flipCardHandler: (key: number) => void
}

const CardTile: React.FC<Props> = ({ card, flipCardHandler  }) => {
  const didMount = useRef(false)
  const [animationClass, setAnimationClass] = useState('card-tile-hidden')
  const [selected, setSelected] = useState(false)
  useEffect(() => {
    // Prevent the flip back animation from running on initial render
    if (!didMount.current) {
      didMount.current = true
      return
    }
    if (card.visible) {
      setAnimationClass('card-tile-flip-forward')
      setTimeout(() => setAnimationClass(`card-tile-${card.cardType}`), FLIP_DURATION)
    } else {
      setAnimationClass('card-tile-flip-backward')
      setTimeout(() => setAnimationClass('card-tile-hidden'), FLIP_DURATION)
    }
  }, [card.visible])
  const clickHandler = () => {
    if (!card.visible && !card.flippingBack) {
      flipCardHandler(card.key)
    }
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
        style={{ backgroundColor: card.backgroundColor }}
        src={cardsUrl}
      />
    </div>
  )
}

export default CardTile
