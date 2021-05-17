import {ObvioEvent} from 'Event'
import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {PaginatedCollection} from 'lib/api-client'
import {useAsync} from 'lib/async'
import useDebounce from 'lib/debounce'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {useCallback, useEffect, useState} from 'react'
import download from 'js-file-download'
import {Downloadable} from 'lib/api-client'

const SEARCH_DEBOUNCE_MS = 1000

export interface AttendeesContextProps {
  attendees: Attendee[]
  update: (attendee: Attendee) => void
  insert: (attendee: Attendee[] | Attendee) => void
  remove: (attendee: Attendee) => void
  loading: boolean
  groups: string[]
  search: (term: string) => void
  isCheckedIn: (attendee: Attendee) => boolean
  toggleCheckIn: (attendee: Attendee) => () => void
  error: string | null
  clearError: () => void
  exportAttendees: () => Promise<void>
  importAttendees: (file: File) => Promise<AttendeeImportResult>
}

export interface AttendeeImportResult {
  attendees: Attendee[]
  invalid_emails: string[]
}

export const AttendeesContext =
  React.createContext<AttendeesContextProps | undefined>(undefined)

export default function AttendeesProvider(props: {
  children: React.ReactElement
}) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS)
  const {data: results, loading} = useFetchAttendees(debouncedSearch)
  const [groups, setGroups] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const checkIn = useCheckIn()
  const checkOut = useCheckOut()
  const exportAttendees = useExport({onError: setError})

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

  const importAttendees = useImport({onError: setError, onSuccess: insert})

  const clearError = () => setError(null)

  useEffect(() => {
    if (!results) {
      return
    }

    setAttendees(results.data)
  }, [results])

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
    setAttendees((current) => {
      const updated = current.map((a) => {
        const isTarget = a.id === target.id
        if (isTarget) {
          return target
        }

        return a
      })

      return updated
    })
  }

  const isExisting = (target: Attendee) =>
    !!attendees.find((existing) => target.id === existing.id)

  const remove = (attendee: Attendee) => {
    const updated = attendees.filter((a) => a.id !== attendee.id)
    setAttendees(updated)
  }

  const isCheckedIn = (attendee: Attendee) =>
    Boolean(attendee.tech_check_completed_at)

  const toggleCheckIn = (attendee: Attendee) => () => {
    const process = isCheckedIn(attendee) ? checkOut : checkIn

    clearError()

    process(attendee)
      .then(update)
      .catch((e) => setError(e.message))
  }

  return (
    <AttendeesContext.Provider
      value={{
        attendees,
        update,
        insert,
        remove,
        loading,
        search: setSearch,
        groups,
        isCheckedIn,
        toggleCheckIn,
        error,
        clearError,
        exportAttendees,
        importAttendees,
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

function useFetchAttendees(search: string) {
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = fetchUrl(event, search)

  const request = useCallback(
    () => client.get<PaginatedCollection<Attendee>>(url),
    [client, url],
  )
  return useAsync(request)
}

function fetchUrl(event: ObvioEvent, search: string) {
  const baseUrl = api(`/events/${event.slug}/attendees`)
  if (!search) {
    return baseUrl
  }

  return `${baseUrl}?search=${search}`
}

export function useCheckIn() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}/tech_check`)
    return client.patch<Attendee>(url, {})
  }
}

export function useCheckOut() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}/tech_check`)

    return client.delete<Attendee>(url)
  }
}

export function useExport(options: {onError: (error: string | null) => void}) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees/export `)

  return () =>
    client
      .get<Downloadable>(url)
      .then((res) => {
        download(res.data, res.file_name)
      })
      .catch((e) => options.onError(e.message))
}

export function useImport(options: {
  onError: (error: string | null) => void
  onSuccess: (attendees: Attendee[]) => void
}) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees/import`)

  return (file: File) => {
    const formData = new FormData()

    formData.set('file', file)
    return client
      .post<AttendeeImportResult>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        options.onSuccess(res.attendees)

        const hasInvalidEmails = res.invalid_emails.length > 0
        if (hasInvalidEmails) {
          const emails = res.invalid_emails.join(', ')
          const invalidEmailMessage = `Could not import the following emails: ${emails}.`
          options.onError(invalidEmailMessage)
        }

        return res
      })
      .catch((e) => {
        options.onError(e.message)
        throw e
      })
  }
}
