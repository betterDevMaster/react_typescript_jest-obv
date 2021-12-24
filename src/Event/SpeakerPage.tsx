import React, {useCallback} from 'react'

import {useTrackEventPage} from 'analytics'

import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'

import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Client} from 'lib/ui/api-client'
import {FileLocation} from 'lib/http-client'

import PagePoints, {SPEAKERS} from 'Event/PointsProvider/PagePoints'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSpeakers from 'Event/template/SimpleBlog/SpeakerPage'
import {PANELS} from 'Event/template/Panels'
import PanelsSpeakers from 'Event/template/Panels/Dashboard/Speakers'
import {CARDS} from 'Event/template/Cards'
import CardsSpeakers from 'Event/template/Cards/Speakers'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'
import FiftyBlogSpeakers from 'Event/template/FiftyBlog/Dashboard/Speakers'

import {EventSpeakersProvider} from 'organization/Event/SpeakersProvider'

export interface Speaker {
  id: number
  image: FileLocation | null
  name: string
  text: string
}

export default function SpeakersPage() {
  return (
    <PagePoints page={SPEAKERS}>
      <EventSpeakersProvider>
        <Speakers />
      </EventSpeakersProvider>
    </PagePoints>
  )
}

function Speakers() {
  const {name} = useTemplate()
  const user = useAttendee()
  const {event} = useEvent()

  useTrackEventPage({
    page: 'Visited Speakers',
  })

  const speakers = event.speakers
  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSpeakers user={user} speakers={speakers} />
    case PANELS:
      return <PanelsSpeakers speakers={speakers} />
    case CARDS:
      return <CardsSpeakers user={user} speakers={speakers} />
    case FIFTY_BLOG:
      return <FiftyBlogSpeakers speakers={speakers} />
    default:
      throw new Error(`Missing speaker page for template: ${name}`)
  }
}

export function useFetchSpeakers(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/speakers`)
  const request = useCallback(() => client.get<Speaker[]>(url), [url, client])
  return useAsync(request)
}
