import React from 'react'
import styled from 'styled-components'

export interface SidebarProps {
  backgroundColor: string
}

export default function Sidebar(props: SidebarProps) {
  return <Box backgroundColor={props.backgroundColor}>sidebar</Box>
}

const Box = styled.div<{backgroundColor: string}>`
  background: ${(props) => props.backgroundColor};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }
`
