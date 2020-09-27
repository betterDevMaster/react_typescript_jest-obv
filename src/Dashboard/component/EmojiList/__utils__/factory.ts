import faker from 'faker'
import {ALL_EMOJIS} from 'Dashboard/component/EmojiList/emoji'
import {EmojiList} from 'Dashboard/component/EmojiList'

export function withEmojiList<
  T extends {
    emojiList: EmojiList | null
  }
>(attributes: T): T {
  const emojiList: EmojiList = {
    emojis: Array.from({length: faker.random.number({min: 0, max: 5})}, () =>
      faker.random.arrayElement(ALL_EMOJIS),
    ),
  }

  if (faker.random.boolean()) {
    emojiList.width = faker.random.number({min: 50, max: 100})
  }

  return {
    ...attributes,
    emojiList,
  }
}
