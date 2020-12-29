import Events from 'organization/Events'
import CreateEventForm from 'organization/Events/CreateEventForm'
import {RouteEventProvider} from 'Event/EventProvider'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useOrganization} from 'organization/OrganizationProvider'
import EventConfigRoutes from 'organization/Events/EventConfig/EventConfigRoutes'
import Team from 'organization/Team'

export default function UserRoutes() {
  const {routes} = useOrganization()

  return (
    <Layout>
      <Switch>
        {/*
          Handle login redirect. Placed first here, rather than on login success to
          avoid hitting the event catch-all below, and getting a React
          render error .
        */}
        <Redirect path={routes.login} to={routes.events.root} />

        <Route path={routes.events.create}>
          <CreateEventForm />
        </Route>
        <Route path={routes.events.root} exact>
          <Events />
        </Route>
        <Route path={routes.team}>
          <Team />
        </Route>
        <Route path={routes.events[':event'].root}>
          <RouteEventProvider>
            <EventConfigRoutes />
          </RouteEventProvider>
        </Route>
        <Redirect to={routes.events.root} />
      </Switch>
    </Layout>
  )
}
