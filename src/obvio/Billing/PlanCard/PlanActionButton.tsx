import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {PlanInfo, FOUNDER} from 'obvio/Billing/plans'
import {usePlan} from 'obvio/Billing/PlanProvider'
import {useGetSubscription} from 'obvio/Billing/subscribe'
import {obvioRoutes} from 'obvio/Routes'
import {colors} from 'lib/ui/theme'

export default function PlanActionButton(props: {plan: PlanInfo}) {
  const {plan} = props
  const {
    canCancel,
    canDowngrade,
    canResume,
    canUpgrade,
    isDowngradingTo,
  } = usePlan()
  const subscription = useGetSubscription()

  if (isDowngradingTo(plan, subscription)) {
    return null
  }

  if (canResume(plan, subscription)) {
    return <ResumePlanButton plan={plan} />
  }

  if (canCancel(plan, subscription)) {
    return <CancelPlanButton plan={plan} />
  }

  if (canUpgrade(plan, subscription)) {
    return <UpgradePlanButton plan={plan} />
  }

  if (canDowngrade(plan, subscription)) {
    return <DowngradePlanButton plan={plan} />
  }

  return <ChoosePlanButton plan={plan} />
}

const StyledLink = styled((props) => {
  const {children, ...otherProps} = props

  return (
    <RelativeLink disableStyles {...otherProps}>
      {children}
    </RelativeLink>
  )
})<{
  children: React.ReactElement | React.ReactElement[]
}>`
  width: 100%;
`

function CancelPlanButton(props: {plan: PlanInfo}) {
  const {plan} = props
  const cancelUrl = `${obvioRoutes.billing.cancel_plan}?plan=${plan.name}`

  return (
    <StyledLink to={cancelUrl}>
      <StyledButton
        color={colors.error}
        aria-label={`cancel ${plan.name} plan`}
      >
        Cancel Plan
      </StyledButton>
    </StyledLink>
  )
}

function ResumePlanButton(props: {plan: PlanInfo}) {
  const {plan} = props
  const resumeUrl = `${obvioRoutes.billing.resume_plan}?plan=${plan.name}`

  return (
    <StyledLink to={resumeUrl}>
      <StyledButton
        color={colors.primary}
        aria-label={`resume ${plan.name} plan`}
      >
        Resume Plan
      </StyledButton>
    </StyledLink>
  )
}

function UpgradePlanButton(props: {plan: PlanInfo}) {
  const {plan} = props
  const upgradeUrl = `${obvioRoutes.billing.change_plan}?plan=${plan.name}`

  if (plan.name === FOUNDER) {
    return <ChoosePlanButton plan={plan} />
  }

  return (
    <StyledLink to={upgradeUrl}>
      <StyledButton aria-label={`upgrade ${plan.name} plan`}>
        Upgrade Plan
      </StyledButton>
    </StyledLink>
  )
}

function ChoosePlanButton(props: {plan: PlanInfo}) {
  const {plan} = props
  const upgradeUrl = `${obvioRoutes.billing.change_plan}?plan=${plan.name}`

  return (
    <StyledLink to={upgradeUrl}>
      <StyledButton aria-label={`choose ${plan.name} plan`}>
        Choose Plan
      </StyledButton>
    </StyledLink>
  )
}

function DowngradePlanButton(props: {plan: PlanInfo}) {
  const {plan} = props
  const downgradeUrl = `${obvioRoutes.billing.change_plan}?plan=${plan.name}&downgrade`

  return (
    <StyledLink to={downgradeUrl}>
      <StyledButton aria-label={`downgrade ${plan.name} plan`}>
        Downgrade Plan
      </StyledButton>
    </StyledLink>
  )
}

const StyledButton = styled((props) => {
  const {children, color: _, ...otherProps} = props

  return (
    <Button variant="outlined" fullWidth {...otherProps}>
      {children}
    </Button>
  )
})<{
  color: string
}>`
  background-color: transparent !important;
  border: solid 1px ${(props) => props.color};
  color: ${(props) => props.color};
  margintop: 9px;
`
