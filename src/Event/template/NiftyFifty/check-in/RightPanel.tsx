import React from 'react'
import styled from 'styled-components'

import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {Step} from 'Event/template/NiftyFifty/check-in/CheckInConfig'

import {rgba} from 'lib/color'
import ProgressBar from 'lib/ui/ProgressBar'

export default function RightPanel(props: {
  children: React.ReactElement
  center?: boolean
  step: Step
}) {
  const template = useNiftyFiftyTemplate()
  const {checkInRightPanel, progressBar} = template
  const text =
    props.step === 1
      ? progressBar.step1Text
      : props.step === 2
      ? progressBar.step2Text
      : progressBar.step3Text
  const percent =
    props.step === 1
      ? progressBar.step1Percent
      : props.step === 2
      ? progressBar.step2Percent
      : progressBar.step3Percent

  return (
    <Paper
      backgroundColor={rgba(
        checkInRightPanel.backgroundColor,
        checkInRightPanel.backgroundOpacity,
      )}
      textColor={checkInRightPanel.textColor}
    >
      <ProgressBar
        showing={progressBar.showing}
        text={text}
        value={Number(percent)}
        barColor={progressBar.barColor}
        backgroundColor={progressBar.backgroundColor}
        textColor={progressBar.textColor}
        borderRadius={progressBar.borderRadius}
        thickness={progressBar.thickness}
      />
      {props.children}
    </Paper>
  )
}

const Paper = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  background: ${(props) => props.backgroundColor};
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing[10]};
  > * {
    color: ${(props) => props.textColor}!important;
  }
`
