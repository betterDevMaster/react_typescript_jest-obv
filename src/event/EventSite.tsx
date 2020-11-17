import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'event/Dashboard'
import AttendeeProfileProvider from 'event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEvent} from 'organization/Events/EventProvider'
import React from 'react'

export default function EventSite() {
  const event = useEvent()

  return (
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <Dashboard user={fakeUser()} dashboard={event.dashboard} />
    </AttendeeProfileProvider>
  )
}
