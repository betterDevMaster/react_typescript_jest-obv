import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import Page from 'organization/user/Layout/Page'
import React, {useEffect, useRef, useState} from 'react'
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

interface floatingEmojiData{
    content: string
    number:number
    duration: number
    repeat: number
    size: number
}

export default function Emoji() {
  const {event} = useEvent()

  useEffect(() => {
    const interval = setInterval(() => {
      const url = api(`/events/${event.slug}/getEmoji`)
      eventClient.get(url)
      .then(res => {
        console.log(emojiWithName('heart').image)
      })
      .catch((error) => {
        // ignore errors, prevent failing to send emoji from crashing app
        console.error(error)
      })

    }, 3000);
    return () => clearInterval(interval);
  })

  const getEmoji = () => {
    
  }

  return (
    <MainBody>
      <div className="float-container" id="float-container">
        <img
            aria-label="event emoji"
            src={emojiWithName('heart').image}
            alt=""
        />
      </div>        
    </MainBody>
  )
}

const MainBody = styled.div`
    height: calc(100vh - 64px);
    width: 100%;
    background:black;

    img {
        width: 68px;
        height: 68px;
    }
    
`




