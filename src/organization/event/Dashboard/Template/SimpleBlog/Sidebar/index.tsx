import React from 'react'
import AgendaList from 'organization/event/Dashboard/components/AgendaList'
import EmojiList from 'organization/event/Dashboard/components/EmojiList'
import PointsSummary from 'organization/event/Dashboard/components/PointsSummary'
import {ResourceList} from 'organization/event/Dashboard/components/ResourceList'
import Section from 'organization/event/Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'organization/event/Dashboard/components/TicketRibbon'
import SidebarNav from 'organization/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import SidebarContainer from 'organization/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {useDashboard} from 'organization/event/Dashboard/state/DashboardProvider'

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
