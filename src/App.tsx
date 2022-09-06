import { useEffect, useState } from 'react'
import Grid from './components/Grid'
import { Card } from './domain/Card'
import { CardType } from './domain/CardType'
import Controls from './components/Controls'
import stripesUrl from './assets/stripes.png'

const layouts = [
  [
    CardType.Mushroom, CardType.Flower, CardType.Coins20, CardType.Mushroom, CardType.Coins10, CardType.Star,
    CardType.Flower, CardType.OneUp, CardType.Mushroom, CardType.Coins10, CardType.OneUp, CardType.Coins20,
    CardType.Star, CardType.Flower, CardType.Star, CardType.Mushroom, CardType.Flower, CardType.Star
  ]
]

const cards1 = (() => {
  const cards = []
  for (let i = 0; i < layouts[0].length; i++) {
    const card: Card = {
      key: i,
      cardType: layouts[0][i],
      matched: false
    }
    cards[i] = card
  }
  return cards
})

function calculateScale(width: number, height: number): number {
  width = width || 1
  height = height || 1
  // Black area is 224x176, so 224/176 = 1.2727272727... WxH ratio
  if (width / height < 1.2727272727) {
    return width / 224 // Scale based on window width
  } else {
    return height / 176 // Scale based on window height
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
    cardsNext[card.key] = { ...card, matched: true }
    setCards(cardsNext)
    return true // TODO: Return false if not a match
  }
  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${stripesUrl})`,
        transform: `scale(${scale})`
      }}
    >
      <Grid cards={cards} flipCardHandler={flipCardHandler}></Grid>
      {/* <Controls /> */}
    </div>
  )
}

export default App
