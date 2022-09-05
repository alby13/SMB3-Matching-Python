import { Card } from '../domain/Card'

type Props = {
  cards: Array<Card>
}

const Grid: React.FC<Props> = ({ cards }) => {
  return (
    <div>
      <div>
        {cards.slice(0, 6).map(card => {
          return (
            <div key={card.key}>
              {card.cardType}
            </div>
          )
        })}
      </div>
      <div>
        {cards.slice(6, 12).map(card => {
          return (
            <div key={card.key}>
              {card.cardType}
            </div>
          )
        })}
      </div>
      <div>
        {cards.slice(12, 18).map(card => {
          return (
            <div key={card.key}>
              {card.cardType}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Grid
