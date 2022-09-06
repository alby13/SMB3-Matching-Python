import { Card } from '../domain/Card'
import cardsUrl from '../assets/cards.png'

type Props = {
  card: Card
}

const CardTile: React.FC<Props> = ({ card }) => {
  return (
    <div>
      <img className="card-tile" src={cardsUrl} />
    </div>
  )
}

export default CardTile
