import Layout from 'obvio/user/Layout'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React, {useState} from 'react'
import {obvioRoutes} from 'obvio/Routes'
import {isPlan, PlanInfo, useGetPlanFromQueryParams} from 'obvio/Billing/plans'
import {useGetSubscription} from 'obvio/Billing/subscribe'
import {Redirect} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {formatDate} from 'lib/date-time'
import Box from '@material-ui/core/Box'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import CancelStep from 'obvio/Billing/CancelPlanPage/CancelStep'

export default function CancelPlanPage() {
  const plan = useGetPlanFromQueryParams()

  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Cancel Plan',
      url: `${obvioRoutes.billing.cancel_plan}?plan=${plan?.name}`,
    },
  ])

  if (!plan || !isPlan(plan.name)) {
    return <Redirect to={obvioRoutes.billing.root} />
  }

  return <Content plan={plan} />
}

function Content(props: {plan: PlanInfo}) {
  const {plan} = props
  const subscription = useGetSubscription()

  const endDate =
    subscription?.renews_at ||
    subscription?.ends_at ||
    subscription?.trial_ends_at ||
    ''

  const formattedEndDate = formatDate(endDate)

  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <Layout>
        <Page>
          <Box textAlign="center">
            <ErrorAlert>{error}</ErrorAlert>
            <Box mb={4}>
              <Typography>
                You are cancelling the <strong>{plan.name}</strong> plan.
              </Typography>
              <Typography>
                You will <strong>NOT</strong> be billed on the renewal date of{' '}
                <strong>{formattedEndDate}</strong>. You will continue to be
                able to use Obvio until the maturation of your plan.
              </Typography>
            </Box>
            <CancelStep onError={setError} {...props} />
          </Box>
        </Page>
      </Layout>
    </>
  )
}
