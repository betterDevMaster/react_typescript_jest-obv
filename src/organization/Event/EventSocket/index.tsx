import {useEvent, useRefreshEvent} from 'Event/EventProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import ConnectionOverlay from 'organization/Event/EventSocket/ConnectionOverlay'
import {useOrganizationEcho} from 'organization/OrganizationProvider'
import {ConnectionManager} from 'pusher-js'
import PrivateChannel from 'pusher-js/types/src/core/channels/private_channel'
import React, {useEffect, useState} from 'react'

/**
 * Subscribes to live updates to the event model. This means
 * multiple people can edit the dashboard at the same
 * time without overwriting each other's changes.
 */
export default function EventSocket(props: {children: React.ReactElement}) {
  const [isConnected, setIsConnected] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [connection, setConnection] = useState<ConnectionManager | null>(null)

  const connect = () => {
    if (!connection) {
      throw new Error('Connection has not been initialized')
    }

    if (isBusy) {
      return
    }

    setIsBusy(true)
    connection.connect()
  }

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

    /**
     * Bind socket connected/disconnected events
     */

    const connection = ((privateChannel as unknown) as PrivateChannel).pusher
      .connection

    connection.bind('connected', () => {
      setConnection(connection)

      setIsConnected(true)
      setIsBusy(false)
    })

    connection.bind('disconnected', () => {
      setIsConnected(false)
      setIsBusy(false)
    })

    return () => {
      echo.leave(channel)
    }
  }, [slug, echo, refreshEvent])

  if (!connection) {
    return <FullPageLoader />
  }

  return (
    <ConnectionOverlay
      isConnected={isConnected}
      isBusy={isBusy}
      connect={connect}
    >
      {props.children}
    </ConnectionOverlay>
  )
}
