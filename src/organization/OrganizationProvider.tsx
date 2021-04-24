import {useAsync} from 'lib/async'
import {api, createRoutes} from 'lib/url'
import {Organization} from 'organization'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback} from 'react'
import {useLocation} from 'react-router-dom'
import {Client} from 'lib/api-client'

export type OrganizationRoutes = ReturnType<typeof createRoutesFor>

interface OrganizationContextProps {
  organization: Organization
  routes: OrganizationRoutes
  client: Client
}

export const OrganizationContext = React.createContext<
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

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        routes,
        client: teamMemberClient,
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
      forgot_password: '/forgot_password',
      reset_password: '/reset_password',
      team: '/team',
      events: {
        create: '/create',
        ':event': {
          dashboard: '/dashboard',
          waiver: '/waiver',
          forms: {
            ':form': {},
          },
          emoji: '/emoji',
          speakers: '/speakers',
          sponsors: '/sponsors',
          tech_check: '/tech_check',
          attendees: '/attendees',
          points: '/points',
          general: '/general',
          services: {
            zapier: '/zapier',
            infusionsoft: '/infusionsoft',
          },
          name_appendage: '/name_appendage',
          areas: {
            create: '/create',
            ':area': {
              rooms: {
                create: '/create',
                ':room': {},
              },
            },
          },
          leaderboard: '/leaderboard',
        },
      },
    },
    // Namespace
    `organization/${organization.slug}`,
  )
}

function findOrganization(slug: string) {
  const url = api(`/organizations/${slug}`)
  return teamMemberClient.get<Organization>(url)
}
