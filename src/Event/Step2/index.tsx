import React from 'react'
import {Redirect} from 'react-router-dom'

import {useTrackEventPage} from 'analytics'

import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import WaiverProvider from 'Event/Step2/WaiverProvider'

import SimpleBlogStep2 from 'Event/template/SimpleBlog/Step2'
import PanelsStep2 from 'Event/template/Panels/Step2'
import CardsStep2 from 'Event/template/Cards/Step2'
import FiftyBlogStep2 from 'Event/template/FiftyBlog/Step2'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

export default function Step2() {
  const attendee = useAttendee()
  const {event, hasWaiver} = useEvent()

  useTrackEventPage({
    page: 'Visited Step 2',
  })

  if (!event.waiver || !hasWaiver) {
    return <Redirect to={eventRoutes.step3} />
  }

  /**
   * Form questions are optional, so we'll use
   * completing the waiver to indicate that
   * the user has completed the step.
   */
  if (attendee.waiver) {
    return <Redirect to={eventRoutes.step3} />
  }

  return (
    <WaiverProvider waiver={event.waiver}>
      <TemplateStep2 />
    </WaiverProvider>
  )
}

function TemplateStep2() {
  const template = useTemplate()

  const user = useAttendee()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogStep2 user={user} />
    case PANELS:
      return <PanelsStep2 />
    case CARDS:
      return <CardsStep2 user={user} />
    case FIFTY_BLOG:
      return <FiftyBlogStep2 user={user} />
    default:
      throw new Error(`Missing step 2 for template.`)
  }
}
