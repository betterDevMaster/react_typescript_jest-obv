import React from 'react'
import styled from 'styled-components'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useAttendeeVariables} from 'Event'
import {useEvent} from 'Event/EventProvider'
import {Icon} from 'lib/fontawesome/Icon'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'

export default function StepIndicator(props: {
  step: Step
  className?: string
  horizontal?: boolean
}) {
  const template = useFiftyBlogTemplate()
  const {event, hasWaiver, hasTechCheck} = useEvent()

  return (
    <Box className={props.className}>
      <LabelContainer>
        <CheckInLabel />
        <StepLabel step={props.step} />
      </LabelContainer>
      <IconContainer horizontal={props.horizontal}>
        <StepBox
          step={1}
          currentStep={props.step}
          horizontal={props.horizontal}
          icon={template.step1Icon}
          showing={event.requires_attendee_password}
          isLast={!hasWaiver && !hasTechCheck}
        />
        <StepBox
          step={2}
          currentStep={props.step}
          horizontal={props.horizontal}
          icon={template.step2Icon}
          showing={hasWaiver}
          isLast={!hasTechCheck}
        />
        <StepBox
          step={3}
          currentStep={props.step}
          horizontal={props.horizontal}
          icon={template.step3Icon}
          showing={hasTechCheck}
          isLast
        />
      </IconContainer>
    </Box>
  )
}

function CheckInLabel() {
  const template = useFiftyBlogTemplate()

  const v = useAttendeeVariables()
  return <Label>{v(template.checkInTitle)}</Label>
}

function StepLabel(props: {step: Step}) {
  const template = useFiftyBlogTemplate()

  const labels = {
    1: template.step1Label,
    2: template.step2Label,
    3: template.step3Label,
  }

  const label = labels[props.step]

  const v = useAttendeeVariables()
  return <Label color={template.stepLabelColor}>{v(label)}</Label>
}

function StepIcon(props: {icon: string; isActive: boolean}) {
  const {isActive} = props
  const template = useFiftyBlogTemplate()
  const color = isActive ? template.stepIconColor : template.stepInactiveColor

  return <StyledIcon iconClass={props.icon} color={color} />
}

function Divider(props: {
  isActive: boolean
  horizontal?: boolean
  showing: boolean
}) {
  const {isActive, showing, horizontal} = props
  const template = useFiftyBlogTemplate()
  const color = isActive ? template.stepIconColor : template.stepInactiveColor

  if (!showing) {
    return null
  }

  return <DividerLine color={color} horizontal={horizontal} />
}

function StepBox(props: {
  step: number
  currentStep: number
  horizontal?: boolean
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
      <Divider
        horizontal={props.horizontal}
        isActive={isActive}
        showing={!isLast}
      />
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
  margin-bottom: 20px;
`

const IconContainer = styled.div<{
  horizontal?: boolean
}>`
  display: flex;
  flex-direction: ${(props) => (props.horizontal ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
`

const StyledIcon = styled(Icon)`
  font-size: 40px;
`

const DividerLine = styled.div<{horizontal?: boolean; color: string}>`
  background: ${(props) => props.color};
  width: ${(props) => (props.horizontal ? '120px' : '4px')};
  height: ${(props) => (props.horizontal ? '4px' : '80px')};
  margin: 8px;
  border-radius: 10px;
`
