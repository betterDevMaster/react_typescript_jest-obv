import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Attendee} from 'Event/attendee'
import {onUnknownChangeHandler} from 'lib/dom'
import React, {useState} from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {api} from 'lib/url'
import {Area} from 'organization/Event/AreasProvider'
import {withStyles} from '@material-ui/core/styles'

export interface RoomAssignment {
  area_id: number
  attendee_id: number
  room_id: number
}

export default function RoomSelect(props: {
  area: Area
  attendee: Attendee
  assignments: RoomAssignment[]
  addAssignment: (assignment: RoomAssignment) => void
  removeAssignment: (attendee: Attendee) => void
}) {
  const [processing, setProcessing] = useState(false)
  const assigned = getAssignedRoom(
    props.attendee,
    props.area,
    props.assignments,
  )
  const {area} = props

  const assign = useAssign(props.area, props.addAssignment)
  const unassign = useUnassign(props.area, props.removeAssignment)
  /**
   * Use 0 to indicate unassigned value as Material UI select expects a
   * string/number, and since ids will never be 0, it should be
   * safe to use to represent no room assigned.
   */
  const value = assigned || 0

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
    <StyledSelect
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
    </StyledSelect>
  )
}

const NotAssignedText = styled.span`
  color: ${grey[500]};
`

function useAssign(
  area: Area,
  addAssignment: (assignment: RoomAssignment) => void,
) {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (attendee: Attendee, room: Room) => {
    const url = api(
      `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}/rooms/${room.id}`,
    )
    return client.post<RoomAssignment>(url).then(addAssignment)
  }
}

function useUnassign(
  area: Area,
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

function getAssignedRoom(
  attendee: Attendee,
  area: Area,
  assignments: RoomAssignment[],
) {
  const target = assignments.find(
    (assignment) =>
      assignment.attendee_id === attendee.id && assignment.area_id === area.id,
  )

  if (!target) {
    return null
  }

  return target.room_id
}

const StyledSelect = withStyles({
  root: {
    minWidth: 160,
  },
})(Select)
