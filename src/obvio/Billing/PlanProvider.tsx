import {useObvioUser} from 'obvio/auth'
import {getPlan, Plan, tier} from 'obvio/Billing/plans'
import React from 'react'

interface PlanContextProps {
  plan: Plan | null
  isCurrent: (plan: Plan['name']) => boolean
  canSelect: (plan: Plan['name']) => boolean
}

const PlanContext = React.createContext<undefined | PlanContextProps>(undefined)

export default function PlanProvider(props: {children: React.ReactElement}) {
  const user = useObvioUser()
  const plan = user.plan ? getPlan(user.plan) : null

  const isCurrent = (target: Plan['name']) =>
    plan ? plan.name === target : false

  const canSelect = (target: Plan['name']) => {
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
