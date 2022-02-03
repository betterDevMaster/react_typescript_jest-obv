import React from 'react'
import {PaymentMethodProvider} from 'obvio/Billing/PaymentMethodProvider'
import Billing from 'obvio/Billing'
import BuyCreditsPage from 'obvio/Billing/BuyCreditsPage'
import {Route, Switch} from 'react-router-dom'
import {obvioRoutes} from 'obvio/Routes'
import ChangePlanPage from 'obvio/Billing/ChangePlanPage/ChangePlanPage'
import CancelPlanPage from 'obvio/Billing/CancelPlanPage/CancelPlanPage'
import ResumePlanPage from 'obvio/Billing/ResumePlanPage/ResumePlanPage'
import PlanProvider from 'obvio/Billing/PlanProvider'
import CreditTransactions from 'obvio/Billing/CreditTransactions'

export default function BillingRoutes() {
  return (
    <PaymentMethodProvider>
      <PlanProvider>
        <Switch>
          <Route path={obvioRoutes.billing.change_plan}>
            <ChangePlanPage />
          </Route>
          <Route path={obvioRoutes.billing.cancel_plan}>
            <CancelPlanPage />
          </Route>
          <Route path={obvioRoutes.billing.resume_plan}>
            <ResumePlanPage />
          </Route>
          <Route path={obvioRoutes.billing.buy_credits}>
            <BuyCreditsPage />
          </Route>
          <Route path={obvioRoutes.billing.credit_transactions}>
            <CreditTransactions />
          </Route>
          <Route path={obvioRoutes.billing.root}>
            <Billing />
          </Route>
        </Switch>
      </PlanProvider>
    </PaymentMethodProvider>
  )
}
