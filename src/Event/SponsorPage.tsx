import React, {useCallback} from 'react'
import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSponsorPage from 'Event/template/SimpleBlog/SponsorPage'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Client} from 'lib/api-client'
import {FileLocation} from 'lib/http-client'
import {EntityList} from 'lib/list'
import NavButton from 'Event/Dashboard/components/NavButton'
import {useTrackEventPage} from 'analytics'

export interface Sponsor {
  id: number
  image: FileLocation | null
  name: string
  description: string
  settings: null | {
    buttons?: EntityList<NavButton>
    formId?: number
  }
}

export default function SponsorPage(props: {isEditMode?: boolean}) {
  const template = useTemplate()
  const user = useAttendee()

  useTrackEventPage({
    page: 'Visited Sponsors',
  })

  const {client} = useEvent()
  const {data, loading} = useFetchSponsors(client)

  if (loading) {
    return null
  }

  const sponsors = data || []

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSponsorPage user={user} sponsors={sponsors} />
    default:
      throw new Error(`Missing sponsor page for template: ${template.name}`)
  }
}

export function useFetchSponsors(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/sponsors`)
  const request = useCallback(() => client.get<Sponsor[]>(url), [url, client])
  return useAsync(request)
}
