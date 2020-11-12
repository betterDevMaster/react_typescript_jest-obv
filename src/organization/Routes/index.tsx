import {createRoutes} from 'lib/url'
import {useOrganizationAuth} from 'organization/auth'
import React from 'react'
import UserRoutes from 'organization/Routes/UserRoutes'
import GuestRoutes from 'organization/Routes/GuestRoutes'

export const organizationRoutes = createRoutes({
  login: '/login',
  events: {
    create: '/create',
  },
})

export default function OrganizationRoutes() {
  const {user, loading} = useOrganizationAuth()

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}
