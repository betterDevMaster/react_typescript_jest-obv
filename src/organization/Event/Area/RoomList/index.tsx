import {Room} from 'Event/room'
import React, {useCallback} from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import OnlineSwitch from 'organization/Event/Room/OnlineSwitch'
import {StaticRoomProvider, useRoom} from 'organization/Event/Room/RoomProvider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useRoomRoutes} from 'organization/Event/Room/RoomRoutes'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/Area/AreaProvider'

export interface RoomMetrics {
  room_id: number
  num_attendees: number
  last_joined_timestamp: string
}

export default function RoomList(props: {rooms: Room[]}) {
  const {rooms} = props
  const isEmpty = rooms.length === 0
  const {data: metrics} = useAreaMetrics()

  if (isEmpty) {
    return (
      <div>
        <p>No rooms have been created</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Max Num Attendees</TableCell>
          <TableCell>Num Attendees</TableCell>
          <TableCell>Online</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rooms.map((room) => (
          <StaticRoomProvider room={room} key={room.id}>
            <TableRow key={room.id} aria-label="room">
              <TableCell>
                <RoomLink />
              </TableCell>
              <TableCell>{room.max_num_attendees || '-'}</TableCell>
              <TableCell>{numAttendees(room.id, metrics) || '-'}</TableCell>
              <TableCell>
                <OnlineSwitch />
              </TableCell>
            </TableRow>
          </StaticRoomProvider>
        ))}
      </TableBody>
    </Table>
  )
}

function numAttendees(roomId: number, metrics: RoomMetrics[] | null) {
  if (!metrics) {
    return null
  }

  const target = metrics.find((m) => m.room_id === roomId)
  if (!target) {
    return null
  }

  return target.num_attendees
}

function useAreaMetrics() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {
    area: {id},
  } = useArea()

  const fetch = useCallback(() => {
    const url = api(`/events/${event.slug}/areas/${id}/metrics`)
    return client.get<RoomMetrics[]>(url)
  }, [client, event.slug, id])

  return useAsync(fetch)
}

function RoomLink() {
  const {room} = useRoom()
  const routes = useRoomRoutes(room)
  const label = `view ${room.name} room`

  return (
    <RelativeLink to={routes.root} aria-label={label}>
      {room.name}
    </RelativeLink>
  )
}
