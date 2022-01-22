import Layout from 'obvio/user/Layout'
// import styled from 'styled-components'
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
import ResumeStep from 'obvio/Billing/ResumePlanPage/ResumeStep'

export default function ResumePlanPage() {
  const plan = useGetPlanFromQueryParams()

  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Resume Plan',
      url: `${obvioRoutes.billing.resume_plan}?plan=${plan?.name}`,
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
  const endsAt = formatDate(
    subscription?.renews_at || subscription?.ends_at || '',
  )

  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <Layout>
        <Page>
          <Box textAlign="center">
            <ErrorAlert>{error}</ErrorAlert>
            <Box mb={4}>
              <Typography>
                You are resuming the <strong>{plan.name}</strong> plan.
              </Typography>
              <Typography>
                You will be billed on the renewal date of{' '}
                <strong>{endsAt}</strong>.
              </Typography>
            </Box>
            <ResumeStep onError={setError} {...props} />
          </Box>
        </Page>
      </Layout>
    </>
  )
}
