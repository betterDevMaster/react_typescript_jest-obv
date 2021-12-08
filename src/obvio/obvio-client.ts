import {Client, client, RequestOptions} from 'lib/ui/api-client'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'

export const teamMemberClient: Client = {
  get: (url: string, options?: RequestOptions) =>
    client.get(url, {...options, tokenKey: TEAM_MEMBER_TOKEN_KEY}),
  post: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.post(url, data, {...options, tokenKey: TEAM_MEMBER_TOKEN_KEY}),
  put: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.put(url, data, {...options, tokenKey: TEAM_MEMBER_TOKEN_KEY}),
  patch: (url: string, data: {} = {}, options?: RequestOptions) =>
    client.patch(url, data, {...options, tokenKey: TEAM_MEMBER_TOKEN_KEY}),
  delete: (url: string, options?: RequestOptions) =>
    client.delete(url, {...options, tokenKey: TEAM_MEMBER_TOKEN_KEY}),
}
