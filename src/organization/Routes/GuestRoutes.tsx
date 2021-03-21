import Login from 'organization/auth/Login'
import ForgotPassword from 'organization/auth/ForgotPassword'
import ResetPassword from 'organization/auth/ResetPassword'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function GuestRoutes() {
  const {routes} = useOrganization()
  return (
    <Switch>
      <Route path={routes.login}>
        <Login />
      </Route>
      <Route path={routes.forgot_password}>
        <ForgotPassword />
      </Route>
      <Route path={routes.reset_password}>
        <ResetPassword />
      </Route>
      <Redirect
        to={{
          pathname: routes.login,
        }}
      />
    </Switch>
  )
}
