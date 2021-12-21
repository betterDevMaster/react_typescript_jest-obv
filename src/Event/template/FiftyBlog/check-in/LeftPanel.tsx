import StepIndicator from 'Event/template/FiftyBlog/check-in/StepIndicator'
import styled from 'styled-components'
import React from 'react'
import Logo from 'Event/Logo'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {rgba} from 'lib/color'
import defaultLogo from 'assets/images/logo.png'

export default function LeftPanel(props: {step: Step}) {
  const template = useFiftyBlogTemplate()
  const {checkInLeftPanel, dashboardLogo, dashboardLogoProps} = template
  const logo = dashboardLogo ? dashboardLogo : defaultLogo

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
        <Logo
          src={logo}
          hidden={dashboardLogoProps.hidden}
          size={dashboardLogoProps.size}
        />
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
