import React from 'react'
import styled from 'styled-components'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useAttendeeVariables} from 'Event'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'

export default function StepIndicator(props: {
  step: Step
  className?: string
  horizontal?: boolean
}) {
  const template = useFiftyBlogTemplate()

  return (
    <InactiveProgress
      backgroundColor={template.checkInRightPanel.progressInActiveColor}
    >
      <ActiveProgress
        backgroundColor={template.checkInRightPanel.progressActiveColor}
        step={props.step}
      ></ActiveProgress>
      <LabelContainer>
        <CheckInLabel />
        <StepLabel step={props.step} />
      </LabelContainer>
    </InactiveProgress>
  )
}

function CheckInLabel() {
  const template = useFiftyBlogTemplate()

  const v = useAttendeeVariables()
  return (
    <Label marginRight={1} color={template.checkInColor}>
      {v(template.checkInTitle)}
    </Label>
  )
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

const InactiveProgress = styled.div<{
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  width: 90%;
  height: 2.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  position: absolute;
  top: 5%;
`

const ActiveProgress = styled.div<{
  backgroundColor: string
  step: number
}>`
  background: ${(props) => props.backgroundColor};
  width: ${(props) => 33.3 * props.step}%;
  z-index: 1;
  height: 100%;
  left: 0;
  position: absolute;
  border-radius: 5px;
`

const LabelContainer = styled.div`
  display: flex;
  z-index: 2;
`

const Label = styled.h5<{
  color?: string
  marginRight?: number
}>`
  margin: 0;
  ${(props) => (props.color ? `color: ${props.color};` : '')}
  ${(props) =>
    props.marginRight ? `margin-right: ${props.marginRight}rem;` : ''}
  line-height: 36px;
`
