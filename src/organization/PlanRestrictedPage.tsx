import {PlanName} from 'obvio/Billing/plans'
import {useOrganization} from 'organization/OrganizationProvider'
import {useOwner} from 'organization/OwnerProvider'
import React from 'react'
import {Redirect} from 'react-router'

export default function PlanRestrictedPage(props: {
  plan: PlanName
  children: React.ReactElement
}) {
  const {owner} = useOwner()
  const {routes} = useOrganization()

  const hasRequiredPlan = owner.plan?.name === props.plan
  if (!hasRequiredPlan) {
    return <Redirect to={routes.root} />
  }

  return props.children
}
