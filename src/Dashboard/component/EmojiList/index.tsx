import React from 'react'
import styled from 'styled-components'
import {Emoji} from 'Dashboard/component/EmojiList/emoji'

export interface EmojiList {
  emojis: Emoji[]
  width?: number
}

export default function EmojiList(props: {list: EmojiList | null}) {
  const {list} = props
  if (!list) {
    return null
  }

  return (
    <Box>
      {list.emojis.map((emoji, index) => (
        <Container key={index} width={list.width}>
          <Image aria-label="event emoji" src={emoji}></Image>
        </Container>
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

const Container = styled((props: any) => {
  const {width: _, ...otherProps} = props
  return <div {...otherProps} />
})`
  margin: 0 ${(props) => props.theme.spacing[3]};
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
`
const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`
