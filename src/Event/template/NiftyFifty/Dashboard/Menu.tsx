import styled from 'styled-components'
import React from 'react'

import {User} from 'auth/user'

import {useAttendeeVariables} from 'Event'
import {useEventAuth} from 'Event/auth'
import {
  useHasMultipleTabs,
  useNiftyFiftyTemplate,
} from 'Event/template/NiftyFifty'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

import CustomButton from 'lib/ui/Button/CustomButton'

export default function Menu(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const {onChangeTab} = props
  const template = useNiftyFiftyTemplate()
  const color = template.leftPanel.menuTextColor || '#000000'

  const {logout} = useEventAuth()

  const {
    homeMenuTitle: homeTitle,
    speakers: {menuTitle: speakerTitle, isVisible: showingSpeakers},
    sponsors: {menuTitle: sponsorsTitle, isVisible: showingSponsors},
    resourceList: {menuTitle: resourcesTitle, isVisible: showingResources},
    leaderboard: {menuTitle: pointsTitle, isVisible: showingPoints},
    imageWaterfall: {
      menuTitle: imageWaterfallTitle,
      isVisible: showingImageWaterfall,
    },
    faq: {menuTitle: faqsTitle, isVisible: showingFaqs},
  } = template

  const hasMultipleTabs = useHasMultipleTabs()

  const linkProps = {
    onChangeTab,
    color,
  }

  return (
    <Box>
      <LinkText
        {...linkProps}
        index={0}
        showing={hasMultipleTabs}
        label={homeTitle}
      />
      <LinkText
        {...linkProps}
        index={1}
        showing={showingSpeakers}
        label={speakerTitle}
      />
      <LinkText
        {...linkProps}
        index={2}
        showing={showingSponsors}
        label={sponsorsTitle}
      />
      <LinkText
        {...linkProps}
        index={3}
        showing={showingResources}
        label={resourcesTitle}
      />
      <LinkText
        {...linkProps}
        index={4}
        showing={showingPoints}
        label={pointsTitle}
      />
      <LinkText
        {...linkProps}
        index={5}
        showing={showingImageWaterfall}
        label={imageWaterfallTitle}
      />
      <LinkText
        {...linkProps}
        index={6}
        showing={showingFaqs}
        label={faqsTitle}
      />
      <UserInfo color={color}>
        You're logged in as <br />
        {props.user.email}
      </UserInfo>
      <LogoutBox>
        <CustomButton
          variant="text"
          onClick={logout}
          aria-label="logout"
          textColor={color}
        >
          Logout
        </CustomButton>
      </LogoutBox>
    </Box>
  )
}

function LinkText(props: {
  onChangeTab: (tab: number) => void
  label: string
  showing: boolean
  color: string
  index: number
}) {
  const {label, color, index, showing} = props

  const isEditMode = useEditMode()
  const v = useAttendeeVariables()

  if (!isEditMode && !showing) {
    return null
  }

  return (
    <TabText
      key={label}
      onClick={() => props.onChangeTab(index)}
      style={{color}}
      aria-label={`left panel menu ${label} button`}
    >
      {v(label)}
    </TabText>
  )
}
const TabText = styled.span`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  line-height: 20px;
  cursor: pointer;
  margin-bottom: 20px;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing[6]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[10]};
`

const UserInfo = styled.div<{color: string}>`
  margin-top: ${(props) => props.theme.spacing[4]};
  text-align: center;
  color: ${(props) => props.color} !important;
`

const LogoutBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[8]};
  text-align: center;
`
