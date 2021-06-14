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
  const {
    event: {slug},
  } = useEvent()
  const echo = useOrganizationEcho()
  const refreshEvent = useRefreshEvent()

  useEffect(() => {
    const channel = `event.${slug}`
    echo
      .private(channel)
      .listen('.event.updated', (data: {updated_at: string}) => {
        refreshEvent(data.updated_at)
      })

    return () => {
      echo.leave(channel)
    }
  }, [slug, echo, refreshEvent])

  return props.children
}
