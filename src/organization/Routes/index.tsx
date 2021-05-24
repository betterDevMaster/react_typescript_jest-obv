import {useOrganizationAuth} from 'organization/auth'
import React from 'react'
import UserRoutes from 'organization/Routes/UserRoutes'
import GuestRoutes from 'organization/Routes/GuestRoutes'
import OwnerProvider from 'organization/OwnerProvider'
import PermissionsProvider from 'organization/PermissionsProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import TextEditorProvider from 'lib/ui/form/TextEditor/TextEditorProvider'

export default function OrganizationRoutes() {
  const {user, loading} = useOrganizationAuth()

  if (loading) {
    return <FullPageLoader />
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
          <TextEditorProvider>
            <UserRoutes />
          </TextEditorProvider>
        </PermissionsProvider>
      </OwnerProvider>
    )
  }

  return <GuestRoutes />
}
