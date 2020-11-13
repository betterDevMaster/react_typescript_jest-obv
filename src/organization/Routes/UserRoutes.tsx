import Events from 'organization/Events'
import CreateEventForm from 'organization/Events/CreateEventForm'
import {organizationRoutes} from 'organization/Routes'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function UserRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path={organizationRoutes.events.create}>
          <CreateEventForm />
        </Route>
        <Route path={organizationRoutes.events.root}>
          <Events />
        </Route>
        <Redirect
          to={{
            pathname: organizationRoutes.events.root,
          }}
        />
      </Switch>
    </Layout>
  )
}
