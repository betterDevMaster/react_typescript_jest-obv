import styled from 'styled-components'
import React, {useEffect} from 'react'
import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'
import {v4 as uuid} from 'uuid'

const DEFAULT_SIZE: number = 68

export interface EmojiStateType {
  id: string
  content: string
  number: number
  duration: number
  repeat: number
  size: number
}

interface EmojiProps {
  emoji: EmojiStateType
  onComplete: (emoji: EmojiStateType) => void
}

export default React.memo<EmojiProps>(Emoji, (_, nextProps) => {
  return Boolean(nextProps.emoji.id)
})

function Emoji(props: EmojiProps) {
  const {emoji, onComplete: finished} = props

  useEffect(() => {
    setTimeout(() => {
      finished(emoji)
    }, emoji.duration * 1000)
  }, [])

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

export const createEmoji = (image: string): EmojiStateType => ({
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
