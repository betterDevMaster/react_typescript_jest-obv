import React from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'
import Logo from 'Event/Logo'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'

import defaultLogo from 'assets/images/logo.png'

export default function LeftPanel(props: {user: User}) {
  const template = useNiftyFiftyTemplate()
  const {
    stepLogo,
    stepBackground,
    checkInLeftPanel,
    stepLogoProps,
    stepBackgroundProps,
  } = template
  const logo = stepLogo ? stepLogo : defaultLogo
  const background = stepBackground ? stepBackground : null

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
        <div>
          <Logo
            src={logo}
            hidden={stepLogoProps.hidden}
            size={stepLogoProps.size}
          />
        </div>
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
      ? `url(${props.background})`
      : props.backgroundColor};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  width: 100%;
`

const Box = styled.div<{
  backgroundColor: string
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: ${(props) => props.backgroundColor};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: auto;
  position: relative;
  width: 100%;
  height: 100%;
`
