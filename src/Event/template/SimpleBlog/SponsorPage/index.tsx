import React from 'react'
import {Attendee} from 'Event/attendee'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import Grid from '@material-ui/core/Grid'
import {useSponsors} from 'Event/SponsorPage'
import Sponsor from 'Event/template/SimpleBlog/SponsorPage/Sponsor'
import grey from '@material-ui/core/colors/grey'

export default function SimpleBlogSponsorPage(props: {user: Attendee}) {
  const {event} = useEvent()
  const {sponsor_page_title: title} = event

  return (
    <Page user={props.user}>
      <Title aria-label="sponsors title">{title}</Title>
      <Sponsors />
    </Page>
  )
}

function Sponsors() {
  const {client} = useEvent()
  const {data, loading} = useSponsors(client)

  if (loading) {
    return null
  }

  const sponsors = data || []
  const hasSponsors = sponsors.length > 0
  if (!hasSponsors) {
    return <div>No sponsors have been added</div>
  }

  return (
    <Grid container>
      {sponsors &&
        sponsors.map((sponsor) => (
          <SponsorGridItem item xs={12} key={sponsor.id}>
            <Sponsor key={sponsor.id} sponsor={sponsor} />
          </SponsorGridItem>
        ))}
    </Grid>
  )
}

const Title = styled.h2`
  color: #000;
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`

const SponsorGridItem = styled(Grid)`
  &:not(:last-child) {
    border-bottom: 1px solid ${grey[500]};
  }
`
