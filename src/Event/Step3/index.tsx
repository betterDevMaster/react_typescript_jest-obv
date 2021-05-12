import React from 'react'
import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import TechCheck from 'Event/Step3/TechCheck'
import {useEvent} from 'Event/EventProvider'
import {useTrackOnLoad} from 'analytics'

export default function Step3() {
  const attendee = useAttendee()
  const {hasTechCheck, hasWaiver, event} = useEvent()

  useTrackOnLoad({
    category: 'Event',
    action: 'Visited Step 2',
    label: event.name,
  })

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  const needWaiver = hasWaiver && !attendee.waiver
  if (needWaiver) {
    return <Redirect to={eventRoutes.step2} />
  }

  const hasCompletedTechCheck = Boolean(attendee.tech_check_completed_at)
  if (hasCompletedTechCheck || !hasTechCheck) {
    return <Redirect to={eventRoutes.root} />
  }

  return <TechCheck />
}
