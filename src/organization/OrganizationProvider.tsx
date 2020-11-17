import {client, RequestOptions} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {createRoutes} from 'lib/url'
import {Organization} from 'organization'
import {organizationTokenKey} from 'organization/auth'
import {findOrganization} from 'organization/obvio-client'
import React, {useCallback} from 'react'
import {useLocation} from 'react-router-dom'

export type OrganizationClient = ReturnType<typeof createClientFor>
export type OrganizationRoutes = ReturnType<typeof createRoutesFor>
interface OrganizationContextProps {
  organization: Organization
  routes: OrganizationRoutes
  client: OrganizationClient
}

const OrganizationContext = React.createContext<
  OrganizationContextProps | undefined
>(undefined)

export default function OrganizationProvider(props: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const slug = location.pathname.split('/')[2]

  const find = useCallback(() => {
    return findOrganization(slug)
  }, [slug])
  const {data: organization, loading} = useAsync(find)

  if (loading) {
    return null
  }

  if (!organization) {
    return (
      <div>
        <h1>404 - Organization '{slug}' not found.</h1>
      </div>
    )
  }

  const routes = createRoutesFor(organization)
  const client = createClientFor(organization)

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        routes,
        client,
      }}
    >
      {props.children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = React.useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within a OrganizationProvider',
    )
  }

  return context
}

export function createRoutesFor(organization: Organization) {
  return createRoutes(
    {
      login: '/login',
      events: {
        create: '/create',
        ':event': {
          dashboard: '/dashboard',
        },
      },
    },
    `organization/${organization.slug}`,
  )
}

function createClientFor(organization: Organization): typeof client {
  const tokenKey = organizationTokenKey(organization.slug)
  return {
    get: (url: string, options?: RequestOptions) =>
      client.get(url, {...options, tokenKey}),
    post: (url: string, data: {}, options?: RequestOptions) =>
      client.post(url, data, {...options, tokenKey}),
    put: (url: string, data: {}, options?: RequestOptions) =>
      client.put(url, data, {...options, tokenKey}),
    delete: (url: string, options?: RequestOptions) =>
      client.delete(url, {...options, tokenKey}),
  }
}
