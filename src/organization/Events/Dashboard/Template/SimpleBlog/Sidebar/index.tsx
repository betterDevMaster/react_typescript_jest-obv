import React from 'react'
import AgendaList from 'organization/Events/Dashboard/components/AgendaList'
import EmojiList from 'organization/Events/Dashboard/components/EmojiList'
import PointsSummary from 'organization/Events/Dashboard/components/PointsSummary'
import {ResourceList} from 'organization/Events/Dashboard/components/ResourceList'
import Section from 'organization/Events/Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'organization/Events/Dashboard/components/TicketRibbon'
import SidebarNav from 'organization/Events/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import SidebarContainer from 'organization/Events/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {useDashboard} from 'organization/Events/Dashboard/state/DashboardProvider'

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
