import React from 'react'
import styled from 'styled-components'

import {useEvent} from 'Event/EventProvider'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'

import defaultLogo from 'assets/images/logo_vertical.png'

export default function Logo() {
  const {event} = useEvent()
  const {
    login,
    loginLogoBackground,
    loginLogo,
    loginLogoBackgroundProps,
    loginLogoProps,
  } = useNiftyFiftyTemplate()

  const background = loginLogoBackground ? loginLogoBackground : null
  const logo = loginLogo ? loginLogo : defaultLogo

  return (
    <Box
      backgroundColor={rgba(
        login.logoBackgroundColor,
        login.logoBackgroundOpacity,
      )}
      background={background}
      isBoxHidden={loginLogoBackgroundProps.hidden}
      isLogoHidden={!loginLogo && loginLogoProps.hidden ? true : false}
      aria-label="login logo background"
    >
      <LogoImage
        src={logo}
        alt={event.name}
        isLogoHidden={!loginLogo && loginLogoProps.hidden ? true : false}
        aria-label="login logo"
        size={loginLogoProps.size}
      />
    </Box>
  )
}

export const Box = styled.div<{
  background: any
  backgroundColor: string
  isBoxHidden?: boolean
  isLogoHidden?: boolean
}>`
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) =>
    !props.isBoxHidden || props.background
      ? `url(${props.background})`
      : props.backgroundColor};
  display: ${(props) =>
    props.isBoxHidden && props.isLogoHidden ? 'none' : 'flex'};
  margin: auto;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing[4]};
  width: 100%;
  height: 50%;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 50%;
    height: 100%;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: 50%;
    height: 100%;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    width: 50%;
    height: 100%;
  }
`

export const LogoImage = styled.img<{size: number; isLogoHidden?: boolean}>`
  display: ${(props) => (props.isLogoHidden ? 'none' : 'block')};
  max-width: 100%;
  margin: 0 auto;
  width: ${(props) => props.size}%;
`
