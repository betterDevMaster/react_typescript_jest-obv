import React from 'react'
import styled from 'styled-components'
import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'
import Emojis from 'Dashboard/templates/SimpleBlog/Sidebar/Emojis'

export type SidebarProps = Pick<SimpleBlogDashboard, 'emojis'> & {
  backgroundColor: SimpleBlogDashboard['sidebar']['background']
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Box backgroundColor={props.backgroundColor} style={{color: '#FFF'}}>
      <Emojis emojis={props.emojis} />
    </Box>
  )
}

const Box = styled.div<{backgroundColor: string}>`
  background: ${(props) => props.backgroundColor};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }
`
