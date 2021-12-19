import styled from 'styled-components'
import React from 'react'
import {
  useHasMultipleTabs,
  useFiftyBlogTemplate,
} from 'Event/template/FiftyBlog'
import {User} from 'auth/user'
import {useEventAuth} from 'Event/auth'
import CustomButton from 'lib/ui/Button/CustomButton'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useAttendeeVariables} from 'Event'

export default function Menu(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const {onChangeTab} = props
  const template = useFiftyBlogTemplate()
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
      <TopCenterBox>
        <Top>
          <LinkText
            {...linkProps}
            index={0}
            showing={hasMultipleTabs}
            label={homeTitle}
            isdisplay="visible"
          />
          <LinkText
            {...linkProps}
            index={1}
            showing={showingSpeakers}
            label={speakerTitle}
            isdisplay="visible"
          />
          <LinkText
            {...linkProps}
            index={2}
            showing={showingSponsors}
            label={sponsorsTitle}
            isdisplay="visible"
          />
          <LinkText
            {...linkProps}
            index={3}
            showing={showingResources}
            label={resourcesTitle}
            isdisplay="visible"
          />
          <LinkText
            {...linkProps}
            index={4}
            showing={showingPoints}
            label={pointsTitle}
            isdisplay="visible"
          />
          <LinkText
            {...linkProps}
            index={5}
            showing={showingImageWaterfall}
            label={imageWaterfallTitle}
            isdisplay="inVisible"
          />
          <LinkText
            {...linkProps}
            index={6}
            showing={showingFaqs}
            label={faqsTitle}
            isdisplay="inVisible"
          />
        </Top>
      </TopCenterBox>

      <Bottom>
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
      </Bottom>
    </Box>
  )
}

function LinkText(props: {
  onChangeTab: (tab: number) => void
  label: string
  showing: boolean
  color: string
  index: number
  isdisplay: string
}) {
  const {label, color, index, showing, isdisplay} = props

  const isEditMode = useEditMode()
  const v = useAttendeeVariables()

  if ((!isEditMode && !showing) || isdisplay === 'inVisible') {
    return null
  }

  return (
    <TabText
      key={label}
      onClick={() => props.onChangeTab(index)}
      style={{color}}
      aria-label={`fiftyblog left panel menu ${label} button`}
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
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  flex: 1;
  padding: 24px 24px 72px;
`

const Bottom = styled.div``

const Top = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const TopCenterBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`
const UserInfo = styled.p<{color: string}>`
  text-align: center;
  color: ${(props) => props.color} !important;
`

const LogoutBox = styled.div`
  margin-top: 16px;
  text-align: center;
`
