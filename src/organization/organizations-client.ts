import {client} from 'lib/api-client'
import {api} from 'lib/url'

export interface Organization {
  id: number
  name: string
  slug: string
  joined: boolean
  updated_at: string
  created_at: string
}

export function getUserOrganizations() {
  const url = api('/organizations')
  return client.get<Organization[]>(url)
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
  return client.post<Organization>(url, data)
}
