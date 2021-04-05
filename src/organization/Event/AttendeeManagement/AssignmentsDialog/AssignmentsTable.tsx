import {Attendee} from 'Event/attendee'
import React, {useState} from 'react'
import {useAreas} from 'organization/Event/AreasProvider'
import RoomSelect, {
  RoomAssignment,
} from 'organization/Event/AttendeeManagement/AssignmentsDialog/RoomSelect'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

export default function AssignmentsTable(props: {
  attendee: Attendee
  assignments: RoomAssignment[]
}) {
  const {areas} = useAreas()

  const {assignments, addAssignment, removeAssignment} = useCurrentAssignments(
    props.assignments,
  )

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Area</TableCell>
          <TableCell>Room</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {areas.map((area) => (
          <TableRow key={area.id}>
            <TableCell>{area.name}</TableCell>
            <TableCell>
              <RoomSelect
                area={area}
                attendee={props.attendee}
                assignments={assignments}
                addAssignment={addAssignment}
                removeAssignment={removeAssignment}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function useCurrentAssignments(savedAssignments: RoomAssignment[]) {
  const [assignments, setAssignments] = useState<RoomAssignment[]>(
    savedAssignments,
  )

  const addAssignment = (assignment: RoomAssignment) => {
    setAssignments((current) => [...current, assignment])
  }

  const findAssignment = (attendee: Attendee, assignments: RoomAssignment[]) =>
    assignments.find((assignment) => assignment.attendee_id === attendee.id)

  const removeAssignment = (attendee: Attendee) => {
    const target = findAssignment(attendee, assignments)
    if (!target) {
      throw new Error(`Missing assignment for attendee: ${attendee.id}`)
    }

    setAssignments((current) => {
      return current.filter((a) => !isEqual(target, a))
    })
  }

  return {
    assignments,
    addAssignment,
    removeAssignment,
  }
}

function isEqual(a: RoomAssignment, b: RoomAssignment) {
  const sameAttendee = a.attendee_id === b.attendee_id
  const sameRoom = a.room_id === b.room_id
  return sameAttendee && sameRoom
}
