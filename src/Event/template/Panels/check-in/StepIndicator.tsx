import React from 'react'
import styled from 'styled-components'
import {DEFAULTS, usePanelsTemplate} from 'Event/template/Panels'
import {useAttendeeVariables} from 'Event'
import {Icon} from 'lib/fontawesome/Icon'
import {Step} from 'Event/template/Panels/check-in/CheckInConfig'

export default function StepIndicator(props: {
  step: Step
  className?: string
  horizontal?: boolean
}) {
  const template = usePanelsTemplate()

  return (
    <Box className={props.className}>
      <LabelContainer>
        <CheckInLabel />
        <StepLabel step={props.step} />
      </LabelContainer>
      <IconContainer horizontal={props.horizontal}>
        <StepIcon
          icon={template.step1Icon || DEFAULTS.step1Icon}
          isActive={props.step >= 1}
        />
        <Divider horizontal={props.horizontal} isActive={props.step > 1} />
        <StepIcon
          icon={template.step2Icon || DEFAULTS.step2Icon}
          isActive={props.step >= 2}
        />
        <Divider horizontal={props.horizontal} isActive={props.step > 2} />
        <StepIcon
          icon={template.step3Icon || DEFAULTS.step3Icon}
          isActive={props.step === 3}
        />
      </IconContainer>
    </Box>
  )
}

function CheckInLabel() {
  const template = usePanelsTemplate()

  const v = useAttendeeVariables()
  return <Label>{v(template.checkInTitle)}</Label>
}

function StepLabel(props: {step: Step}) {
  const template = usePanelsTemplate()

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
  const template = usePanelsTemplate()

  const color = () => {
    if (!isActive) {
      return template.checkInLeftPanel.inactiveTextColor
    }

    return template.checkInLeftPanel.textColor
  }
  return <StyledIcon iconClass={props.icon} color={color()} />
}

function Divider(props: {isActive: boolean; horizontal?: boolean}) {
  const {isActive, horizontal} = props
  const template = usePanelsTemplate()

  const color = () => {
    if (!isActive) {
      return template.checkInLeftPanel.inactiveTextColor
    }

    return template.checkInLeftPanel.textColor
  }
  return <DividerLine color={color()} horizontal={horizontal} />
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
