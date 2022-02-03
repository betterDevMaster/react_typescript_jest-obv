import React, {useCallback} from 'react'
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
import NiftyFiftyStep2 from 'Event/template/NiftyFifty/Step2'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import {WaiverConfig} from 'Event'
import {useAsync} from 'lib/async'

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

  if (event.has_additional_waivers) {
    return <MatchingStep2 />
  }

  return (
    <WaiverProvider waiver={event.waiver}>
      <TemplateStep2 />
    </WaiverProvider>
  )
}

/**
 * A Step 2 that matches the attendee in cases
 * where there could be additional waivers.
 */
function MatchingStep2() {
  const waiver = useTargetWaiver()

  if (!waiver) {
    return <FullPageLoader />
  }

  return (
    <WaiverProvider waiver={waiver}>
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
    case NIFTY_FIFTY:
      return <NiftyFiftyStep2 user={user} />
    default:
      throw new Error(`Missing step 2 for template.`)
  }
}

/**
 * Fetches a target waiver for the attendee. Used when there
 * could be multiple waivers.
 *
 * @returns
 */
function useTargetWaiver() {
  const {client} = useEvent()

  const url = api(`/waiver`)
  const request = useCallback(() => client.get<WaiverConfig>(url), [
    client,
    url,
  ])

  const {data} = useAsync(request)

  return data
}
