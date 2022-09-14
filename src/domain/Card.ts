import { CardType } from './CardType'

export interface Card {
  key: number,
  cardType: CardType,
  visible: boolean,
  matched: boolean,
  flippingBack: boolean,
  backgroundColor: string
}
