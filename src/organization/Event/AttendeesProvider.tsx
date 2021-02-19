import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {useCallback, useEffect, useState} from 'react'

export interface AttendeesContextProps {
  attendees: Attendee[]
  update: (attendee: Attendee) => void
  insert: (attendee: Attendee[] | Attendee) => void
  remove: (attendee: Attendee) => void
  loading: boolean
  groups: string[]
}

export const AttendeesContext = React.createContext<
  AttendeesContextProps | undefined
>(undefined)

export default function AttendeesProvider(props: {
  children: React.ReactElement
}) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const {data: fetchedAttendees, loading} = useFetchAttendees()
  const [groups, setGroups] = useState<string[]>([])

  useEffect(() => {
    if (!fetchedAttendees) {
      return
    }

    setAttendees(fetchedAttendees)
  }, [fetchedAttendees])

  const addGroups = useCallback(
    (attendee: Attendee) => {
      for (const key of Object.keys(attendee.groups)) {
        /**
         * Checking groups as we modify it, so we'll always need the
         * current version. ie. use callback version of setState
         */
        setGroups((groups) => {
          const isNewKey = !groups.includes(key)
          if (!isNewKey) {
            return groups
          }

          return [...groups, key]
        })
      }
    },
    [setGroups],
  )

  useEffect(() => {
    setGroups([])

    for (const attendee of attendees) {
      addGroups(attendee)
    }
  }, [attendees, addGroups])

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

  return (
    <AttendeesContext.Provider
      value={{
        attendees,
        update,
        insert,
        remove,
        loading,
        groups,
      }}
    >
      {props.children}
    </AttendeesContext.Provider>
  )
}

export function useAttendees() {
  const context = React.useContext(AttendeesContext)
  if (context === undefined) {
    throw new Error('useAttendees must be used within an AttendeeListProvider')
  }

  return context
}

function useFetchAttendees() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/attendees`)

  const request = useCallback(() => client.get<Attendee[]>(url), [client, url])
  return useAsync(request)
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
