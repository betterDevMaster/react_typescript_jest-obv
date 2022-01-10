import React from 'react'
import Box from '@material-ui/core/Box'
import Header from './Header'
import EventList from './EventList'

export enum ViewType {
  LIST,
  GRID,
}

export interface Event {
  name: string
  url: string
  avatar: string
  live: boolean
}

export type EventsProps = {
  viewType: ViewType
  events: Event[]
}

export default function Events(props: EventsProps) {
  const {viewType, events} = props

  return (
    <Box>
      <Header viewType={viewType} />
      <EventList viewType={viewType} events={events} />
    </Box>
  )
}
