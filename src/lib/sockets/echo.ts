/**
 * Required - explicitly import pusher BEFORE echo, otherwise
 * we run into Pusher is not defined error as Laravel
 * expects it to be a globally defined variable.
 */
import 'pusher-js'
import Echo from 'laravel-echo'
import 'env'
import {api} from 'lib/url'

const APP_KEY = process.env.REACT_APP_PUSHER_KEY
const APP_CLUSTER = process.env.REACT_APP_PUSHER_CLUSTER

/**
 * Create a private Laravel Echo instance that is authenticated
 * using the provided token.
 *
 * @param token
 * @returns
 */
export const createPrivate = (token: string) =>
  new Echo({
    broadcaster: 'pusher',
    key: APP_KEY,
    cluster: APP_CLUSTER,
    authEndpoint: api('/broadcasting/auth'),
    forceTLS: true,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
