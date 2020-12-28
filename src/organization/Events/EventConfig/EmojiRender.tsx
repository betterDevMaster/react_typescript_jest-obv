import styled from 'styled-components'
import React, {memo, useEffect, useMemo, useRef, useState} from 'react'

import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'
import {EmojiStateType} from './Emoji'

const EMOJI_WIDTH_BIND: number = 50
const EMOJI_DEFAULT_SIZE: number = 68

const injectStyle = (style: string) => {
  const styleElement = document.createElement('style') as HTMLStyleElement
  let styleSheet = null

  document.head.appendChild(styleElement)

  styleSheet = styleElement.sheet as CSSStyleSheet

  styleSheet.insertRule(style, styleSheet.cssRules.length)
}

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
    console.log('id = ', emojiInfo.data.id)
    setTimeout(() => {
      finished(emojiInfo)
    }, emojiInfo.data.duration * 1000)
  }, [])

  useEffect(() => {
    const intervalPercent = 100 / (emojiInfo.data.duration * 2)
    const moveHeightPerSec = 100 / (emojiInfo.data.duration * 2)
    const frames = Array(emojiInfo.data.duration * 2)
      .fill(1)
      .map((_value, index) => {
        return `
        ${(index + 0.5) * intervalPercent}% { transform: translateX(${
          EMOJI_WIDTH_BIND * (index % 2 ? -1 : 1)
        }px); bottom: ${(index + 0.5) * moveHeightPerSec}%; }
      `
      })

    const keyframesStyle = `
      @-webkit-keyframes bubbleKeyframe${emojiInfo.data.id} {
        0% { transform: translateX(0); bottom: 0% }
        ${frames.join('')}
        100% { transform: translateX(0); bottom: 100% }
      }
    `
    injectStyle(keyframesStyle)

    setKeyframeName(`bubbleKeyframe${emojiInfo.data.id}`)
  }, [])

  return (
    <EmojiRenderContainer
      style={{
        WebkitAnimation: `${keyframeName} ${emojiInfo.data.duration}s linear`,
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
