import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {
  DEFAULT_SIDEBAR_SEPARATOR_COLOR,
  DEFAULT_SIDEBAR_SEPARATOR_STYLE,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer/SidebarContainerConfig'
import {withDefault} from 'lib/template'
import React from 'react'
import styled from 'styled-components'

export default function Section(props: {
  children: React.ReactNode
  className?: string
}) {
  const {
    template: {
      sidebar: {separatorColor, separatorWidth, separatorStyle},
    },
  } = useSimpleBlog()

  const color = separatorColor || DEFAULT_SIDEBAR_SEPARATOR_COLOR
  const width = withDefault(1, separatorWidth)

  const style = separatorStyle || DEFAULT_SIDEBAR_SEPARATOR_STYLE

  return (
    <Box
      className={props.className}
      color={color}
      width={width}
      borderStyle={style}
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
