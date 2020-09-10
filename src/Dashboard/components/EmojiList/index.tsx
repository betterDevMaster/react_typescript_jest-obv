import React from 'react'
import styled from 'styled-components'
import {Emoji} from 'Dashboard/components/EmojiList/emoji'

export default function Emojis(props: {emojis: Emoji[]}) {
  const hasEmojis = props.emojis.length > 0
  if (!hasEmojis) {
    return null
  }

  return (
    <Box>
      {props.emojis.map((emoji, index) => (
        <EmojiText aria-label="event emoji" key={index}>
          {emoji}
        </EmojiText>
      ))}
    </Box>
  )
}

const Box = styled.div`
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  display: flex;
  justify-content: center;
`

const EmojiText = styled.span`
  margin: 0 ${(props) => props.theme.spacing[3]};
  font-size: 55px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 50px;
  }
`
