import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import React, {useCallback, useState, useEffect} from 'react'
import {FileLocation} from 'lib/http-client'
import {useAsync} from 'lib/async'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'

/**
 * Image Entry statuses. Values come from the backend, and these
 * need to be updated if they're modified.
 */
export const PENDING = 'pending'
export const APPROVED = 'approved'
export const REJECTED = 'rejected'

export type PageLimit = 10 | 25 | 50 | 100
export const DEFAULT_PAGE_LIMIT: PageLimit = 25

export interface ImageEntry {
  id: string
  title?: string
  description?: string
  file: FileLocation
  status: typeof PENDING | typeof APPROVED | typeof REJECTED
}

interface ImageEntryProviderContextProps {
  entries: ImageEntry[]
  approve: (image: ImageEntry) => Promise<void>
  reject: (image: ImageEntry) => Promise<void>
  statusFilter: ImageEntry['status']
  filterByStatus: (status: ImageEntry['status']) => void
  updatePerPage: (limit: PageLimit) => void
  pageLimit: PageLimit
  hasNextPage: boolean
  hasPrevPage: boolean
  goNextPage: () => void
  goPrevPage: () => void
}

const ImageEntriesProviderContext = React.createContext<
  undefined | ImageEntryProviderContextProps
>(undefined)

export default function ImageEntriesProvider(props: {
  children: React.ReactElement
}) {
  const [entries, setEntries] = useState<ImageEntry[]>([])
  const [status, setStatus] = useState<ImageEntry['status']>(PENDING)
  const [startId, setStartId] = useState<string>('')
  const [pageLimit, setPageLimit] = useState<PageLimit>(DEFAULT_PAGE_LIMIT)
  const {loading, data: list} = useFetchEntries({
    status,
    startId,
    limit: pageLimit,
  })
  const requestApprove = useApproveEntry()
  const requestReject = useRejectEntry()
  const [hasNextPage, setHasNextPage] = useState(false)

  const [prevPageIds, setPrevPageIds] = useState<string[]>([])

  const update = (entry: ImageEntry) => {
    setEntries((entries) =>
      entries.map((e) => {
        const isTarget = e.id === entry.id

        if (isTarget) {
          return entry
        }

        return e
      }),
    )
  }

  const approve = (entry: ImageEntry) => requestApprove(entry).then(update)
  const reject = (entry: ImageEntry) => requestReject(entry).then(update)

  const goToFirstPage = () => {
    setStartId('')
    setPrevPageIds([])
  }

  const filterByStatus = (status: ImageEntry['status']) => {
    setStatus(status)
    goToFirstPage()
  }

  const changeLimit = (pageLimit: PageLimit) => {
    setPageLimit(pageLimit)
    goToFirstPage()
  }

  const hasEntries = entries.length > 0

  const goNextPage = () => {
    if (!hasEntries || !hasNextPage) {
      return
    }

    const lastItem = entries[entries.length - 1]
    setStartId(lastItem.id)

    /**
     * Track previous page ids
     */
    const currentFirst = entries[0]
    setPrevPageIds((existingIds) => [...existingIds, currentFirst.id])
  }

  const hasPrevPage = prevPageIds.length > 0

  const goPrevPage = () => {
    if (!hasPrevPage) {
      return
    }

    const otherIds = [...prevPageIds]
    const prevId = otherIds.pop()

    setPrevPageIds(otherIds)
    /**
     * pop should always have an item, but in case it doesn't, we'll
     * just set an empty start (first page).
     */
    setStartId(prevId || '')
  }

  useEffect(() => {
    if (!list) {
      return
    }

    setEntries(list.items)
    setHasNextPage(list.has_next_page)
  }, [list])

  if (loading || !list) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }
  return (
    <ImageEntriesProviderContext.Provider
      value={{
        entries,
        approve,
        reject,
        filterByStatus,
        updatePerPage: changeLimit,
        pageLimit,
        hasNextPage,
        goNextPage,
        hasPrevPage,
        goPrevPage,
        statusFilter: status,
      }}
    >
      {props.children}
    </ImageEntriesProviderContext.Provider>
  )
}

function useApproveEntry() {
  const {client} = useOrganization()

  return (imageEntry: ImageEntry) => {
    const url = api(`/image_entries/${imageEntry.id}/approve`)

    return client.put<ImageEntry>(url)
  }
}

function useRejectEntry() {
  const {client} = useOrganization()

  return (imageEntry: ImageEntry) => {
    const url = api(`/image_entries/${imageEntry.id}/reject`)
    return client.put<ImageEntry>(url)
  }
}

function useFetchEntries({
  status,
  startId = '',
  limit = DEFAULT_PAGE_LIMIT,
}: {
  status: ImageEntry['status']
  startId?: string
  limit?: number
}) {
  const {client} = useOrganization()
  const {
    event: {slug: eventSlug},
  } = useEvent()

  const request = useCallback(() => {
    const url = api(
      `/events/${eventSlug}/image_entries?status=${status}&start_id=${startId}&limit=${limit}`,
    )

    return client.get<{
      has_next_page: boolean
      items: ImageEntry[]
    }>(url)
  }, [status, startId, limit, client, eventSlug])

  return useAsync(request)
}

export function useImageEntries() {
  const context = React.useContext(ImageEntriesProviderContext)

  if (context === undefined) {
    throw new Error(
      'useImageEntries must be used within a ImageEntriesProvider',
    )
  }

  return context
}
