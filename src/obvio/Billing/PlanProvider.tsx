import {useObvioUser} from 'obvio/auth'
import React from 'react'
import {getPlan, PlanInfo, tier} from 'obvio/Billing/plans'
import {
  isActive,
  Subscription,
  SUBSCRIPTION_TYPE_ACTIVE,
} from 'obvio/Billing/subscribe'

interface PlanContextProps {
  plan: PlanInfo | null
  isCurrent: (plan: PlanInfo) => boolean
  isDowngradingTo: (plan: PlanInfo, subscription?: Subscription) => boolean
  canSelect: (plan: PlanInfo) => boolean
  canUpgrade: (plan: PlanInfo, subscription?: Subscription) => boolean
  canDowngrade: (plan: PlanInfo, subscription?: Subscription) => boolean
  canCancel: (plan: PlanInfo, subscription?: Subscription) => boolean
  canResume: (plan: PlanInfo, subscription?: Subscription) => boolean
}

const PlanContext = React.createContext<undefined | PlanContextProps>(undefined)

export default function PlanProvider(props: {children: React.ReactElement}) {
  const user = useObvioUser()
  const plan = user.plan ? getPlan(user.plan.name) : null

  const isCurrent = (target: PlanInfo) =>
    plan ? plan.name === target.name : false

  const isDowngradingTo = (target: PlanInfo, subscription?: Subscription) => {
    return target.name === subscription?.renew_plan && isActive(subscription)
  }

  const canSelect = (target: PlanInfo) => {
    const currentTier = plan ? tier(plan.name) : 0
    const targetTier = tier(target.name)

    return targetTier > currentTier
  }

  const canUpgrade = (target: PlanInfo, subscription?: Subscription) => {
    return canSelect(target) && typeof subscription !== 'undefined'
  }

  const canDowngrade = (target: PlanInfo, subscription?: Subscription) => {
    const currentTier = plan ? tier(plan.name) : 0
    const targetTier = tier(target.name)

    return targetTier < currentTier && !isDowngradingTo(target, subscription)
  }

  const canCancel = (target: PlanInfo, subscription?: Subscription) => {
    return isCurrent(target) && isActive(subscription) && !subscription?.ends_at
  }

  const canResume = (target: PlanInfo, subscription?: Subscription) => {
    return (
      isCurrent(target) &&
      subscription?.stripe_status === SUBSCRIPTION_TYPE_ACTIVE &&
      subscription?.ends_at !== null
    )
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        isCurrent,
        isDowngradingTo,
        canSelect,
        canUpgrade,
        canDowngrade,
        canCancel,
        canResume,
      }}
    >
      {props.children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = React.useContext(PlanContext)
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider')
  }

  return context
}
