import {client} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Event} from 'organization/Events'
import {useOrganization} from 'organization/OrganizationProvider'
import {Organization} from 'organization/organizations-client'
import React, {useCallback} from 'react'
import {useLocation} from 'react-router-dom'

const EventContext = React.createContext<Event | undefined>(undefined)

export default function EventProvider(props: {
  children: React.ReactNode
  authenticated?: boolean
}) {
  const location = useLocation()
  const slug = location.pathname.split('/')[1]
  const organization = useOrganization()
  const {authenticated} = props
  const find = useCallback(() => {
    return findEvent(slug, {
      organization,
      authenticated,
    })
  }, [slug, organization, authenticated])

  const {data: event, loading} = useAsync(find)

  if (loading) {
    return null
  }

  if (!event) {
    return (
      <div>
        <h1>404 - Event not found</h1>
      </div>
    )
  }

  return (
    <EventContext.Provider value={event}>
      {props.children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const context = React.useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within a EventProvider')
  }

  return context
}

function findEvent(
  slug: string,
  {
    organization,
    authenticated = false,
  }: {organization: Organization; authenticated?: boolean},
) {
  const url = api(`/organizations/${organization.slug}/events/${slug}`)

  if (authenticated) {
    return client.get<Event>(url, {
      headers: {
        Authenticated: 'true',
      },
    })
  }

  return client.get<Event>(url)
}
