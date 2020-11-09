import Login from 'obvio/Login'
import React from 'react'
import {useObvioAuth} from 'obvio/auth'

export default function ObvioRoutes() {
  const {user, loading} = useObvioAuth()

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <AuthenticatedRoutes />
  }

  return <Login />
}

function AuthenticatedRoutes() {
  return <div>auth</div>
}
