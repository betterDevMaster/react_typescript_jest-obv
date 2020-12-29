import styled from 'styled-components'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {eventClient} from 'Event/api-client'
import EmojiRender from './EmojiRender'

export interface floatingEmojiData {
  id: number
  content: string
  number: number
  duration: number
  repeat: number
  size: number
}

export interface EmojiStateType {
  data: floatingEmojiData
  isRendering: boolean
}

const injectStyle = (style: string) => {
  const styleElement = document.createElement('style') as HTMLStyleElement
  let styleSheet = null
  document.head.appendChild(styleElement)
  styleSheet = styleElement.sheet as CSSStyleSheet
  styleSheet.insertRule(style, styleSheet.cssRules.length)
}

export default function Emoji() {
  const {event} = useEvent()
  const [emojiList, setEmojiList] = useState<EmojiStateType[]>([])
  const [timer, setTimer] = useState<Number>()
  useEffect(() => {
    const animateBubble = `
      @-webkit-keyframes animateBubble {
        0% { top: calc(100% + 50px) }
        100% {top: -50px }
      }`
    const sideWays = `
        @-webkit-keyframes sideWays { 
          0% { margin-left:-50px }
          100% { margin-left:50px }
      }`
    injectStyle(animateBubble)
    injectStyle(sideWays)
    /* fetch emoji updates */
    const interval = setInterval(() => {
      const url = api(`/events/${event.slug}/getEmoji`)
      eventClient
        .get(url)
        .then((res) => {
          JSON.parse(JSON.stringify(res)).data.forEach((image: string) => {
            const newEmoji: EmojiStateType = {
              data: {
                id: Date.now(),
                content: image,
                number: 2,
                duration: Math.random() * 10 + 1,
                repeat: 1,
                size: Math.random() + 1,
              },
              isRendering: false,
            }
            emojiList.push(newEmoji)
          })
          setEmojiList(JSON.parse(JSON.stringify(emojiList)))
        })
        .catch((error) => {
          // ignore errors, prevent failing to send emoji from crashing app
          console.error(error)
        })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const emojiRenderFinished = useCallback((emojiInfo) => {
    const indexOfEmoji = emojiList.findIndex(
      (item) => item.data.id === emojiInfo.data.id,
    )
    emojiList.splice(indexOfEmoji, 1)
    setEmojiList(JSON.parse(JSON.stringify(emojiList)))
  }, [])

  const updateStatus = useCallback((emojiInfo) => {
    const indexOfEmoji = emojiList.findIndex(
      (item) => item.data.id === emojiInfo.data.id,
    )
    emojiList[indexOfEmoji].isRendering = true
    setEmojiList(JSON.parse(JSON.stringify(emojiList)))
  }, [])

  return (
    <MainBody>
      <div className="float-container" id="float-container">
        {emojiList.map((emojiItem, index) => {
          return (
            <EmojiRender
              emojiInfo={emojiItem}
              key={emojiItem.data.id}
              finished={(emojiInfo: EmojiStateType) =>
                emojiRenderFinished(emojiInfo)
              }
            />
          )
        })}
      </div>
    </MainBody>
  )
}

const MainBody = styled.div`
  height: 100vh;
  width: 100%;
  background: black;
  position: absolute;
  margin-top: -64px;
  overflow: hidden;
  img {
    width: 66px;
    height: 66px;
  }
`