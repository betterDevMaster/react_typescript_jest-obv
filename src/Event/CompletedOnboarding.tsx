import {useAttendee} from 'Event/auth'
import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {useNeedsToSetPassword} from 'Event/Step1'
import {Redirect} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'

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
  const shouldSkipTve3TechCheck = useShouldSkip10xbootcampTechCheck()
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
 * certain 10xbootcamp (Oct, 2021) attendees.
 */
export function useShouldSkip10xbootcampTechCheck() {
  const {event} = useEvent()
  const attendee = useAttendee()

  const isTargetEvent = event.slug === '10xbootcamp'

  if (!isTargetEvent) {
    return false
  }

  return attendee.groups['Preview'] === 'Yes'
}
