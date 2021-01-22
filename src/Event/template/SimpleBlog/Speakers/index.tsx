import React from 'react'
import {Attendee} from 'Event/attendee'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {Redirect} from 'react-router-dom'
import Speaker from 'Event/template/SimpleBlog/Speakers/Speaker'
import {eventRoutes} from 'Event/Routes'

export default function SimpleBlogSpeakers(props: {user: Attendee}) {
  const {event} = useEvent()
  const {speaker_page: page} = event

  if (!page) {
    return <Redirect to={eventRoutes.root} />
  }

  return (
    <Page user={props.user}>
      <Title aria-label="speakers title">{page.title}</Title>
      <Container>
        {page.speakers.map((speaker) => (
          <Speaker key={speaker.id} speaker={speaker} />
        ))}
      </Container>
    </Page>
  )
}

const Container = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Title = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
