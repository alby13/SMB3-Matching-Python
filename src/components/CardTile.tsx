import React from 'react'
import { Card } from '../domain/Card'
import cardsUrl from '../assets/cards.png'
import { useEffect, useState } from 'react'
import { CardType } from '../domain/CardType'

type Props = {
  card: Card
  flipCardHandler: (card: Card) => boolean
}

enum TileState {
  Hidden,
  FlippingFront,
  FlippingBack,
  Showing
}

function animateFlipping(forward: boolean, card: Card, setObjectPosition: React.Dispatch<React.SetStateAction<string>>) {
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
      clearTimeout(tickId)
    }
  }
  tick()
  return () => {
    clearTimeout(tickId)
  }
}

const CardTile: React.FC<Props> = ({ card, flipCardHandler }) => {
  const [objectPosition, setObjectPosition] = useState('0 0')
  const [tileState, setTileState] = useState(TileState.Hidden)
  useEffect(() => {
    if (tileState === TileState.FlippingFront) {
      animateFlipping(true, card, setObjectPosition)
    }
  }, [tileState])
  const clickHandler = () => {
    if (!card.matched && tileState === TileState.Hidden) {
      if (flipCardHandler(card)) {
        setTileState(TileState.FlippingFront)
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
