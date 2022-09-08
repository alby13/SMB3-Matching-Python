import React, { useEffect, useRef, useState } from 'react'
import cardsUrl from '../assets/cards.png'
import selectorUrl from '../assets/selector.png'
import { OUTCOME_DELAY } from '../constants'
import { Card } from '../domain/Card'
import { playSelectSound } from '../SoundSystem'

type Props = {
  card: Card
  flipCardHandler: (card: Card) => void
  checkMatch: (cb: () => void) => void
}

const CardTile: React.FC<Props> = ({ card, flipCardHandler, checkMatch }) => {
  const [animationClass, setAnimationClass] = useState('card-tile-hidden')
  const [selected, setSelected] = useState(false)
  const flipping = useRef(false)
  useEffect(() => {
    if (card.visible) {
      flipping.current = true
      playSelectSound()
      setAnimationClass('card-tile-flip-forward')
    } else {
      flipping.current = true
      setAnimationClass('card-tile-flip-backward')
    }
  }, [card.visible])
  const clickHandler = () => {
    if (!card.visible && !flipping.current) {
      flipCardHandler(card)
    }
  }
  const animationEndHandler = () => {
    if (card.visible) {
      setAnimationClass(`card-tile-${card.cardType}`)
      setTimeout(() => {
        checkMatch(() => {
          flipping.current = false // Do this afterwards to prevent attempts to click on a card that is visible but mismatched
        })
      }, OUTCOME_DELAY)
    } else {
      setAnimationClass('card-tile-hidden')
      flipping.current = false
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
        src={cardsUrl}
        onAnimationEnd={animationEndHandler}
      />
    </div>
  )
}

export default CardTile
