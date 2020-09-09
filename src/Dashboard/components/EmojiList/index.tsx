import React from 'react'
import styled from 'styled-components'
import {SidebarProps} from 'Dashboard/templates/SimpleBlog/Sidebar'

export default function Emojis(props: {emojis: SidebarProps['emojis']}) {
  const hasEmojis = props.emojis.length > 0
  if (!hasEmojis) {
    return null
  }

  return (
    <Box>
      {props.emojis.map((emoji, index) => (
        <Emoji aria-label="event emoji" key={index}>
          {emoji}
        </Emoji>
      ))}
    </Box>
  )
}

const Box = styled.div`
  padding: ${(props) => props.theme.spacing[5]} 0;
  display: flex;
  justify-content: center;
`

const Emoji = styled.span`
  margin: 0 ${(props) => props.theme.spacing[3]};
  font-size: 55px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 34px;
  }
`
