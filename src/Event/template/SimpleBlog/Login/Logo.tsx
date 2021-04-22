import React from 'react'
import defaultLogo from 'assets/images/logo_vertical.png'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'
import styled from 'styled-components'
import {DEFAULT_LOGO_SIZE_PERCENT} from 'Event/template/SimpleBlog/Login/LoginConfig'

export default function Logo(props: {isHidden?: boolean}) {
  const {event} = useEvent()
  const logo = event.login_logo ? event.login_logo.url : defaultLogo
  const {login} = useTemplate()

  const size = login.logoSize || DEFAULT_LOGO_SIZE_PERCENT

  return (
    <Box isHidden={props.isHidden}>
      <LogoImage
        src={logo}
        alt={event.name}
        aria-label="login logo"
        size={size}
      />
    </Box>
  )
}

const Box = styled.div<{
  isHidden?: boolean
}>`
  display: ${(props) => (props.isHidden ? 'none' : 'block')};
  margin-bottom: ${(props) => props.theme.spacing[6]};
  width: 100%;
  text-align: center;
  padding: ${(props) => props.theme.spacing[4]};
`

export const LogoImage = styled.img<{size: number}>`
  max-width: 100%;
  width: ${(props) => props.size}%;
`
