import React from 'react'

type Props = {
  visible: boolean
}

const EndScreen: React.FC<Props> = ({ visible }) => {
  if (!visible) return null
  const patternName = 'a'
  const patternColor = '#ffcec6'
  return (
    <div className="end-screen">
      <div className="end-screen-header">
        pattern
        <span
          style={{
            marginLeft: '6px',
            marginRight: '6px',
            color: patternColor
          }}
        >
          {patternName}
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
              <td>32</td>
              <td>19</td>
            </tr>
            <tr>
              <td>time</td>
              <td>54</td>
              <td>43</td>
            </tr>
          </tbody>
        </table>
        <button
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
