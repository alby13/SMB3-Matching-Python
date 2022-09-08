import { useEffect, useState } from 'react'
import Grid from './components/Grid'
import { Card } from './domain/Card'
import { CardType } from './domain/CardType'
import stripesUrl from './assets/stripes.png'
import { playCoinSound, playMatchCorrectSound, playMatchIncorrectSound, playOneUpSound } from './SoundSystem'

const FLIP_DURATION = 256 // Should match the animation value in index.css
const OUTCOME_DELAY = FLIP_DURATION * 1.2 // Just a little bit longer than the flip duration

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

function findCandidate(cards: Card[]): Card | null {
    for (let candidate of cards) {
      if (candidate.visible && !candidate.matched) {
        return candidate
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
    const candidate = findCandidate(cards)
    const cardsNext = [...cards]
    let matched = false
    if (candidate !== null) {
      matched = cardToFlip.cardType === candidate.cardType
      if (matched) {
        if (cardToFlip.cardType === CardType.Coins10 || cardToFlip.cardType === CardType.Coins20) {
          playCoinSound(OUTCOME_DELAY)
        } else if (cardToFlip.cardType === CardType.OneUp) {
          playOneUpSound(OUTCOME_DELAY)
        } else {
          playMatchCorrectSound(OUTCOME_DELAY)
        }
      } else {
        playMatchIncorrectSound(OUTCOME_DELAY)
      }
      cardsNext[candidate.key] = {
        ...candidate,
        visible: matched,
        matched
      }
    }
    cardsNext[cardToFlip.key] = {
      ...cardToFlip,
      visible: candidate ? matched : true,
      matched
    }
    setCards(cardsNext)
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
        flipCardHandler={flipCardHandler} />
    </div>
  )
}

export default App
