import React from 'react'
import {OBVIO_SUBDOMAIN} from 'App'
import {getSubdomain} from 'lib/url'
import EventProvider from 'organization/Events/EventProvider'
import {useOrganizationUrl} from 'organization/url'
import OrganizationProvider from 'organization/OrganizationProvider'
import OrganizationRoutes from 'organization/Routes'
import ObvioRoutes from 'obvio/Routes'

export default function Routes() {
  const subdomain = getSubdomain(window.location.host)

  const isObvioAppDomain = subdomain === OBVIO_SUBDOMAIN
  if (!subdomain || isObvioAppDomain) {
    return <AppRoutes />
  }

  return (
    <EventProvider>
      <div>event routes...</div>
    </EventProvider>
  )
}

function AppRoutes() {
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
