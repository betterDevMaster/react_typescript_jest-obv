import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard, {Dashboard as DashboardData} from 'Event/Dashboard'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEvent} from 'Event/EventProvider'
import React from 'react'

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  id: number
  name: string
  slug: string
  dashboard: null | DashboardData
}

export default function EventSite() {
  const event = useEvent()

  return (
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <Dashboard user={fakeUser()} dashboard={event.dashboard} />
    </AttendeeProfileProvider>
  )
}
