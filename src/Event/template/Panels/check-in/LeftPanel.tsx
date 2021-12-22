import StepIndicator from 'Event/template/Panels/check-in/StepIndicator'
import styled from 'styled-components'
import React from 'react'
import Logo from 'Event/Logo'
import {Step} from 'Event/template/Panels/check-in/CheckInConfig'
import {usePanelsTemplate} from 'Event/template/Panels'
import {rgba} from 'lib/color'

export default function LeftPanel(props: {step: Step}) {
  const template = usePanelsTemplate()
  const {checkInLeftPanel} = template

  return (
    <Box
      backgroundColor={rgba(
        checkInLeftPanel.backgroundColor,
        checkInLeftPanel.backgroundOpacity,
      )}
      textColor={checkInLeftPanel.textColor}
    >
      <BoxInner>
        <Menu />
        <StyledLogo />
        <StepIndicator step={props.step} />
      </BoxInner>
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

const BoxInner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`

const StyledLogo = styled(Logo)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`
