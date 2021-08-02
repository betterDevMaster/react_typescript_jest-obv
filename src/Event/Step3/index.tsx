import React from 'react'
import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import TechCheck from 'Event/Step3/TechCheck'
import {useEvent} from 'Event/EventProvider'
import {useTrackEventPage} from 'analytics'

export default function Step3() {
  const attendee = useAttendee()
  const {hasTechCheck} = useEvent()

  useTrackEventPage({
    page: 'Visited Step 3',
  })

  const hasCompletedTechCheck = Boolean(attendee.tech_check_completed_at)
  if (hasCompletedTechCheck || !hasTechCheck) {
    return <Redirect to={eventRoutes.root} />
  }

  return <TechCheck />
}
