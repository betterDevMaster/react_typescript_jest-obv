import {Client, client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {domainEventSlug, useParamEventSlug} from 'Event/url'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {setEvent} from 'Event/state/actions'
import {ObvioEvent} from 'Event'
import {RootState} from 'store'
import {eventClient} from 'Event/api-client'
import {appRoot, isProduction} from 'App'
import {useInterval} from 'lib/interval'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useOrganization} from 'organization/OrganizationProvider'

interface EventContextProps {
  event: ObvioEvent
  client: Client
  hasTechCheck: boolean
  hasWaiver: boolean
  set: (event: ObvioEvent) => void
  url: string
}

export const EventContext = React.createContext<EventContextProps | undefined>(
  undefined,
)

export function DomainEventProvider(props: {children: React.ReactNode}) {
  const slug = domainEventSlug()
  return <EventProvider slug={slug} {...props} />
}

export function RouteEventProvider(props: {children: React.ReactNode}) {
  const slug = useParamEventSlug()
  return <EventProvider slug={slug} {...props} noCache />
}

function EventProvider(props: {
  children: React.ReactNode
  slug: string
  noCache?: boolean
}) {
  const {slug, noCache} = props
  const find = useCallback(() => {
    return findEvent(slug, {noCache})
  }, [slug, noCache])
  const dispatch = useDispatch()

  const {data: saved, loading} = useAsync(find)
  const current = useSelector((state: RootState) => state.event)

  useEffect(() => {
    if (!saved) {
      return
    }
    dispatch(setEvent(saved))
  }, [saved, dispatch])

  const update = useCallback(
    (updated: ObvioEvent) => {
      dispatch(setEvent(updated))
    },
    [dispatch],
  )

  if (loading) {
    return <div>loading...</div>
  }

  if (!saved) {
    return (
      <div>
        <h1>404 - Event not found</h1>
      </div>
    )
  }

  if (!current) {
    return <div>loading...</div>
  }

  const scheme = isProduction ? 'https://' : 'http://'
  const url = `${scheme}${current.slug}.${appRoot}`

  return (
    <EventContext.Provider
      value={{
        event: current,
        client: eventClient,
        hasTechCheck: hasTechCheck(current),
        hasWaiver: hasWaiver(current),
        set: update,
        url,
      }}
    >
      {props.children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const context = React.useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within a EventProvider')
  }

  return context
}

function findEvent(slug: string, options: {noCache?: boolean}) {
  const url = api(`/events/${slug}`)
  return client.get<ObvioEvent>(url, {noCache: options.noCache})
}

export function hasTechCheck(event: ObvioEvent) {
  if (!event.tech_check) {
    return false
  }

  return event.tech_check.is_enabled
}

export function hasWaiver(event: ObvioEvent) {
  if (!event.waiver) {
    return false
  }

  return event.waiver.is_enabled
}

// How many seconds to wait before trying to re-fetch the join url
const FETCH_JOIN_URL_INTERVAL_MS = 5000

export function useJoinUrl(areaId: number) {
  const {event, client} = useEvent()
  const [joinUrl, setJoinUrl] = useState<null | string>(null)
  const isEditMode = useEditMode()

  const fetchUrl = useCallback(() => {
    if (isEditMode) {
      return
    }

    const url = api(`/events/${event.slug}/areas/${areaId}/join`)

    client
      .get<{url: string | null}>(url)
      .then(({url}) => setJoinUrl(url))
      .catch((e) => console.error(`Could not fetch join url: ${e.message}`))
  }, [client, event, areaId, isEditMode])

  // Fetch once on load without waiting for interval
  useEffect(() => {
    fetchUrl()
  }, [fetchUrl])

  useInterval(fetchUrl, FETCH_JOIN_URL_INTERVAL_MS, Boolean(joinUrl))

  return joinUrl
}

export function useUpdate() {
  const {client} = useOrganization()
  const {event, set: setEvent} = useEvent()

  const url = api(`/events/${event.slug}`)

  return (data: Partial<ObvioEvent>) =>
    client.put<ObvioEvent>(url, data).then(setEvent)
}
