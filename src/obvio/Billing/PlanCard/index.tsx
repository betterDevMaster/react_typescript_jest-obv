import {Plan} from 'obvio/Billing/plans'
import styled from 'styled-components'
import React from 'react'
import {colors} from 'lib/ui/theme'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckSquare, faTimesSquare} from '@fortawesome/pro-solid-svg-icons'
import ChoosePlanButton from 'obvio/Billing/PlanCard/ChoosePlanButton'

export default function PlanCard(props: {plan: Plan}) {
  const {plan} = props

  if (!plan.canSubscribe) {
    return null
  }

  return (
    <Box>
      <Name>{plan.name}</Name>
      <Price>
        <Dollars>${plan.price}</Dollars>
        <MonthLabel>/ Year</MonthLabel>
      </Price>
      <Description>{plan.description}</Description>
      <FeatureSection>
        {plan.features.map((f) => (
          <Feature feature={f} key={f.details} />
        ))}
      </FeatureSection>
      <ChoosePlanButton plan={plan} />
    </Box>
  )
}

function Feature(props: {feature: Plan['features'][0]}) {
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

const Box = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => `${props.theme.spacing[6]} ${props.theme.spacing[10]}`};
  border-radius: 15px;
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
  font-size: 42px;
  line-height: 48px;
  margin: 0;
`

const MonthLabel = styled.span`
  color: ${(props) => props.theme.colors.text.muted};
  font-weight: 300;
  margin: 0 0 4px;
`

const Description = styled.p`
  font-family: Rubik;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 ${(props) => props.theme.spacing[5]};
  color: ${(props) => props.theme.colors.text.muted};
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
