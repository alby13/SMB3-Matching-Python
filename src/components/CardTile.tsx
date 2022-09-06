import { Card } from '../domain/Card'
import cardsUrl from '../assets/cards.png'
import { useState } from 'react'
import { CardType } from '../domain/CardType'

type Props = {
  card: Card
  flipCardHandler: (card: Card) => boolean
}

const CardTile: React.FC<Props> = ({ card, flipCardHandler }) => {
  const [objectPosition, setObjectPosition] = useState('0 0')
  const clickHandler = () => {
    if (!card.matched) {
      if (flipCardHandler(card)) {
        setObjectPosition('-128px 0')
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
