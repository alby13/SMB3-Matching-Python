import { Card } from '../domain/Card'

type Props = {
  card: Card
}

const CardTile: React.FC<Props> = ({ card }) => {
  return (
    <div>
      {card.cardType}
    </div>
  )
}

export default CardTile
