import React, {useCallback, useEffect, useRef, useState} from 'react'
import {createGlobalStyle} from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import ClickedEmoji, {
  createEmoji,
  Emoji,
} from 'organization/Event/EmojiPage/ClickedEmoji'
import {useInterval} from 'lib/interval'
import Page from 'organization/Event/EmojiPage/Page'

export type Emojis = string[]

const POLL_INTERVAL_MS = 1000
const MAX_COUNT = 30

export default function EmojiPage() {
  const [fetching, setFetching] = useState(false)
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const fetchEmojis = useFetchEmojis()
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const poll = useCallback(() => {
    if (fetching) {
      return
    }

    setFetching(true)
    fetchEmojis()
      .then((images) => {
        if (!isMountedRef.current) {
          return
        }

        const newEmojis = images.slice(0, MAX_COUNT).map(createEmoji)
        // Use setState's callback version to make sure
        // we always have latest state.
        setEmojis((current) => [...current, ...newEmojis])
      })
      .catch((error) => {
        // ignore errors, prevent failing to send emoji from crashing app
        console.error(error)
      })
      .finally(() => {
        if (!isMountedRef.current) {
          return
        }

        setFetching(false)
      })
  }, [fetchEmojis, fetching])

  useInterval(poll, POLL_INTERVAL_MS)

  const remove = useCallback((target: Emoji) => {
    setEmojis((current) => current.filter((e) => e.id !== target.id))
  }, [])

  return (
    <Page>
      <>
        <RemoveScrollbar />
        {emojis.map((emoji) => {
          return (
            <ClickedEmoji emoji={emoji} key={emoji.id} onComplete={remove} />
          )
        })}
      </>
    </Page>
  )
}

function useFetchEmojis() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/emoji_page`)

  return useCallback(() => client.get<Emojis>(url), [client, url])
}

const RemoveScrollbar = createGlobalStyle`
  html,
  body {
    overflow: hidden;
  }
`
