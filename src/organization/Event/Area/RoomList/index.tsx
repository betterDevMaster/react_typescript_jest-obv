import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import RoomOnlineSwitch from 'organization/Event/Area/RoomList/RoomOnlineSwitch'
import {StaticRoomProvider, useRoom} from 'organization/Event/Room/RoomProvider'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useRoomRoutes} from 'organization/Event/Room/RoomRoutes'
import StartButton from 'organization/Event/Area/RoomList/StartButton'

export default function RoomList(props: {rooms: Room[]}) {
  const {rooms} = props
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
          <TableCell>Name</TableCell>
          <TableCell>Max Num Attendees</TableCell>
          <TableCell>Online</TableCell>
          <TableCell>{/* Start Button Column */}</TableCell>
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
              <TableCell>
                <RoomOnlineSwitch />
              </TableCell>
              <TableCell>
                <StartButton />
              </TableCell>
            </TableRow>
          </StaticRoomProvider>
        ))}
      </TableBody>
    </Table>
  )
}

export function useRooms() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()

  const {id} = area

  const fetch = useCallback(() => {
    const url = api(`/events/${event.slug}/areas/${id}/rooms`)
    return client.get<Room[]>(url)
  }, [client, event, id])

  const {data: rooms, ...asyncRes} = useAsync(fetch)

  return {rooms, ...asyncRes}
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
