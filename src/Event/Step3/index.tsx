import React from 'react'
import {useAttendee} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import TechCheck from 'Event/Step3/TechCheck'
import {useEvent} from 'Event/EventProvider'
import {useTrackEventPage} from 'analytics'
import {useTemplate} from 'Event/TemplateProvider'
import {hasMatch} from 'Event/attendee-rules/matcher'

export default function Step3() {
  const attendee = useAttendee()
  const {hasTechCheck} = useEvent()
  const matchesRulestoSkip = useMatchesRulesToSkipTechCheck()

  useTrackEventPage({
    page: 'Visited Step 3',
  })
  if (matchesRulestoSkip) {
    return <Redirect to={eventRoutes.root} />
  }

  if (attendee.has_completed_tech_check || !hasTechCheck) {
    return <Redirect to={eventRoutes.root} />
  }

  return <TechCheck />
}

export function useMatchesRulesToSkipTechCheck() {
  const template = useTemplate()
  const attendee = useAttendee()

  return hasMatch(attendee, template.skipTechCheckRules)
}
