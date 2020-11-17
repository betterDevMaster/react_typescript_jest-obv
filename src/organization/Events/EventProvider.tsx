import {client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {ObvioEvent} from 'event'
import React, {useCallback, useEffect} from 'react'
import {useParamEventSlug} from 'organization/Events'
import {useDispatch} from 'react-redux'
import {setEvent} from 'event/state/actions'

export const EventContext = React.createContext<ObvioEvent | undefined>(
  undefined,
)

export default function EventProvider(props: {children: React.ReactNode}) {
  const slug = useParamEventSlug()
  const find = useCallback(() => {
    return findEvent(slug)
  }, [slug])
  const dispatch = useDispatch()

  const {data: event, loading} = useAsync(find)

  useEffect(() => {
    dispatch(setEvent(event))
  }, [event, dispatch])

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
