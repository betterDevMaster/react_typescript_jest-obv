import React from 'react'
import styled from 'styled-components'

import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import StepIndicator from 'Event/template/FiftyBlog/check-in/StepIndicator'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'

import {rgba} from 'lib/color'

export default function RightPanel(props: {
  children: React.ReactElement
  center?: boolean
  step: Step
}) {
  const template = useFiftyBlogTemplate()
  const {checkInRightPanel} = template

  return (
    <Box
      backgroundColor={rgba(
        checkInRightPanel.backgroundColor,
        checkInRightPanel.backgroundOpacity,
      )}
      textColor={checkInRightPanel.textColor}
      center={props.center}
    >
      <StepIndicator step={props.step} />
      {props.children}
    </Box>
  )
}

const Box = styled.div<{
  backgroundColor: string
  textColor: string
  center?: boolean
}>`
  padding: 35px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) => (props.center ? 'center' : 'flex-start')};
  background: ${(props) => props.backgroundColor};
  overflow: auto;
  position: relative;
  > * {
    color: ${(props) => props.textColor}!important;
  }
`
