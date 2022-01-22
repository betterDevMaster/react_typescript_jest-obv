import Layout from 'obvio/user/Layout'
import styled from 'styled-components'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React, {useState} from 'react'
import {obvioRoutes} from 'obvio/Routes'
import {isPlan, PlanInfo, useGetPlanFromQueryParams} from 'obvio/Billing/plans'
import {useQueryParams} from 'lib/url'
import {Redirect} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {formatPrice} from 'lib/currency'
import Box from '@material-ui/core/Box'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import SubscribeStep from 'obvio/Billing/ChangePlanPage/SubscribeStep'
import {useGetSubscription} from '../subscribe'
import CreditCardForm from 'obvio/Billing/CreditCardManagement/NewCardForm'
import {formatDate} from 'lib/date-time'

export default function ChangePlanPage() {
  const params = useQueryParams()
  const plan = useGetPlanFromQueryParams()

  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Change Plan',
      url: `${obvioRoutes.billing.change_plan}?plan=${plan?.name}`,
    },
  ])

  if (!plan || !isPlan(plan.name)) {
    return <Redirect to={obvioRoutes.billing.root} />
  }

  return <Content plan={plan} downgrade={'downgrade' in params} />
}

function Content(props: {plan: PlanInfo; downgrade: boolean}) {
  const {downgrade, plan} = props
  const subscription = useGetSubscription()
  const [error, setError] = useState<string | null>(null)

  const price = formatPrice(plan.price)
  const actionText = downgrade ? 'downgrading' : 'subscribing'

  const billedOn = () => {
    if (subscription?.renews_at) {
      return (
        <>
          on <strong>{formatDate(subscription.renews_at)}</strong>
        </>
      )
    }

    return <strong>now</strong>
  }

  return (
    <>
      <Layout>
        <Page>
          <Box textAlign="center">
            <ErrorAlert>{error}</ErrorAlert>
            <Box mb={4}>
              <Typography>
                You are {actionText} to the <strong>{plan.name}</strong> plan.
              </Typography>
              <Typography>
                You will be billed {billedOn()} for <strong>${price}</strong>,
                recurring annually until cancelled.
              </Typography>
            </Box>
            <Step downgrade={downgrade} plan={plan} onError={setError} />
          </Box>
        </Page>
      </Layout>
    </>
  )
}

function Step(props: {
  plan: PlanInfo
  downgrade: boolean
  onError: (error: string) => void
}) {
  const {paymentMethod} = usePaymentMethod()

  if (!paymentMethod) {
    return <StyledCreditCardForm />
  }

  return <SubscribeStep paymentMethod={paymentMethod} {...props} />
}

const StyledCreditCardForm = styled(CreditCardForm)`
  form {
    margin: 0 auto;
  }
`
