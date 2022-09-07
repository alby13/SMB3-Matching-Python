import React from 'react'
import { Card } from '../domain/Card'
import cardsUrl from '../assets/cards.png'
import { useEffect, useState } from 'react'
import { CardType } from '../domain/CardType'

type Props = {
  card: Card
  flipCardHandler: (card: Card) => boolean
  checkMatch: (key: number) => void
}

function animateFlipping(
  forward: boolean,
  card: Card,
  setObjectPosition: React.Dispatch<React.SetStateAction<string>>,
  setFlipping: React.Dispatch<React.SetStateAction<boolean>>
) {
  let step = forward ? 0 : 2
  let tickId: number | undefined = undefined
  const tick = () => {
    switch (step) {
      case -1:
        setObjectPosition('0 0')
        break
      case 0:
        setObjectPosition('-32px 0')
        break
      case 1:
        setObjectPosition('-64px 0')
        break
      case 2:
        setObjectPosition('-96px 0')
        break
      case 3:
        switch (card.cardType) {
          case CardType.Mushroom:
            setObjectPosition('-64px -48px')
            break
          case CardType.Flower:
            setObjectPosition('-96px -48px')
            break
          case CardType.Coins10:
            setObjectPosition('0 -48px')
            break
          case CardType.Coins20:
            setObjectPosition('-32px -48px')
            break
          case CardType.Star:
            setObjectPosition('-128px -48px')
            break
          case CardType.OneUp:
            setObjectPosition('-128px 0')
            break
        }
        break
    }
    forward ? step++ : step--
    if (step >= -1 && step <= 3) {
      tickId = setTimeout(tick, 64)
    } else {
      setFlipping(false)
      clearTimeout(tickId)
    }
  }
  tick()
  return () => {
    clearTimeout(tickId)
  }
}

const CardTile: React.FC<Props> = ({ card, flipCardHandler, checkMatch }) => {
  const [objectPosition, setObjectPosition] = useState('0 0')
  const [flipping, setFlipping] = useState(false)
  useEffect(() => {
    if (flipping) {
      animateFlipping(card.visible, card, setObjectPosition, setFlipping)
    } else {
      if (card.visible) {
        checkMatch(card.key)
      }
    }
  }, [flipping])
  const clickHandler = () => {
    if (!card.visible && !flipping) {
      if (flipCardHandler(card)) {
        setFlipping(true)
        console.log('TODO: Something')
      }
    }
  }
  return (
    <div>
      <img
        draggable="false"
        className="card-tile"
        src={cardsUrl}
        onClick={clickHandler}
        style={{
          objectPosition
        }}
      />
    </div>
  )
}

export default CardTile
