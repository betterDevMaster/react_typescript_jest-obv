import Logo from 'Event/Logo'
import styled from 'styled-components'
import StepIndicator from 'Event/template/Panels/check-in/StepIndicator'
import React from 'react'
import {usePanels} from 'Event/template/Panels'
import {Step} from 'Event/template/Panels/GeneralConfig/CheckInConfig'
import {rgba} from 'lib/color'

export default function MobilePanel(props: {
  children: React.ReactElement
  step: Step
}) {
  const {
    template: {checkInRightPanel},
  } = usePanels()

  return (
    <Box>
      <LogoBox>
        <Logo />
      </LogoBox>
      <StyledStepIndicator horizontal step={props.step} />
      <Panel
        backgroundColor={rgba(
          checkInRightPanel.backgroundColor,
          checkInRightPanel.backgroundOpacity,
        )}
      >
        {props.children}
      </Panel>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const LogoBox = styled.div`
  max-width: 260px;
  max-height: 260px;
`

const StyledStepIndicator = styled(StepIndicator)`
  margin-bottom: 80px;
`

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 24px 24px 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.backgroundColor};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: calc(100% - 40px);
  }
`
