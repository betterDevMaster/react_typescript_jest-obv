import React from 'react'
import styled from 'styled-components'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import AgendaList from 'Dashboard/components/AgendaList'
import EmojiList from 'Dashboard/components/EmojiList'
import PointsSummary from 'Dashboard/components/PointsSummary'
import {ResourceList} from 'Dashboard/components/ResourceList'
import Section from 'Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'Dashboard/components/TicketRibbon'
import SidebarNav from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'

export default function Sidebar(props: SimpleBlog) {
  return (
    <Box
      backgroundColor={props.sidebarBackground}
      textColor={props.sidebarTextColor}
    >
      <EmojiList list={props.emojiList} />
      <TicketRibbon ribbon={props.ticketRibbon} />
      <AgendaList agendas={props.agendas} component={Section} />
      <PointsSummary points={props.points} component={Section} />
      <ResourceList
        list={props.resourceList}
        component={Section}
        iconColor={props.primaryColor}
      />
      <SidebarNav
        buttons={props.sidebarNavButtons}
        buttonColor={props.primaryColor}
        component={Section}
      />
    </Box>
  )
}

const Box = styled.div<{backgroundColor: string; textColor: string}>`
  background: ${(props) => props.backgroundColor};
  padding: ${(props) => `${props.theme.spacing[12]} ${props.theme.spacing[8]}`};
  color: ${(props) => props.textColor};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 100%;
  }

  a {
    color: ${(props) => props.textColor};
  }
`
