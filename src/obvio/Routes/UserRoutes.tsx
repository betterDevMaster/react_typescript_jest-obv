import {obvioRoutes} from 'obvio/Routes'
import Organizations from 'obvio/Organizations'
import CreateOrganizationForm from 'obvio/Organizations/CreateOrganizationForm'
import React from 'react'
import {Redirect, Route, Switch, useLocation} from 'react-router-dom'
import ChangePassword from 'obvio/ChangePasswordPage'
import BillingRoutes from 'obvio/Billing/BillingRoutes'
import AuthCallbackHandler from 'organization/Event/Services/Apps/Mailchimp/AuthCallbackHandler'
import {useObvioUser} from 'obvio/auth'

export default function UserRoutes() {
  return (
    <Switch>
      <Route path={obvioRoutes.billing.root}>
        <BillingRoutes />
      </Route>
      <Route>
        <SubscribedUserRoutes />
      </Route>
    </Switch>
  )
}

function SubscribedUserRoutes() {
  /**
   * If a user doesn't have an active subscription we'll redirect
   * them back to billing.
   */
  const shouldRedirectToBilling = useShouldRedirectToBilling()
  if (shouldRedirectToBilling) {
    return <Redirect to={obvioRoutes.billing.root} />
  }

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

/**
 * If the user does NOT have an active subscription, we'll ALWAYS.
 * redirect them to the billing page.
 */
function useShouldRedirectToBilling() {
  const user = useObvioUser()
  const {pathname} = useLocation()
  const isBillingRoute = /\/billing.*/.test(pathname)

  if (user.has_active_subscription) {
    return false
  }

  return !isBillingRoute
}
