import {useEvent} from 'Event/EventProvider'
import React from 'react'
import styled from 'styled-components'

export default function BackgroundImage() {
  const {event} = useEvent()

  if (!event.sidebar_background) {
    return null
  }

  return <StyledImage src={event.sidebar_background.url} />
}

const StyledImage = styled.img`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`
