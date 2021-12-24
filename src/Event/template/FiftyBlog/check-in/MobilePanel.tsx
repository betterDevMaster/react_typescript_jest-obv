import React, {useState} from 'react'
import styled from 'styled-components'

import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {Step} from 'Event/template/FiftyBlog/check-in/CheckInConfig'
import Menu from 'Event/template/FiftyBlog/Menu'

import {rgba} from 'lib/color'
import ProgressBar from 'lib/ui/ProgressBar'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'

import {useObvioUser} from 'obvio/auth'

import defaultLogo from 'assets/images/logo.png'

export default function MobilePanel(props: {
  children: React.ReactElement
  step: Step
}) {
  const template = useFiftyBlogTemplate()
  const {checkInRightPanel, menu} = template
  const {
    stepLogo,
    stepBackground,
    checkInLeftPanel,
    stepLogoProps,
    stepBackgroundProps,
    progressBar,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : ''
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const user = useObvioUser()
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
      <LogoBox
        backgroundColor={rgba(
          checkInLeftPanel.backgroundColor,
          checkInLeftPanel.backgroundOpacity,
        )}
        backgroundImage={background}
        isBackgroundHidden={stepBackgroundProps.hidden}
        textColor={checkInLeftPanel.textColor}
      >
        <IconContainer>
          <MenuIconButton
            active={menuVisible}
            onClick={toggleMenu}
            aria-label="show side menu"
            iconColor={menu.iconColor}
          />
        </IconContainer>
        <Menu visible={menuVisible} toggle={toggleMenu} user={user} />
        <Logo
          src={logo}
          hidden={stepLogoProps.hidden}
          size={stepLogoProps.size}
          mobile={true}
        />
      </LogoBox>
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
  min-height: 100vh;
`

const IconContainer = styled.div`
  cursor: pointer;
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
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: auto;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  position: relative;

  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  > * {
    color: ${(props) => props.textColor}!important;
  }
`

const Panel = styled.div`
  overflow: auto;
  padding: 20px;
  width: 100%;
`
