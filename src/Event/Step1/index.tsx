import {useTrackEventPage} from 'analytics'
import {useAttendee} from 'Event/auth'
import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import SetPasswordForm from 'Event/Step1/SetPasswordForm'
import React from 'react'
import {Redirect} from 'react-router-dom'

export default function Step1() {
  const needsToSetPassword = useNeedsToSetPassword()

  useTrackEventPage({
    page: 'Visited Step 1',
  })

  if (!needsToSetPassword) {
    return <Redirect to={eventRoutes.step2} />
  }

  return <SetPasswordForm />
}

export function useNeedsToSetPassword() {
  const {event} = useEvent()
  const attendee = useAttendee()

  if (!event.requires_attendee_password) {
    return false
  }

  return !attendee.has_password
}
