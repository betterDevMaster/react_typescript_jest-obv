import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'
import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'

import {rgba} from 'lib/color'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import Menu from 'Event/template/FiftyBlog/Menu'

import defaultLogo from 'assets/images/logo.png'

export default function LeftPanel(props: {user: User}) {
  const template = useFiftyBlogTemplate()
  const {
    stepLogo,
    stepBackground,
    checkInLeftPanel,
    stepLogoProps,
    stepBackgroundProps,
    menu,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : ''
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  return (
    <Box
      backgroundColor={rgba(
        checkInLeftPanel.backgroundColor,
        checkInLeftPanel.backgroundOpacity,
      )}
      backgroundImage={background}
      isBackgroundHidden={stepBackgroundProps.hidden}
    >
      <div>
        <IconContainer>
          <MenuIconButton
            active={menuVisible}
            onClick={toggleMenu}
            aria-label="show side menu"
            iconColor={menu.iconColor}
          />
        </IconContainer>
        <Menu visible={menuVisible} toggle={toggleMenu} user={props.user} />
        <Logo
          src={logo}
          hidden={stepLogoProps.hidden}
          size={stepLogoProps.size}
        />
      </div>
    </Box>
  )
}

const IconContainer = styled.div`
  position: absolute;
  top: 3%;
  left: 3%;
  cursor: pointer;
`

const Box = styled.div<{
  backgroundColor: string
  backgroundImage: string
  isBackgroundHidden: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: auto;
  position: relative;
`
