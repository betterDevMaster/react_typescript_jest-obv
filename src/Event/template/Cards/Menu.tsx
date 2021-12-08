import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import {User} from 'auth/user'
import {useEventAuth} from 'Event/auth'
import CustomButton from 'lib/ui/Button/CustomButton'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useCardsTemplate} from 'Event/template/Cards'
import {useAttendeeVariables} from 'Event'

export const DEFAULT_MENU_TEXT_COLOR = '#FFFFFF'
export const DEFAULT_MENU_ICON_COLOR = '#000000'
export const DEFAULT_MENU_BACKGROUND_COLOR = '#000000'

export default function Menu(props: {
  visible: boolean
  toggle: () => void
  user: User
}) {
  const {menu} = useCardsTemplate()

  const background = menu?.backgroundColor || DEFAULT_MENU_BACKGROUND_COLOR

  return (
    <Drawer anchor="left" open={props.visible} onClose={props.toggle}>
      <Box background={background}>
        <UserInfo email={props.user.email} />
        <Links />
      </Box>
    </Drawer>
  )
}

function UserInfo(props: {email: string}) {
  const {menu} = useCardsTemplate()
  const menuTextColor = menu?.textColor || DEFAULT_MENU_TEXT_COLOR
  return (
    <UserInfoText color={menuTextColor}>
      You're logged in as <br />
      {props.email}
    </UserInfoText>
  )
}

function Links() {
  const {logout} = useEventAuth()
  const template = useCardsTemplate()
  const {menu} = template
  const v = useAttendeeVariables()

  const {
    homeMenuTitle: homeTitle,
    speakers: {menuTitle: speakerTitle, isVisible: showingSpeakers},
    sponsors: {menuTitle: sponsorsTitle, isVisible: showingSponsors},
    zoomBackgrounds: {
      menuTitle: zoomBackgroundsMenuTitle,
      isVisible: showingZoomBackgrounds,
    },
    leaderboard: {menuTitle: pointsTitle, isVisible: showingPoints},
    faq: {menuTitle: faqsTitle, isVisible: showingFaqs},
    imageWaterfall: {
      menuTitle: imageWaterfallTitle,
      isVisible: showingImageWaterfall,
    },
  } = template

  const menuTextColor = menu?.textColor || DEFAULT_MENU_TEXT_COLOR

  return (
    <List>
      <ListItem>
        <Item
          to={eventRoutes.root}
          aria-label="menu link main"
          color={menuTextColor}
          showing={true}
          text={v(homeTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.speakers}
          aria-label="menu link speakers"
          color={menuTextColor}
          showing={showingSpeakers}
          text={v(speakerTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.sponsors}
          aria-label="menu link sponsors"
          color={menuTextColor}
          showing={showingSponsors}
          text={v(sponsorsTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.backgrounds}
          aria-label="menu link zoom backgrounds"
          color={menuTextColor}
          showing={showingZoomBackgrounds}
          text={v(zoomBackgroundsMenuTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.leaderboard}
          aria-label="menu link leaderboard"
          color={menuTextColor}
          showing={showingPoints}
          text={v(pointsTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.faq}
          aria-label="menu link faqs"
          color={menuTextColor}
          showing={showingFaqs}
          text={v(faqsTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.image_waterfall}
          aria-label="menu link image waterfall"
          color={menuTextColor}
          showing={showingImageWaterfall}
          text={v(imageWaterfallTitle)}
        />
      </ListItem>
      <ListItem>
        <Item
          to={eventRoutes.changePassword}
          aria-label="change password"
          color={menuTextColor}
          showing={true}
          text="Change Password"
        />
      </ListItem>
      <ListItem>
        <CustomButton
          variant="text"
          onClick={logout}
          aria-label="logout"
          textColor={menuTextColor}
        >
          Logout
        </CustomButton>
      </ListItem>
    </List>
  )
}

function Item(props: {
  to: string
  'aria-label': string
  color: string
  showing: boolean
  text: string
}) {
  if (!props.showing) {
    return null
  }

  return (
    <StyledRelativeLink
      to={props.to}
      aria-label={props['aria-label']}
      disableStyles
      color={props.color}
    >
      {props.text}
    </StyledRelativeLink>
  )
}

const Box = styled.div<{background: string}>`
  background: ${(props) => props.background};
  height: 100%;
  min-width: 240px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${(props) =>
    `${props.theme.spacing[20]} ${props.theme.spacing[4]} ${props.theme.spacing[6]}`};
  color: #ffffff;
`

const UserInfoText = styled.p<{color: string}>`
  text-align: center;
  color: ${(props) => props.color} !important;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
`

const ListItem = styled.li`
  margin: ${(props) => props.theme.spacing[2]} 0;
`

const StyledRelativeLink = styled(RelativeLink)<{color: string}>`
  color: ${(props) => props.color};
`
