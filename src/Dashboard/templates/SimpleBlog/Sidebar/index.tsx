import React from 'react'
import styled from 'styled-components'
import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'
import Emojis from 'Dashboard/templates/SimpleBlog/Sidebar/Emojis'
import AgendaList from 'Dashboard/components/AgendaList'

export type SidebarProps = Pick<SimpleBlogDashboard, 'emojis' | 'agendas'> & {
  backgroundColor: SimpleBlogDashboard['sidebar']['background']
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Box backgroundColor={props.backgroundColor} style={{color: '#FFF'}}>
      <Emojis emojis={props.emojis} />
      <AgendaList agendas={props.agendas} />
    </Box>
  )
}

const Box = styled.div<{backgroundColor: string}>`
  background: ${(props) => props.backgroundColor};
  padding: ${(props) => `${props.theme.spacing[8]}`};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }
`
