import React from 'react'
import styled from 'styled-components'
import {useCardsTemplate} from 'Event/template/Cards'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import {Icon} from 'lib/fontawesome/Icon'
import {Step} from 'Event/template/Cards/check-in/CheckInConfig'

export default function StepIndicator(props: {step: Step; className?: string}) {
  const {checkIn} = useCardsTemplate()
  const {event, hasWaiver, hasTechCheck} = useEvent()

  return (
    <Box className={props.className}>
      <IconContainer>
        <StepBox
          step={1}
          currentStep={props.step}
          icon={checkIn.step1Icon}
          showing={event.requires_attendee_password}
          isLast={!hasWaiver && !hasTechCheck}
        />
        <StepBox
          step={2}
          currentStep={props.step}
          icon={checkIn.step2Icon}
          showing={hasWaiver}
          isLast={!hasTechCheck}
        />
        <StepBox
          step={3}
          currentStep={props.step}
          icon={checkIn.step3Icon}
          showing={hasTechCheck}
          isLast
        />
      </IconContainer>
      <LabelContainer>
        <CheckInLabel />
        <StepLabel step={props.step} />
      </LabelContainer>
    </Box>
  )
}

function CheckInLabel() {
  const {
    checkIn: {title: checkInLabel, titleColor},
  } = useCardsTemplate()

  const v = useAttendeeVariables()
  return <Label color={titleColor}>{v(checkInLabel)}</Label>
}

function StepLabel(props: {step: Step}) {
  const {checkIn} = useCardsTemplate()

  const labels = {
    1: checkIn.step1Label,
    2: checkIn.step2Label,
    3: checkIn.step3Label,
  }

  const label = labels[props.step]

  const v = useAttendeeVariables()
  return <Label color={checkIn.stepLabelColor}>&nbsp;{v(label)}</Label>
}

function StepIcon(props: {icon: string; isActive: boolean}) {
  const {isActive} = props
  const {checkIn} = useCardsTemplate()
  const color = isActive ? checkIn.stepIconColor : checkIn.inActiveColor

  return <StyledIcon iconClass={props.icon} color={color} />
}

function Divider(props: {isActive: boolean; showing: boolean}) {
  const {isActive, showing} = props
  const {checkIn} = useCardsTemplate()
  const color = isActive ? checkIn.stepIconColor : checkIn.inActiveColor

  if (!showing) {
    return null
  }

  return <DividerLine color={color} />
}

function StepBox(props: {
  step: number
  currentStep: number
  icon: string
  showing: boolean
  isLast?: boolean
}) {
  const {showing, isLast} = props

  if (!showing) {
    return null
  }

  const isActive = props.currentStep >= props.step

  return (
    <>
      <StepIcon icon={props.icon} isActive={isActive} />
      <Divider isActive={isActive} showing={!isLast} />
    </>
  )
}

const Label = styled.h4<{
  color?: string
}>`
  ${(props) => (props.color ? `color: ${props.color};` : '')}
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  line-height: 36px;
`

const Box = styled.div`
  text-align: center;
`

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

const IconContainer = styled.div<{
  horizontal?: boolean
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const StyledIcon = styled(Icon)`
  font-size: 40px;
`

const DividerLine = styled.div<{color: string}>`
  background: ${(props) => props.color};
  width: 120px;
  height: 4px;
  margin: 8px;
  border-radius: 10px;
`
