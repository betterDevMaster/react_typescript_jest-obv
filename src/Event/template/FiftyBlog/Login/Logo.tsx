import React from 'react'
import styled from 'styled-components'
import {useMediaQuery} from '@material-ui/core'
import {useTheme} from '@material-ui/core/styles'

import {useEvent} from 'Event/EventProvider'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import defaultLogo from 'assets/images/logo.png'
import defaultLoginBackground from 'assets/images/background.png'

export default function Logo() {
  const {event} = useEvent()
  const template = useFiftyBlogTemplate()
  const theme = useTheme()
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const background = template.loginLogoBackground
    ? template.loginLogoBackground
    : defaultLoginBackground
  const logo = template.loginLogo ? template.loginLogo : defaultLogo

  return (
    <Box
      background={background}
      isBoxHidden={template.loginLogoBackgroundProps.hidden}
      isLogoHidden={template.loginLogoProps.hidden}
      aria-label="login logo background"
      isMobileScreen={isMobileScreen}
    >
      <LogoImage
        src={logo}
        alt={event.name}
        isLogoHidden={template.loginLogoProps.hidden}
        aria-label="login logo"
        size={template.loginLogoProps.size}
      />
    </Box>
  )
}

export const Box = styled.div<{
  background: string
  isBoxHidden?: boolean
  isLogoHidden?: boolean
  isMobileScreen: boolean
}>`
  ${(props) =>
    props.isBoxHidden
      ? 'background: transparent;'
      : `background: url(${props.background});`}
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: ${(props) =>
    props.isBoxHidden && props.isLogoHidden ? 'none' : 'flex'};
  margin: auto;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing[4]};
  height: 30vh;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
    height: 30vh;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 50%;
    height: 100vh;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: 50%;
    height: 100vh;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    width: 50%;
    height: 100vh;
  }
`

export const LogoImage = styled.img<{size: number; isLogoHidden?: boolean}>`
  display: ${(props) => (props.isLogoHidden ? 'none' : 'block')};
  max-width: 100%;
  margin: 0 auto;
  width: ${(props) => props.size}%;
`
