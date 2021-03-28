import {useOrganizationAuth} from 'organization/auth'
import React from 'react'
import UserRoutes from 'organization/Routes/UserRoutes'
import GuestRoutes from 'organization/Routes/GuestRoutes'
import OwnerProvider from 'organization/OwnerProvider'
import PermissionsProvider from 'organization/PermissionsProvider'

export default function OrganizationRoutes() {
  const {user, loading} = useOrganizationAuth()

  if (loading) {
    return <div>loading...</div>
  }

  /**
   * Always need the owner for every organization, so OwnerProvider also
   * serves as a guard that the current user is authorized to view
   * the organization, ie. a team member.
   */
  if (user) {
    return (
      <OwnerProvider>
        <PermissionsProvider>
          <UserRoutes />
        </PermissionsProvider>
      </OwnerProvider>
    )
  }

  return <GuestRoutes />
}
