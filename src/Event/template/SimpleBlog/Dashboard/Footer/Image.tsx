import Box from '@material-ui/core/Box'
import {useEvent} from 'Event/EventProvider'
import React from 'react'
import styled from 'styled-components'

export default function Image() {
  const {event} = useEvent()
  if (!event.footer_image) {
    return null
  }

  return (
    <Box mb={4}>
      <StyledImage src={event.footer_image.url} aria-label="footer image" />
    </Box>
  )
}

const StyledImage = styled.img`
  width: 100%;
`
