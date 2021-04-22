import {Client, client} from './../lib/api-client'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {RequestOptions} from 'lib/api-client'

export const eventClient: Client = {
  get: (url: string, options?: RequestOptions) =>
    client.get(url, {...options, tokenKey: EVENT_TOKEN_KEY}),
  post: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.post(url, data, {...options, tokenKey: EVENT_TOKEN_KEY}),
  put: (url: string, data: {}, options?: RequestOptions) =>
    client.put(url, data, {...options, tokenKey: EVENT_TOKEN_KEY}),
  patch: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.patch(url, data, {...options, tokenKey: EVENT_TOKEN_KEY}),
  delete: (url: string, options?: RequestOptions) =>
    client.delete(url, {...options, tokenKey: EVENT_TOKEN_KEY}),
}
