import {useAsync} from 'lib/async'
import {api, createRoutes} from 'lib/url'
import {Organization} from 'organization'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Client} from 'lib/ui/api-client'
import {createPrivate as createEcho} from 'lib/echo'
import {Redirect, useLocation} from 'react-router-dom'
import {obvioRoutes} from 'obvio/Routes'
import {useAuthToken} from 'obvio/auth'

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
  const id = useRouteOrganizationId()

  const find = useCallback(() => {
    return findOrganization(id)
  }, [id])

  const [organization, setOrganization] = useState<Organization | null>(null)
  const {data: fetched, loading} = useAsync(find)

  useEffect(() => {
    setOrganization(fetched)
  }, [fetched])

  // If invalid id let's just redirect back to organizations list
  if (!id) {
    return <Redirect to={obvioRoutes.organizations.root} />
  }

  if (loading) {
    return null
  }

  if (!organization) {
    return (
      <div>
        <h1>404 - Organization '{id}' not found.</h1>
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

function useRouteOrganizationId() {
  const location = useLocation()
  // Parse id out of URL. example location: '/organization/35',
  // which would split to ['','organization','35'].
  const id = location.pathname.split('/')[2]

  try {
    return parseInt(id)
  } catch {
    return null
  }
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
      buy_credits: '/buy_credits',
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
          login: '/login',
          event_offline: '/event_offline',
          password_create: '/password_create',
          global_styles: '/global_styles',
          check_in: '/check_in',
        },
      },
    },
    // Namespace
    `organization/${organization.id}`,
  )
}

function findOrganization(id: number | null) {
  const url = api(`/organizations/${id}`)
  return teamMemberClient.get<Organization>(url)
}
