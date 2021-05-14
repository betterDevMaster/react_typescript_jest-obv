import React from 'react'
import {useAttendee} from 'Event/auth'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogBackgrounds from 'Event/template/SimpleBlog/Backgrounds'
import {useTrackEventPage} from 'analytics'

export default function Backgrounds() {
  const template = useTemplate()
  const user = useAttendee()

  useTrackEventPage({
    page: 'Visited Zoom Backgrounds',
  })

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogBackgrounds user={user} />
    default:
      throw new Error(`Missing backgrounds page for template: ${template.name}`)
  }
}
