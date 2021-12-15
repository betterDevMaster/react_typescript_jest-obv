import React from 'react'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import Hidden from '@material-ui/core/Hidden'

export default function Logo(props: {className?: string}) {
  return (
    <>
      <Hidden mdUp>
        <MobileLogo className={props.className} />
      </Hidden>
      <Hidden smDown>
        <DesktopLogo className={props.className} />
      </Hidden>
    </>
  )
}

function MobileLogo(props: {className?: string}) {
  const {event} = useEvent()
  const {mobile_logo} = event

  if (!mobile_logo) {
    return <DesktopLogo className={props.className} />
  }

  return (
    <LogoImage
      src={mobile_logo?.url}
      alt={event.name}
      className={props.className}
    />
  )
}

function DesktopLogo(props: {className?: string}) {
  const {event} = useEvent()
  const {logo} = event

  if (!logo) {
    return null
  }

  return (
    <LogoImage src={logo?.url} alt={event.name} className={props.className} />
  )
}

const LogoImage = styled.img`
  max-width: 100%;
`
