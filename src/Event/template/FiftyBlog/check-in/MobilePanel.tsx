import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

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
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : ''
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const user = useObvioUser()

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
      <Panel
        backgroundColor={rgba(
          checkInRightPanel.backgroundColor,
          checkInRightPanel.backgroundOpacity,
        )}
      >
        <Container>
          <ProgressBar
            showing={template.progressBar.showing}
            text={template.progressBar.step1Text}
            value={template.progressBar.step1Percent}
            barColor={template.progressBar.barColor}
            backgroundColor={template.progressBar.backgroundColor}
            textColor={template.progressBar.textColor}
            borderRadius={template.progressBar.borderRadius}
            thickness={template.progressBar.thickness}
            checkInTitle={template.progressBar.checkInTitle}
            checkInColor={template.progressBar.checkInColor}
          />
        </Container>
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
  overflow: hidden;
`

const Container = styled.div`
  position: absolute;
  top: 5%;
  left: 0;
  width: 100%;
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

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 80px 24px 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.backgroundColor};
  position: relative;
  width: 100%;
`
