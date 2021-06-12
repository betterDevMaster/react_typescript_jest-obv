import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import React, {useEffect, useState, useCallback} from 'react'
import {FileLocation} from 'lib/http-client'
import {Form} from 'organization/Event/FormsProvider'

export interface Report {
  id: number
  is_active?: boolean
  header_background: FileLocation | null
  body_background: FileLocation | null
  forms: Form[]
  settings: null | ReportSettings
}

export interface ReportSettings {
  header?: {
    title?: string
    color?: string
  }
  body?: {
    backgroundColor?: string
    backgroundOpacity?: number
  }
  footer?: {
    text?: string
    textColor?: string
    backgroundColor?: string
  }
}

interface ReportsProviderContextProps {
  add: (report: Report) => void
  set: (report: Report) => void
  editing: Report | null
  loading: boolean
}

const ReportsProviderContext =
  React.createContext<undefined | ReportsProviderContextProps>(undefined)

export default function ReportsProvider(props: {children: React.ReactElement}) {
  const {data: saved, loading} = useFetchReports()
  const [reports, setReports] = useState<Report[]>([])
  const createReport = useCreateReport()
  const [creating, setCreating] = useState(false)

  /**
   * TEMPORARY workaround - before multiple reports is implemented, we'll just
   * edit the first one returned.
   */
  const editing = reports.length === 0 ? null : reports[0]

  const add = useCallback(
    (target: Report) => {
      const added = [...reports, target]
      setReports(added)
    },
    [reports],
  )

  /**
   * Load saved reports
   */
  useEffect(() => {
    if (!saved) {
      return
    }

    setReports(saved)
  }, [saved])

  /**
   * Create first report if one doesn't exist
   */
  useEffect(() => {
    if (loading || !saved || Boolean(editing) || creating) {
      return
    }

    setCreating(true)

    const needFirstReport = saved.length === 0
    if (!needFirstReport) {
      return
    }

    createReport().then(add)
  }, [loading, saved, add, createReport, editing, creating])

  const set = useCallback(
    (target: Report) => {
      const updated = reports.map((r) => {
        const isTarget = r.id === target.id

        if (!isTarget) {
          return r
        }

        return target
      })

      setReports(updated)
    },
    [reports],
  )

  return (
    <ReportsProviderContext.Provider
      value={{
        add,
        set,
        editing,

        /**
         * Since we're auto-creating the first report for now, we'll just assume
         * we're still loading if one doesn't exist yet. With multiple reports
         * this would just be the loading state for the fetch.
         */
        loading: !editing,
      }}
    >
      {props.children}
    </ReportsProviderContext.Provider>
  )
}

export function useReports() {
  const context = React.useContext(ReportsProviderContext)

  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider')
  }

  return context
}

function useFetchReports() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/reports`)
  const request = useCallback(() => client.get<Report[]>(url), [url, client])

  return useAsync(request)
}

function useCreateReport() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/reports`)

  return useCallback(() => client.post<Report>(url, []), [url, client])
}
