import Event from 'Event'
import {useEventAuth} from 'Event/auth'
import Login from 'Event/auth/Login'
import {useEvent} from 'Event/EventProvider'
import Step1 from 'Event/Step1'
import Step2 from 'Event/Step2'
import Step3 from 'Event/Step3'
import {createRoutes} from 'lib/url'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Speakers from 'Event/Speakers'
import {EventActionsProvider} from 'Event/ActionsProvider'
import {PointsProvider} from 'Event/PointsProvider'
import Leaderboard from 'Event/Leaderboard'
import UnderConstruction from 'Event/UnderConstruction'
import TemplateProvider from 'Event/TemplateProvider'
import WaiverProvider from 'Event/Step2/WaiverProvider'
import SubmissionsProvider from 'Event/SubmissionsProvider'
import CustomScripts from 'organization/Event/CustomScripts'

export const eventRoutes = createRoutes({
  login: '/login',
  step1: '/step_1',
  step2: '/step_2',
  step3: '/step_3',
  speakers: '/speakers',
  leaderboard: '/leaderboard',
})

export default function Routes() {
  const {user, loading} = useEventAuth()
  const {event} = useEvent()

  if (!event.template || !event.waiver) {
    return <UnderConstruction />
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (user) {
    return (
      <EventActionsProvider>
        <PointsProvider>
          <SubmissionsProvider>
            <TemplateProvider template={event.template}>
              <CustomScripts>
                <UserRoutes />
              </CustomScripts>
            </TemplateProvider>
          </SubmissionsProvider>
        </PointsProvider>
      </EventActionsProvider>
    )
  }

  return (
    <TemplateProvider template={event.template}>
      <CustomScripts>
        <GuestRoutes />
      </CustomScripts>
    </TemplateProvider>
  )
}

function UserRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.step1}>
        <Step1 />
      </Route>
      <Route path={eventRoutes.step2}>
        <WaiverProvider>
          <Step2 />
        </WaiverProvider>
      </Route>
      <Route path={eventRoutes.step3}>
        <Step3 />
      </Route>
      <Route path={eventRoutes.root} exact>
        <Event />
      </Route>
      <Route path={eventRoutes.speakers} exact>
        <Speakers />
      </Route>
      <Route path={eventRoutes.leaderboard}>
        <Leaderboard />
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
