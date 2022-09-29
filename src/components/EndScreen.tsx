import React from 'react'
import { Puzzle } from '../domain/Puzzle'

type Props = {
  puzzle: Puzzle
  visible: boolean
  onContinue: () => void
}

const EndScreen: React.FC<Props> = ({ puzzle, visible, onContinue }) => {
  if (!visible) return null
  return (
    <div className="end-screen">
      <div className="end-screen-header">
        pattern
        <span
          style={{
            marginLeft: '6px',
            marginRight: '6px',
            color: puzzle.pattern.cardBackgroundColor
          }}
        >
          {puzzle.pattern.name}
        </span>
        complete
      </div>
      <div className="end-screen-detail">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>current</th>
              <th>best</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>moves</td>
              <td>{puzzle.moves}</td>
              <td>TBD</td>
            </tr>
            <tr>
              <td>time</td>
              <td>{puzzle.time}</td>
              <td>TBD</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={onContinue}
          style={{
            color: '#3fbfff',
            fontFamily: 'inherit',
            fontSize: '1em',
            marginTop: '6px'
          }}
        >
          continue
        </button>
      </div>
    </div>
  )
}

export default EndScreen
