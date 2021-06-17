import React, {useCallback} from 'react'
import {useAttendee} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSponsorPage from 'Event/template/SimpleBlog/SponsorPage'
import {PANELS} from 'Event/template/Panels'
import PanelsSponsorPage from 'Event/template/Panels/Dashboard/Sponsors'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Client} from 'lib/api-client'
import {FileLocation} from 'lib/http-client'
import {EntityList} from 'lib/list'
import NavButton from 'Event/Dashboard/components/NavButton'
import {useTrackEventPage} from 'analytics'
import {Form} from 'organization/Event/FormsProvider'
import {useTemplate} from 'Event/TemplateProvider'
import PagePoints, {SPONSORS} from 'Event/PointsProvider/PagePoints'

export interface Sponsor {
  id: number
  image: FileLocation | null
  name: string
  description: string
  form: Form | null
  settings: null | {
    buttons?: EntityList<NavButton>
  }
}

export default function SponsorPage(props: {isEditMode?: boolean}) {
  return (
    <PagePoints page={SPONSORS}>
      <Sponsors />
    </PagePoints>
  )
}

function Sponsors() {
  const {name} = useTemplate()

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

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSponsorPage user={user} sponsors={sponsors} />
    case PANELS:
      return <PanelsSponsorPage user={user} sponsors={sponsors} />
    default:
      throw new Error(`Missing sponsor page for template: ${name}`)
  }
}

export function useFetchSponsors(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/sponsors`)
  const request = useCallback(() => client.get<Sponsor[]>(url), [url, client])
  return useAsync(request)
}
