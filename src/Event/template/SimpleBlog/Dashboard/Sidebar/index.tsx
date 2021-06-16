import React from 'react'
import AgendaList from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import EmojiList from 'Event/template/SimpleBlog/Dashboard/EmojiList'
import PointsSummary from 'Event/template/SimpleBlog/Dashboard/PointsSummary'
import {ResourceList} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import TicketRibbonList from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList'
import SidebarNav from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import SidebarContainer from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'

export default function Sidebar() {
  return (
    <SidebarContainer>
      <EmojiList />
      <TicketRibbonList />
      <AgendaList />
      <PointsSummary />
      <ResourceList />
      <SidebarNav />
    </SidebarContainer>
  )
}
