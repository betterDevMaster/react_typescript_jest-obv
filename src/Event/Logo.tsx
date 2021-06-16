import React from 'react'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import Hidden from '@material-ui/core/Hidden'

export default function Logo() {
  return (
    <>
      <Hidden mdUp>
        <MobileLogo />
      </Hidden>
      <Hidden smDown>
        <DesktopLogo />
      </Hidden>
    </>
  )
}

function MobileLogo() {
  const {event} = useEvent()
  const {mobile_logo} = event

  if (!mobile_logo) {
    return <DesktopLogo />
  }

  return <LogoImage src={mobile_logo?.url} alt={event.name} />
}

function DesktopLogo() {
  const {event} = useEvent()
  const {logo} = event

  if (!logo) {
    return null
  }

  return <LogoImage src={logo?.url} alt={event.name} />
}

const LogoImage = styled.img`
  max-width: 100%;
`
