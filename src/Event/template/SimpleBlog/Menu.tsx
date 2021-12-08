import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import {User} from 'auth/user'
import {useEventAuth} from 'Event/auth'
import CustomButton from 'lib/ui/Button/CustomButton'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'

export const DEFAULT_MENU_TEXT_COLOR = '#FFFFFF'
export const DEFAULT_MENU_ICON_COLOR = '#000000'
export const DEFAULT_MENU_BACKGROUND_COLOR = '#000000'

export default function Menu(props: {
  visible: boolean
  toggle: () => void
  user: User
}) {
  const template = useSimpleBlogTemplate()
  const {menu} = template

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
  const template = useSimpleBlogTemplate()
  const {menu} = template
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
  const template = useSimpleBlogTemplate()
  const {menu} = template

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
      <ListItem>
        <StyledRelativeLink
          to={eventRoutes.changePassword}
          aria-label="change password"
          disableStyles
          color={menuTextColor}
        >
          Change password
        </StyledRelativeLink>
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
