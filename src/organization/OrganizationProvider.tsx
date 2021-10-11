import {useAsync} from 'lib/async'
import {api, createRoutes} from 'lib/url'
import {Organization} from 'organization'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Client} from 'lib/api-client'
import {createPrivate as createEcho} from 'lib/echo'
import {useAuthToken} from 'organization/auth'
import {useLocation} from 'react-router-dom'

export type OrganizationRoutes = ReturnType<typeof createRoutesFor>

interface OrganizationContextProps {
  organization: Organization
  routes: OrganizationRoutes
  client: Client
  set: (organization: Organization) => void
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

  const [organization, setOrganization] = useState<Organization | null>(null)

  const {data: fetched, loading} = useAsync(find)

  useEffect(() => {
    setOrganization(fetched)
  }, [fetched])

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
        set: setOrganization,
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

export function useOrganizationEcho() {
  const token = useAuthToken()
  return useMemo(() => createEcho(token), [token])
}

export function createRoutesFor(organization: Organization) {
  return createRoutes(
    {
      login: '/login',
      forgot_password: '/forgot_password',
      reset_password: '/reset_password',
      team: '/team',
      settings: '/settings',
      form_submissions: {
        ':file': {},
      },
      question_submissions: {
        ':file': {},
      },
      attendees_export: {
        ':file': {},
      },
      area_attendees_export: {
        ':file': {},
      },
      room_attendees_export: {
        ':file': {},
      },
      waivers: {
        ':file': {},
      },
      events: {
        create: '/create',
        ':event': {
          duplicate: '/duplicate',
          dashboard: '/dashboard',
          waiver: '/waiver',
          forms: {
            ':form': {},
          },
          emoji: {
            settings: '/settings',
          },
          speakers: '/speakers',
          sponsors: '/sponsors',
          faqs: '/faqs',
          tech_check: '/tech_check',
          attendees: '/attendees',
          points: '/points',
          general: '/general',
          localization: '/localization',
          services: {
            zapier: '/zapier',
            infusionsoft: '/infusionsoft',
            mailchimp: '/mailchimp',
          },
          name_appendage: '/name_appendage',
          backgrounds: '/zoom_backgrounds',
          areas: {
            create: '/create',
            ':area': {
              rules: '/rules',
              rooms: {
                create: '/create',
                ':room': {
                  recordings: '/recordings',
                },
              },
            },
          },
          leaderboard: '/leaderboard',
          reports: '/reports',
          image_entries: '/image_entries',
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
