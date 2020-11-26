import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard, {Dashboard as DashboardData} from 'Event/Dashboard'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEvent} from 'Event/EventProvider'
import React from 'react'

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

export default function EventSite() {
  const event = useEvent()

  if (!event.dashboard) {
    throw new Error(`Dashboard has not been created for event: ${event.name}`)
  }

  return (
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <Dashboard user={fakeUser()} dashboard={event.dashboard} />
    </AttendeeProfileProvider>
  )
}
