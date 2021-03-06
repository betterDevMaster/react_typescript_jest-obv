import Box from '@material-ui/core/Box'
import {useEvent} from 'Event/EventProvider'
import React from 'react'
import styled from 'styled-components'
import {DEFAULT_FOOTER_IMAGE_SIZE} from 'Event/template/SimpleBlog/Dashboard/Footer/FooterConfig'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'

export default function Image() {
  const {event} = useEvent()
  const template = useSimpleBlogTemplate()
  const {footer} = template

  if (!event.footer_image) {
    return null
  }

  return (
    <Box mb={4}>
      <StyledImage
        src={event.footer_image.url}
        aria-label="footer image"
        width={footer.imageSize || DEFAULT_FOOTER_IMAGE_SIZE}
      />
    </Box>
  )
}

const StyledImage = styled.img<{width: number}>`
  width: ${(props) => props.width}px;
  max-width: 100%;
`
