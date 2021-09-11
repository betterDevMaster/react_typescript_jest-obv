import {eventRoutes} from 'Event/Routes'
import styled from 'styled-components'
import React from 'react'
import {usePanels} from 'Event/template/Panels'
import {User} from 'auth/user'
import {useEventAuth} from 'Event/auth'
import Button from 'lib/ui/Button'

export default function Menu(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const items = {
    Home: eventRoutes.root,
    Speakers: eventRoutes.speakers,
    Resources: eventRoutes.resources,
    Points: eventRoutes.leaderboard,
  }
  const {template} = usePanels()
  const color = template.isDarkMode ? '#ffffff' : '#000000'
  const {logout} = useEventAuth()

  return (
    <Box>
      <TopCenterBox>
        <Top>
          {Object.entries(items).map(([label, url], index) => (
            <LinkText
              key={label}
              onClick={() => props.onChangeTab(index)}
              color={color}
              aria-label={`left panel menu ${label} button`}
            >
              {label}
            </LinkText>
          ))}
        </Top>
      </TopCenterBox>

      <Bottom>
        <UserInfo color={color}>
          You're logged in as <br />
          {props.user.email}
        </UserInfo>
        <LogoutBox>
          <Button
            variant="text"
            onClick={logout}
            aria-label="logout"
            textColor={color}
          >
            Logout
          </Button>
        </LogoutBox>
      </Bottom>
    </Box>
  )
}

const LinkText = styled.span`
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
