import {client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api, getSubdomain} from 'lib/url'
import {ObvioEvent} from 'event'
import React, {useCallback} from 'react'

const EventContext = React.createContext<ObvioEvent | undefined>(undefined)

export default function EventProvider(props: {children: React.ReactNode}) {
  const slug = eventSlug()
  const find = useCallback(() => {
    return findEvent(slug)
  }, [slug])

  const {data: event, loading} = useAsync(find)

  if (loading) {
    return null
  }

  if (!event) {
    return (
      <div>
        <h1>404 - Event not found</h1>
      </div>
    )
  }

  return (
    <EventContext.Provider value={event}>
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

function findEvent(slug: string) {
  const url = api(`/events/${slug}`)
  return client.get<ObvioEvent>(url)
}

export function eventSlug() {
  return getSubdomain(window.location.host)
}
