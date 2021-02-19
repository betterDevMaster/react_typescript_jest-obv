import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {api} from 'lib/url'
import {Area, useAreas} from 'organization/Event/AreasProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {useCallback, useEffect, useState} from 'react'

export interface RoomAssignment {
  room: Room
  attendee: Attendee
}

export type AreaWithAssignments = Area & {
  assignments: RoomAssignment[]
}

export interface RoomAssignmentsContextProps {
  areas: AreaWithAssignments[]
  loading: boolean
}

export const RoomAssignmentsContext = React.createContext<
  RoomAssignmentsContextProps | undefined
>(undefined)

export default function RoomAssignmentsProvider(props: {
  children: React.ReactElement
}) {
  const {areas} = useAreas()
  const [withAssignments, setWithAssignments] = useState<AreaWithAssignments[]>(
    [],
  )
  const [processing, setProcessing] = useState(false)

  const {client} = useOrganization()
  const {event} = useEvent()
  const url = useCallback(
    (area: Area) =>
      api(`/events/${event.slug}/areas/${area.id}/room_assignments`),
    [event],
  )

  const hasAllAreas =
    areas && areas.length > 0 && withAssignments.length === areas.length

  const set = useCallback(
    (target: AreaWithAssignments) => {
      const updated = withAssignments.map((a) => {
        const isTarget = a.id === target.id
        if (isTarget) {
          return target
        }

        return a
      })

      setWithAssignments(updated)
    },
    [withAssignments],
  )

  useEffect(() => {
    setWithAssignments([])
  }, [areas])

  useEffect(() => {
    if (!areas || processing) {
      return
    }

    setProcessing(true)
    setWithAssignments([])

    for (const area of areas) {
      client.get<RoomAssignment[]>(url(area)).then((assignments) => {
        const withAssignment = {...area, assignments}
        setWithAssignments((current) => [...current, withAssignment])
      })
    }
  }, [areas, client, url, withAssignments, processing, event, set])

  return (
    <RoomAssignmentsContext.Provider
      value={{
        areas: withAssignments,
        loading: !hasAllAreas,
      }}
    >
      {props.children}
    </RoomAssignmentsContext.Provider>
  )
}

export function useRoomAssignments() {
  const context = React.useContext(RoomAssignmentsContext)
  if (context === undefined) {
    throw new Error(
      'useRoomAssignments must be used within an RoomAssignmentsProvider',
    )
  }

  return context
}
