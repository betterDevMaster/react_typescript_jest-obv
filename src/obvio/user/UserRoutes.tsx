import {obvioRoutes} from 'obvio/Routes'
import Layout from 'obvio/user/Layout'
import Organizations from 'obvio/user/Organizations'
import CreateOrganizationForm from 'obvio/user/Organizations/CreateOrganizationForm'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function UserRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path={obvioRoutes.organizations.create}>
          <CreateOrganizationForm />
        </Route>
        <Route path={obvioRoutes.organizations.root}>
          <Organizations />
        </Route>
        <Redirect
          to={{
            pathname: obvioRoutes.organizations.root,
          }}
        />
      </Switch>
    </Layout>
  )
}
