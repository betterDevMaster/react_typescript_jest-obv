import Events from 'organization/Events'
import CreateEventForm from 'organization/Events/CreateEventForm'
import DashboardConfig from 'event/Dashboard/DashboardConfig'
import EventConfig from 'organization/Events/EventConfig'
import EventProvider from 'organization/Events/EventProvider'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useOrganization} from 'organization/OrganizationProvider'

export default function UserRoutes() {
  const {routes} = useOrganization()

  return (
    <Layout>
      <Switch>
        {/*
          Handle login redirect. Handle it here rather than on login success to
          avoid hitting the event catch-all below.
        */}
        <Redirect path={routes.login} to={routes.events.root} />

        <Route path={routes.events.create}>
          <CreateEventForm />
        </Route>
        <Route path={routes.events.root} exact>
          <Events />
        </Route>
        <Route path={routes.events[':event'].dashboard}>
          <EventProvider>
            <DashboardConfig />
          </EventProvider>
        </Route>
        <Route path={routes.events[':event'].root}>
          <EventProvider>
            <EventConfig />
          </EventProvider>
        </Route>
        <Redirect to={routes.events.root} />
      </Switch>
    </Layout>
  )
}
