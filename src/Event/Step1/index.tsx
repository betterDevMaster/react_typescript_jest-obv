import {useTrackOnLoad} from 'analytics'
import {useAttendee} from 'Event/auth'
import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import SetPasswordForm from 'Event/Step1/SetPasswordForm'
import React from 'react'
import {Redirect} from 'react-router-dom'

export default function Step1() {
  const attendee = useAttendee()
  const {event} = useEvent()

  useTrackOnLoad({
    category: 'Event',
    action: 'Visited Step 1',
    label: event.name,
  })

  if (attendee.has_password) {
    return <Redirect to={eventRoutes.step2} />
  }

  return <SetPasswordForm />
}
