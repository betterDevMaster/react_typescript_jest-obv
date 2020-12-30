import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'
import {v4 as uuid} from 'uuid'
import {EmojiStateType} from 'organization/Event/EmojiPage'

const EMOJI_DEFAULT_SIZE: number = 68
interface EmojiProps {
  emoji: EmojiStateType
  onComplete: (emoji: EmojiStateType) => void
}

export default React.memo<EmojiProps>(Emoji, (_, nextProps) => {
  return Boolean(nextProps.emoji.data.id)
})

function Emoji(props: EmojiProps) {
  const {emoji, onComplete: finished} = props
  const [keyframeName, setKeyframeName] = useState('')
  useEffect(() => {
    setTimeout(() => {
      finished(emoji)
    }, emoji.data.duration * 1000)
  }, [])
  useEffect(() => {
    setKeyframeName(
      `animateBubble ${emoji.data.duration}s linear, sideWays 1s ease-in-out infinite alternate`,
    )
  }, [])
  return (
    <Box
      style={{
        WebkitAnimation: `${keyframeName}`,
        left: `${Math.random() * 80 + 10}%`,
        width: emoji.data.size * EMOJI_DEFAULT_SIZE,
        height: emoji.data.size * EMOJI_DEFAULT_SIZE,
      }}
    >
      <img
        aria-label="event emoji"
        src={emojiWithName(emoji.data.content).image}
        alt={emoji.data.content}
      />
    </Box>
  )
}

export const createEmoji = (image: string): EmojiStateType => ({
  data: {
    id: uuid(),
    content: image,
    number: 2,
    duration: Math.random() * 10 + 1,
    repeat: 1,
    size: Math.random() + 1,
  },
  isRendering: false,
})

const Box = styled.div`
  position: absolute;
`
