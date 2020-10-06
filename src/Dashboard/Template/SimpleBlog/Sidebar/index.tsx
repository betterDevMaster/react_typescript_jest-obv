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
import {Editable} from 'Dashboard'

export default function Sidebar(props: SimpleBlog & Editable) {
  return (
    <SidebarContainer
      isEditMode={props.isEditMode}
      background={props.sidebar.background}
      textColor={props.sidebar.textColor}
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
    </SidebarContainer>
  )
}
