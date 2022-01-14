import {useEvent, useRefreshEvent} from 'Event/EventProvider'
import {Channel} from 'laravel-echo/dist/channel'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useOrganization} from 'organization/OrganizationProvider'
import {useOrganizationEcho} from 'organization/OrganizationProvider'
import PrivateChannel from 'pusher-js/types/src/core/channels/private_channel'
import React, {useEffect, useState, useCallback} from 'react'
import {
  socketConnected,
  socketDisconnected,
} from 'organization/Event/EventSocketNotification'

type EventSocketContextProps = {
  channel: Channel
}

const EventSocketContext = React.createContext<
  EventSocketContextProps | undefined
>(undefined)

/**
 * Event names start with a '.' to prevent Laravel's
 * auto name-spacing event.
 *
 * Reference: https://laravel.com/docs/8.x/broadcasting#namespaces
 */
const UPDATED_EVENT = '.event.updated'

/**
 * Subscribes to live updates to the event model. This means
 * multiple people can edit the dashboard at the same
 * time without overwriting each other's changes.
 */
export default function EventSocketProvider(props: {
  children: React.ReactElement
}) {
  const [socketId, setSocketId] = useState<string | null>(null)
  const [channel, setChannel] = useState<Channel | null>(null)

  const {
    event: {slug},
  } = useEvent()
  const echo = useOrganizationEcho()
  const refreshEvent = useRefreshEvent()

  const {client} = useOrganization()

  const disconnect = useCallback(() => setSocketId(null), [])

  useEffect(() => {
    const channel = `event.${slug}`
    const privateChannel = echo
      .private(channel)
      .error((error: {type: string}) => {
        /**
         * Handle authentication failure which would mean we would never receive auth updates
         */
        if (error.type === 'AuthError') {
          // disconnect()
        }
      })

    /**
     * Bind socket connected/disconnected events
     */

    const connection = ((privateChannel as unknown) as PrivateChannel).pusher
      .connection

    connection.bind('connected', () => {
      setSocketId(connection.socket_id)
      socketConnected(client, slug, connection.socket_id)
    })

    connection.bind('disconnected', disconnect)

    setChannel(privateChannel)

    return () => {
      echo.leave(channel)
      socketDisconnected(client, slug, connection.socket_id)
    }
  }, [client, slug, echo, disconnect])

  useEffect(() => {
    if (!channel || !socketId) {
      return
    }

    channel.listen(
      UPDATED_EVENT,
      (data: {
        updated_at: string // Event updated at timestamp
        id: string // Update identifier for tracking
      }) => {
        refreshEvent({
          updatedAt: data.updated_at,
          id: data.id,
          socketId,
        })
      },
    )

    return () => {
      channel.stopListening(UPDATED_EVENT)
    }
  }, [channel, socketId, refreshEvent])

  // Loading...
  if (!socketId || !channel) {
    return <FullPageLoader />
  }

  return (
    <EventSocketContext.Provider value={{channel}}>
      {props.children}
    </EventSocketContext.Provider>
  )
}

export function useEventSocket() {
  const context = React.useContext(EventSocketContext)
  if (context === undefined) {
    throw new Error('useEventSocket must be used within a EventSocketProvider')
  }

  return context
}
