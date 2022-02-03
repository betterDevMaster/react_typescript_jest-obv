import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Area} from 'organization/Event/AreasProvider'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

type AreaContextProps = {
  area: Area
  update: (data: Partial<Area>) => void
  processing: boolean
  deleteArea: () => Promise<void>
}

const AreaContext = React.createContext<AreaContextProps | undefined>(undefined)

export function AreaProvider(props: {children: React.ReactElement}) {
  const {area: routeId} = useParams<{area: string}>()
  const id = parseInt(routeId)
  const [area, setArea] = useState<Area | null>(null)
  const {data: saved, loading, error} = useAreaWithId(id)
  const [processing, setProcessing] = useState(false)
  const update = useUpdateArea(id, setArea, setProcessing)
  const deleteArea = useDeleteArea(id, setProcessing)

  useEffect(() => {
    setArea(saved)
  }, [saved])

  if (error) {
    throw new Error(error.message)
  }

  if (loading || !area) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <AreaContext.Provider value={{area, update, processing, deleteArea}}>
      {props.children}
    </AreaContext.Provider>
  )
}

function useAreaWithId(id: number) {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()

  const fetch = useCallback(() => {
    const url = api(`/events/${slug}/areas/${id}`)
    return client.get<Area>(url)
  }, [id, client, slug])

  return useAsync(fetch)
}

function useUpdateArea(
  id: number,
  setArea: (area: Area) => void,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()

  const update = useCallback(
    (data: Partial<Area>) => {
      const url = api(`/events/${slug}/areas/${id}`)
      setProcessing(true)
      return client
        .patch<Area>(url, data)
        .then(setArea)
        .finally(() => {
          setProcessing(false)
        })
    },
    [client, slug, setArea, id, setProcessing],
  )

  return update
}

function useDeleteArea(
  id: number,
  setProcessing: (processing: boolean) => void,
) {
  const {event} = useEvent()
  const {client} = useOrganization()

  return useCallback(() => {
    const endpoint = `/events/${event.slug}/areas/${id}`
    const url = api(endpoint)

    setProcessing(true)
    return client.delete<void>(url).catch((e) => {
      setProcessing(false)
      throw e // re-throw to prevent downstream from thinking it was a success
    })
  }, [id, client, setProcessing, event])
}

export function useArea() {
  const context = React.useContext(AreaContext)
  if (context === undefined) {
    throw new Error('useArea must be used within a AreaProvider')
  }

  return context
}
