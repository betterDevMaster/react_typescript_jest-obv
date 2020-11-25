import CLAP_IMAGE from './clap.png'
import HEART_IMAGE from './heart.png'
import LAUGH_IMAGE from './laugh.png'
import THUMB_UP_IMAGE from './thumbup.png'
import THUNDER_IMAGE from './thunder.png'

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

export const ALL_EMOJIS = Object.values(EMOJI)

export const emojiWithName = (name: string) => {
  const target = ALL_EMOJIS.find((e) => e.name === name)
  if (!target) {
    throw new Error(`Missing emoji with name: ${name}`)
  }

  return target
}
