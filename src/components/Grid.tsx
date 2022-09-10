import { useRef, useState } from 'react'
import { FLIP_DURATION, OUTCOME_FLIP_BACK_DELAY, OUTCOME_SOUND_DELAY } from '../constants'
import { Card } from '../domain/Card'
import { CardType } from '../domain/CardType'
import { playMatchCorrectSound, playMatchIncorrectSound, playSelectSound } from '../SoundSystem'
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
      flippingBack: false
    }
    cards[i] = card
  }
  return cards
})

// TODO: DRY
function markCardsAsMatched(cards: Card[], key1: number, key2: number) {
  return cards.map(card => {
    if (card.key === key1 || card.key === key2) {
      return { ...card, matched: true }
    } else {
      return card
    }
  })
}

// TODO: DRY
function hideCards(cards: Card[], key1: number, key2: number) {
  return cards.map(card => {
    if (card.key === key1 || card.key === key2) {
      return { ...card, visible: false }
    } else {
      return card
    }
  })
}

// TODO: DRY
function setCardFlipping(flippingBack: boolean, cards: Card[], key1: number, key2: number) {
  return cards.map(card => {
    if (card.key === key1 || card.key === key2) {
      return { ...card, flippingBack }
    } else {
      return card
    }
  })
}

const Grid = () => {
  const [cards, setCards] = useState(cards1)
  const [otherCardKey, setOtherCardKey] = useState<number | null>(null)
  const [flipKey, setFlipKey] = useState<number>(-1)
  const flipCardHandler = (key: number) => {
    let cardsNext = cards.map(card => card)
    cardsNext = cardsNext.map(card => card.key === key ? { ...card, visible: true } : card)
    if (otherCardKey === null) {
      setOtherCardKey(key)
    } else {
      const cardA = cards[otherCardKey]
      const cardB = cards[key]
      if (cardA.cardType === cardB.cardType) {
        cardsNext = markCardsAsMatched(cardsNext, cardA.key, cardB.key)
        setTimeout(() => playMatchCorrectSound(), OUTCOME_SOUND_DELAY)
      } else {
        cardsNext = setCardFlipping(true, cardsNext, cardA.key, cardB.key)
        setTimeout(() => playMatchIncorrectSound(), OUTCOME_SOUND_DELAY)
        setTimeout(() => console.log('HIDE NOW', Date.now()), OUTCOME_FLIP_BACK_DELAY)
      }
      setOtherCardKey(null)
    }
    setCards(cardsNext)
    playSelectSound()
  }
  return (
    <div className="grid">
      <table>
        <tbody>
          <tr>
            {cards.slice(0, 6).map(card => (
              <td key={card.key}>
                <CardTile
                  card={card}
                  flipCardHandler={flipCardHandler} />
              </td>)
            )}
          </tr>
          <tr>
            {cards.slice(6, 12).map(card => (
              <td key={card.key}>
                <CardTile
                  card={card}
                  flipCardHandler={flipCardHandler} />
              </td>)
            )}
          </tr>
          <tr>
            {cards.slice(12, 18).map(card => (
              <td key={card.key}>
                <CardTile
                  card={card}
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
