import Layout from 'obvio/user/Layout'
import styled from 'styled-components'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React, {useState} from 'react'
import {obvioRoutes} from 'obvio/Routes'
import {getPlan, isPlan, PlanName} from 'obvio/Billing/plans'
import {useQueryParams} from 'lib/url'
import {Redirect} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {formatPrice} from 'lib/currency'
import Box from '@material-ui/core/Box'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import SubscribeStep from 'obvio/Billing/ChangePlanPage/SubscribeStep'
import CreditCardForm from 'obvio/Billing/CreditCardManagement/CreditCardForm'

export default function ChangePlanPage() {
  const {plan} = useQueryParams()

  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Change Plan',
      url: `${obvioRoutes.billing.change_plan}?plan=${plan}`,
    },
  ])

  if (!isPlan(plan)) {
    return <Redirect to={obvioRoutes.billing.root} />
  }

  return <Content plan={plan} />
}

function Content(props: {plan: PlanName}) {
  const {plan} = props
  const info = getPlan(plan)
  const [error, setError] = useState<string | null>(null)

  const price = formatPrice(info.price)

  return (
    <>
      <Layout>
        <Page>
          <Box textAlign="center">
            <ErrorAlert>{error}</ErrorAlert>
            <Box mb={4}>
              <Typography>
                You are subscribing to the <strong>{plan}</strong> plan.
              </Typography>
              <Typography>
                <strong>
                  You will be billed now for ${price}, recurring annually until
                  cancelled.
                </strong>
              </Typography>
            </Box>
            <Step plan={plan} onError={setError} />
          </Box>
        </Page>
      </Layout>
    </>
  )
}

function Step(props: {plan: PlanName; onError: (error: string) => void}) {
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
