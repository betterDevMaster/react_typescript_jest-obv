import Event from 'Event'
import {useEventAuth} from 'Event/auth'
import Login from 'Event/auth/Login'
import Step1 from 'Event/Step1'
import Step2 from 'Event/Step2'
import {createRoutes} from 'lib/url'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export const eventRoutes = createRoutes({
  login: '/login',
  step1: '/step_1',
  step2: '/step_2',
})

export default function Routes() {
  const {user, loading} = useEventAuth()

  if (loading) {
    return <div>loading...</div>
  }

  if (user) {
    return <UserRoutes />
  }

  return <GuestRoutes />
}

function UserRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.step1}>
        <Step1 />
      </Route>
      <Route path={eventRoutes.step2}>
        <Step2 />
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
