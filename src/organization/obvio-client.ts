import {client, RequestOptions} from 'lib/api-client'
import {api} from 'lib/url'
import {OBVIO_TOKEN_KEY} from 'obvio/auth'
import {Organization} from 'organization'

export const obvioClient: typeof client = {
  get: (url: string, options?: RequestOptions) =>
    client.get(url, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  post: (url: string, data: {}, options?: RequestOptions) =>
    client.post(url, data, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  put: (url: string, data: {}, options?: RequestOptions) =>
    client.put(url, data, {...options, tokenKey: OBVIO_TOKEN_KEY}),
  delete: (url: string, options?: RequestOptions) =>
    client.delete(url, {...options, tokenKey: OBVIO_TOKEN_KEY}),
}

export function getUserOrganizations() {
  const url = api('/organizations')
  return obvioClient.get<Organization[]>(url)
}

export function findOrganization(slug: string) {
  const url = api(`/organizations/${slug}`)
  return client.get<Organization>(url)
}

export interface CreateOrganizationData {
  name: string
  slug: string
}

export function createOrganization(data: CreateOrganizationData) {
  const url = api('/organizations')
  return obvioClient.post<Organization>(url, data)
}
