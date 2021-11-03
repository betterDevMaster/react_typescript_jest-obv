import BillingStatusOverlay, {Overlay} from 'obvio/BillingStatusOverlay'
import {useOwner} from 'organization/OwnerProvider'
import React from 'react'

export function OrganizationBillingStatusOverlay() {
  const owner = useOwner()

  const userOverlay = BillingStatusOverlay()
  if (userOverlay) {
    return <>{userOverlay}</>
  }

  if (!owner.has_active_subscription) {
    return <SubscriptionRequiredOverlay />
  }

  if (owner.has_unpaid_transactions) {
    return <HasUnpaidTransactionsOverlay />
  }

  return null
}

function SubscriptionRequiredOverlay() {
  return (
    <Overlay
      title="Inactive Subscription"
      description="The owner of this event does not have an active subscription."
      hideButton
    />
  )
}

function HasUnpaidTransactionsOverlay() {
  return (
    <Overlay
      title="Unpaid Credit Transactions"
      description="The owner of this event needs to add more credits."
      hideButton
    />
  )
}
