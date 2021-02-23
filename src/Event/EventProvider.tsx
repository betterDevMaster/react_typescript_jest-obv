import {client, RequestOptions} from 'lib/api-client'
import {v4 as uuid} from 'uuid'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {domainEventSlug, useParamEventSlug} from 'Event/url'
import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {setEvent} from 'Event/state/actions'
import {ObvioEvent} from 'Event'
import {RootState} from 'store'
import {EventClient, eventClient} from 'Event/api-client'

interface EventContextProps {
  event: ObvioEvent
  client: EventClient
  hasTechCheck: boolean
  update: (event: ObvioEvent) => void
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

  return (
    <EventContext.Provider
      value={{
        event: current,
        client: eventClient,
        hasTechCheck: hasTechCheck(current),
        update,
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

  /**
   * Cloudfront custom NoCache policy accepts a 'No-Cache' header as key.
   * If we pass in a different value, CLoudFront should fetch it
   * again from.
   */
  const requestOptions: RequestOptions = options.noCache
    ? {
        headers: {
          'No-Cache': uuid(),
        },
      }
    : {}

  return client.get<ObvioEvent>(url, requestOptions)
}

export function hasTechCheck(event: ObvioEvent) {
  if (!event.tech_check) {
    return false
  }

  return event.tech_check.is_enabled
}
