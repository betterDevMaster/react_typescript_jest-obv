/**
 * Required - explicitly import pusher BEFORE echo, otherwise
 * we run into Pusher is not defined error as Laravel
 * expects it to be a globally defined variable.
 */
import Echo from 'laravel-echo'
import {useCallback, useEffect, useState} from 'react'
import PrivateChannel from 'pusher-js/types/src/core/channels/private_channel'
import {Channel} from 'laravel-echo/dist/channel'

export function usePrivateChannel(params: {
  echo: Echo
  name: string
  onConnect?: () => void
  onDisconnect?: () => void
}) {
  const [socketId, setSocketId] = useState<string | null>(null)
  const [channel, setChannel] = useState<Channel | null>(null)
  const disconnect = useCallback(() => setSocketId(null), [])

  const {echo, name, onConnect, onDisconnect} = params

  useEffect(() => {
    const privateChannel = echo.private(name).error((error: {type: string}) => {
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
      onConnect && onConnect()
    })

    connection.bind('disconnected', disconnect)

    setChannel(privateChannel)

    return () => {
      echo.leave(name)
      onDisconnect && onDisconnect()
    }
  }, [echo, disconnect, name, onConnect, onDisconnect])

  const connected = Boolean(socketId) && Boolean(channel)
  return {socketId, channel, connected}
}
