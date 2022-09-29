import { Card } from './Card'
import { CardType } from './CardType'

export type Pattern = {
  name: string,
  cardBackgroundColor: string
  cards: CardType[]
}

export const patterns: Pattern[] = [
  {
    name: 'a',
    cardBackgroundColor: '#ffcec6',
    cards: [
      CardType.Mushroom, CardType.Flower, CardType.Coins20, CardType.Mushroom, CardType.Coins10, CardType.Star,
      CardType.Flower, CardType.OneUp, CardType.Mushroom, CardType.Coins10, CardType.OneUp, CardType.Coins20,
      CardType.Star, CardType.Flower, CardType.Star, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'b',
    cardBackgroundColor: "#88ccee",
    cards: [
      CardType.Mushroom, CardType.Flower, CardType.Coins20, CardType.Flower, CardType.Coins10, CardType.Star,
      CardType.Coins20, CardType.OneUp, CardType.Mushroom, CardType.Coins10, CardType.OneUp, CardType.Flower,
      CardType.Star, CardType.Mushroom, CardType.Star, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'c',
    cardBackgroundColor: "#7966d8", // Original: #332288
    cards: [
      CardType.Mushroom, CardType.Flower, CardType.OneUp, CardType.Flower, CardType.Star, CardType.Star,
      CardType.Coins20, CardType.Star, CardType.Mushroom, CardType.Coins10, CardType.OneUp, CardType.Flower,
      CardType.Coins20, CardType.Mushroom, CardType.Coins10, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'd',
    cardBackgroundColor: "#117733",
    cards: [
      CardType.Flower, CardType.Coins10, CardType.OneUp, CardType.Flower, CardType.OneUp, CardType.Mushroom,
      CardType.Star, CardType.Mushroom, CardType.Coins20, CardType.Star, CardType.Mushroom, CardType.Coins10,
      CardType.Star, CardType.Flower, CardType.Coins20, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'e',
    cardBackgroundColor: "#44aa99",
    cards: [
      CardType.Flower, CardType.Coins20, CardType.Mushroom, CardType.Star, CardType.OneUp, CardType.Flower,
      CardType.OneUp, CardType.Flower, CardType.Coins10, CardType.Mushroom, CardType.Coins20, CardType.Star,
      CardType.Mushroom, CardType.Coins10, CardType.Star, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'f',
    cardBackgroundColor: "#ddcc77",
    cards: [
      CardType.Flower, CardType.Star, CardType.OneUp, CardType.Flower, CardType.Coins20, CardType.Mushroom,
      CardType.Coins10, CardType.Mushroom, CardType.Coins20, CardType.OneUp, CardType.Mushroom, CardType.Coins10,
      CardType.Star, CardType.Flower, CardType.Star, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'g',
    cardBackgroundColor: "#cc6677",
    cards: [
      CardType.Flower, CardType.Star, CardType.OneUp, CardType.Flower, CardType.OneUp, CardType.Mushroom,
      CardType.Coins10, CardType.Mushroom, CardType.Flower, CardType.Star, CardType.Mushroom, CardType.Coins10,
      CardType.Star, CardType.Coins20, CardType.Coins20, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
  {
    name: 'h',
    cardBackgroundColor: "#d8669f", // Original: #882255
    cards: [
      CardType.OneUp, CardType.Mushroom, CardType.Coins10, CardType.Mushroom, CardType.Flower, CardType.Star,
      CardType.Mushroom, CardType.Coins10, CardType.Star, CardType.Coins20, CardType.Coins20, CardType.Flower,
      CardType.Star, CardType.OneUp, CardType.Flower, CardType.Mushroom, CardType.Flower, CardType.Star
    ]
  },
]

export const createCards = (pattern: Pattern) => {
  const cards = []
  for (let i = 0; i < pattern.cards.length; i++) {
    const card: Card = {
      key: i,
      cardType: pattern.cards[i],
      visible: false,
      matched: false,
      flippingBack: false,
      backgroundColor: pattern.cardBackgroundColor
    }
    cards[i] = card
  }
  return cards
}
