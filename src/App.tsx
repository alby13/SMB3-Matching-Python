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
      key: i,
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
  const [musicPlayingIndicator, setMusicPlayingIndicator] = useState(false)
  useEffect(() => {
    music.loop = true
    music.addEventListener('canplaythrough', () => {
      setWaitingForMusicLoad(false)
    })
    return () => {
      music.pause()
      setMusicPlayingIndicator(false)
    }
  }, [])
  const toggleMusic = () => {
    if (music.paused) {
      music.play()
      setMusicPlayingIndicator(true)
    } else {
      music.pause()
      setMusicPlayingIndicator(false)
    }
  }
  return (
    <div className="app">
      <Grid cards={cards}></Grid>
      <button onClick={toggleMusic} disabled={waitingForMusicLoad}>
        {musicPlayingIndicator ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}

export default App
