import {useEvent, useRefreshEvent} from 'Event/EventProvider'
import {isAfter} from 'lib/date-time'
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
    event: {slug, updated_at: lastUpdated},
  } = useEvent()
  const echo = useOrganizationEcho()
  const refreshEvent = useRefreshEvent()

  useEffect(() => {
    const channel = `event.${slug}`
    echo
      .private(channel)
      .listen('.event.updated', (data: {updated_at: string}) => {
        const hasChanges = isAfter({
          target: data.updated_at,
          isAfter: lastUpdated,
        })

        if (!hasChanges) {
          return
        }

        refreshEvent()
      })

    return () => {
      echo.leave(channel)
    }
  }, [slug, echo, refreshEvent, lastUpdated])

  return props.children
}
