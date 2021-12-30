import React from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'
import Logo from 'Event/Logo'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'
// import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
// import Menu from 'Event/template/NiftyFifty/Menu'

import defaultLogo from 'assets/images/logo.png'

export default function LeftPanel(props: {user: User}) {
  const template = useNiftyFiftyTemplate()
  const {
    stepLogo,
    stepBackground,
    checkInLeftPanel,
    stepLogoProps,
    stepBackgroundProps,
    // menu,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : null
  // const [menuVisible, setMenuVisible] = useState(false)
  // const toggleMenu = () => setMenuVisible(!menuVisible)

  return (
    <Box
      backgroundColor={rgba(
        checkInLeftPanel.backgroundColor,
        checkInLeftPanel.backgroundOpacity,
      )}
      background={background}
      isBackgroundHidden={stepBackgroundProps.hidden}
    >
      <div>
        {/* <IconContainer>
          <MenuIconButton
            active={menuVisible}
            onClick={toggleMenu}
            aria-label="show side menu"
            iconColor={menu.iconColor}
          />
        </IconContainer>
        <Menu visible={menuVisible} toggle={toggleMenu} user={props.user} /> */}
        <Logo
          src={logo}
          hidden={stepLogoProps.hidden}
          size={stepLogoProps.size}
        />
      </div>
    </Box>
  )
}

// const IconContainer = styled.div`
//   position: absolute;
//   top: 3%;
//   left: 3%;
//   cursor: pointer;
// `

const Box = styled.div<{
  backgroundColor: string
  background: any
  isBackgroundHidden: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: ${(props) =>
    !props.isBackgroundHidden && props.background
      ? `url(${props.background})`
      : props.backgroundColor};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: auto;
  position: relative;
  width: 100%;
`