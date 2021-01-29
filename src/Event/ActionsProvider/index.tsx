import {useEvent} from 'Event/EventProvider'
import {Client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'

export interface Action {
  id: number
  description: string
  points: number
  max_per_day: number | null
  max_per_event: number | null
  is_active: boolean
  is_platform_action: boolean
}

export interface ActionsContextProps {
  custom: ReturnType<typeof useActionsList>
  platform: ReturnType<typeof useActionsList>
}

export const ActionsContext = React.createContext<
  ActionsContextProps | undefined
>(undefined)

export function OrganizationActionsProvider(props: {
  children: React.ReactNode
  loader?: React.ReactElement
}) {
  const {client} = useOrganization()
  return <ActionsProvider client={client} {...props} />
}

export function EventActionsProvider(props: {children: React.ReactNode}) {
  const {client} = useEvent()
  return <ActionsProvider client={client} {...props} />
}

function ActionsProvider(props: {
  client: Client
  children: React.ReactNode
  loader?: React.ReactElement
}) {
  const platform = usePlatformList(props.client)
  const custom = useCustomList(props.client)

  const loading = platform.loading || custom.loading
  if (loading) {
    return props.loader || <div>loading...</div>
  }

  return (
    <ActionsContext.Provider
      value={{
        // Have to rebuild object to keep TS happy with
        // us saying actions is not NULL.
        platform: {...platform, actions: platform.actions},
        custom: {...custom, actions: custom.actions},
      }}
    >
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

function usePlatformList(client: Client) {
  const fetchPlatform = useFetchPlatform(client)
  const list = useActionsList(fetchPlatform)

  /**
   * Always wait for platform list to have actions
   * rendered, so they can be used immediately.
   */
  const empty = list.actions.length === 0
  const loading = list.loading || empty

  return {...list, loading}
}

function useFetchPlatform(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/actions/platform`)

  return useCallback(() => client.get<Action[]>(url), [client, url])
}

function useCustomList(client: Client) {
  const fetchCustom = useFetchCustom(client)
  return useActionsList(fetchCustom)
}

function useFetchCustom(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/actions`)

  return useCallback(() => client.get<Action[]>(url), [client, url])
}

export function useActionsList(request: () => Promise<Action[]>) {
  const {data: saved, loading, error} = useAsync(request)
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    if (!saved) {
      return
    }

    setActions(saved)
  }, [saved])

  const update = (target: Action) => {
    const updated = actions.map((a) => {
      const isTarget = a.id === target.id
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
    const removed = actions.filter((a) => a.id !== target.id)
    setActions(removed)
  }

  return {actions, update, loading, error, add, remove}
}
