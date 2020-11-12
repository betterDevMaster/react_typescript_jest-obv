import {organizationRoutes} from 'organization/Routes'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function UserRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path={organizationRoutes.events.create}>
          <div>Create an event...</div>
        </Route>
        <Route path={organizationRoutes.events.root}>
          <div>your events...</div>
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
