import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback} from 'react'

export const ZAPIER = 'Zapier'
export type Service = typeof ZAPIER

export interface Integration {
  service: {
    name: Service
  }
}

export interface ServicesContextProps {
  integrations: Integration[]
  isConnected: (service: Service) => boolean
}

const ServicesContext = React.createContext<undefined | ServicesContextProps>(
  undefined,
)

export default function ServicesProvider(props: {
  children: React.ReactElement
}) {
  const {data: integrations, loading} = useIntegrations()

  if (loading || !integrations) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  const isConnected = (service: Service) =>
    Boolean(integrations.find((i) => i.service.name === service))

  return (
    <ServicesContext.Provider value={{isConnected, integrations}}>
      {props.children}
    </ServicesContext.Provider>
  )
}

function useIntegrations() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/integrations`)

  const request = useCallback(() => client.get<Integration[]>(url), [
    client,
    url,
  ])
  return useAsync(request)
}

export function useServices() {
  const context = React.useContext(ServicesContext)
  if (context === undefined) {
    throw new Error(`useServices must be used within a ServicesProvider`)
  }

  return context
}
