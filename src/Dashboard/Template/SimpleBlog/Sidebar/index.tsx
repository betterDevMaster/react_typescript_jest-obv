import React from 'react'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import AgendaList from 'Dashboard/components/AgendaList'
import EmojiList from 'Dashboard/components/EmojiList'
import PointsSummary from 'Dashboard/components/PointsSummary'
import {ResourceList} from 'Dashboard/components/ResourceList'
import Section from 'Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'Dashboard/components/TicketRibbon'
import SidebarNav from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import SidebarContainer from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'

export default function Sidebar(props: SimpleBlog) {
  return (
    <SidebarContainer
      background={props.sidebar.background}
      textColor={props.sidebar.textColor}
    >
      <EmojiList list={props.emojiList} />
      <TicketRibbon ribbon={props.ticketRibbon} />
      <AgendaList agendas={props.agendas} container={Section} />
      <PointsSummary points={props.points} container={Section} />
      <ResourceList
        list={props.resourceList}
        container={Section}
        iconColor={props.primaryColor}
      />
      <SidebarNav
        buttons={props.sidebarNavButtons}
        buttonColor={props.primaryColor}
        container={Section}
      />
    </SidebarContainer>
  )
}
