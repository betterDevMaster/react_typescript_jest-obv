import React from 'react'
import AgendaList from 'Event/Dashboard/components/AgendaList'
import EmojiList from 'Event/Dashboard/components/EmojiList'
import PointsSummary from 'Event/Dashboard/components/PointsSummary'
import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import TicketRibbonList from 'Event/Dashboard/components/TicketRibbonList'
import SidebarNav from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import SidebarContainer from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {useTemplate} from 'Event/TemplateProvider'

export default function Sidebar() {
  const {sidebar} = useTemplate()

  return (
    <SidebarContainer
      background={sidebar.background}
      textColor={sidebar.textColor}
    >
      <EmojiList />
      <TicketRibbonList />
      <AgendaList />
      <PointsSummary />
      <ResourceList />
      <SidebarNav />
    </SidebarContainer>
  )
}
