import React from 'react'
import AgendaList from 'event/Dashboard/components/AgendaList'
import EmojiList from 'event/Dashboard/components/EmojiList'
import PointsSummary from 'event/Dashboard/components/PointsSummary'
import {ResourceList} from 'event/Dashboard/components/ResourceList'
import Section from 'event/Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'event/Dashboard/components/TicketRibbon'
import SidebarNav from 'event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import SidebarContainer from 'event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {useDashboard} from 'event/Dashboard/state/DashboardProvider'

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
