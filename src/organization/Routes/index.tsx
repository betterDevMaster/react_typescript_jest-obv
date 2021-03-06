import React from 'react'
import UserRoutes from 'organization/Routes/UserRoutes'
import OwnerProvider from 'organization/OwnerProvider'
import PermissionsProvider from 'organization/PermissionsProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import TextEditorProvider from 'lib/ui/form/TextEditor/TextEditorProvider'
import {OrganizationBillingStatusOverlay} from 'organization/OrganizationBillingStatusOverlay'
import {useObvioAuth} from 'obvio/auth'
import {Redirect} from 'react-router'
import {obvioRoutes} from 'obvio/Routes'
import {PaymentMethodProvider} from 'organization/PaymentMethodProvider'
import WithLiveChatSupport from 'lib/WithLiveChatSupport'
import TeamMemberLiveUpdates from 'auth/TeamMemberLiveUpdates'

export default function OrganizationRoutes() {
  const {user, loading} = useObvioAuth()

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
      <TeamMemberLiveUpdates>
        <WithLiveChatSupport user={user}>
          <OwnerProvider>
            <PaymentMethodProvider>
              <OrganizationBillingStatusOverlay />
              <PermissionsProvider>
                <TextEditorProvider>
                  <UserRoutes />
                </TextEditorProvider>
              </PermissionsProvider>
            </PaymentMethodProvider>
          </OwnerProvider>
        </WithLiveChatSupport>
      </TeamMemberLiveUpdates>
    )
  }

  return <Redirect to={obvioRoutes.login} />
}
