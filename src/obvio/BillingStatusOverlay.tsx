import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import {Icon} from 'lib/fontawesome/Icon'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useObvioUser} from 'obvio/auth'
import {obvioRoutes} from 'obvio/Routes'
import React from 'react'
import {getPlan} from 'obvio/Billing/plans'

export default function BillingStatusOverlay() {
  const user = useObvioUser()

  if (user.has_unpaid_transactions) {
    return <HasUnpaidTransactionsOverlay />
  }

  if (user.has_active_subscription && !user.has_payment_method) {
    return <CreditCardRequiredOverlay />
  }

  return null
}

export function SubscriptionRequiredOverlay() {
  return (
    <Overlay
      title="Inactive Subscription"
      description="Click the button below to re-activate your subscription."
    >
      <GoToBillingButton />
    </Overlay>
  )
}

export function CreditCardRequiredOverlay() {
  const user = useObvioUser()

  if (!user.plan) {
    return null
  }

  const planInfo = getPlan(user.plan.name)

  return (
    <Overlay
      title="Credit Card Required"
      description={`You are currently signed up for the ${planInfo.label} plan. A credit card is required to continue using Obvio. You will not be charged until your subscription renews.`}
    >
      <GoToBillingButton>Add Credit Card</GoToBillingButton>
    </Overlay>
  )
}

export function HasUnpaidTransactionsOverlay() {
  return (
    <Overlay
      title="Unpaid Credit Transactions"
      description="To continue using your Obv.io account please add more credits."
    >
      <GoToBillingButton />
    </Overlay>
  )
}

export function Overlay(props: {
  title: string
  description: string
  children: React.ReactElement
}) {
  return (
    <Dialog open>
      <DialogContent>
        <Box>
          <WarningIcon iconClass="far fa-exclamation-triangle" />
          <Title>{props.title}</Title>
          <Description>{props.description}</Description>
          <Actions>{props.children}</Actions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function GoToBillingButton(props: {children?: string}) {
  const label = props.children || 'Go To Billing'
  return (
    <RelativeLink to={obvioRoutes.billing.root} disableStyles>
      <Button variant="contained" color="primary">
        {label}
      </Button>
    </RelativeLink>
  )
}

const Actions = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

const Box = styled.div`
  text-align: center;
`

const Title = styled.h1`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
`

const Description = styled.p`
  margin: 0 0 ${(props) => props.theme.spacing[5]};
`

const WarningIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.error};
  font-size: 4rem;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
