import React, {useCallback} from 'react'
import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogLeaderboard from 'Event/template/SimpleBlog/Leaderboard'
import {Attendee} from 'Event/attendee'
import {useTrackEventPage} from 'analytics'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'
import {CARDS} from './template/Cards'
import CardsLeaderboard from 'Event/template/Cards/Leaderboard'

export interface Entry {
  attendee: Pick<Attendee, 'id' | 'first_name' | 'last_name' | 'email'>
  score: number
}

export default function Leaderboard() {
  const template = useTemplate()
  const user = useAttendee()

  useTrackEventPage({
    page: 'Visited Leaderboard',
  })

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogLeaderboard user={user} />
    case CARDS:
      return <CardsLeaderboard user={user} />
    default:
      throw new Error(`Missing leaderboard for template: ${template.name}`)
  }
}

export function useEntries() {
  const {client, event} = useEvent()
  const url = api(`/events/${event.slug}/leaderboard`)

  const request = useCallback(() => client.get<Entry[]>(url), [client, url])

  const {data, loading} = useAsync(request)

  return {
    entries: data || [],
    loading,
  }
}
