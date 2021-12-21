import React from 'react'
import styled from 'styled-components'

import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'

import {rgba} from 'lib/color'

import defaultLogo from 'assets/images/logo.png'
import defaultBackground from 'assets/images/background.png'
import {Icon} from '@material-ui/core'

export default function LeftPanel() {
  const template = useFiftyBlogTemplate()
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
    <Box
      backgroundColor={rgba(
        checkInLeftPanel.backgroundColor,
        checkInLeftPanel.backgroundOpacity,
      )}
      backgroundImage={background}
      isBackgroundHidden={stepBackgroundProps.hidden}
      textColor={checkInLeftPanel.textColor}
    >
      <div>
        <Menu />
        <Logo
          src={logo}
          hidden={stepLogoProps.hidden}
          size={stepLogoProps.size}
        />
      </div>
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

const MenuIcon = styled.div`
  position: absolute;
  top: 3%;
  left: 3%;
  cursor: pointer;
`

const Box = styled.div<{
  backgroundColor: string
  textColor: string
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
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: auto;
  position: relative;
  > * {
    color: ${(props) => props.textColor}!important;
  }
`
