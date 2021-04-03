import React from 'react'
import defaultLogo from 'assets/images/logo_vertical.png'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'
import styled from 'styled-components'

export const DEFAULT_LOGO_SIZE = 150

export default function Logo() {
  const {event} = useEvent()
  const logo = event.login_logo ? event.login_logo.url : defaultLogo
  const {login} = useTemplate()

  const size = login.logoSize || DEFAULT_LOGO_SIZE

  return (
    <Box size={size}>
      <LogoImage src={logo} alt={event.name} aria-label="login logo" />
    </Box>
  )
}

const Box = styled.div<{size: number}>`
  width: ${(props) => props.size}px;
  margin-bottom: ${(props) => props.theme.spacing[12]};
`

export const LogoImage = styled.img`
  width: 100%;
`
