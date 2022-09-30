import { Pattern } from './cards-factory'

export type Puzzle = {
  pattern: Pattern,
  moves: number,
  startTime: number
  endTime: number
}
