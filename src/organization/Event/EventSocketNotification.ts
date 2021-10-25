import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'

const broadcastPusherUrl = api('/broadcasting/pusher')

/**
 * Notification to the backend that a socket connection to Pusher created a
 * channel. This is used to record some Telemetry.
 * @param client
 * @param slug
 * @param socketId
 */
export const socketConnected = (
  client: typeof teamMemberClient,
  slug: string,
  socketId: string,
) => {
  client.post<{url: string}>(
    `${broadcastPusherUrl}?slug=${slug}&socketId=${socketId}`,
  )
}

/**
 * Notification to the backend that a socket connection to Pusher left a channel.
 * This is used to record some Telemetry.
 * @param client
 * @param slug
 * @param socketId
 */
export const socketDisconnected = (
  client: typeof teamMemberClient,
  slug: string,
  socketId: string,
) => {
  client.delete<{url: string}>(
    `${broadcastPusherUrl}?slug=${slug}&socketId=${socketId}`,
  )
}
