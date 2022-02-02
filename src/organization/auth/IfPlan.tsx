import React from 'react'
import {Redirect} from 'react-router-dom'
import {PlanName, tier} from 'obvio/Billing/plans'
import {useOwner} from 'organization/OwnerProvider'

export default function IfPlan(props: {
  plan: string
  redirect?: string
  orHigher?: boolean
  orLower?: boolean
  children: React.ReactElement | React.ReactElement[]
}) {
  const {children, orHigher, orLower, plan: requiredPlan, redirect} = props
  const {owner} = useOwner()

  const planToEvaluate = owner?.plan?.name || null

  // If the current user has a plan and it happens to be the required one, or if
  // the owner of the user's organization has the required plan, we can render
  // what is being guarded.
  if (planToEvaluate === requiredPlan) {
    return <>{children}</>
  }

  // If the current user/owner plan can be lower than the required, check the
  // tier of the current plan to ensure it's below the upper bound and render
  // what is being guarded.
  if (
    orLower &&
    tier(planToEvaluate as PlanName) < tier(requiredPlan as PlanName)
  ) {
    return <>{children}</>
  }

  // If the current user/owner plan can be higher than the required, check the
  // tier of the current plan to ensure it's above the lower bound and render
  // what is being guarded.
  if (
    orHigher &&
    tier(planToEvaluate as PlanName) > tier(requiredPlan as PlanName)
  ) {
    return <>{children}</>
  }

  // At this point, current user/owner does not have the required plan to view
  // what is being guarded, and a redirect location has been provided, so we'll
  // send them on their way.
  if (redirect) {
    return <Redirect to={redirect} />
  }

  // Current user/owner doens't have the required plan and we haven't been told
  // to redirect anywhere, so render nothing.
  return null
}
