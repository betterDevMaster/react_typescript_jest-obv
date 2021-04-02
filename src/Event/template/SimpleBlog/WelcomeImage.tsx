import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'

export default function WelcomeImage() {
  const {event} = useEvent()
  return (
    <Box>
      <StyledImg src={event.welcome_image?.url} aria-label="welcome image" />
    </Box>
  )
}

const Box = styled.div`
  padding: ${(props) => props.theme.spacing[5]} 0;
`
const StyledImg = styled.img`
  width: 100%;
`
