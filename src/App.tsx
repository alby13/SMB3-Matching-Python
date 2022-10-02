import { useEffect, useRef, useState } from 'react'
import stripesUrl from './assets/stripes.png'
import CreditsScreen from './components/CreditsScreen'
import EndScreen from './components/EndScreen'
import Grid from './components/Grid'
import { patterns } from './domain/cards-factory'
import { GameState } from './domain/GameState'
import { Puzzle } from './domain/Puzzle'

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

// Global variable, only used for debugging along with iwin() (see below)
(window as any).iwincount = 0

const App = () => {
  const [scale, setScale] = useState(1)
  const [iwin, setIwin] = useState(0)
  const currentPatternIndex = useRef(0)
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({
    pattern: patterns[currentPatternIndex.current],
    moves: 0,
    startTime: 0,
    endTime: 0
  })
  const [gameState, setGameState] = useState(GameState.InPlay)
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
  useEffect(() => {
    (window as any).iwin = () => {
      (window as any).iwincount++
      setIwin((window as any).iwincount)
    }
  }, [])
  const handlePatternCompleted = () => {
    setCurrentPuzzle({
      ...currentPuzzle,
      endTime: Date.now()
    })
    setGameState(GameState.PatternCompleted)
  }
  const handleMove = () => {
    const startTime = currentPuzzle.startTime === 0 ? Date.now() : currentPuzzle.startTime
    setCurrentPuzzle({
      ...currentPuzzle,
      moves: currentPuzzle.moves + 1,
      startTime
    })
  }
  const handleContinue = () => {
    currentPatternIndex.current += 1
    if (currentPatternIndex.current >= patterns.length) {
      setGameState(GameState.AllPatternsCompleted)
    } else {
      setCurrentPuzzle({
        pattern: patterns[currentPatternIndex.current],
        moves: 0,
        startTime: 0,
        endTime: 0
      })
      setGameState(GameState.InPlay)
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
      <Grid
        puzzle={currentPuzzle}
        gameState={gameState}
        iwin={iwin}
        onPatternCompleted={handlePatternCompleted}
        onMove={handleMove}
      />
      <EndScreen
        puzzle={currentPuzzle}
        visible={gameState === GameState.PatternCompleted}
        onContinue={handleContinue}
      />
      <CreditsScreen visible={gameState === GameState.AllPatternsCompleted}/>
    </div>
  )
}

export default App
