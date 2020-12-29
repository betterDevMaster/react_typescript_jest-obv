import styled from 'styled-components'
import React, {memo, useEffect, useMemo, useRef, useState} from 'react'
import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'
import {EmojiStateType} from './Emoji'

const EMOJI_WIDTH_BIND: number = 50
const EMOJI_DEFAULT_SIZE: number = 68
interface EmojiRenderPropsType {
  emojiInfo: EmojiStateType
  finished: Function
  key: number
}

function EmojiRender(props: EmojiRenderPropsType) {
  const {emojiInfo, finished} = props
  const [repeat, setRepeat] = useState(1)
  const [keyframeName, setKeyframeName] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      finished(emojiInfo)
    }, emojiInfo.data.duration * 1000)
  }, [])
  useEffect(() => {
    setKeyframeName(
      `animateBubble ${emojiInfo.data.duration}s linear, sideWays 1s ease-in-out infinite alternate`,
    )
  }, [])
  return (
    <EmojiRenderContainer
      style={{
        WebkitAnimation: `${keyframeName}`,
        left: `${Math.random() * 80 + 10}%`,
        width: emojiInfo.data.size * EMOJI_DEFAULT_SIZE,
        height: emojiInfo.data.size * EMOJI_DEFAULT_SIZE,
      }}
    >
      <img
        aria-label="event emoji"
        src={emojiWithName(emojiInfo.data.content).image}
        alt={emojiInfo.data.content}
      />
    </EmojiRenderContainer>
  )
}

export default memo<EmojiRenderPropsType>(
  EmojiRender,
  (_prevProps, nextProps) => {
    if (nextProps.emojiInfo.data.id) return true
    return false
  },
)

const EmojiRenderContainer = styled.div`
  position: absolute;
  /* bottom: 0; */
`