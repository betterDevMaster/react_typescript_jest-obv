import React, {useState} from 'react'
import styled from 'styled-components'
import {User} from 'auth/user'
import Page from 'Event/template/Panels/Page'
import LeftPanel from 'Event/template/Panels/Dashboard/LeftPanel'
import RightPanel from 'Event/template/Panels/Dashboard/RightPanel'
import MobilePanel from 'Event/template/Panels/Dashboard/MobilePanel'
import {useEvent} from 'Event/EventProvider'
import SpeakerPage from 'Event/template/Panels/Dashboard/Speakers'
import TabPanel from 'lib/ui/tabs/TabPanel'
import ResourceList from 'Event/template/Panels/Dashboard/ResourceList'
import ResourceGroupList from 'Event/template/Panels/Dashboard/ResourceGroupList'
import Home from 'Event/template/Panels/Dashboard/Home'
import Leaderboard from 'Event/template/Panels/Dashboard/Leaderboard/Leaderboard'

export default function PanelsDashboard(props: {user: User}) {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <Page
      Left={<LeftPanel onChangeTab={setTabIndex} user={props.user} />}
      Right={
        <RightPanel currentTab={tabIndex} onChangeTab={setTabIndex}>
          <Content currentTab={tabIndex} />
        </RightPanel>
      }
      Mobile={
        <MobilePanel onChangeTab={setTabIndex} user={props.user}>
          <Content currentTab={tabIndex} />
        </MobilePanel>
      }
    />
  )
}

function Content(props: {currentTab: number}) {
  const {currentTab} = props
  const {event} = useEvent()

  return (
    <>
      <StyledTabPanel index={0} currentIndex={currentTab} disablePadding>
        <Home />
      </StyledTabPanel>
      <StyledTabPanel index={1} currentIndex={currentTab} disablePadding>
        <SpeakerPage speakers={event.speakers} />
      </StyledTabPanel>
      <StyledTabPanel index={2} currentIndex={currentTab} disablePadding>
        <ResourceList />
        <ResourceGroupList />
      </StyledTabPanel>
      <StyledTabPanel index={3} currentIndex={currentTab} disablePadding>
        <Leaderboard />
      </StyledTabPanel>
    </>
  )
}

const StyledTabPanel = styled(TabPanel)`
  /* 
    Explicitly set color to avoid dark mode's white color from
    rendering text invisible on white background. 
  */
  color: #000000;
  width: 100%;
`
