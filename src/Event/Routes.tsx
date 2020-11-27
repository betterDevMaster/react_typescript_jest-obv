import Event from 'Event'
import {useEventAuth} from 'Event/auth'
import Login from 'Event/auth/Login'
import Waiver from 'Event/Waiver'
import {createRoutes} from 'lib/url'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export const eventRoutes = createRoutes({
  login: '/login',
  step2: '/step_2',
})

export default function Routes() {
  const {user, loading} = useEventAuth()

  if (loading) {
    return <div>...loading</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}

function UserRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.step2}>
        <Waiver />
      </Route>
      <Route path={eventRoutes.root} exact>
        <Event />
      </Route>
      <Redirect to={eventRoutes.root} />
    </Switch>
  )
}

function GuestRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.login}>
        <Login />
      </Route>
      <Redirect to={eventRoutes.login} />
    </Switch>
  )
}
