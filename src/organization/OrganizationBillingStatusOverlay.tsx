import Button from '@material-ui/core/Button'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useObvioUser} from 'obvio/auth'
import {
  CreditCardRequiredOverlay,
  HasUnpaidTransactionsOverlay,
  Overlay,
  SubscriptionRequiredOverlay,
} from 'obvio/BillingStatusOverlay'
import {obvioRoutes} from 'obvio/Routes'
import {useIsOwner, useOwner} from 'organization/OwnerProvider'
import React from 'react'

export function OrganizationBillingStatusOverlay() {
  const {owner} = useOwner()
  const user = useObvioUser()
  const isOwner = useIsOwner()

  if (isOwner && !user.has_active_subscription) {
    return <SubscriptionRequiredOverlay />
  }

  if (
    isOwner &&
    user.has_active_subscription &&
    !user.has_payment_method &&
    !user.is_admin
  ) {
    return <CreditCardRequiredOverlay />
  }

  if (user.has_unpaid_transactions) {
    return <HasUnpaidTransactionsOverlay />
  }

  if (!owner.has_active_subscription) {
    return <OwnerRequiresSubscriptionOverlay />
  }

  if (owner.has_unpaid_transactions) {
    return <OnwerHasUnpaidTransactionsOverlay />
  }

  if (!owner.has_payment_method && !owner.is_admin) {
    return <OwnerCreditCardRequiredOverlay />
  }

  return null
}

function OwnerRequiresSubscriptionOverlay() {
  return (
    <Overlay
      title="Inactive Subscription"
      description="The owner of this event does not have an active subscription."
    >
      <BackToOrganizationsButton />
    </Overlay>
  )
}

function OnwerHasUnpaidTransactionsOverlay() {
  return (
    <Overlay
      title="Unpaid Credit Transactions"
      description="The owner of this event needs to add more credits."
    >
      <BackToOrganizationsButton />
    </Overlay>
  )
}

function OwnerCreditCardRequiredOverlay() {
  return (
    <Overlay
      title="Credit Card Required"
      description="The owner of this event needs to add a credit card to their account."
    >
      <BackToOrganizationsButton />
    </Overlay>
  )
}

function BackToOrganizationsButton() {
  return (
    <RelativeLink to={obvioRoutes.organizations.root} disableStyles>
      <Button variant="contained" color="primary">
        Return to My Organizations
      </Button>
    </RelativeLink>
  )
}
