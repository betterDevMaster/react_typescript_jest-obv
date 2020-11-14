import Events from 'organization/Events'
import CreateEventForm from 'organization/Events/CreateEventForm'
import EventConfig from 'organization/Events/EventConfig'
import EventProvider from 'organization/Events/EventProvider'
import {organizationRoutes} from 'organization/Routes'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function UserRoutes() {
  return (
    <Layout>
      <Switch>
        {/*
          Handle login redirect. Handle it here rather than on login success to
          avoid hitting the event catch-all below.
        */}
        <Redirect
          path={organizationRoutes.login}
          to={organizationRoutes.events.root}
        />

        <Route path={organizationRoutes.events.create}>
          <CreateEventForm />
        </Route>
        <Route path={organizationRoutes.events.root}>
          <Events />
        </Route>

        {/*         
          Event Catch-all: treat all other urls as event routes. Avoids
          having to define a route for every event.
        */}
        <Route>
          <EventProvider>
            <Switch>
              <Route path="/:event/dashboard">
                <div>configure dashboard</div>
              </Route>
              <Route path="/:event">
                <EventConfig />
              </Route>
            </Switch>
          </EventProvider>
        </Route>
      </Switch>
    </Layout>
  )
}
