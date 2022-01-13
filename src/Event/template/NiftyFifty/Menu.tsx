import React from 'react'
import styled from 'styled-components'

import Drawer from '@material-ui/core/Drawer'

import {User} from 'auth/user'

import {useEventAuth} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'
import CustomButton from 'lib/ui/Button/CustomButton'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Menu(props: {
  visible: boolean
  toggle: () => void
  user: User
}) {
  const template = useNiftyFiftyTemplate()
  const {menu} = template

  return (
    <Drawer anchor="left" open={props.visible} onClose={props.toggle}>
      <Box background={rgba(menu.backgroundColor, menu.backgroundOpacity)}>
        <UserInfo email={props.user.email} />
        <Links />
      </Box>
    </Drawer>
  )
}

function UserInfo(props: {email: string}) {
  const template = useNiftyFiftyTemplate()
  const {menu} = template

  return (
    <UserInfoText color={menu.textColor}>
      You're logged in as <br />
      {props.email}
    </UserInfoText>
  )
}

function Links() {
  const {logout} = useEventAuth()
  const template = useNiftyFiftyTemplate()
  const {menu} = template

  return (
    <List>
      <ListItem>
        <StyledRelativeLink
          to={eventRoutes.root}
          aria-label="dashboard"
          disableStyles
          color={menu.textColor}
        >
          Dashboard
        </StyledRelativeLink>
      </ListItem>
      <ListItem>
        <StyledRelativeLink
          to={eventRoutes.changePassword}
          aria-label="change password"
          disableStyles
          color={menu.textColor}
        >
          Change password
        </StyledRelativeLink>
      </ListItem>
      <ListItem>
        <CustomButton
          variant="text"
          onClick={logout}
          aria-label="logout"
          textColor={menu.textColor}
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
