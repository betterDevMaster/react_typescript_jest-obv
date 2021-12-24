import React from 'react'
import styled from 'styled-components'

import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'

import {rgba} from 'lib/color'
import ProgressBar from 'lib/ui/ProgressBar'

export default function RightPanel(props: {
  children: React.ReactElement
  center?: boolean
  step: Step
}) {
  const template = useFiftyBlogTemplate()
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
        checktitle={progressBar.checkInTitle}
        checkcolor={progressBar.checkInColor}
      />
      <Box textColor={checkInRightPanel.textColor} center={props.center}>
        {props.children}
      </Box>
    </Paper>
  )
}

const Paper = styled.div<{
  backgroundColor: string
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.backgroundColor};
  border: 10px;
  padding: 35px 0;
  width: 100%;
`

const Box = styled.div<{
  textColor: string
  center?: boolean
}>`
  overflow: auto;
  width: 100%;
  padding: 40px;
  > * {
    color: ${(props) => props.textColor}!important;
  }
`
