import React from 'react'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import Hidden from '@material-ui/core/Hidden'

export default function Logo(props: {
  className?: string
  src?: string
  hidden?: boolean
  size?: number
}) {
  return (
    <>
      <Hidden mdUp>
        <MobileLogo
          className={props.className}
          src={props.src}
          hidden={props.hidden}
          size={props.size}
        />
      </Hidden>
      <Hidden smDown>
        <DesktopLogo
          className={props.className}
          src={props.src}
          hidden={props.hidden}
          size={props.size}
        />
      </Hidden>
    </>
  )
}

function MobileLogo(props: {
  className?: string
  src?: string
  hidden?: boolean
  size?: any
}) {
  const {event} = useEvent()
  const {mobile_logo} = event
  // if (!mobile_logo) {
  //   return <DesktopLogo className={props.className} />
  // }

  return (
    <LogoImage
      src={mobile_logo ? mobile_logo.url : props.src}
      alt={event.name}
      className={props.className}
      isLogoHidden={props.hidden}
      size={props.size}
    />
  )
}

function DesktopLogo(props: {
  className?: string
  src?: string
  hidden?: boolean
  size?: any
}) {
  const {event} = useEvent()
  const {logo} = event

  // if (!logo) {
  //   return null
  // }

  return (
    <LogoImage
      src={logo ? logo.url : props.src}
      alt={event.name}
      className={props.className}
      isLogoHidden={props.hidden}
      size={props.size}
    />
  )
}

const LogoImage = styled.img<{
  isLogoHidden?: boolean
  size: number
}>`
  display: ${(props) => (props.isLogoHidden ? 'none' : 'block')};
  width: ${(props) => props.size}%;
  cursor: pointer;
  margin: 0 auto;
`
