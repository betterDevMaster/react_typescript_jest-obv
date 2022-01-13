import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'
import Logo from 'Event/Logo'
import Menu from 'Event/template/NiftyFifty/Menu'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'

import defaultLogo from 'assets/images/logo.png'

export default function LeftPanel(props: {user: User}) {
  const template = useNiftyFiftyTemplate()
  const {
    checkInLeftPanel,
    menu,
    stepBackground,
    stepBackgroundProps,
    stepLogo,
    stepLogoProps,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : null
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  return (
    <Paper
      backgroundColor={rgba(
        checkInLeftPanel.backgroundColor,
        checkInLeftPanel.backgroundOpacity,
      )}
      background={background}
      isBackgroundHidden={stepBackgroundProps.hidden}
    >
      <Box
        backgroundColor={rgba(
          checkInLeftPanel.backgroundColor,
          checkInLeftPanel.backgroundOpacity,
        )}
      >
        <StyledMenuIconButton
          active={menuVisible}
          iconColor={menu.menuColor}
          onClick={toggleMenu}
          aria-label="menu icon button"
        />
        <Menu visible={menuVisible} toggle={toggleMenu} user={props.user} />

        <Logo
          src={logo}
          hidden={stepLogoProps.hidden}
          size={stepLogoProps.size}
        />
      </Box>
    </Paper>
  )
}

const Paper = styled.div<{
  backgroundColor: string
  background: any
  isBackgroundHidden: boolean
}>`
  background: ${(props) =>
    !props.isBackgroundHidden && props.background
      ? `url(${props.background}) no-repeat center fixed`
      : props.backgroundColor};
  background-size: cover;
  width: 100%;
  height: 100%;
`

const Box = styled.div<{
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  position: relative;
  padding: ${(props) => props.theme.spacing[5]};
`

const StyledMenuIconButton = styled(MenuIconButton)`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 4%;
  left: 4%;
`
