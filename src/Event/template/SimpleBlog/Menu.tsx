import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import {User} from 'auth/user'
import {useEventAuth} from 'Event/auth'
import Button from 'lib/ui/Button'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'

export default function Menu(props: {
  visible: boolean
  background: string
  toggle: () => void
  user: User
}) {
  return (
    <Drawer anchor="left" open={props.visible} onClose={props.toggle}>
      <Box background={props.background}>
        <UserInfo email={props.user.email} />
        <Links />
      </Box>
    </Drawer>
  )
}

function UserInfo(props: {email: string}) {
  return (
    <UserInfoText>
      You're logged in as <br />
      {props.email}
    </UserInfoText>
  )
}

function Links() {
  const {logout} = useEventAuth()

  return (
    <List>
      <ListItem>
        <RelativeLink
          to={eventRoutes.root}
          aria-label="dashboard"
          disableStyles
        >
          Dashboard
        </RelativeLink>
      </ListItem>
      <SpeakersLink />
      <ListItem>
        <Button
          variant="text"
          onClick={logout}
          aria-label="logout"
          textColor="#FFFFFF"
        >
          Logout
        </Button>
      </ListItem>
    </List>
  )
}

function SpeakersLink() {
  const {event} = useEvent()
  if (!event.speaker_page) {
    return null
  }

  return (
    <ListItem>
      <RelativeLink
        to={eventRoutes.speakers}
        aria-label="view speakers"
        disableStyles
      >
        Speakers
      </RelativeLink>
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

const UserInfoText = styled.p`
  text-align: center;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
`

const ListItem = styled.li`
  margin: ${(props) => props.theme.spacing[2]} 0;
`
