import CLAP_IMAGE from 'Event/Dashboard/components/EmojiList/emoji/clap.png'
import HEART_IMAGE from 'Event/Dashboard/components/EmojiList/emoji/heart.png'
import LAUGH_IMAGE from 'Event/Dashboard/components/EmojiList/emoji/laugh.png'
import THUMB_UP_IMAGE from 'Event/Dashboard/components/EmojiList/emoji/thumbup.png'
import THUNDER_IMAGE from 'Event/Dashboard/components/EmojiList/emoji/thunder.png'
import {storage} from 'lib/url'

export type Emoji = {
  name: string
  image: string
}

export const EMOJI: Record<string, Emoji> = {
  HEART: {
    name: 'heart',
    image: HEART_IMAGE,
  },
  THUMB_UP: {
    name: 'thumb_up',
    image: THUMB_UP_IMAGE,
  },
  THUNDER: {
    name: 'thunder',
    image: THUNDER_IMAGE,
  },
  CLAP: {
    name: 'clap',
    image: CLAP_IMAGE,
  },
  LAUGH: {
    name: 'laugh',
    image: LAUGH_IMAGE,
  },
}

export const DEFAULT_EMOJIS = Object.values(EMOJI)

export const isCustom = (emoji: string) =>
  !DEFAULT_EMOJIS.find(({name}) => emoji === name)

export const emojiWithName = (name: string) => {
  const defaultEmoji = DEFAULT_EMOJIS.find((e) => e.name === name)
  if (defaultEmoji) {
    return defaultEmoji
  }

  return createCustomEmoji(name)
}

export const createCustomEmoji = (name: string): Emoji => ({
  name,
  image: storage(`/event/emojis/${name}`),
})
