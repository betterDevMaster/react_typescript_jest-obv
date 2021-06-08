import {eventRoutes} from 'Event/Routes'
import styled from 'styled-components'
import React from 'react'
import {usePanels} from 'Event/template/Panels'

export default function Menu(props: {onChangeTab: (tab: number) => void}) {
  const items = {
    Home: eventRoutes.root,
    Speakers: eventRoutes.speakers,
    Resources: eventRoutes.resources,
    Points: eventRoutes.leaderboard,
  }

  return (
    <Box>
      {Object.entries(items).map(([label, url], index) => (
        <Link key={label} to={url} onClick={() => props.onChangeTab(index)}>
          {label}
        </Link>
      ))}
    </Box>
  )
}

function Link(props: {to: string; children: string; onClick: () => void}) {
  const {template} = usePanels()

  const color = template.isDarkMode ? '#ffffff' : '#000000'

  return (
    <LinkText color={color} onClick={props.onClick}>
      {props.children}
    </LinkText>
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
`
