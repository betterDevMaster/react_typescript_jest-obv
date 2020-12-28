import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import Page from 'organization/user/Layout/Page'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {ObvioEvent} from 'Event'
import {setEvent} from 'Event/state/actions'
import {useDispatch} from 'react-redux'
import {useEventRoutes} from 'Event/url'
import {useHistory} from 'react-router-dom'
import {waiverLogoPath} from 'Event/Step2/Waiver'
import {fetchFile} from 'lib/http-client'

import {emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'
import {eventClient} from 'Event/api-client'
import EmojiRender from './EmojiRender'
import {random} from 'faker'

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

// const mockup = [
//   {
//     content: 'heart',
//     number: 2,
//     duration: 5,
//     repeat: 2,
//     size: 1,
//   },
//   {
//     content: 'clap',
//     number: 2,
//     duration: 2,
//     repeat: 2,
//     size: 1.5,
//   },
//   {
//     content: 'laugh',
//     number: 2,
//     duration: 3,
//     repeat: 2,
//     size: 1.2,
//   },
// ]

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
    /* initialize emoji styles */
    const defaultEmojiStyle = `
      default-emoji {
        marging-top: 110%
      }`
    const animateBubble = `
      @-webkit-keyframes animateBubble {
        0% { margin-top: 110% }
        100% { margin-top: -10% }
      }`
    const sideWays = `
        @-webkit-keyframes sideWays { 
          0% { margin-left:-50px }
          100% { margin-left:50px }
      }`

    injectStyle(defaultEmojiStyle)
    injectStyle(animateBubble)
    injectStyle(sideWays)

    /* fetch emoji updates */
    const interval = setInterval(() => {
      /* TODO: removed afterwards */
      // let randomNumber = parseInt((Math.random() * 20).toString())
      // const isAdd = randomNumber > 3
      // if (isAdd) {
      //   const newEmoji: EmojiStateType = {
      //     data: JSON.parse(
      //       JSON.stringify({
      //         ...mockup[randomNumber % 3],
      //         id: Date.now(),
      //       }),
      //     ),
      //     isRendering: false,
      //   }
      //   emojiList.push(newEmoji)
      //   setEmojiList(JSON.parse(JSON.stringify(emojiList)))
      // }

      const url = api(`/events/${event.slug}/getEmoji`)
      eventClient
        .get(url)
        .then((res) => {
          // res will josn data ex {"data":["thumb_up","thumb_up"]}
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

          // console.log(emojiWithName('heart').image)
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
    // console.log('delete = ', emojiInfo.data.id)
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
  height: calc(100vh - 64px);
  width: 100%;
  background: black;

  img {
    width: 68px;
    height: 68px;
  }
`
