import {useAttendee} from 'Event/auth'
import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {useNeedsToSetPassword} from 'Event/Step1'
import {Redirect} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'
import {useMatchesRulesToSkipTechCheck} from 'Event/Step3'

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
  const needsToSetPassword = useNeedsToSetPassword()

  const canSkipTechCheck = useMatchesRulesToSkipTechCheck()

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

  const shouldRedirectToStep3 =
    hasTechCheck && !attendee.has_completed_tech_check && !canSkipTechCheck

  if (shouldRedirectToStep3) {
    return <Redirect to={eventRoutes.step3} />
  }

  return props.children
}
