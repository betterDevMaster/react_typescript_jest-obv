import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {InfusionsoftIntegration} from 'organization/Event/Services/Infusionsoft'
import {ZapierIntegration} from 'organization/Event/Services/Zapier'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'

export const ZAPIER = 'Zapier'
export const INFUSIONSOFT = 'Infusionsoft'

export type Service = typeof ZAPIER | typeof INFUSIONSOFT

export type BaseIntegration = {
  service: Service
  is_linked: boolean
}

export type Integration = ZapierIntegration | InfusionsoftIntegration

export interface ServicesContextProps {
  integrations: Integration[]
  isLinked: (service: Service) => boolean
  updateIntegration: (integration: Integration) => void
}

const ServicesContext = React.createContext<undefined | ServicesContextProps>(
  undefined,
)

export default function ServicesProvider(props: {
  children: React.ReactElement
}) {
  const {data: fetched, loading} = useIntegrations()
  const [integrations, setIntegrations] = useState<Integration[]>([])

  useEffect(() => {
    if (!fetched) {
      return
    }

    setIntegrations(fetched)
  }, [fetched])

  if (loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  const isLinked = (service: Service) => {
    const integration = integrations.find((i) => i.service === service)
    if (!integration) {
      return false
    }

    return integration.is_linked
  }

  const updateIntegration = (target: Integration) => {
    setIntegrations((current) => {
      return current.map((i) => {
        const isTarget = i.service === target.service
        if (isTarget) {
          return target
        }

        return i
      })
    })
  }

  return (
    <ServicesContext.Provider
      value={{isLinked, integrations, updateIntegration}}
    >
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
