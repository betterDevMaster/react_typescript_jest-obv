import CLAP from './clap.png'
import HEART from './heart.png'
import LAUGH from './laugh.png'
import THUMB_UP from './thumbup.png'
import THUNDER from './thunder.png'

export type Emoji = string

export const EMOJI: Record<string, Emoji> = {
  HEART,
  THUMB_UP,
  THUNDER,
  CLAP,
  LAUGH,
}

export const ALL_EMOJIS = Object.values(EMOJI)
