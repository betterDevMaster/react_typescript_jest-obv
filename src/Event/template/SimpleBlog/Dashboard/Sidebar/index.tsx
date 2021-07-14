import React from 'react'
import styled from 'styled-components'
import AgendaList from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import EmojiList from 'Event/template/SimpleBlog/Dashboard/EmojiList'
import PointsSummary from 'Event/template/SimpleBlog/Dashboard/PointsSummary'
import {ResourceList} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import TicketRibbonList from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList'
import SidebarNav from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import SidebarContainer from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {useEvent} from 'Event/EventProvider'

export default function Sidebar() {
  return (
    <SidebarContainer>
      <GylsPlayer />
      <EmojiList />
      <TicketRibbonList />
      <AgendaList />
      <PointsSummary />
      <ResourceList />
      <SidebarNav />
    </SidebarContainer>
  )
}

/**
 * TEMP - hardcode player for gyls event
 * @returns
 */
function GylsPlayer() {
  const {event} = useEvent()

  const isTargetEvent = event.slug === 'gyls'
  if (!isTargetEvent) {
    return null
  }

  return (
    <GylsPlayerBox>
      <p
        style={{
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '15px',
          textAlign: 'center',
          paddingTop: '10px',
        }}
      >
        JOIN AUDIO - Click the Play button below every day before you join the
        Main Stage!(This is important so you can hear us during the breakout
        sessions.)
      </p>
      <iframe
        title="gyls player iframe"
        src="https://mixlr.com/users/8574169/embed?autoplay=true"
        width="100%"
        height="150px"
        scrolling="no"
        frameBorder="no"
        marginHeight={0}
        marginWidth={0}
      ></iframe>
    </GylsPlayerBox>
  )
}

const GylsPlayerBox = styled.div`
  margin: 50px 0;
`
