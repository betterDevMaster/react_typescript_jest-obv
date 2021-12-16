import React from 'react'
import {isObvioApp} from 'lib/url'
import {useOrganizationUrl} from 'organization/url'
import OrganizationProvider from 'organization/OrganizationProvider'
import OrganizationRoutes from 'organization/Routes'
import ObvioRoutes from 'obvio/Routes'
import {AutoRefreshEvent, DomainEventProvider} from 'Event/EventProvider'
import EventRoutes from 'Event/Routes'
import AuthTokenHandler from 'Event/auth/AuthTokenHandler'
import BillingProvider from 'BillingProvider'

export default function Routes() {
  if (isObvioApp()) {
    return (
      <BillingProvider>
        <AdminRoutes />
      </BillingProvider>
    )
  }

  return (
    <DomainEventProvider>
      <AutoRefreshEvent>
        <AuthTokenHandler>
          <EventRoutes />
        </AuthTokenHandler>
      </AutoRefreshEvent>
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
