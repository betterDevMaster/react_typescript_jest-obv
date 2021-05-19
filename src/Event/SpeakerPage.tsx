import React, {useCallback} from 'react'
import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSpeakers from 'Event/template/SimpleBlog/SpeakerPage'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Client} from 'lib/api-client'
import {FileLocation} from 'lib/http-client'
import {useTrackEventPage} from 'analytics'
import PagePoints, {SPEAKERS} from 'Event/PointsProvider/PagePoints'

export interface Speaker {
  id: number
  image: FileLocation | null
  name: string
  text: string
}

export default function SpeakersPage() {
  return (
    <PagePoints page={SPEAKERS}>
      <Speakers />
    </PagePoints>
  )
}

function Speakers() {
  const template = useTemplate()
  const user = useAttendee()
  const {event} = useEvent()

  useTrackEventPage({
    page: 'Visited Speakers',
  })

  const speakers = event.speakers

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSpeakers user={user} speakers={speakers} />
    default:
      throw new Error(`Missing speaker page for template: ${template.name}`)
  }
}

export function useFetchSpeakers(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/speakers`)
  const request = useCallback(() => client.get<Speaker[]>(url), [url, client])
  return useAsync(request)
}
