import {useObvioUser} from 'obvio/auth'
import {HasUnpaidTransactionsOverlay, Overlay} from 'obvio/BillingStatusOverlay'
import {useOwner} from 'organization/OwnerProvider'
import React from 'react'

export function OrganizationBillingStatusOverlay() {
  const owner = useOwner()
  const user = useObvioUser()

  if (user.has_unpaid_transactions) {
    return <HasUnpaidTransactionsOverlay />
  }

  if (!owner.has_active_subscription) {
    return <OwnerRequiresSubscriptionOverlay />
  }

  if (owner.has_unpaid_transactions) {
    return <OnwerHasUnpaidTransactionsOverlay />
  }

  return null
}

function OwnerRequiresSubscriptionOverlay() {
  return (
    <Overlay
      title="Inactive Subscription"
      description="The owner of this event does not have an active subscription."
      hideButton
    />
  )
}

function OnwerHasUnpaidTransactionsOverlay() {
  return (
    <Overlay
      title="Unpaid Credit Transactions"
      description="The owner of this event needs to add more credits."
      hideButton
    />
  )
}
