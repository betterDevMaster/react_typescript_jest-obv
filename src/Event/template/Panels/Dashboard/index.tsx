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
import Home from 'Event/template/Panels/Dashboard/Home'
import Leaderboard from 'Event/template/Panels/Dashboard/Leaderboard/Leaderboard'
import Resources from 'Event/template/Panels/Dashboard/Resources'
import {usePanels} from 'Event/template/Panels'

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
      <ContentPanel index={0} currentIndex={currentTab}>
        <Home />
      </ContentPanel>
      <ContentPanel index={1} currentIndex={currentTab}>
        <SpeakerPage speakers={event.speakers} />
      </ContentPanel>
      <ContentPanel index={2} currentIndex={currentTab}>
        <Resources />
      </ContentPanel>
      <ContentPanel index={3} currentIndex={currentTab}>
        <Leaderboard />
      </ContentPanel>
    </>
  )
}

function ContentPanel(props: {
  index: number
  currentIndex: number
  children: React.ReactElement
}) {
  const {
    template: {
      rightPanel: {textColor},
    },
  } = usePanels()

  return (
    <StyledTabPanel
      disablePadding
      textColor={textColor}
      index={props.index}
      currentIndex={props.currentIndex}
    >
      {props.children}
    </StyledTabPanel>
  )
}

const StyledTabPanel = styled(TabPanel)<{
  textColor: string
}>`
  /* 
    Explicitly set color to avoid dark mode's white color from
    rendering text invisible on white background. 
  */
  color: ${(props) => props.textColor}!important;
  width: 100%;
`
