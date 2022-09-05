import { useEffect, useState } from 'react'
import Grid from './components/Grid'
import { Card } from './domain/Card'
import { CardType } from './domain/CardType'
import musicUrl from './assets/music.ogg'

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
      index: i,
      cardType: layouts[0][i]
    }
    cards[i] = card
  }
  return cards
})

const App = () => {
  const [cards, setCards] = useState(cards1)
  const [waitingForMusicLoad, setWaitingForMusicLoad] = useState(true)
  const [music, setMusic] = useState<HTMLAudioElement>(new Audio(musicUrl))
  useEffect(() => {
    music.loop = true
    music.addEventListener('canplaythrough', () => {
      setWaitingForMusicLoad(false)
    })
    return () => {
      music.pause()
    }
  }, [])
  const toggleMusic = () => {
    if (music.paused) {
      music.play()
    } else {
      music.pause()
    }
  }
  return (
    <div className="App">
      <Grid cards={cards}></Grid>
      <button onClick={toggleMusic} disabled={waitingForMusicLoad}>
        {music.paused ? 'Play' : 'Pause'}
      </button>
    </div>
  )
}

export default App
