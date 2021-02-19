import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Attendee} from 'Event/attendee'
import {onUnknownChangeHandler} from 'lib/dom'
import React, {useEffect, useState} from 'react'
import {
  AreaWithAssignments,
  RoomAssignment,
} from 'organization/Event/RoomAssignmentsProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {api} from 'lib/url'

export default function RoomSelect(props: {
  attendee: Attendee
  area: AreaWithAssignments
}) {
  const [assignments, setAssignments] = useState<RoomAssignment[]>([])
  const [processing, setProcessing] = useState(false)
  const {area} = props
  const assigned = getAssignedRoom(props.attendee, assignments)

  const addAssignment = (assignment: RoomAssignment) => {
    setAssignments((current) => [...current, assignment])
  }

  const findAssignment = (attendee: Attendee, assignments: RoomAssignment[]) =>
    assignments.find((assignment) => assignment.attendee.id === attendee.id)

  const removeAssignment = (attendee: Attendee) => {
    const target = findAssignment(attendee, assignments)
    if (!target) {
      throw new Error(`Missing assignment for attendee: ${attendee.id}`)
    }

    setAssignments((current) => current.filter((a) => !isEqual(target, a)))
  }

  const assign = useAssign(props.area, addAssignment)
  const unassign = useUnassign(props.area, removeAssignment)

  useEffect(() => {
    setAssignments(area.assignments)
  }, [area])

  /**
   * Use 0 to indicate unassigned value as Material UI select expects a
   * string/number, and since ids will never be 0, it should be
   * safe to use to represent no room assigned.
   */
  const value = assigned ? assigned.id : 0

  const handleRoomSelect = async (roomId: number) => {
    if (processing) {
      return
    }

    setProcessing(true)
    const isRemoveAssignment = roomId === 0

    if (isRemoveAssignment) {
      unassign(props.attendee).finally(() => setProcessing(false))
      return
    }

    const room = area.rooms.find((r) => r.id === roomId)
    if (!room) {
      throw new Error(`Invalid room id: ${roomId}`)
    }

    if (assigned) {
      unassign(props.attendee)
        .then(() => assign(props.attendee, room))
        .finally(() => setProcessing(false))
      return
    }

    assign(props.attendee, room).finally(() => setProcessing(false))
  }

  return (
    <Select
      fullWidth
      value={value}
      variant="outlined"
      disabled={processing}
      onChange={onUnknownChangeHandler(handleRoomSelect)}
      inputProps={{
        'aria-label': 'room select',
      }}
    >
      {area.rooms.map((room) => (
        <MenuItem
          key={room.id}
          value={room.id}
          aria-label={`pick ${room.name}`}
        >
          {room.name}
        </MenuItem>
      ))}
      <MenuItem value={0} aria-label="unassign room">
        <NotAssignedText>Not Assigned</NotAssignedText>
      </MenuItem>
    </Select>
  )
}

const NotAssignedText = styled.span`
  color: ${grey[500]};
`

function useAssign(
  area: AreaWithAssignments,
  addAssignment: (assignment: RoomAssignment) => void,
) {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (attendee: Attendee, room: Room) => {
    const url = api(
      `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}/rooms/${room.id}`,
    )
    return client.post(url).then(() => {
      const assignment: RoomAssignment = {
        attendee,
        room,
      }

      addAssignment(assignment)
    })
  }
}

function useUnassign(
  area: AreaWithAssignments,
  removeAssignment: (attendee: Attendee) => void,
) {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (attendee: Attendee) => {
    const url = api(
      `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}`,
    )
    return client.delete(url).then(() => removeAssignment(attendee))
  }
}

function getAssignedRoom(attendee: Attendee, assignments: RoomAssignment[]) {
  const target = assignments.find(
    (assignment) => assignment.attendee.id === attendee.id,
  )

  if (!target) {
    return null
  }

  return target.room
}

function isEqual(a: RoomAssignment, b: RoomAssignment) {
  const sameAttendee = a.attendee.id === b.attendee.id
  const sameRoom = a.room.id === b.room.id
  return sameAttendee && sameRoom
}
