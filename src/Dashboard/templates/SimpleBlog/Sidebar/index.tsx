import React from 'react'
import styled from 'styled-components'
import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'
import AgendaList from 'Dashboard/components/AgendaList'
import EmojiList from 'Dashboard/components/EmojiList'
import PointsSummary from 'Dashboard/components/PointsSummary'
import {ResourceList} from 'Dashboard/components/ResourceList'

export type SidebarProps = Pick<
  SimpleBlogDashboard,
  'emojis' | 'agendas' | 'points' | 'resourceList'
> & {
  backgroundColor: SimpleBlogDashboard['sidebar']['background']
  textColor: SimpleBlogDashboard['sidebar']['textColor']
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Box backgroundColor={props.backgroundColor} textColor={props.textColor}>
      <EmojiList emojis={props.emojis} />
      <AgendaList agendas={props.agendas} />
      <PointsSummary points={props.points} />
      <ResourceList list={props.resourceList} />
    </Box>
  )
}

const Box = styled.div<{backgroundColor: string; textColor: string}>`
  background: ${(props) => props.backgroundColor};
  padding: ${(props) => `${props.theme.spacing[8]}`};
  color: ${(props) => props.textColor};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }

  a {
    color: ${(props) => props.textColor};
  }
`
