import React from 'react'
import AgendaList from 'organization/user/event/Dashboard/components/AgendaList'
import EmojiList from 'organization/user/event/Dashboard/components/EmojiList'
import PointsSummary from 'organization/user/event/Dashboard/components/PointsSummary'
import {ResourceList} from 'organization/user/event/Dashboard/components/ResourceList'
import Section from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/Section'
import TicketRibbon from 'organization/user/event/Dashboard/components/TicketRibbon'
import SidebarNav from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import SidebarContainer from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {useDashboard} from 'organization/user/event/Dashboard/state/DashboardProvider'

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
