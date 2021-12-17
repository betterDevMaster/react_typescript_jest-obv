import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import defaultLogo from 'assets/images/logo.png'
import defaultLoginBackground from 'assets/images/background.png'

export default function Logo() {
  const {event} = useEvent()
  const template = useFiftyBlogTemplate()
  const {login} = template
  const size = login.logoSize
  const logo = event.login_logo ? event.login_logo.url : defaultLogo
  const background = event.login_logo_background
    ? event.login_logo_background.url
    : defaultLoginBackground

  return (
    <Box
      background={background}
      isBoxHidden={login.logoBackgroundHidden}
      isLogoHidden={login.logoHidden}
      aria-label="login logo background"
    >
      <LogoImage
        src={logo}
        alt={event.name}
        aria-label="login logo"
        size={size}
      />
    </Box>
  )
}

export const Box = styled.div<{
  background: string
  isBoxHidden?: boolean
  isLogoHidden?: boolean
}>`
  ${(props) =>
    props.isBoxHidden
      ? 'background: transparent;'
      : `background: url(${props.background});`}
  display: ${(props) =>
    props.isBoxHidden && props.isLogoHidden ? 'none' : 'block'};
  width: 100%;
  text-align: center;
  padding: ${(props) => props.theme.spacing[16]};
`

export const LogoImage = styled.img<{size: number}>`
  max-width: 100%;
  width: ${(props) => props.size}%;
`
