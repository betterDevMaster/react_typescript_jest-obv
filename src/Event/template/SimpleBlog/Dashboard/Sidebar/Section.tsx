import {useSimpleBlog} from 'Event/template/SimpleBlog'
import React from 'react'
import {DraggableProvidedDraggableProps} from 'react-beautiful-dnd'
import styled from 'styled-components'

const Section = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    className?: string
    draggableProps?: DraggableProvidedDraggableProps
    disableBorder?: boolean
  }
>((props, ref) => {
  const {
    template: {sidebar},
  } = useSimpleBlog()

  return (
    <Box
      ref={ref}
      className={props.className}
      color={sidebar.separatorColor}
      width={sidebar.separatorWidth}
      disableBorder={props.disableBorder}
      borderStyle={sidebar.separatorStyle}
      {...props.draggableProps}
    >
      {props.children}
    </Box>
  )
})

export default Section

const Box = styled.div<{
  color: string
  width: number
  borderStyle: string
  disableBorder?: boolean
  disableTopPadding?: boolean
}>`
  border-top: ${(props) =>
    props.disableBorder
      ? 'none'
      : `${props.color} ${props.width}px ${props.borderStyle}`};

  padding: ${(props) => props.theme.spacing[8]} 0;
`
