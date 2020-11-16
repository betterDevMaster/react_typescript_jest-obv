import {useOrganizationAuth} from 'organization/auth'
import Dashboard from 'event/Dashboard'
import {useEvent} from 'organization/Events/EventProvider'
import React from 'react'

export default function DashboardConfig() {
  const event = useEvent()
  const {user} = useOrganizationAuth()
  if (!user) {
    throw new Error('Missing user')
  }

  return <Dashboard user={user} isEditMode={true} dashboard={event.dashboard} />
}
