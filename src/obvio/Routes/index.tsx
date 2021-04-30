import React from 'react'
import {useObvioAuth} from 'obvio/auth'
import {createRoutes} from 'lib/url'
import GuestRoutes from 'obvio/Routes/GuestRoutes'
import UserRoutes from 'obvio/Routes/UserRoutes'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'

export const obvioRoutes = createRoutes({
  login: '/login',
  registration: '/register',
  forgotPassword: '/forgot_password',
  resetPassword: '/reset_password',
  organizations: {
    create: '/create',
  },
})

export default function ObvioRoutes() {
  const {user, loading} = useObvioAuth()

  if (loading) {
    return <FullPageLoader />
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}
