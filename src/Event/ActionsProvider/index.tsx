import {useEvent} from 'Event/EventProvider'
import {Client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'

export interface Action {
  id: number
  key: string
  description: string
  points: number
  max_per_day: number | null
  max_per_event: number | null
  is_active: boolean
  has_random_points: boolean
  random_min_points: number | null
  random_max_points: number | null
}

export type ActionsContextProps = ReturnType<typeof useActionsList>

export const ActionsContext = React.createContext<
  ActionsContextProps | undefined
>(undefined)

export function OrganizationActionsProvider(props: {
  children: React.ReactNode
  loader?: React.ReactElement
}) {
  const {client} = useOrganization()
  return <ActionsProvider client={client} {...props} noCache />
}

export function EventActionsProvider(props: {children: React.ReactNode}) {
  const {client} = useEvent()
  return <ActionsProvider client={client} {...props} />
}

function ActionsProvider(props: {
  client: Client
  children: React.ReactNode
  loader?: React.ReactElement
  noCache?: boolean
}) {
  const fetch = useFetch(props.client, props.noCache)
  const list = useActionsList(fetch)

  const loading = list.loading
  if (loading) {
    return props.loader || <div>loading...</div>
  }

  return (
    <ActionsContext.Provider value={list}>
      {props.children}
    </ActionsContext.Provider>
  )
}

export function useActions() {
  const context = React.useContext(ActionsContext)
  if (context === undefined) {
    throw new Error(`useActions must be used within a ActionsProvider`)
  }

  return context
}

function useFetch(client: Client, noCache?: boolean) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/actions`)

  return useCallback(
    () => client.get<Action[]>(url, {noCache}),
    [client, url, noCache],
  )
}

export function useActionsList(request: () => Promise<Action[]>) {
  const {data: saved, loading: fetching, error} = useAsync(request)
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (fetching) {
      return
    }

    if (!saved) {
      setLoading(false)
      return
    }

    setActions(saved)
    setLoading(false)
  }, [saved, fetching])

  const update = (target: Action) => {
    const updated = actions.map((a) => {
      const isTarget = a.key === target.key
      if (isTarget) {
        return target
      }

      return a
    })

    setActions(updated)
  }

  const add = (action: Action) => {
    const appended = [...actions, action]
    setActions(appended)
  }

  const remove = (target: Action) => {
    const removed = actions.filter((a) => a.key !== target.key)
    setActions(removed)
  }

  return {actions, update, loading, error, add, remove}
}
