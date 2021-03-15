import React from 'react'
import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogLeaderboard from 'Event/template/SimpleBlog/Leaderboard'
import {Attendee} from 'Event/attendee'

export interface Entry {
  attendee: Attendee
  score: number
}

export default function Leaderboard() {
  const template = useTemplate()
  const user = useAttendee()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogLeaderboard user={user} />
    default:
      throw new Error(`Missing leaderboard for template: ${template.name}`)
  }
}
