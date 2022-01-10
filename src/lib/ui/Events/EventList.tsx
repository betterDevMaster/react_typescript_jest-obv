import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import EventItem from './EventItem'
import {ViewType, Event} from '.'

export type EventListProps = {
  viewType: ViewType
  events: Event[]
}

export default function EventList(props: EventListProps) {
  const {viewType, events} = props
  if (viewType === ViewType.LIST) {
    return (
      <Box>
        {events.map((event) => (
          <EventItem viewType={viewType} event={event} key={event.name} />
        ))}
      </Box>
    )
  }

  return (
    <Grid container>
      {events.map((event) => (
        <Grid item xs={12} sm={4} md={3} key={event.name}>
          <EventItem viewType={viewType} event={event} />
        </Grid>
      ))}
    </Grid>
  )
}
