import {Client, client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api, getDomain, isObvioApp, isObvioDomain} from 'lib/url'
import {domainEventSlug, useParamEventSlug} from 'Event/url'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {refreshEvent, setEvent} from 'Event/state/actions'
import {ObvioEvent} from 'Event'
import {RootState} from 'store'
import {eventClient} from 'Event/api-client'
import {appRoot, isProduction} from 'env'
import {useInterval} from 'lib/interval'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useOrganization} from 'organization/OrganizationProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'

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
  const domain = getDomain(window.location.host)
  const slug = domainEventSlug()

  if (!isObvioApp() && !isObvioDomain(domain)) {
    return <EventProvider domain={domain} slug={slug} {...props} />
  }

  return <EventProvider slug={slug} {...props} />
}

export function RouteEventProvider(props: {children: React.ReactNode}) {
  const slug = useParamEventSlug()
  return <EventProvider slug={slug} {...props} noCache />
}

function EventProvider(props: {
  children: React.ReactNode
  slug: string
  domain?: string
  noCache?: boolean
}) {
  const {slug, domain, noCache} = props

  const getEvent = useCallback(() => {
    if (domain) {
      return findEventByDomain(domain, {noCache})
    }

    return findEvent(slug, {noCache})
  }, [slug, domain, noCache])

  const dispatch = useDispatch()

  const {data: saved, loading} = useAsync(getEvent)
  const current = useSelector((state: RootState) => state.event)

  const set = useCallback(
    (target: ObvioEvent) => {
      dispatch(setEvent(target))
    },
    [dispatch],
  )

  useEffect(() => {
    if (!saved) {
      return
    }
    set(saved)
  }, [saved, set])

  if (loading) {
    return <FullPageLoader />
  }

  if (!saved) {
    return (
      <div>
        <h1>404 - Event not found</h1>
      </div>
    )
  }

  if (!current) {
    return <FullPageLoader />
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
        set,
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

function findEvent(slug: string, options: {noCache?: boolean} = {}) {
  const url = api(`/events/${slug}`)
  return client.get<ObvioEvent>(url, {noCache: options.noCache})
}

function findEventByDomain(domain: string, options: {noCache?: boolean}) {
  const url = api(`/events/domain/${domain}`)
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

export interface RequestJoinUrlError {
  message: string
  offline_title?: string | null
  offline_description?: string | null
}

export function useJoinUrl(areaId: string) {
  const {event, client} = useEvent()
  const [joinUrl, setJoinUrl] = useState<null | string>(null)
  const isEditMode = useEditMode()
  const [error, setError] = useState<RequestJoinUrlError | null>(null)

  const fetchUrl = useCallback(() => {
    if (isEditMode) {
      return
    }

    const url = api(`/events/${event.slug}/areas/${areaId}/join`)

    client
      .get<{url: string | null}>(url)
      .then(({url}) => setJoinUrl(url))
      .catch((e) => {
        setError(e)
        console.error(`Could not fetch join url: ${e.message}`)
      })
  }, [client, event, areaId, isEditMode])

  // Fetch once on load without waiting for interval
  useEffect(() => {
    fetchUrl()
  }, [fetchUrl])

  useInterval(fetchUrl, FETCH_JOIN_URL_INTERVAL_MS, Boolean(joinUrl))

  return {error, joinUrl}
}

export function useUpdate() {
  const {client} = useOrganization()
  const {event, set: setEvent} = useEvent()

  const url = api(`/events/${event.slug}`)

  return (data: Partial<ObvioEvent> | FormData) =>
    client.put<ObvioEvent>(url, data).then((updated) => {
      setEvent(updated)
      return updated
    })
}

/**
 * Auto-refresh event interval will fetch the event every x seconds. This
 * value should be at least greater than the cached value.
 */

export const AUTO_REFRESH_EVENT_INTERVAL_SEC = 100

export function AutoRefreshEvent(props: {children: React.ReactElement}) {
  const {event, set} = useEvent()

  const refresh = useCallback(() => {
    findEvent(event.slug).then(set)
  }, [event, set])

  useInterval(refresh, AUTO_REFRESH_EVENT_INTERVAL_SEC * 1000)

  return props.children
}

export function useRefreshEvent() {
  const dispatch = useDispatch()

  return useCallback(
    (updatedAt: string) => {
      dispatch(refreshEvent(updatedAt))
    },
    [dispatch],
  )
}
