import {useUser} from 'auth/client'
import Login from 'obvio/Login'
import {useTokenAuth} from 'obvio/user'
import React from 'react'

export default function ObvioRoutes() {
  const user = useUser()
  useTokenAuth()

  if (user) {
    return <AuthenticatedRoutes />
  }

  return <Login />
}

function AuthenticatedRoutes() {
  return <div>auth</div>
}
