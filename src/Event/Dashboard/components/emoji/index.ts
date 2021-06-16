import CLAP_IMAGE from 'Event/Dashboard/components/emoji/clap.png'
import HEART_IMAGE from 'Event/Dashboard/components/emoji/heart.png'
import LAUGH_IMAGE from 'Event/Dashboard/components/emoji/laugh.png'
import THUMB_UP_IMAGE from 'Event/Dashboard/components/emoji/thumbup.png'
import THUNDER_IMAGE from 'Event/Dashboard/components/emoji/thunder.png'
import {useEvent} from 'Event/EventProvider'
import {api, storage} from 'lib/url'
import {useState} from 'react'

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

export type EmojiImageProps = {
  name: string
  src: string
}

export function useSendEmoji() {
  const [sending, setSending] = useState(false)
  const {event, client} = useEvent()

  const send = (name: string) => () => {
    if (sending) {
      return
    }

    setSending(true)
    setTimeout(() => setSending(false), 1000)
    const url = api(`/events/${event.slug}/emoji_page`)
    client.post(url, {name}).catch((error) => {
      // ignore errors, prevent failing to send emoji from crashing app
      console.error(error)
    })
  }

  return {send, sending}
}
