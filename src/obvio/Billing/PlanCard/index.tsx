import {PlanInfo} from 'obvio/Billing/plans'
import React from 'react'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckSquare, faTimesSquare} from '@fortawesome/pro-solid-svg-icons'
import Button from '@material-ui/core/Button'
import {formatDate} from 'lib/date-time'
import {colors} from 'lib/ui/theme'
import PlanActionButton from 'obvio/Billing/PlanCard/PlanActionButton'
import {usePlan} from 'obvio/Billing/PlanProvider'
import {useGetSubscription} from 'obvio/Billing/subscribe'

export default function PlanCard(props: {plan: PlanInfo}) {
  const {plan} = props

  return (
    <Box>
      <div>
        <Name>{plan.label}</Name>
        <Price>
          <Dollars>${plan.price}</Dollars>
          <MonthLabel>/ Year</MonthLabel>
        </Price>
        <FeatureSection>
          {plan.features.map((f) => (
            <Feature feature={f} key={f.details} />
          ))}
        </FeatureSection>
      </div>
      <ButtonContainer>
        <CurrentPlanIndicator plan={plan} />
        <PlanActionButton plan={plan} />
      </ButtonContainer>
    </Box>
  )
}

const CurrentPlanIndicator = (props: {plan: PlanInfo}) => {
  const {plan} = props
  const subscription = useGetSubscription()
  const {isCurrent, isDowngradingTo} = usePlan()

  const renewDate = formatDate(subscription?.renews_at || '')
  const endDate = formatDate(subscription?.ends_at || '')
  const isDowngrade = isDowngradingTo(plan, subscription)

  if (isDowngrade) {
    return <TextButton>Renewing On: {renewDate}</TextButton>
  }

  if (!isCurrent(plan)) {
    return null
  }

  const dateText = () => {
    // If the renew_plan is this plan's name, we want to show the user that this
    // is the plan that is renewing on a date.
    if (subscription?.renew_plan === plan.name) {
      return <div>Renewing On: {renewDate}</div>
    }

    // If there is an ends_at date and we DON'T have a renew_plan value, this
    // subscription is being cancelled and we want to show WHEN it's ending.
    if (subscription?.ends_at && !subscription?.renew_plan) {
      return <div>Ending On: {endDate}</div>
    }

    // No extra information text to show to the user.
    return null
  }

  return (
    <TextButton>
      <div aria-label={`current plan ${plan.name}`}>Your Current Plan</div>
      {dateText()}
    </TextButton>
  )
}

function Feature(props: {feature: PlanInfo['features'][0]}) {
  const {feature} = props
  const iconColor = () => {
    if (!feature.isActive) {
      return '#A0A9B0'
    }

    return feature.isGood ? colors.success : colors.primary
  }

  const icon = feature.isGood ? faCheckSquare : faTimesSquare

  return (
    <FeatureBox>
      <FeatureIcon icon={icon} color={iconColor()} />
      <FeatureDetails>{feature.details}</FeatureDetails>
    </FeatureBox>
  )
}

const ButtonContainer = styled.div`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
`

const Box = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => `${props.theme.spacing[6]} ${props.theme.spacing[10]}`};
  border-radius: 15px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const Name = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing[4]};
  font-weight: normal;
`

const Price = styled.div`
  margin: 0 0 ${(props) => props.theme.spacing[8]};
  display: flex;
  align-items: flex-end;
`

const Dollars = styled.h2`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 48px;
  margin: 0;
`

const MonthLabel = styled.span`
  color: ${(props) => props.theme.colors.text.muted};
  font-weight: 300;
  margin: 0 0 4px;
`

const FeatureBox = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const FeatureIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  margin-right: ${(props) => props.theme.spacing[3]};
`

const FeatureDetails = styled.span`
  font-family: Rubik;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`

const FeatureSection = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[10]};
`

const TextButton = styled((props) => {
  return (
    <Button
      disableRipple
      disableFocusRipple
      fullWidth
      variant="text"
      {...props}
    />
  )
})`
  background-color: transparent !important;
  cursor: default;
  &:hover {
    background-color: transparent !important;
  }
  .MuiButton-label {
    flex-wrap: wrap;
  }
`
