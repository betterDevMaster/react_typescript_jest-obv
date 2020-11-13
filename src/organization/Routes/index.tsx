import {createRoutes} from 'lib/url'
import {useOrganizationAuth} from 'organization/auth'
import React from 'react'
import UserRoutes from 'organization/Routes/UserRoutes'
import GuestRoutes from 'organization/Routes/GuestRoutes'
import {useOrganization} from 'organization/OrganizationProvider'

export const organizationRoutes = createRoutes({
  login: '/login',
  events: {
    create: '/create',
  },
})

export default function OrganizationRoutes() {
  const {organization, loading} = useOrganization()
  if (loading) {
    return null
  }

  if (!organization) {
    return (
      <div>
        <h1>404 - Organization not found</h1>
      </div>
    )
  }

  return <Routes />
}

function Routes() {
  const {user, loading} = useOrganizationAuth()

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}
