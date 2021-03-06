import {ObvioEvent} from 'Event'
import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {PaginatedCollection} from 'lib/ui/api-client'
import {useAsync} from 'lib/async'
import useDebounce from 'lib/debounce'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {useCallback, useEffect, useState} from 'react'

const SEARCH_DEBOUNCE_MS = 1000

export interface AttendeesContextProps {
  attendees: Attendee[]
  update: (attendee: Attendee) => void
  insert: (attendee: Attendee[] | Attendee) => void
  remove: (attendee: Attendee) => void
  loading: boolean
  groups: string[]
  page: number
  perPage: number
  total: number
  search: (term: string) => void
  setPage: (index: number) => void
  setPerPage: (count: number) => void
  toggleTechCheckComplete: (attendee: Attendee) => () => void
  error: string | null
  clearError: () => void
  exportAttendees: () => Promise<AttendeeExportResult>
  importAttendees: (file: File) => Promise<AttendeeImportResult>
}

export interface AttendeeImportResult {
  message: string
}

export interface AttendeeExportResult {
  message: string
}

export const AttendeesContext = React.createContext<
  AttendeesContextProps | undefined
>(undefined)

export default function AttendeesProvider(props: {
  children: React.ReactElement
}) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS)
  const {data: results, loading} = useFetchAttendees(
    debouncedSearch,
    page,
    perPage,
  )
  const [groups, setGroups] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const MarkTechCheckComplete = useMarkTechCheckComplete()
  const markTechCheckIncomplete = useMarkTechCheckIncomplete()
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

  const importAttendees = useImport({onError: setError})

  const clearError = () => setError(null)

  useEffect(() => {
    if (!results) {
      return
    }

    setAttendees(results.data)
    setPage(results.current_page)
    setPerPage(results.per_page)
    setTotal(results.total)
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

  const toggleTechCheckComplete = (attendee: Attendee) => () => {
    const process = attendee.has_completed_tech_check
      ? markTechCheckIncomplete
      : MarkTechCheckComplete

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
        page,
        perPage,
        total,
        search: setSearch,
        setPage,
        setPerPage,
        groups,
        toggleTechCheckComplete,
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

function useFetchAttendees(search: string, page: number, perPage: number) {
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = fetchUrl(event, search, page, perPage)

  const request = useCallback(
    () => client.get<PaginatedCollection<Attendee>>(url),
    [client, url],
  )
  return useAsync(request)
}

function fetchUrl(
  event: ObvioEvent,
  search: string,
  page: number,
  perPage: number,
) {
  const baseUrl = api(
    `/events/${event.slug}/attendees?page=${page}&per_page=${perPage}`,
  )
  if (!search) {
    return baseUrl
  }

  return `${baseUrl}&search=${search}`
}

export function useMarkTechCheckComplete() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}/tech_check`)
    return client.patch<Attendee>(url, {})
  }
}

export function useMarkTechCheckIncomplete() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}/tech_check`)

    return client.delete<Attendee>(url)
  }
}

export function useExport(options: {
  onSuccess?: (result: AttendeeExportResult) => void
  onError: (error: string | null) => void
}) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/attendees/export `)

  return () =>
    client
      .get<AttendeeExportResult>(url)
      .then((res) => {
        if (options.onSuccess) {
          options.onSuccess(res)
        }
        return res
      })
      .catch((e) => {
        options.onError(e.message)
        throw e
      })
}

export function useImport(options: {
  onError: (error: string | null) => void
  onSuccess?: (result: AttendeeImportResult) => void
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
      .then((res: AttendeeImportResult) => {
        if (options.onSuccess) {
          options.onSuccess(res)
        }

        return res
      })
      .catch((e) => {
        options.onError(e.message)
        throw e
      })
  }
}
