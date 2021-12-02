import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

const Section = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    className?: string
  }
>((props, ref) => {
  const {sidebar} = useSimpleBlogTemplate()

  /**
   * If empty is true, padding should be ignored.
   */
  return (
    <Box
      ref={ref}
      className={props.className}
      color={sidebar.separatorColor}
      width={sidebar.separatorThickness}
      borderStyle={sidebar.separatorStyle}
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
}>`
  border-top: ${(props) =>
    `${props.color} ${props.width}px ${props.borderStyle}`};

  padding: ${(props) => props.theme.spacing[8]} 0;

  &:first-child {
    border-top: none;
  }
`
