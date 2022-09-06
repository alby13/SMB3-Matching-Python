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
      cardType: layouts[0][i]
    }
    cards[i] = card
  }
  return cards
})

const App = () => {
  const [cards, setCards] = useState(cards1)
  return (
    <div className="app" style={{ backgroundImage: `url(${stripesUrl})` }}>
      <Grid cards={cards}></Grid>
      {/* <Controls /> */}
    </div>
  )
}

export default App
