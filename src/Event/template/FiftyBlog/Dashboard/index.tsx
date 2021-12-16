import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

import {isAttendee} from 'Event/auth'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import Page from 'Event/template/FiftyBlog/Page'
import LeftPanel from 'Event/template/FiftyBlog/Dashboard/LeftPanel'
import RightPanel from 'Event/template/FiftyBlog/Dashboard/RightPanel'
import MobilePanel from 'Event/template/FiftyBlog/Dashboard/MobilePanel'
import {useEvent} from 'Event/EventProvider'
import SpeakerPage from 'Event/template/FiftyBlog/Dashboard/Speakers'
import Home from 'Event/template/FiftyBlog/Dashboard/Home'
import Leaderboard from 'Event/template/FiftyBlog/Dashboard/Leaderboard/Leaderboard'
import Resources from 'Event/template/FiftyBlog/Dashboard/Resources'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import SponsorPage from 'Event/template/FiftyBlog/Dashboard/Sponsors'

import TabPanel from 'lib/ui/tabs/TabPanel'

import {
  EventSponsorsProvider,
  OrganizationSponsorsProvider,
  useSponsors,
} from 'organization/Event/SponsorsProvider'
import {
  useFaqs,
  OrganizationFaqsProvider,
  EventFaqsProvider,
} from 'organization/Event/FaqsProvider'

export default function FiftyBlogDashboard(props: {user: User}) {
  const {user} = props
  const [tabIndex, setTabIndex] = useState(0)
  const isEdit = useEditMode()

  const SponsorsProvider = isAttendee(user)
    ? EventSponsorsProvider
    : OrganizationSponsorsProvider

  const FaqsProvider = isAttendee(user)
    ? EventFaqsProvider
    : OrganizationFaqsProvider

  return (
    <SponsorsProvider>
      <FaqsProvider>
        <Page
          Left={<LeftPanel onChangeTab={setTabIndex} user={props.user} />}
          Right={
            <RightPanel currentTab={tabIndex} onChangeTab={setTabIndex}>
              <Content currentTab={tabIndex} isEdit={isEdit} />
            </RightPanel>
          }
          Mobile={
            <MobilePanel onChangeTab={setTabIndex} user={props.user}>
              <Content currentTab={tabIndex} isEdit={isEdit} />
            </MobilePanel>
          }
        />
      </FaqsProvider>
    </SponsorsProvider>
  )
}

function Content(props: {currentTab: number; isEdit: boolean}) {
  const {currentTab, isEdit} = props
  const {event} = useEvent()
  const {sponsors, loading} = useSponsors()
  const {faqs} = useFaqs()

  if (loading) {
    return <div>loading...</div>
  }
  return (
    <>
      <ContentPanel index={0} currentIndex={currentTab}>
        <Home />
      </ContentPanel>
      <ContentPanel index={1} currentIndex={currentTab}>
        <SpeakerPage speakers={event.speakers} />
      </ContentPanel>
      <ContentPanel index={2} currentIndex={currentTab}>
        <SponsorPage isEditMode={isEdit} sponsors={sponsors} />
      </ContentPanel>
      <ContentPanel index={3} currentIndex={currentTab}>
        <Resources />
      </ContentPanel>
      <ContentPanel index={4} currentIndex={currentTab}>
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
    rightPanel: {textColor},
  } = useFiftyBlogTemplate()

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
