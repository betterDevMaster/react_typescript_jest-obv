import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/Area/AreaProvider'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'

type RoomsContextProps = {
  rooms: Room[]
  add: (room: Room) => void
  update: (room: Room) => void
}

const RoomsContext = React.createContext<RoomsContextProps | undefined>(
  undefined,
)

export default function RoomsProvider(props: {children: React.ReactElement}) {
  const [rooms, setRooms] = useState<Room[]>([])
  const {data: saved, loading} = useSavedRooms()

  useEffect(() => {
    if (!saved) {
      return
    }

    setRooms(saved)
  }, [saved])

  const add = (room: Room) => {
    const added = [...rooms, room]
    setRooms(added)
  }

  const update = useCallback(
    (room: Room) => {
      const updated = rooms.map((r) => {
        const isTarget = r.id === room.id
        if (!isTarget) {
          return r
        }

        return room
      })

      setRooms(updated)
    },
    [rooms],
  )

  if (loading || !saved) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <RoomsContext.Provider value={{rooms, add, update}}>
      {props.children}
    </RoomsContext.Provider>
  )
}

export function useRooms() {
  const context = React.useContext(RoomsContext)
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomsProvider')
  }

  return context
}

function useSavedRooms() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()
  const {id} = area

  const request = useCallback(() => {
    const url = api(`/events/${event.slug}/areas/${id}/rooms`)
    return client.get<Room[]>(url)
  }, [client, event, id])

  return useAsync(request)
}
