import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import {Icon} from 'lib/fontawesome/Icon'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useObvioUser} from 'obvio/auth'
import {obvioRoutes} from 'obvio/Routes'
import React from 'react'

export default function BillingStatusOverlay() {
  const user = useObvioUser()

  if (!user.has_active_subscription) {
    return <SubscriptionRequiredOverlay />
  }

  if (user.has_unpaid_transactions) {
    return <HasUnpaidTransactionsOverlay />
  }

  return null
}

function SubscriptionRequiredOverlay() {
  return (
    <Overlay
      title="Inactive Subscription"
      description="Click the button below to re-activate your subscription."
    />
  )
}

export function HasUnpaidTransactionsOverlay() {
  return (
    <Overlay
      title="Unpaid Credit Transactions"
      description="To continue using your Obv.io account please add more credits."
    />
  )
}

export function Overlay(props: {
  title: string
  description: string
  hideButton?: boolean
}) {
  return (
    <Dialog open>
      <DialogContent>
        <Box>
          <WarningIcon iconClass="far fa-exclamation-triangle" />
          <Title>{props.title}</Title>
          <Description>{props.description}</Description>
          <Actions hidden={props.hideButton}>
            <RelativeLink to={obvioRoutes.billing.root} disableStyles>
              <Button variant="contained" color="primary">
                Go To Billing
              </Button>
            </RelativeLink>
          </Actions>
        </Box>
      </DialogContent>
    </Dialog>
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
