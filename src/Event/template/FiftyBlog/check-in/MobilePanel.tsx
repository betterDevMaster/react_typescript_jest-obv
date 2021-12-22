import React from 'react'
import styled from 'styled-components'
import {Icon} from '@material-ui/core'

import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'
import StepIndicator from 'Event/template/FiftyBlog/check-in/StepIndicator'

import {rgba} from 'lib/color'

import defaultLogo from 'assets/images/logo.png'
import defaultBackground from 'assets/images/background.png'

export default function MobilePanel(props: {
  children: React.ReactElement
  step: Step
}) {
  const template = useFiftyBlogTemplate()
  const {checkInRightPanel} = template
  const {
    stepLogo,
    stepBackground,
    checkInLeftPanel,
    stepLogoProps,
    stepBackgroundProps,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : defaultBackground

  return (
    <Box>
      {/* <LogoBox>
        <Logo />
      </LogoBox> */}
      <LogoBox
        backgroundColor={rgba(
          checkInLeftPanel.backgroundColor,
          checkInLeftPanel.backgroundOpacity,
        )}
        backgroundImage={background}
        isBackgroundHidden={stepBackgroundProps.hidden}
        textColor={checkInLeftPanel.textColor}
      >
        <Menu />
        <Logo
          src={logo}
          hidden={stepLogoProps.hidden}
          size={stepLogoProps.size}
          mobile={true}
        />
      </LogoBox>
      <Panel
        backgroundColor={rgba(
          checkInRightPanel.backgroundColor,
          checkInRightPanel.backgroundOpacity,
        )}
      >
        <StepIndicator step={props.step} />
        {props.children}
      </Panel>
    </Box>
  )
}

function Menu() {
  return (
    <MenuIcon>
      <Icon>menu</Icon>
    </MenuIcon>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow: auto;
`

const LogoBox = styled.div<{
  backgroundColor: string
  textColor: string
  backgroundImage: string
  isBackgroundHidden: boolean
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: auto;
  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  > * {
    color: ${(props) => props.textColor}!important;
  }
`

const MenuIcon = styled.div`
  cursor: pointer;
`

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 24px 24px 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.backgroundColor};
  position: relative;
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`
