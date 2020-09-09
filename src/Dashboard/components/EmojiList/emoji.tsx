export type Emoji = string

export const EMOJI: Record<string, Emoji> = {
  HEART: '❤️',
  ONE_HUNDRED: '💯',
  THUMBS_UP: '👍',
  LIGHTNING: '⚡️',
  CLAP: '👏',
  SMILE: '😃',
  JOY: '😂',
  SUNGLASSES: '😎',
}

export const ALL_EMOJIS = Object.values(EMOJI)
