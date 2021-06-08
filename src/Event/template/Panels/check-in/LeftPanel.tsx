import StepIndicator from 'Event/template/Panels/check-in/StepIndicator'
import styled from 'styled-components'
import React from 'react'
import Logo from 'Event/Logo'
import {Step} from 'Event/template/Panels/GeneralConfig/CheckInConfig'
import {usePanels} from 'Event/template/Panels'
import {rgba} from 'lib/color'

export default function LeftPanel(props: {step: Step}) {
  const {
    template: {checkInLeftPanel},
  } = usePanels()

  return (
    <Box
      backgroundColor={rgba(
        checkInLeftPanel.backgroundColor,
        checkInLeftPanel.backgroundOpacity,
      )}
      textColor={checkInLeftPanel.textColor}
    >
      <div>
        <Menu />
        <Logo />
        <StepIndicator step={props.step} />
      </div>
    </Box>
  )
}

function Menu() {
  return null
}

const Box = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  display: flex;
  justify-content: center;
  margin: 24px;
  padding: 40px;
  background: ${(props) => props.backgroundColor};
  border-radius: 10px;
  overflow: auto;

  > * {
    color: ${(props) => props.textColor}!important;
  }
`
