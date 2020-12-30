import styled from 'styled-components'
import React, {useEffect} from 'react'
import {v4 as uuid} from 'uuid'
import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'

const DEFAULT_SIZE: number = 68

export type Emoji = {
  id: string
  content: string
  number: number
  duration: number
  repeat: number
  size: number
}

interface EmojiIconProps {
  emoji: Emoji
  onComplete: (emoji: Emoji) => void
}

export default React.memo<EmojiIconProps>(EmojiIcon, (_, nextProps) => {
  return Boolean(nextProps.emoji.id)
})

function EmojiIcon(props: EmojiIconProps) {
  const {emoji, onComplete} = props

  useEffect(() => {
    setTimeout(() => {
      onComplete(emoji)
    }, emoji.duration * 1000)
  }, [emoji, onComplete])

  const position = Math.random() * 80 + 10
  const size = emoji.size * DEFAULT_SIZE

  return (
    <Box duration={emoji.duration} position={position} size={size}>
      <img
        aria-label="emoji"
        src={emojiWithName(emoji.content).image}
        alt={emoji.content}
      />
    </Box>
  )
}

export const createEmoji = (image: string): Emoji => ({
  id: uuid(),
  content: image,
  number: 2,
  duration: Math.random() * 10 + 1,
  repeat: 1,
  size: Math.random() + 1,
})

const Box = styled.div<{duration: number; position: number; size: number}>`
  position: absolute;
  animation: animateBubble ${(props) => props.duration}s linear,
    sideWays 1s ease-in-out infinite alternate;
  left: ${(props) => props.position}%;
  width: ${(props) => props.position}px;
  height: ${(props) => props.position}px;

  img {
    width: 66px;
    height: 66px;
  }

  @keyframes animateBubble {
    0% {
      top: calc(100% + 50px);
    }
    100% {
      top: -50px;
    }
  }

  @keyframes sideWays {
    0% {
      margin-left: -50px;
    }
    100% {
      margin-left: 50px;
    }
  }
`
