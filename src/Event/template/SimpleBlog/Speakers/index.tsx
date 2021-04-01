import React from 'react'
import {Attendee} from 'Event/attendee'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {Redirect} from 'react-router-dom'
import Speaker from 'Event/template/SimpleBlog/Speakers/Speaker'
import {eventRoutes} from 'Event/Routes'

import Grid from '@material-ui/core/Grid'

export default function SimpleBlogSpeakers(props: {user: Attendee}) {
  const {event} = useEvent()
  const {speaker_page: page} = event

  if (!page) {
    return <Redirect to={eventRoutes.root} />
  }

  return (
    <Page user={props.user}>
      <Title aria-label="speakers title">{page.title}</Title>
      <Grid container>
        {page.speakers.map((speaker) => (
          <Grid item xs={12} key={speaker.id}>
            <Speaker key={speaker.id} speaker={speaker} />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

const Title = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
