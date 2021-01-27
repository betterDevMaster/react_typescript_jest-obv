import {obvioRoutes} from 'obvio/Routes'
import Organizations from 'obvio/Organizations'
import CreateOrganizationForm from 'obvio/Organizations/CreateOrganizationForm'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function UserRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.organizations.create}>
        <CreateOrganizationForm />
      </Route>
      <Route path={obvioRoutes.organizations.root}>
        <Organizations />
      </Route>
      <Redirect to={obvioRoutes.organizations.root} />
    </Switch>
  )
}
