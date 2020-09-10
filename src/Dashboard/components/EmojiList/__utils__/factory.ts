import faker from 'faker'
import {ALL_EMOJIS} from 'Dashboard/components/EmojiList/emoji'

export function withEmojis<T>(attributes: T): T {
  return {
    ...attributes,
    emojis: Array.from({length: faker.random.number({min: 0, max: 5})}, () =>
      faker.random.arrayElement(ALL_EMOJIS),
    ),
  }
}
