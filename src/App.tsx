import { useEffect, useState } from 'react'
import Grid from './components/Grid'
import { Card } from './domain/Card'
import { CardType } from './domain/CardType'
import stripesUrl from './assets/stripes.png'

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
  const flipCardHandler = (card: Card): boolean => {
    console.log(card)
    const cardsNext = [...cards]
    cardsNext[card.key] = { ...card, visible: true }
    setCards(cardsNext)
    return true // TODO: Return false if not a match
  }
  const checkMatch = (key: number) => {
    const typeToFind = cards[key].cardType
    let foundVisible = false
    for (let candidate of cards) {
      if (candidate.key === key) {
        continue
      }
      if (candidate.matched || !candidate.visible) {
        continue
      }
      foundVisible = true
      if (candidate.cardType !== typeToFind) {
        continue
      }
      console.log('MATCH FOUND', candidate.key, key)
      // TODO: Handle it
      return
    }
    if (foundVisible) {
      console.log('No match found', key)
    }
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
