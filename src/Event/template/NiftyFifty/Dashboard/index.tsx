import React, {useState} from 'react'
import styled from 'styled-components'

import {useTheme, useMediaQuery} from '@material-ui/core'

import {User} from 'auth/user'

import {isAttendee} from 'Event/auth'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import FaqPage from 'Event/template/NiftyFifty/Dashboard/Faqs'
import Home from 'Event/template/NiftyFifty/Dashboard/Home'
import ImageWaterfall from 'Event/template/NiftyFifty/Dashboard/ImageWaterfall'
import Resources from 'Event/template/NiftyFifty/Dashboard/Resources'
import Leaderboard from 'Event/template/NiftyFifty/Dashboard/Leaderboard/Leaderboard'
import LeftPanel from 'Event/template/NiftyFifty/Dashboard/LeftPanel'
import MobilePanel from 'Event/template/NiftyFifty/Dashboard/MobilePanel'
import Page from 'Event/template/NiftyFifty/Page'
import RightPanel from 'Event/template/NiftyFifty/Dashboard/RightPanel'
import SpeakerPage from 'Event/template/NiftyFifty/Dashboard/Speakers'
import SponsorPage from 'Event/template/NiftyFifty/Dashboard/Sponsors'

import TabPanel from 'lib/ui/tabs/TabPanel'

import {
  useFaqs,
  OrganizationFaqsProvider,
  EventFaqsProvider,
} from 'organization/Event/FaqsProvider'
import {
  EventSponsorsProvider,
  OrganizationSponsorsProvider,
  useSponsors,
} from 'organization/Event/SponsorsProvider'
import {
  EventSpeakersProvider,
  OrganizationSpeakersProvider,
  useSpeakers,
} from 'organization/Event/SpeakersProvider'

export default function NiftyFiftyDashboard(props: {user: User}) {
  const {user} = props
  const [tabIndex, setTabIndex] = useState(0)
  const isEdit = useEditMode()

  const SponsorsProvider = isAttendee(user)
    ? EventSponsorsProvider
    : OrganizationSponsorsProvider

  const FaqsProvider = isAttendee(user)
    ? EventFaqsProvider
    : OrganizationFaqsProvider

  const SpeakersProvider = isAttendee(user)
    ? EventSpeakersProvider
    : OrganizationSpeakersProvider

  return (
    <SpeakersProvider>
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
              <MobilePanel
                currentTab={tabIndex}
                onChangeTab={setTabIndex}
                user={props.user}
              >
                <Content currentTab={tabIndex} isEdit={isEdit} />
              </MobilePanel>
            }
          />
        </FaqsProvider>
      </SponsorsProvider>
    </SpeakersProvider>
  )
}

function Content(props: {currentTab: number; isEdit: boolean}) {
  const {currentTab, isEdit} = props
  const {sponsors, loading} = useSponsors()
  const {speakers, speakerloading} = useSpeakers()
  const {faqs} = useFaqs()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  if (loading || speakerloading) {
    return <div>loading...</div>
  }
  return (
    <Panel isXSMobile={isXSMobile}>
      <ContentPanel index={0} currentIndex={currentTab}>
        <Home />
      </ContentPanel>
      <ContentPanel index={1} currentIndex={currentTab}>
        <SpeakerPage isEditMode={isEdit} speakers={speakers} />
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
      <ContentPanel index={5} currentIndex={currentTab}>
        <ImageWaterfall />
      </ContentPanel>
      <ContentPanel index={6} currentIndex={currentTab}>
        <FaqPage isEditMode={isEdit} faqs={faqs} />
      </ContentPanel>
    </Panel>
  )
}

function ContentPanel(props: {
  index: number
  currentIndex: number
  children: React.ReactElement
}) {
  const {
    rightPanel: {textColor},
  } = useNiftyFiftyTemplate()

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

const Panel = styled.div<{
  isXSMobile: boolean
}>`
  padding: ${(props) =>
      props.isXSMobile ? props.theme.spacing[5] : props.theme.spacing[10]}
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[17]};
`

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
