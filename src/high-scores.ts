type RenderCallback = (moves: number, time: number) => void

const STORAGE_KEY = 'matching_a5b2de657a650b527eabf78d6f85bdaebc2635e1b2020a67bc614bf3b8362352'

type PatternHighScore = {
  moves: number
  time: number
}

/**
 * Should match cards-factory.ts names
 */
type AllHighScores = {
  '1': PatternHighScore,
  '2': PatternHighScore,
  '3': PatternHighScore,
  '4': PatternHighScore,
  '5': PatternHighScore,
  '6': PatternHighScore,
  '7': PatternHighScore,
  '8': PatternHighScore
}

function writeHighScores(scores: AllHighScores) {
  const base64 = btoa(JSON.stringify(scores))
  localStorage.setItem(STORAGE_KEY, base64)
}

function readHighScores() {
  let raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    writeHighScores({
      '1': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '2': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '3': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '4': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '5': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '6': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '7': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER },
      '8': { moves: Number.MAX_SAFE_INTEGER, time: Number.MAX_SAFE_INTEGER }
    })
    raw = localStorage.getItem(STORAGE_KEY) as string // OK to coerce because it should have been written
  }
  return JSON.parse(atob(raw))
}

export function submitScore(name: string, currentMoves: number, currentTime: number, callback: RenderCallback) {
  const scores = readHighScores() as AllHighScores
  const patternScore = (scores as any)[name] as PatternHighScore
  if (patternScore) {
    if (currentMoves < patternScore.moves) {
      patternScore.moves = currentMoves
    }
    if (currentTime < patternScore.time && currentTime > 0) { // Greater than zero is to prevent (development-only due to HMR? hopefully?) inconsistent state when locking on mobile
      patternScore.time = currentTime
    }
  } else {
    (scores as any)[name] = {
      moves: currentMoves,
      time: currentTime
    }
  }
  writeHighScores(scores)
  callback(patternScore.moves, patternScore.time)
}

export function resetScores() {
  localStorage.removeItem(STORAGE_KEY)
}
