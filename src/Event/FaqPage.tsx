import React, {useCallback} from 'react'
import {useAttendee} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogFaqs from 'Event/template/SimpleBlog/FaqPage'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Client} from 'lib/ui/api-client'
import {HasRules} from 'Event/attendee-rules'
import {useTrackEventPage} from 'analytics'
import {useTemplate} from 'Event/TemplateProvider'
import {CARDS} from 'Event/template/Cards'
import CardsFaqs from 'Event/template/Cards/Faqs'

export type FAQ = {
  id: number
  question: string
  answer: string
  settings: FAQSettings | null
}

export type FAQSettings = HasRules & {
  showAnswerOnLoad?: boolean
}

export default function FaqsPage() {
  const template = useTemplate()
  const user = useAttendee()

  useTrackEventPage({
    page: 'Visited FAQ',
  })

  const {client} = useEvent()
  const {data, loading} = useFetchFaqs(client)
  if (loading) {
    return null
  }
  const faqs = data || []

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogFaqs user={user} faqs={faqs} />
    case CARDS:
      return <CardsFaqs user={user} faqs={faqs} />
    default:
      throw new Error(`Missing fag page for template: ${template.name}`)
  }
}

export function useFetchFaqs(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/faqs`)
  const request = useCallback(() => client.get<FAQ[]>(url), [url, client])
  return useAsync(request)
}
