import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Area} from 'organization/Event/AreaList'
import {useOrganization} from 'organization/OrganizationProvider'
import {useCallback, useEffect, useState} from 'react'

export function useAttendees(area?: Area) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const {data: fetchedAttendees, loading} = useFetchAttendees(area)

  useEffect(() => {
    if (!fetchedAttendees) {
      return
    }

    setAttendees(fetchedAttendees)
  }, [fetchedAttendees])

  const update = (target: Attendee) => {
    const updated = attendees.map((a) => {
      const isTarget = a.id === target.id
      if (isTarget) {
        return target
      }

      return a
    })

    setAttendees(updated)
  }

  const isExisting = (target: Attendee) =>
    !!attendees.find((existing) => target.id === existing.id)

  const insert = (items: Attendee[] | Attendee) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    const updates = itemsArray.filter(isExisting)
    const newAttendees = itemsArray.filter((a) => !isExisting(a))

    const updatedExisting = attendees.map((existing) => {
      const updated = updates.find((a) => a.id === existing.id)
      if (!updated) {
        return existing
      }

      return updated
    })

    const updatedList = [...updatedExisting, ...newAttendees]
    setAttendees(updatedList)
  }

  const remove = (attendee: Attendee) => {
    const updated = attendees.filter((a) => a.id !== attendee.id)
    setAttendees(updated)
  }

  return {
    attendees,
    update,
    insert,
    remove,
    loading,
  }
}

function useFetchAttendees(area?: Area) {
  const {client} = useOrganization()
  const url = useFetchUrl(area)

  const request = useCallback(() => client.get<Attendee[]>(url), [client, url])
  return useAsync(request)
}

function useFetchUrl(area?: Area) {
  const {event} = useEvent()
  if (!area) {
    // All attendees
    return api(`/events/${event.slug}/attendees`)
  }

  // Attendees for given event
  return api(`/events/${event.slug}/areas/${area.id}/attendees`)
}

export function useCheckIn() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee) => {
    const url = api(
      `/events/${event.slug}/attendees/${attendee.id}/complete_tech_check`,
    )

    return client.patch<Attendee>(url, {})
  }
}
