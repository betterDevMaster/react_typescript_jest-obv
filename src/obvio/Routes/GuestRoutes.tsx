import Login from 'obvio/auth/Login'
import Registration from 'obvio/auth/Registration'
import ForgotPassword from 'obvio/auth/ForgotPassword'
import ResetPassword from 'obvio/auth/ResetPassword'
import {obvioRoutes} from 'obvio/Routes'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import AcceptInvitation from 'obvio/auth/AcceptInvitation'

export default function GuestRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.login}>
        <Login />
      </Route>
      <Route path={obvioRoutes.registration}>
        <Registration />
      </Route>
      <Route path={obvioRoutes.forgot_password}>
        <ForgotPassword />
      </Route>
      <Route path={obvioRoutes.reset_password}>
        <ResetPassword />
      </Route>
      <Route path={obvioRoutes.accept_invitation}>
        <AcceptInvitation />
      </Route>
      <Redirect
        to={{
          pathname: obvioRoutes.login,
        }}
      />
    </Switch>
  )
}
