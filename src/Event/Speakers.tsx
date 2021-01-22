import React from 'react'
import {useAttendee} from 'Event/auth'
import {useEvent} from 'Event/EventProvider'
import TemplateProvider, {
  useTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSpeakers from 'Event/template/SimpleBlog/Speakers'

export default function SpeakersPage() {
  const {event} = useEvent()

  return (
    <TemplateProvider template={event.template}>
      <TemplateSpeakers />
    </TemplateProvider>
  )
}

function TemplateSpeakers() {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSpeakers user={user} />
    default:
      throw new Error(`Missing waiver for template: ${template.name}`)
  }
}
