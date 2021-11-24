import {useEvent} from 'Event/EventProvider'
import {useCardsTemplate} from 'Event/template/Cards'
import React from 'react'
import styled from 'styled-components'

export default function BackgroundImage() {
  const {event} = useEvent()
  const {sidebar} = useCardsTemplate()

  if (!event.sidebar_background) {
    return null
  }

  return (
    <StyledImage
      src={event.sidebar_background.url}
      borderRadius={sidebar.borderRadius}
    />
  )
}

const StyledImage = styled.img<{borderRadius: number}>`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: ${(props) => props.borderRadius}px;
`
