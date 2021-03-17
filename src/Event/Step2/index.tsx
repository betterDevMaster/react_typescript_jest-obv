import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import React from 'react'
import {Redirect} from 'react-router-dom'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogStep2 from 'Event/template/SimpleBlog/Step2'

export default function Step2() {
  const attendee = useAttendee()
  const template = useTemplate()
  const user = useAttendee()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  /**
   * Form questions are optional, so we'll use
   * completing the waiver to indicate that
   * the user has completed the step.
   */
  if (attendee.waiver) {
    return <Redirect to={eventRoutes.step3} />
  }

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogStep2 user={user} />
    default:
      throw new Error(`Missing step 2 for template: ${template.name}`)
  }
}
