import styled from 'styled-components'
import React, {useCallback, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import ClickedEmoji, {
  createEmoji,
  Emoji,
} from 'organization/Event/EmojiPage/ClickedEmoji'
import {useInterval} from 'lib/interval'

export type Emojis = string[]

const POLL_INTERVAL_MS = 1000

export default function EmojiPage() {
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const fetchEmojis = useFetchEmojis()

  useInterval(() => {
    fetchEmojis()
      .then((images) => {
        const newEmojis = images.map(createEmoji)
        const updated = [...emojis, ...newEmojis]
        setEmojis(updated)
      })
      .catch((error) => {
        // ignore errors, prevent failing to send emoji from crashing app
        console.error(error)
      })
  }, POLL_INTERVAL_MS)

  const remove = useCallback(
    (target: Emoji) => {
      const updated = emojis.filter((e) => e.id !== target.id)
      setEmojis(updated)
    },
    [emojis],
  )

  return (
    <Container>
      {emojis.map((emoji) => {
        return <ClickedEmoji emoji={emoji} key={emoji.id} onComplete={remove} />
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
  background: #000000;
  position: absolute;
  overflow: hidden;
`
