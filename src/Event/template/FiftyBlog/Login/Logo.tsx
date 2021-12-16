import React from 'react'
import defaultLogo from 'assets/images/logo.png'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import defaultLoginBackground from 'assets/images/background.png'

export default function Logo() {
  const {event} = useEvent()
  const logo = event.login_logo ? event.login_logo.url : defaultLogo
  const template = useFiftyBlogTemplate()
  const {login} = template
  const background = event.login_logo_background
    ? event.login_logo_background.url
    : defaultLoginBackground

  const size = login.logoSize

  return (
    <Box
      background={background}
      isBoxHidden={login.logoBackgroundHidden}
      isLogoHidden={login.logoHidden}
    >
      <LogoImage
        src={logo}
        alt={event.name}
        aria-label="login logo"
        size={size}
        isLogoHidden={login.logoHidden}
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

export const LogoImage = styled.img<{
  size: number
  isLogoHidden?: boolean
}>`
  display: ${(props) => (props.isLogoHidden ? 'none' : 'block')};
  max-width: 100%;
  width: ${(props) => props.size}%;
  margin: 0 auto;
`
