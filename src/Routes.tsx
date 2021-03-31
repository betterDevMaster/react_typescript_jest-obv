import React from 'react'
import {isObvioApp} from 'lib/url'
import {useOrganizationUrl} from 'organization/url'
import OrganizationProvider from 'organization/OrganizationProvider'
import OrganizationRoutes from 'organization/Routes'
import ObvioRoutes from 'obvio/Routes'
import {DomainEventProvider} from 'Event/EventProvider'
import EventRoutes from 'Event/Routes'
import HelpDesk from 'lib/HelpDesk'

export default function Routes() {
  if (isObvioApp()) {
    return (
      <>
        <HelpDesk />
        <AdminRoutes />
      </>
    )
  }

  return (
    <DomainEventProvider>
      <EventRoutes />
    </DomainEventProvider>
  )
}

function AdminRoutes() {
  const {isOrganizationRoute} = useOrganizationUrl()
  if (isOrganizationRoute) {
    return (
      <OrganizationProvider>
        <OrganizationRoutes />
      </OrganizationProvider>
    )
  }

  return <ObvioRoutes />
}
