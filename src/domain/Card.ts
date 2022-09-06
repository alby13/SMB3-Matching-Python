import { CardType } from './CardType'

export interface Card {
  key: number,
  cardType: CardType,
  matched: boolean
}
