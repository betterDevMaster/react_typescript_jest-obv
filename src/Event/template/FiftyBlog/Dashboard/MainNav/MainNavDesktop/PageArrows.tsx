import styled from 'styled-components'
import {Icon} from 'lib/fontawesome/Icon'
import IconButton from 'lib/ui/IconButton'
import React from 'react'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'

export default function PageArrows(props: {
  hasNext: boolean
  onNext: () => void
  hasPrev: boolean
  onPrev: () => void
  disableLabel?: boolean
}) {
  return (
    <Box>
      <Arrow
        direction="prev"
        showing={props.hasPrev}
        onClick={props.onPrev}
        disableLabel={props.disableLabel}
      />
      <Arrow
        direction="next"
        showing={props.hasNext}
        onClick={props.onNext}
        disableLabel={props.disableLabel}
      />
    </Box>
  )
}

function Arrow(props: {
  direction: 'prev' | 'next'
  showing: boolean
  onClick: () => void
  disableLabel?: boolean
}) {
  const template = useFiftyBlogTemplate()

  if (!props.showing) {
    return null
  }

  const faClass = props.direction === 'next' ? 'fa-angle-down' : 'fa-angle-up'

  const label = props.disableLabel ? '' : `show ${props.direction} buttons`

  return (
    <IconButton onClick={props.onClick} aria-label={label}>
      <ArrowIcon
        iconClass={`far ${faClass}`}
        color={template.leftPanel.arrowColor}
      />
    </IconButton>
  )
}

const Box = styled.div`
  text-align: center;
`

const ArrowIcon = styled(Icon)<{
  color: string
}>`
  color: ${(props) => props.color};
  font-size: 36px;
  margin: 0 2px;
`
