import styled from 'styled-components'
import React, {useCallback, useEffect, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import Emoji, {createEmoji} from './Emoji'
import {useOrganization} from 'organization/OrganizationProvider'

export interface floatingEmojiData {
  id: string
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

export type Emojis = string[]

const injectStyle = (style: string) => {
  const styleElement = document.createElement('style') as HTMLStyleElement
  let styleSheet = null
  document.head.appendChild(styleElement)
  styleSheet = styleElement.sheet as CSSStyleSheet
  styleSheet.insertRule(style, styleSheet.cssRules.length)
}

const POLL_INTERVAL_MS = 1000

export default function EmojiPage() {
  const [emojiList, setEmojiList] = useState<EmojiStateType[]>([])
  const fetchEmojis = useFetchEmojis()

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
      fetchEmojis()
        .then((emojis) => {
          emojis.forEach((image: string) => {
            const newEmoji = createEmoji(image)
            emojiList.push(newEmoji)
          })
          setEmojiList(JSON.parse(JSON.stringify(emojiList)))
        })
        .catch((error) => {
          // ignore errors, prevent failing to send emoji from crashing app
          console.error(error)
        })
    }, POLL_INTERVAL_MS)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const removeEmoji = useCallback((emojiInfo) => {
    const indexOfEmoji = emojiList.findIndex(
      (item) => item.data.id === emojiInfo.data.id,
    )
    emojiList.splice(indexOfEmoji, 1)
    setEmojiList(JSON.parse(JSON.stringify(emojiList)))
  }, [])

  return (
    <MainBody>
      <div className="float-container" id="float-container">
        {emojiList.map((emoji) => {
          return (
            <Emoji emoji={emoji} key={emoji.data.id} onComplete={removeEmoji} />
          )
        })}
      </div>
    </MainBody>
  )
}

function useFetchEmojis() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/emoji`)

  return () => client.get<Emojis>(url)
}

const MainBody = styled.div`
  height: 100vh;
  width: 100%;
  background: black;
  position: absolute;
  overflow: hidden;
  img {
    width: 66px;
    height: 66px;
  }
`
