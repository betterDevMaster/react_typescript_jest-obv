import {createRoutes} from 'lib/url'
import {organizationSlug} from 'organization/url'
import {useOrganizationAuth} from 'organization/auth'
import React from 'react'
import UserRoutes from 'organization/user/UserRoutes'
import GuestRoutes from 'organization/guest/GuestRoutes'

export const organizationRoutes = createRoutes({
  login: '/login',
  events: {
    create: '/create',
  },
})

export default function OrganizationRoutes() {
  const slug = organizationSlug()
  const {user, loading} = useOrganizationAuth(slug)

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}
