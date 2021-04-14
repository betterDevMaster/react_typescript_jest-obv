import React, {useCallback} from 'react'
import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSponsorPage from 'Event/template/SimpleBlog/SponsorPage'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Client} from 'lib/api-client'
import {Sponsor} from 'Event'

export default function SponsorPage() {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSponsorPage user={user} />
    default:
      throw new Error(`Missing sponsor page for template: ${template.name}`)
  }
}

export function useSponsors(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/sponsors`)
  const request = useCallback(() => client.get<Sponsor[]>(url), [url, client])
  return useAsync(request)
}
