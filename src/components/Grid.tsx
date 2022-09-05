import { Card } from '../domain/Card'

type Props = {
  cards: Array<Card>
}

const Grid: React.FC<Props> = props => {
  return (
    <div>
      {props.cards.map(card => {
        return (
          <div key={card.index}>
            {card.cardType}
          </div>
        )
      })}
    </div>
  )
}

export default Grid
