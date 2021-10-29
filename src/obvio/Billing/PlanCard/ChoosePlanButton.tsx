import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {usePlan} from 'obvio/Billing/PlanProvider'
import {Plan} from 'obvio/Billing/plans'
import {obvioRoutes} from 'obvio/Routes'
import React from 'react'

export default function ChoosePlanButton(props: {plan: Plan}) {
  const {plan} = props

  const {canSelect, isCurrent} = usePlan()

  const upgradeUrl = `${obvioRoutes.billing.change_plan}?plan=${plan.name}`

  const canUpgrade = canSelect(plan.name)

  if (isCurrent(plan.name)) {
    return (
      <CurrentPlanButton
        variant="outlined"
        fullWidth
        color="primary"
        disableRipple
      >
        Current
      </CurrentPlanButton>
    )
  }

  return (
    <RelativeLink to={upgradeUrl} disableStyles disabled={!canUpgrade}>
      <Button
        variant="outlined"
        fullWidth
        disabled={!canUpgrade}
        aria-label={`choose ${plan} plan`}
      >
        Choose Plan
      </Button>
    </RelativeLink>
  )
}

const CurrentPlanButton = withStyles({
  root: {
    cursor: 'default',
    backgroundColor: 'transparent!important',
  },
})(Button)
