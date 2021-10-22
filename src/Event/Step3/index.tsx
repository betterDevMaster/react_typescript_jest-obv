import React from 'react'
import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import TechCheck from 'Event/Step3/TechCheck'
import {useEvent} from 'Event/EventProvider'
import {useTrackEventPage} from 'analytics'
import {useShouldSkip10xbootcampTechCheck} from 'Event/CompletedOnboarding'

export default function Step3() {
  const attendee = useAttendee()
  const {hasTechCheck} = useEvent()

  const shouldSkip10xBootcampTechCheck = useShouldSkip10xbootcampTechCheck()

  useTrackEventPage({
    page: 'Visited Step 3',
  })

  if (shouldSkip10xBootcampTechCheck) {
    return <Redirect to={eventRoutes.root} />
  }

  if (attendee.has_completed_tech_check || !hasTechCheck) {
    return <Redirect to={eventRoutes.root} />
  }

  return <TechCheck />
}
