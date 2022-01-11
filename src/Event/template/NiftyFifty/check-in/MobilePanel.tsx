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
        textColor={checkInLeftPanel.textColor}
      >
        <LogoContent
          backgroundColor={rgba(
            checkInLeftPanel.backgroundColor,
            checkInLeftPanel.backgroundOpacity,
          )}
        >
          <Logo
            src={logo}
            hidden={stepLogoProps.hidden}
            size={stepLogoProps.size}
          />
        </LogoContent>
      </Content>
      <Paper
        backgroundColor={rgba(
          checkInRightPanel.backgroundColor,
          checkInRightPanel.backgroundOpacity,
        )}
      >
        <ProgressContent>
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
        </ProgressContent>
        <Panel>{props.children}</Panel>
      </Paper>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Paper = styled.div<{
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  border: 10px;
  padding: ${(props) => props.theme.spacing[4]};
  width: 100%;
  height: 100%;
`

const ProgressContent = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]} 0;
`

const Content = styled.div<{
  backgroundColor: string
  background: any
  isBackgroundHidden: boolean
  textColor: string
}>`
  width: 100%;
  background: ${(props) =>
    !props.isBackgroundHidden && props.background
      ? `url(${props.background})`
      : props.backgroundColor};
  background-size: cover !important;
  background-position: center;
  background-repeat: no-repeat !important;
  > * {
    color: ${(props) => props.textColor}!important;
  }
`

const LogoContent = styled.div<{
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  background-size: cover !important;
  background-position: center;
  background-repeat: no-repeat !important;
  padding: ${(props) => props.theme.spacing[5]};
  width: 100%;
`

const Panel = styled.div`
  width: 100%;
`
