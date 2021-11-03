import {obvioRoutes} from 'obvio/Routes'
import Organizations from 'obvio/Organizations'
import CreateOrganizationForm from 'obvio/Organizations/CreateOrganizationForm'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import ChangePassword from 'obvio/ChangePasswordPage'
import BillingRoutes from 'obvio/Billing/BillingRoutes'
import AuthCallbackHandler from 'organization/Event/Services/Apps/Mailchimp/AuthCallbackHandler'
import BillingStatusOverlay from 'obvio/BillingStatusOverlay'

export default function UserRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.billing.root}>
        <BillingRoutes />
      </Route>
      <Route>
        <BillingStatusOverlay />
        <SubscribedUserRoutes />
      </Route>
    </Switch>
  )
}

function SubscribedUserRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.organizations.create}>
        <CreateOrganizationForm />
      </Route>
      <Route path={obvioRoutes.organizations.root}>
        <Organizations />
      </Route>
      <Route path={obvioRoutes.change_password}>
        <ChangePassword />
      </Route>
      <Route path={obvioRoutes.mailchimp.auth}>
        <AuthCallbackHandler />
      </Route>
      <Redirect to={obvioRoutes.organizations.root} />
    </Switch>
  )
}
