import {useEvent, useRefreshEvent} from 'Event/EventProvider'
import {useOrganizationEcho} from 'organization/OrganizationProvider'
import React, {useEffect} from 'react'

/**
 * Subscribes to live updates to the event model. This means
 * multiple people can edit the dashboard at the same
 * time without overwriting each other's changes.
 */
export default function EventLiveUpdates(props: {
  children: React.ReactElement
}) {
  const {event} = useEvent()
  const echo = useOrganizationEcho()
  const refresh = useRefreshEvent()

  useEffect(() => {
    const eventChannel = echo.private(`event.${event.slug}`)
    eventChannel.listen('.event.updated', refresh)

    return () => {
      echo.leave(`event.${event.id}`)
    }
  }, [event, echo, refresh])

  return props.children
}
