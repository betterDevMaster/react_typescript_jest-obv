import React from 'react'
import AgendaList from 'Event/Dashboard/components/AgendaList'
import EmojiList from 'Event/Dashboard/components/EmojiList'
import PointsSummary from 'Event/Dashboard/components/PointsSummary'
import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import Section from 'Event/Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'Event/Dashboard/components/TicketRibbon'
import SidebarNav from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import SidebarContainer from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {useDashboard} from 'Event/Dashboard/state/DashboardProvider'

export default function Sidebar() {
  const {sidebar} = useDashboard()

  return (
    <SidebarContainer
      background={sidebar.background}
      textColor={sidebar.textColor}
    >
      <EmojiList />
      <TicketRibbon />
      <Section>
        <AgendaList />
      </Section>
      <Section>
        <PointsSummary />
      </Section>
      <Section>
        <ResourceList />
      </Section>
      <Section>
        <SidebarNav />
      </Section>
    </SidebarContainer>
  )
}
