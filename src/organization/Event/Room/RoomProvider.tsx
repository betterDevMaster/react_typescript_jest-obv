import {Room} from 'Event/room'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'

type UpdateRoom = (updates: Partial<Room>) => Promise<void>

type RoomContextProps = {
  room: Room
  update: UpdateRoom
  setOnline: (online: boolean) => void
  toggleRegistration: (hasRegistration: boolean) => void
  processing: boolean
}

const RoomContext = React.createContext<RoomContextProps | undefined>(undefined)

export function StaticRoomProvider(props: {
  room: Room
  children: React.ReactElement
}) {
  const [room, setRoom] = useState<Room>(props.room)
  const [processing, setProcessing] = useState(false)
  const update = useUpdateRoom(props.room.id, setRoom, setProcessing)
  const setOnline = useSetOnline(props.room.id, setRoom, setProcessing)
  const toggleRegistration = useToggleRegistration(
    props.room.id,
    setRoom,
    setProcessing,
  )

  return (
    <RoomContext.Provider
      value={{
        room: room,
        update,
        processing,
        setOnline,
        toggleRegistration,
      }}
    >
      {props.children}
    </RoomContext.Provider>
  )
}

export function RouteRoomProvider(props: {children: React.ReactElement}) {
  const {room: routeId} = useParams<{room: string}>()
  const id = parseInt(routeId)
  const [room, setRoom] = useState<Room | null>(null)
  const {data: saved, loading, error: fetchError} = useSavedRoom(id)
  const [processing, setProcessing] = useState(false)
  const update = useUpdateRoom(id, setRoom, setProcessing)
  const setOnline = useSetOnline(id, setRoom, setProcessing)
  const setPublic = useToggleRegistration(id, setRoom, setProcessing)

  useEffect(() => {
    setRoom(saved)
  }, [saved])

  if (loading || !room) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  return (
    <RoomContext.Provider
      value={{
        room: room,
        update,
        processing,
        setOnline,
        toggleRegistration: setPublic,
      }}
    >
      {props.children}
    </RoomContext.Provider>
  )
}

function useSavedRoom(id: number) {
  const {client} = useOrganization()

  const fetch = useCallback(() => {
    const url = api(`/rooms/${id}`)
    return client.get<Room>(url)
  }, [id, client])

  return useAsync(fetch)
}

function useUpdateRoom(
  id: number,
  setRoom: (room: Room) => void,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()

  return useCallback<UpdateRoom>(
    (updates) => {
      const url = api(`/rooms/${id}`)
      setProcessing(true)
      return client
        .patch<Room>(url, updates)
        .then(setRoom)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, setRoom, setProcessing],
  )
}

function useToggleRegistration(
  id: number,
  setRoom: (room: Room) => void,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()

  return useCallback(
    (enable: boolean) => {
      const endpoint = `/rooms/${id}/registration`
      const url = api(endpoint)
      const sendRequest = enable ? client.patch : client.delete

      setProcessing(true)

      sendRequest<Room>(url)
        .then(setRoom)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, setRoom, setProcessing],
  )
}

function useSetOnline(
  id: number,
  setRoom: (room: Room) => void,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()

  return useCallback(
    (online: boolean) => {
      const endpoint = online ? `/rooms/${id}/start` : `/rooms/${id}/stop`
      const url = api(endpoint)

      setProcessing(true)
      client
        .patch<Room>(url)
        .then(setRoom)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, setRoom, setProcessing],
  )
}

export function useRoom() {
  const context = React.useContext(RoomContext)
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider')
  }

  return context
}
