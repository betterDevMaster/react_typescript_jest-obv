import React from 'react'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'

export default function Logo() {
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
