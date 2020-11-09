import Login from 'obvio/auth/Login'
import React from 'react'
import {useObvioAuth} from 'obvio/auth'
import {Redirect, Route, Switch} from 'react-router-dom'
import Home from 'obvio/Home'
import Registration from 'obvio/auth/Registration'

export const ROUTES = {
  root: '/',
  home: '/home',
  login: '/login',
  registration: '/register',
}

export default function ObvioRoutes() {
  const {user, loading} = useObvioAuth()

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <AuthenticatedRoutes />
  }

  return <GuestRoutes />
}

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path={ROUTES.home}>
        <Home />
      </Route>
      <Redirect
        to={{
          pathname: ROUTES.home,
        }}
      />
    </Switch>
  )
}

function GuestRoutes() {
  return (
    <Switch>
      <Route path={ROUTES.login}>
        <Login />
      </Route>
      <Route path={ROUTES.registration}>
        <Registration />
      </Route>
      <Redirect
        to={{
          pathname: ROUTES.login,
        }}
      />
    </Switch>
  )
}
