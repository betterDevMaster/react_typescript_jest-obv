import styled from 'styled-components'
import React, {useCallback, useEffect, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import EmojiIcon, {
  createEmoji,
  Emoji,
} from 'organization/Event/EmojiPage/EmojiIcon'

export type Emojis = string[]

const POLL_INTERVAL_MS = 1000

export default function EmojiPage() {
  const [emojiList, setEmojiList] = useState<Emoji[]>([])
  const fetchEmojis = useFetchEmojis()

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEmojis()
        .then((emojis) => {
          emojis.forEach((image: string) => {
            const newEmoji = createEmoji(image)
            emojiList.push(newEmoji)
          })
          setEmojiList(JSON.parse(JSON.stringify(emojiList)))
        })
        .catch((error) => {
          // ignore errors, prevent failing to send emoji from crashing app
          console.error(error)
        })
    }, POLL_INTERVAL_MS)
    return () => {
      clearInterval(interval)
    }
  }, [fetchEmojis, emojiList])

  const removeEmoji = useCallback((emojiInfo) => {
    const indexOfEmoji = emojiList.findIndex((item) => item.id === emojiInfo.id)
    emojiList.splice(indexOfEmoji, 1)
    setEmojiList(JSON.parse(JSON.stringify(emojiList)))
    // eslint-disable-next-line
  }, [])

  return (
    <Container>
      {emojiList.map((emoji) => {
        return (
          <EmojiIcon emoji={emoji} key={emoji.id} onComplete={removeEmoji} />
        )
      })}
    </Container>
  )
}

function useFetchEmojis() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/emoji`)

  return () => client.get<Emojis>(url)
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: black;
  position: absolute;
  overflow: hidden;
`
