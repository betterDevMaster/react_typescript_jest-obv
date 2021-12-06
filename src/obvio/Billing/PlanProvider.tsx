import {useObvioUser} from 'obvio/auth'
import {getPlan, PlanInfo, tier} from 'obvio/Billing/plans'
import React from 'react'

interface PlanContextProps {
  plan: PlanInfo | null
  isCurrent: (plan: PlanInfo['name']) => boolean
  canSelect: (plan: PlanInfo['name']) => boolean
}

const PlanContext = React.createContext<undefined | PlanContextProps>(undefined)

export default function PlanProvider(props: {children: React.ReactElement}) {
  const user = useObvioUser()
  const plan = user.plan ? getPlan(user.plan.name) : null

  const isCurrent = (target: PlanInfo['name']) =>
    plan ? plan.name === target : false

  const canSelect = (target: PlanInfo['name']) => {
    // Currently during TESTING where users are using test cards, we only
    // want to enable subscribing to users who have previously paid
    // for obv.io
    const hasPaid = user.is_founder || user.is_subscribed
    if (!hasPaid) {
      return false
    }

    const currentTier = plan ? tier(plan.name) : 0
    const targetTier = tier(target)

    return targetTier > currentTier
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        isCurrent,
        canSelect,
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
