import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useCallback} from 'react'
import Card from 'organization/Event/AreaList/Card'

export interface Area {
  id: number
  name: string
  is_open: boolean
  requires_approval: boolean
  allows_multiple_devices: boolean
  rooms: Room[]
}

export default function AreaList() {
  const {areas, loading} = useAreas()

  if (loading || !areas) {
    return <div>loading...</div>
  }

  const isEmpty = areas.length === 0
  if (isEmpty) {
    return <div>You have not created any areas</div>
  }

  return (
    <div>
      {areas.map((a) => (
        <Card key={a.id} area={a} />
      ))}
    </div>
  )
}

export function useAreas() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {slug} = event

  const fetch = useCallback(() => {
    const url = api(`/events/${slug}/areas`)
    return client.get<Area[]>(url)
  }, [client, slug])

  const {data: areas, ...other} = useAsync(fetch)

  return {areas, ...other}
}
