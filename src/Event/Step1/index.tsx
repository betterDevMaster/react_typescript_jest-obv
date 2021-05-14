import {useTrackEventPage} from 'analytics'
import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import SetPasswordForm from 'Event/Step1/SetPasswordForm'
import React from 'react'
import {Redirect} from 'react-router-dom'

export default function Step1() {
  const attendee = useAttendee()

  useTrackEventPage({
    page: 'Visited Step 1',
  })

  if (attendee.has_password) {
    return <Redirect to={eventRoutes.step2} />
  }

  return <SetPasswordForm />
}
