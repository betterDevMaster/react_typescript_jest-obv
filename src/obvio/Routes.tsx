import Login from 'obvio/Login'
import React from 'react'
import {useObvioAuth} from 'obvio/auth'
import {Redirect, Route, Switch} from 'react-router-dom'
import Home from 'obvio/Home'

export const ROUTES = {
  root: '/',
  home: '/home',
  login: '/login',
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
      <Redirect
        to={{
          pathname: ROUTES.login,
        }}
      />
    </Switch>
  )
}
