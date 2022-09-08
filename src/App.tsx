import { useEffect, useState } from 'react'
import Grid from './components/Grid'
import { Card } from './domain/Card'
import { CardType } from './domain/CardType'
import stripesUrl from './assets/stripes.png'
import { playCoinSound, playMatchCorrectSound, playMatchIncorrectSound, playOneUpSound } from './SoundSystem'
import { FLIP_BACK_DELAY } from './constants'

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
      matched: false
    }
    cards[i] = card
  }
  return cards
})

function calculateScale(width: number, height: number): number {
  const ratio = (width || 1) / (height || 1)
  // Black area is 224x176, so 224/176 = 1.2727272727... WxH ratio
  // TODO: 800/629 (1.2718600954) to 800/658 (1.2158054711) border is completely gone
  if (ratio < 1.2727272727) {
    return width / 214 // 224-10, prevents too much side padding in portrait view
  } else {
    return height / 176
  }
}

function findCandidates(cards: Card[]): [Card, Card] | null {
  let candidates: Array<Card> = []
  for (let card of cards) {
    if (card.visible && !card.matched) {
      candidates.push(card)
      if (candidates.length === 2) {
        return [candidates[0], candidates[1]]
      }
    }
  }
  return null
}

const App = () => {
  const [cards, setCards] = useState(cards1)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const resizeHandler = () => {
      const newScale = calculateScale(window.innerWidth, window.innerHeight)
      setScale(newScale)
    }
    window.addEventListener('resize', resizeHandler)
    resizeHandler()
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  })
  const flipCardHandler = (cardToFlip: Card) => {
    const cardsNext = [...cards]
    cardsNext[cardToFlip.key] = {
      ...cardToFlip,
      visible: true
    }
    setCards(cardsNext)
  }
  const checkMatch = (cb: () => void) => {
    const candidates = findCandidates(cards)
    if (!candidates) return
    const [c1, c2] = candidates
    const matched = c1.cardType === c2.cardType
    if (matched) {
      if (c1.cardType === CardType.Coins10 || c1.cardType === CardType.Coins20) {
        playCoinSound()
      } else if (c1.cardType === CardType.OneUp) {
        playOneUpSound()
      } else {
        playMatchCorrectSound()
      }
    } else {
      playMatchIncorrectSound()
    }
    setTimeout(() => {
      const cardsNext = [...cards]
      cardsNext[c1.key] = {
        ...c1,
        matched,
        visible: matched
      }
      cardsNext[c2.key] = {
        ...c2,
        matched,
        visible: matched
      }
      setCards(cardsNext)
      cb()
    }, matched ? 0 : FLIP_BACK_DELAY)
  }
  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${stripesUrl})`,
        transform: `scale(${scale})`
      }}
    >
      <Grid cards={cards}
        flipCardHandler={flipCardHandler}
        checkMatch={checkMatch} />
    </div>
  )
}

export default App
