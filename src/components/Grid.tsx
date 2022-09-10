import { useEffect, useState } from 'react'
import { OUTCOME_FLIP_BACK_DELAY, OUTCOME_SOUND_DELAY } from '../constants'
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
  return cards.map(card => (card.key === key1 || card.key === key2) ? { ...card, matched: true } : card)
}

// TODO: DRY
function hideCards(cards: Card[], key1: number, key2: number) {
  return cards.map(card => (card.key === key1 || card.key === key2) ? { ...card, visible: false }: card)
}

// TODO: DRY
/**
 * Call this to prevent clicks while a card is flipping back.
 * Should be called:
 *    1) Before setTimeout()
 *    2) During the timeout's callback
 */
function setCardFlipping(flippingBack: boolean, cards: Card[], key1: number, key2: number) {
  return cards.map(card => (card.key === key1 || card.key === key2) ? { ...card, flippingBack } : card)
}

const Grid = () => {
  const [cards, setCards] = useState(cards1)
  const [otherCardKey, setOtherCardKey] = useState<number | null>(null)
  const [pairToHide, setPairToHide] = useState<[number | null, number | null]>([null, null])
  // Have to do this here so that the setTimeout() callback can get the latest cards array
  useEffect(() => {
    if (pairToHide[0] === null || pairToHide[1] === null) {
      return
    }
    let cardsNext = cards.slice()
    cardsNext = hideCards(cards, pairToHide[0], pairToHide[1])
    cardsNext = setCardFlipping(false, cardsNext, pairToHide[0], pairToHide[1])
    setCards(cardsNext)
  }, [pairToHide])
  const flipCardHandler = (key: number) => {
    let cardsNext = cards.slice()
    cardsNext = cardsNext.map(card => card.key === key ? { ...card, visible: true } : card)
    if (otherCardKey === null) {
      setOtherCardKey(key)
    } else {
      const cardA = cards[otherCardKey]
      const cardB = cards[key]
      if (cardA.cardType === cardB.cardType) {
        cardsNext = markCardsAsMatched(cardsNext, cardA.key, cardB.key)
        setTimeout(() => playMatchCorrectSound(cardA.cardType), OUTCOME_SOUND_DELAY)
      } else {
        cardsNext = setCardFlipping(true, cardsNext, cardA.key, cardB.key)
        setTimeout(() => playMatchIncorrectSound(), OUTCOME_SOUND_DELAY)
        setTimeout(() => setPairToHide([cardA.key, cardB.key]), OUTCOME_FLIP_BACK_DELAY)
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
