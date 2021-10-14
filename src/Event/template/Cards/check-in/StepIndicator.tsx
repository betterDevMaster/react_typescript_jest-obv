import React from 'react'
import styled from 'styled-components'
import {useCards} from 'Event/template/Cards'
import {useAttendeeVariables} from 'Event'
import {Icon} from 'lib/fontawesome/Icon'
import {Step} from 'Event/template/Cards/GeneralConfig/CheckInConfig'

export default function StepIndicator(props: {step: Step; className?: string}) {
  const {template} = useCards()

  return (
    <Box className={props.className}>
      <IconContainer>
        <StepIcon
          icon={template.checkIn.step1Icon}
          isActive={props.step >= 1}
        />
        <Divider isActive={props.step > 1} />
        <StepIcon
          icon={template.checkIn.step2Icon}
          isActive={props.step >= 2}
        />
        <Divider isActive={props.step > 2} />
        <StepIcon
          icon={template.checkIn.step3Icon}
          isActive={props.step === 3}
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
    template: {
      checkIn: {title: checkInLabel},
    },
  } = useCards()

  const v = useAttendeeVariables()
  return <Label>{v(checkInLabel)}</Label>
}

function StepLabel(props: {step: Step}) {
  const {template} = useCards()

  const labels = {
    1: template.checkIn.step1Label,
    2: template.checkIn.step2Label,
    3: template.checkIn.step3Label,
  }

  const label = labels[props.step]

  const v = useAttendeeVariables()
  return <Label color={template.checkIn.stepLabelColor}>&nbsp;{v(label)}</Label>
}

function StepIcon(props: {icon: string; isActive: boolean}) {
  const {isActive} = props
  const {template} = useCards()

  const color = () => {
    if (!isActive) {
      return template.checkIn.inActiveColor
    }

    return template.checkIn.stepLabelColor
  }
  return <StyledIcon iconClass={props.icon} color={color()} />
}

function Divider(props: {isActive: boolean}) {
  const {isActive} = props
  const {template} = useCards()

  const color = () => {
    if (!isActive) {
      return template.checkIn.inActiveColor
    }

    return template.checkIn.stepLabelColor
  }
  return <DividerLine color={color()} />
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
