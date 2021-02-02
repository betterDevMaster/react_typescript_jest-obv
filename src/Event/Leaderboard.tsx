import React from 'react'
import {useAttendee} from 'Event/auth'
import {useEvent} from 'Event/EventProvider'
import TemplateProvider, {
  useTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogLeaderboard from 'Event/template/SimpleBlog/Leaderboard'
import {Attendee} from 'Event/attendee'

export interface Entry {
  attendee: Attendee
  score: number
}

export default function Leaderboard() {
  const {event} = useEvent()

  return (
    <TemplateProvider template={event.template}>
      <TemplateLeaderboard />
    </TemplateProvider>
  )
}

function TemplateLeaderboard() {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogLeaderboard user={user} />
    default:
      throw new Error(`Missing leaderboard for template: ${template.name}`)
  }
}
