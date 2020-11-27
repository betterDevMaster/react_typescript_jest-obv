import {useAttendee} from 'Event/auth'
import Dashboard, {Dashboard as DashboardData} from 'Event/Dashboard'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import React from 'react'
import {Redirect} from 'react-router-dom'

export interface WaiverConfig {
  logo: null | string
  title: null | string
  body: string
}

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  id: number
  name: string
  slug: string
  dashboard: null | DashboardData
  waiver: null | WaiverConfig
}

export default function Event() {
  const {event} = useEvent()
  const attendee = useAttendee()
  if (!attendee.waiver) {
    return <Redirect to={eventRoutes.step2} />
  }

  if (!event.dashboard) {
    throw new Error(`Dashboard has not been created for event: ${event.name}`)
  }

  // We fetch the user, and split the user from the attendee profile to allow
  // stubbing out data for org users while configuring dashboard.
  return (
    <AttendeeProfileProvider groups={attendee.groups} tags={attendee.tags}>
      <Dashboard dashboard={event.dashboard} user={attendee} />
    </AttendeeProfileProvider>
  )
}
