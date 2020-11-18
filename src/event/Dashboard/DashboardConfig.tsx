import {useOrganizationAuth} from 'organization/auth'
import Dashboard from 'Event/Dashboard'
import {useEvent} from 'Event/EventProvider'
import React from 'react'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'

export default function DashboardConfig() {
  const event = useEvent()
  const {user} = useOrganizationAuth()
  if (!user) {
    throw new Error('Missing user')
  }

  return (
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <Dashboard user={user} isEditMode={true} dashboard={event.dashboard} />
    </AttendeeProfileProvider>
  )
}
