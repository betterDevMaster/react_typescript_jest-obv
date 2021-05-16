import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React from 'react'
import {useCallback} from 'react'

export interface Area {
  id: number
  name: string
  is_open: boolean
  requires_approval: boolean
  allows_multiple_devices: boolean
  rooms: Room[]
  is_tech_check: boolean
  offline_title: string | null
  offline_description: string | null
  key: string
}

export interface AreasContextProps {
  areas: Area[]
  loading: boolean
}

export const AreasContext =
  React.createContext<AreasContextProps | undefined>(undefined)

export default function AreasProvider(props: {children: React.ReactElement}) {
  const fetch = useFetchAreas()

  const {data: areas, loading} = useAsync(fetch)

  if (loading || !areas) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <AreasContext.Provider
      value={{
        areas,
        loading,
      }}
    >
      {props.children}
    </AreasContext.Provider>
  )
}

export function useFetchAreas() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {slug} = event

  return useCallback(() => {
    const url = api(`/events/${slug}/areas`)
    return client.get<Area[]>(url)
  }, [client, slug])
}

export function useAreas() {
  const context = React.useContext(AreasContext)
  if (context === undefined) {
    throw new Error('useAreas must be used within an AreasProvider')
  }

  return context
}
