import {Rule} from 'Event/attendee-rules'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'
import {useCallback} from 'react'

export interface NameAppendage {
  created_at: string
  text: string
  emoji: string
  rules: Rule[]
  priority: number
  id: number
}

export interface NameAppendageContextProps {
  add: (nameAppendage: NameAppendage) => void
  update: (nameAppendage: NameAppendage) => void
  remove: (nameAppendage: NameAppendage) => void
  reorder: (nameAppendages: NameAppendage[]) => void
  nameAppendages: NameAppendage[]
  loading: boolean
}

export const NameAppendageContext = React.createContext<
  NameAppendageContextProps | undefined
>(undefined)

export default function NameAppendageProvider(props: {
  children: React.ReactElement
}) {
  const fetch = useFetchNameAppendage()
  const list = useNameAppendagesList(fetch)
  const nameAppendages = list.nameAppendages
  const loading = list.loading
  const add = list.add
  const remove = list.remove
  const update = list.update
  const reorder = list.reorder

  if (loading || !nameAppendages) {
    return <FullPageLoader />
  }

  return (
    <NameAppendageContext.Provider
      value={{
        nameAppendages,
        loading,
        add,
        remove,
        update,
        reorder,
      }}
    >
      {props.children}
    </NameAppendageContext.Provider>
  )
}

export function useFetchNameAppendage() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {slug} = event

  return useCallback(() => {
    const url = api(`/events/${slug}/attendee_labels`)
    return client.get<NameAppendage[]>(url)
  }, [client, slug])
}

export function useNameAppendages() {
  const context = React.useContext(NameAppendageContext)
  if (context === undefined) {
    throw new Error(
      'useNameAppendages must be used within an NameAppendageProvider',
    )
  }

  return context
}

export function useNameAppendagesList(request: () => Promise<NameAppendage[]>) {
  const {data: saved, loading, error} = useAsync(request)
  const [nameAppendages, setNameAppendages] = useState<NameAppendage[]>([])

  useEffect(() => {
    if (!saved) {
      return
    }

    setNameAppendages(saved)
  }, [saved])

  const update = (nameAppendage: NameAppendage) => {
    const updated = nameAppendages.map((a) => {
      const isTarget = a.id === nameAppendage.id
      if (isTarget) {
        return nameAppendage
      }

      return a
    })

    setNameAppendages(updated)
  }

  const add = (nameAppendage: NameAppendage) => {
    const appended = [...nameAppendages, nameAppendage]
    setNameAppendages(appended)
  }

  const remove = (nameAppendage: NameAppendage) => {
    const removed = nameAppendages.filter((a) => a.id !== nameAppendage.id)
    setNameAppendages(removed)
  }

  const reorder = (nameAppendages: NameAppendage[]) => {
    setNameAppendages(nameAppendages)
  }

  return {nameAppendages, update, loading, error, add, remove, reorder}
}
