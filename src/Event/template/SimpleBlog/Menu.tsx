import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import {User} from 'auth/user'
import {useEventAuth} from 'Event/auth'
import Button from 'lib/ui/Button'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'

export const DEFAULT_MENU_TEXT_COLOR = '#FFFFFF'
export const DEFAULT_MENU_ICON_COLOR = '#000000'
export const DEFAULT_MENU_BACKGROUND_COLOR = '#000000'

export default function Menu(props: {
  visible: boolean
  toggle: () => void
  user: User
}) {
  const {menu} = useTemplate()

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
  const {menu} = useTemplate()
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
  const {menu} = useTemplate()
  const menuTextColor = menu?.textColor || DEFAULT_MENU_TEXT_COLOR

  return (
    <List>
      <ListItem>
        <StyledRelativeLink
          to={eventRoutes.root}
          aria-label="dashboard"
          disableStyles
          color={menuTextColor}
        >
          Dashboard
        </StyledRelativeLink>
      </ListItem>
      <BackgroundsLink />
      <ListItem>
        <Button
          variant="text"
          onClick={logout}
          aria-label="logout"
          textColor={menuTextColor}
        >
          Logout
        </Button>
      </ListItem>
    </List>
  )
}

function BackgroundsLink() {
  const {event} = useEvent()
  const {menu} = useTemplate()
  const menuTextColor = menu?.textColor || DEFAULT_MENU_TEXT_COLOR

  // If there are no Zoom Backgrounds configured in the event, we're not going
  // to show the Backgrounds link.
  if (event.backgrounds.length < 1) {
    return null
  }

  return (
    <ListItem>
      <StyledRelativeLink
        to={eventRoutes.backgrounds}
        aria-label="view backgrounds"
        disableStyles
        color={menuTextColor}
      >
        Backgrounds
      </StyledRelativeLink>
    </ListItem>
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
