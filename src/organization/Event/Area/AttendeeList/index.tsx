import {TableHead} from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {Attendee} from 'Event/attendee'
import {Room} from 'Event/room'
import {onChangeCheckedHandler} from 'lib/dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useRoomAssignments} from 'organization/Event/Area/AttendeeList/assignments'
import {useAreaAttendees} from 'organization/Event/Area/AttendeeList/attendees'
import RoomSelect from 'organization/Event/Area/AttendeeList/RoomSelect'
import {useAttendees} from 'organization/Event/AttendeeManagement/attendees'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import React, {useState} from 'react'

export default function AttendeeList(props: {rooms: Room[]}) {
  const {rooms} = props
  const all = useAttendees()
  const [processing, setProcessing] = useState(false)
  const area = useAreaAttendees()
  const assignments = useRoomAssignments()

  const toggleAttendee = (attendee: Attendee) => (isAdd?: boolean) => {
    if (processing) {
      return
    }

    setProcessing(true)

    const update = isAdd ? area.add : area.remove
    update(attendee).finally(() => setProcessing(false))
  }

  const routes = useEventRoutes()

  const isAdded = (attendee: Attendee) =>
    Boolean(area.attendees.find((a) => a.id === attendee.id))

  const loading = all.loading || area.loading || assignments.loading
  if (loading) {
    return null
  }

  const isEmpty = all.attendees.length === 0
  if (isEmpty) {
    return (
      <div>
        <p>
          No attendees have been added to your event.{' '}
          <RelativeLink to={routes.attendees}>Click here</RelativeLink> to go to
          Attendee Mangement, and import attendees.
        </p>
      </div>
    )
  }

  if (!rooms) {
    throw new Error('Error fetching rooms list')
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Entry</TableCell>
          <TableCell>Room</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {all.attendees.map((attendee) => (
          <TableRow key={attendee.id} aria-label="attendee">
            <TableCell component="th">
              {`${attendee.first_name} ${attendee.last_name}`}
            </TableCell>
            <TableCell>
              <Checkbox
                disabled={processing}
                checked={isAdded(attendee)}
                onChange={onChangeCheckedHandler(toggleAttendee(attendee))}
                inputProps={{
                  'aria-label': 'toggle entry',
                }}
              />
            </TableCell>
            <TableCell>
              <RoomSelect
                attendee={attendee}
                assignments={assignments}
                rooms={rooms}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
