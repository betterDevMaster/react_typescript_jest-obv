import React from 'react'
import {useObvioAuth} from 'obvio/auth'
import {createRoutes} from 'lib/url'
import GuestRoutes from 'obvio/Routes/GuestRoutes'
import UserRoutes from 'obvio/Routes/UserRoutes'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import WithLiveChatSupport from 'lib/WithLiveChatSupport'
import TeamMemberLiveUpdates from 'auth/TeamMemberLiveUpdates'

export const obvioRoutes = createRoutes({
  login: '/login',
  registration: '/register',
  accept_invitation: '/accept_invitation',
  forgot_password: '/forgot_password',
  reset_password: '/reset_password',
  change_password: '/change_password',
  organizations: {
    create: '/create',
  },
  billing: {
    buy_credits: '/buy_credits',
    change_plan: '/change_plan',
    cancel_plan: '/cancel_plan',
    resume_plan: '/resume_plan',
    credit_transactions: '/credit_transactions',
  },
  mailchimp: {
    auth: '/auth',
  },
})

export default function ObvioRoutes() {
  const {user, loading} = useObvioAuth()

  if (loading) {
    return <FullPageLoader />
  }

  if (user) {
    return (
      <TeamMemberLiveUpdates>
        <WithLiveChatSupport user={user}>
          <UserRoutes />
        </WithLiveChatSupport>
      </TeamMemberLiveUpdates>
    )
  }

  return (
    <WithLiveChatSupport>
      <GuestRoutes />
    </WithLiveChatSupport>
  )
}
