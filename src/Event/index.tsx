import {useAttendee} from 'Event/auth'
import Dashboard from 'Event/Dashboard'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {eventRoutes} from 'Event/Routes'
import {Template} from 'Event/template'
import React from 'react'
import {Redirect} from 'react-router-dom'

export interface WaiverConfig {
  logo: null | string
  title: null | string
  body: string
}

export interface TechCheckConfig {
  body: string
}

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  id: number
  name: string
  slug: string
  template: null | Template
  waiver: null | WaiverConfig
  tech_check: null | TechCheckConfig
}

export default function Event() {
  const attendee = useAttendee()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  if (!attendee.waiver) {
    return <Redirect to={eventRoutes.step2} />
  }

  if (!attendee.tech_check_completed_at) {
    return <Redirect to={eventRoutes.step3} />
  }

  // We fetch the user, and split the user from the attendee profile to allow
  // stubbing out data for org users while configuring dashboard.
  return (
    <AttendeeProfileProvider groups={attendee.groups} tags={attendee.tags}>
      <Dashboard user={attendee} />
    </AttendeeProfileProvider>
  )
}
