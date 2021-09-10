import {Room} from 'Event/room'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import OnlineSwitch from 'organization/Event/Room/OnlineSwitch'
import {StaticRoomProvider, useRoom} from 'organization/Event/Room/RoomProvider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useRoomRoutes} from 'organization/Event/Room/RoomRoutes'

export interface RoomMetrics {
  room_id: number
  num_attendees: string
  last_joined_timestamp: string
}

export default function RoomList(props: {
  rooms: Room[]
  metrics: RoomMetrics[]
}) {
  const {rooms, metrics} = props
  const isEmpty = rooms.length === 0

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
          <TableCell>#</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Num Attendees</TableCell>
          <TableCell>Open</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rooms.map((room) => (
          <StaticRoomProvider room={room} key={room.id}>
            <TableRow key={room.id} aria-label="room">
              <TableCell>
                <RoomLink />
              </TableCell>
              <TableCell>{room.description}</TableCell>
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

function RoomLink() {
  const {room} = useRoom()
  const routes = useRoomRoutes(room)
  const label = `view ${room.number} room`

  return (
    <RelativeLink to={routes.root} aria-label={label}>
      {room.number}
    </RelativeLink>
  )
}
