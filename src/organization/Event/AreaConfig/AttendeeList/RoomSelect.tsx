import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Attendee} from 'Event/attendee'
import {Room} from 'Event/room'
import {onUnknownChangeHandler} from 'lib/dom'
import {RoomAssignmentProps} from 'organization/Event/AreaConfig/AttendeeList/assignments'
import React, {useState} from 'react'

export default function RoomSelect(props: {
  attendee: Attendee
  assignments: RoomAssignmentProps
  rooms: Room[]
}) {
  const [processing, setProcessing] = useState(false)
  const assigned = props.assignments.getRoom(props.attendee)

  /**
   * Use 0 to indicate unassigned value as Material UI select expects a
   * string/number, and since ids will never be 0, it should be
   * safe to use to represent no room assigned.
   */
  const value = assigned ? assigned.id : 0

  const assign = (roomId: number) => {
    if (processing) {
      return
    }

    setProcessing(true)
    const isRemoveAssignment = roomId === 0

    if (isRemoveAssignment) {
      props.assignments
        .unassign(props.attendee)
        .finally(() => setProcessing(false))
      return
    }

    const room = props.rooms.find((r) => r.id === roomId)
    if (!room) {
      throw new Error(`Invalid room id: ${roomId}`)
    }

    props.assignments
      .assign(props.attendee, room)
      .finally(() => setProcessing(false))
  }

  return (
    <Select
      fullWidth
      value={value}
      variant="outlined"
      disabled={processing}
      onChange={onUnknownChangeHandler(assign)}
      inputProps={{
        'aria-label': 'room select',
      }}
    >
      {props.rooms.map((room) => (
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
