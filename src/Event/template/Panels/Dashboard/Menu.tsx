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
  const {template} = usePanels()
  const color = template.leftPanel.menuTextColor || '#000000'
  const {logout} = useEventAuth()

  const {
    homeMenuTitle,
    speakers: {menuTitle: speakerMenuTitle},
    sponsors: {menuTitle: sponsorsMenuTitle},
    resourceList: {menuTitle: resourceListMenuTitle},
    leaderboard: {menuTitle: leaderboardMenuTitle},
  } = template

  const items = {
    [homeMenuTitle]: eventRoutes.root,
    [speakerMenuTitle]: eventRoutes.speakers,
    [sponsorsMenuTitle]: eventRoutes.sponsors,
    [resourceListMenuTitle]: eventRoutes.resources,
    [leaderboardMenuTitle]: eventRoutes.leaderboard,
  }

  return (
    <Box>
      <TopCenterBox>
        <Top>
          {Object.entries(items).map(([label, url], index) => (
            <LinkText
              key={label}
              onClick={() => props.onChangeTab(index)}
              style={{color}}
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
