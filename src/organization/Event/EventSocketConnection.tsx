import {useEvent, useRefreshEvent} from 'Event/EventProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useOrganizationEcho} from 'organization/OrganizationProvider'
import PrivateChannel from 'pusher-js/types/src/core/channels/private_channel'
import React, {useEffect, useState} from 'react'

/**
 * Subscribes to live updates to the event model. This means
 * multiple people can edit the dashboard at the same
 * time without overwriting each other's changes.
 */
export default function EventSocketConnection(props: {
  children: React.ReactElement
}) {
  const [isConnected, setIsConnected] = useState(false)

  const {
    event: {slug},
  } = useEvent()
  const echo = useOrganizationEcho()
  const refreshEvent = useRefreshEvent()

  useEffect(() => {
    const channel = `event.${slug}`
    const privateChannel = echo
      .private(channel)

      /**
       * Event names start with a '.' to prevent Laravel's
       * auto name-spacing event.
       *
       * Reference: https://laravel.com/docs/8.x/broadcasting#namespaces
       */
      .listen('.event.updated', (data: {updated_at: string}) => {
        refreshEvent(data.updated_at)
      })
      .error((error: {type: string}) => {
        /**
         * Handle authentication failure which would mean we would never receive auth updates
         */
        if (error.type === 'AuthError') {
          setIsConnected(false)
        }
      })

    /**
     * Bind socket connected/disconnected events
     */

    const connection = ((privateChannel as unknown) as PrivateChannel).pusher
      .connection

    connection.bind('connected', () => {
      setIsConnected(true)
    })

    connection.bind('disconnected', () => {
      setIsConnected(false)
    })

    return () => {
      echo.leave(channel)
    }
  }, [slug, echo, refreshEvent])

  if (!isConnected) {
    return <FullPageLoader />
  }

  return props.children
}
