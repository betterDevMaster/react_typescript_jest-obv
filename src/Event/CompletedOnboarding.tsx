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
  const shouldSkipTve3TechCheck = useShouldSkipTve3TechCheck()
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

  if (shouldSkipTve3TechCheck) {
    return props.children
  }

  const shouldRedirectToStep3 =
    hasTechCheck && !attendee.has_completed_tech_check

  if (shouldRedirectToStep3) {
    return <Redirect to={eventRoutes.step3} />
  }

  return props.children
}

/**
 * TEMPORARY CUSTOM EVENT CODE - Want to skip TechCheck for
 * certain TVE3 attendees.
 */
export function useShouldSkipTve3TechCheck() {
  const {event} = useEvent()
  const attendee = useAttendee()

  const isTve3 = event.slug === 'tve3'

  /**
   * Skip tech check if attendee has one of these tags...
   */
  const tags = ['2997']
  return isTve3 && hasTags(tags, attendee)
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
