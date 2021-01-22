import {Room} from 'Event/room'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/AreaConfig/AreaProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {Attendee} from 'Event/attendee'
import {useCallback, useEffect, useState} from 'react'
import {useAsync} from 'lib/async'

export interface RoomAssignment {
  room: Room
  attendee: Attendee
}

export interface RoomAssignmentProps {
  loading: boolean
  unassign: (attendee: Attendee) => Promise<void>
  assign: (attendee: Attendee, room: Room) => Promise<void>
  getRoom: (attendee: Attendee) => Room | null
}

export function useRoomAssignments(): RoomAssignmentProps {
  const list = useAssignmentsList()
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()

  const unassign = (attendee: Attendee) => {
    const url = api(
      `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}`,
    )
    return client.delete(url).then(() => list.remove(attendee))
  }

  const assign = async (attendee: Attendee, room: Room) => {
    const existing = list.findAssignment(attendee)
    if (existing) {
      await unassign(attendee)
    }

    const url = api(
      `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}/rooms/${room.id}`,
    )
    return client.post(url).then(() => list.assign(attendee, room))
  }

  return {
    loading: list.loading,
    unassign,
    assign,
    getRoom: list.getRoom,
  }
}

function useAssignmentsList() {
  const [assignments, setAssignments] = useState<RoomAssignment[]>([])
  const {data: saved, loading} = useSavedAssignments()

  useEffect(() => {
    if (!saved) {
      return
    }

    setAssignments(saved)
  }, [saved])

  const findAssignment = assignmentForAttendee(assignments)

  const remove = (attendee: Attendee) => {
    const target = findAssignment(attendee)
    if (!target) {
      throw new Error(`Missing assignment for attendee: ${attendee.id}`)
    }

    const remaining = assignments.filter((a) => !isEqual(target, a))
    setAssignments(remaining)
  }

  const add = (attendee: Attendee, room: Room) => {
    const existing = findAssignment(attendee)
    if (existing) {
      remove(attendee)
    }

    const assignment: RoomAssignment = {
      attendee,
      room,
    }

    const appended = [...assignments, assignment]
    setAssignments(appended)
  }

  const getRoom = (attendee: Attendee) => {
    const target = assignments.find(
      (assignment) => assignment.attendee.id === attendee.id,
    )

    if (!target) {
      return null
    }

    return target.room
  }

  return {loading, remove, assign: add, getRoom, findAssignment}
}

function useSavedAssignments() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()
  const url = api(`/events/${event.slug}/areas/${area.id}/room_assignments`)

  const request = useCallback(() => client.get<RoomAssignment[]>(url), [
    client,
    url,
  ])
  return useAsync(request)
}

function isEqual(a: RoomAssignment, b: RoomAssignment) {
  const sameAttendee = a.attendee.id === b.attendee.id
  const sameRoom = a.room.id === b.room.id
  return sameAttendee && sameRoom
}

function assignmentForAttendee(assignments: RoomAssignment[]) {
  return (attendee: Attendee) =>
    assignments.find((assignment) => assignment.attendee.id === attendee.id)
}
