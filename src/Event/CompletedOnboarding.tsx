import {useAttendee} from 'Event/auth'
import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {useNeedsToSetPassword} from 'Event/Step1'
import {Redirect} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'
import {Attendee} from 'Event/attendee'

/**
 * Requires specific on-boarding steps to be completed. If no step is
 * specified we assume all steps must be completed.
 * @param props
 * @returns
 */
export default function CompletedOnboarding(props: {
  children: React.ReactElement
  step?: 1 | 2
}) {
  const {step} = props
  const attendee = useAttendee()
  const {hasTechCheck, hasWaiver} = useEvent()
  const shouldSkipSpanishAttendees = useShouldSkipTechCheckForSpanishAttendees()
  const needsToSetPassword = useNeedsToSetPassword()

  if (needsToSetPassword) {
    return <Redirect to={eventRoutes.step1} />
  }

  if (step === 1) {
    return props.children
  }

  const needsToSignWaiver = hasWaiver && !attendee.waiver
  if (needsToSignWaiver) {
    return <Redirect to={eventRoutes.step2} />
  }

  if (step === 2) {
    return props.children
  }

  if (shouldSkipSpanishAttendees) {
    return props.children
  }

  const shouldRedirectToStep3 =
    hasTechCheck && !attendee.tech_check_completed_at
  if (shouldRedirectToStep3) {
    return <Redirect to={eventRoutes.step3} />
  }

  return props.children
}

/**
 * CUSTOM EVENT CODE - Want to skip spanish attendees for
 * the RankMakersLive event.
 */
export function useShouldSkipTechCheckForSpanishAttendees() {
  const {event} = useEvent()
  const attendee = useAttendee()

  const isRankMakerEvent = event.slug === 'RankMakersLive'
  /**
   * Skip tech check if attendee has one of these tags...
   */
  const spanishTags = ['12094', '12136', '12082']
  return isRankMakerEvent && hasTags(spanishTags, attendee)
}

function hasTags(tags: string[], attendee: Attendee) {
  let exists = false

  for (const tag of attendee.tags) {
    if (tags.includes(tag)) {
      exists = true
      break
    }
  }

  return exists
}
