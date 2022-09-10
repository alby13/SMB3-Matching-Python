import { useState } from 'react'
import { Card } from '../domain/Card'
import { CardType } from '../domain/CardType'
import CardTile from './CardTile'

const patterns = [
  [
    CardType.Mushroom, CardType.Flower, CardType.Coins20, CardType.Mushroom, CardType.Coins10, CardType.Star,
    CardType.Flower, CardType.OneUp, CardType.Mushroom, CardType.Coins10, CardType.OneUp, CardType.Coins20,
    CardType.Star, CardType.Flower, CardType.Star, CardType.Mushroom, CardType.Flower, CardType.Star
  ]
]

const cards1 = (() => {
  const cards = []
  for (let i = 0; i < patterns[0].length; i++) {
    const card: Card = {
      key: i,
      cardType: patterns[0][i],
      visible: false,
      matched: false,
      flipping: false
    }
    cards[i] = card
  }
  return cards
})

const Grid = () => {
  const [cards, setCards] = useState(cards1)
  const [activePair, setActivePair] = useState<Array<number | null>>([null, null])
  const flipCardHandler = (key: number) => {
    let cardsNext = cards.map(card => card.key === key ? { ...card, visible: true } : card)
    setCards(cardsNext)
  }
  return (
    <div className="grid">
      <table>
        <tbody>
          <tr>
            {cards.slice(0, 6).map(card => (
              <td key={card.key}>
                <CardTile card={card}
                          flipCardHandler={flipCardHandler} />
              </td>)
            )}
          </tr>
          <tr>
            {cards.slice(6, 12).map(card => (
              <td key={card.key}>
                <CardTile card={card}
                          flipCardHandler={flipCardHandler} />
              </td>)
            )}
          </tr>
          <tr>
            {cards.slice(12, 18).map(card => (
              <td key={card.key}>
                <CardTile card={card}
                          flipCardHandler={flipCardHandler} />
              </td>)
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Grid
