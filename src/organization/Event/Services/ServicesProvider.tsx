import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {InfusionsoftIntegration} from 'organization/Event/Services/Apps/Infusionsoft'
import {ZapierIntegration} from 'organization/Event/Services/Apps/Zapier'
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
  update: (integration: Integration) => void
  infusionsoft?: InfusionsoftIntegration
  unlink: (service: Service) => Promise<any>
  remove: (service: Service) => void
}

const ServicesContext = React.createContext<undefined | ServicesContextProps>(
  undefined,
)

export default function ServicesProvider(props: {
  children: React.ReactElement
}) {
  const {data: fetched, loading} = useIntegrations()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const unlink = useUnlink()

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

  const update = (target: Integration) => {
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

  const remove = (service: Service) => {
    const removed = integrations.filter((i) => i.service !== service)
    setIntegrations(removed)
  }

  return (
    <ServicesContext.Provider
      value={{isLinked, integrations, update, unlink, remove}}
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

export function useInfusionsoft() {
  const {integrations} = useServices()

  for (const integration of integrations) {
    if (integration.service === INFUSIONSOFT) {
      return integration
    }
  }

  throw new Error('Infusionsoft integration has not been created')
}

function useUnlink() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (service: Service) => {
    switch (service) {
      case ZAPIER:
        return client.delete(
          api(`/events/${event.slug}/integrations/zapier/link`),
        )
      case INFUSIONSOFT:
        return client.delete(
          api(`/events/${event.slug}/integrations/infusionsoft/link`),
        )
    }
  }
}
