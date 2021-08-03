import {useSimpleBlog} from 'Event/template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export default function Section(props: {
  children: React.ReactNode
  className?: string
}) {
  const {
    template: {sidebar},
  } = useSimpleBlog()

  return (
    <Box
      className={props.className}
      color={sidebar.separatorColor}
      width={sidebar.separatorWidth}
      borderStyle={sidebar.separatorStyle}
    >
      {props.children}
    </Box>
  )
}

const Box = styled.div<{
  color: string
  width: number
  borderStyle: string
}>`
  border-top: 1px solid #ffffff;

  border-top: ${(props) => props.color} ${(props) => props.width}px
    ${(props) => props.borderStyle};

  padding: ${(props) => props.theme.spacing[8]} 0;
`
