import { Card } from '../domain/Card'
import CardTile from './CardTile'

type Props = {
  cards: Array<Card>
}

const Grid: React.FC<Props> = ({ cards }) => {
  return (
    <div className="grid">
      <table>
        <tbody>
          <tr>
            {cards.slice(0, 6).map(card => <td key={card.key}><CardTile card={card} /></td>)}
          </tr>
          <tr>
            {cards.slice(6, 12).map(card => <td key={card.key}><CardTile card={card} /></td>)}
          </tr>
          <tr>
            {cards.slice(12, 18).map(card => <td key={card.key}><CardTile card={card} /></td>)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Grid
