import Layout from 'obvio/user/Layout'
import styled from 'styled-components'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React from 'react'
import {obvioRoutes} from 'obvio/Routes'
import Title from 'lib/ui/typography/Title'
import Divider from 'lib/ui/layout/Divider'
import Subheading from 'lib/ui/typography/Subheading'
import CreditBalance from 'obvio/Billing/CreditBalance'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextContainer from 'lib/ui/typography/TextContainer'
import Box from '@material-ui/core/Box'
import {useAvailablePlans} from 'obvio/Billing/plans'
import Grid from '@material-ui/core/Grid'
import PlanCard from 'obvio/Billing/PlanCard'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import CreditCardManagement from 'obvio/Billing/CreditCardManagement'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import IfHasRegisteredCard from 'obvio/Billing/IfHasRegisteredCard'
import {useObvioUser} from 'obvio/auth'
import UnpaidCredits from 'obvio/Billing/UnpaidCredits'

export default function Billing() {
  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
  ])

  const {paymentMethod} = usePaymentMethod()

  const plans = useAvailablePlans()

  return (
    <Layout>
      <Page>
        <Title>Billing & Subscription</Title>
        <Divider />
        <CreditCardSection />
        <Section>
          <Subheading>Credits</Subheading>
          <StyledCreditBalance />
          <UnpaidCredits />
          <IfHasRegisteredCard>
            <PurchaseCreditsLink
              to={obvioRoutes.billing.buy_credits}
              disableStyles
            >
              <Button
                variant="contained"
                color="primary"
                disabled={!paymentMethod}
              >
                Purchase Credits
              </Button>
            </PurchaseCreditsLink>
          </IfHasRegisteredCard>
          <RelativeLink
            to={obvioRoutes.billing.credit_transactions}
            disableStyles
          >
            <Button variant="outlined" color="primary">
              View Transactions
            </Button>
          </RelativeLink>
        </Section>
        <Divider />
        <Subheading>Plans & Pricing</Subheading>
        <Box mb={8}>
          <TextContainer>
            <Typography>
              Pick an account plan that fits your workflow. Add a site plan to
              any project when it's ready to go live.
            </Typography>
          </TextContainer>
        </Box>
        <Grid container spacing={8}>
          {plans.map((plan) => (
            <Grid xs={12} lg key={plan.name} item>
              <PlanCard plan={plan} />
            </Grid>
          ))}
        </Grid>
      </Page>
    </Layout>
  )
}

function CreditCardSection() {
  const {paymentMethod} = usePaymentMethod()

  const user = useObvioUser()

  /**
   * If the user doesn't have an active subscription, we'll want them to select a plan
   * first before adding a card. If they DO have a subscription we'll always show
   * this section so they can add a card before the subscription lapses.
   */
  const showingCardSection =
    Boolean(paymentMethod) || user.has_active_subscription

  if (!showingCardSection) {
    return null
  }

  return (
    <>
      <Section>
        <Subheading>Credit Card</Subheading>
        <CreditCardManagement />
      </Section>
      <Divider />
    </>
  )
}

const StyledCreditBalance = styled(CreditBalance)`
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const Section = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[16]};
`

const PurchaseCreditsLink = styled(RelativeLink)`
  margin-right: ${(props) => props.theme.spacing[2]};
`
