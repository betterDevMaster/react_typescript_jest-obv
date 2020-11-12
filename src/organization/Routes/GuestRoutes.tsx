import Login from 'organization/auth/Login'
import {organizationRoutes} from 'organization/Routes'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function GuestRoutes() {
  return (
    <Switch>
      <Route path={organizationRoutes.login}>
        <Login />
      </Route>
      <Redirect
        to={{
          pathname: organizationRoutes.login,
        }}
      />
    </Switch>
  )
}
