import React from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

import Logo from 'Event/Logo'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {Step} from 'Event/template/NiftyFifty/check-in/CheckInConfig'

import {rgba} from 'lib/color'
import ProgressBar from 'lib/ui/ProgressBar'

import defaultLogo from 'assets/images/logo.png'

export default function MobilePanel(props: {
  children: React.ReactElement
  user: User
  step: Step
}) {
  const template = useNiftyFiftyTemplate()
  const {checkInRightPanel} = template
  const {
    stepLogo,
    stepBackground,
    checkInLeftPanel,
    stepLogoProps,
    stepBackgroundProps,
    progressBar,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : null
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
    <Box>
      <Content
        backgroundColor={rgba(
          checkInLeftPanel.backgroundColor,
          checkInLeftPanel.backgroundOpacity,
        )}
        background={background}
        isBackgroundHidden={stepBackgroundProps.hidden}
      >
        <LogoBox
          backgroundColor={rgba(
            checkInLeftPanel.backgroundColor,
            checkInLeftPanel.backgroundOpacity,
          )}
          textColor={checkInLeftPanel.textColor}
        >
          <Logo
            src={logo}
            hidden={stepLogoProps.hidden}
            size={stepLogoProps.size}
          />
        </LogoBox>
      </Content>
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
        />
        <Panel>{props.children}</Panel>
      </Paper>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`

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
  min-height: 80vh;
`

const Content = styled.div<{
  backgroundColor: string
  background: any
  isBackgroundHidden: boolean
}>`
  min-height: 20vh;
  width: 100%;
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) =>
    !props.isBackgroundHidden && props.background
      ? `url(${props.background})`
      : props.backgroundColor};
`

const LogoBox = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) => props.backgroundColor};
  > * {
    color: ${(props) => props.textColor}!important;
  }
`

const Panel = styled.div`
  overflow: auto;
  padding: 20px;
  width: 100%;
`
