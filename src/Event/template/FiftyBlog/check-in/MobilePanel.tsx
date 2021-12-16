import Logo from 'Event/Logo'
import styled from 'styled-components'
import StepIndicator from 'Event/template/FiftyBlog/check-in/StepIndicator'
import React from 'react'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'
import {rgba} from 'lib/color'

export default function MobilePanel(props: {
  children: React.ReactElement
  step: Step
}) {
  const template = useFiftyBlogTemplate()
  const {checkInRightPanel} = template

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
  overflow: auto;
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
