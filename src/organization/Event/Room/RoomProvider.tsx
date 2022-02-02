import {Room} from 'Event/room'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useState} from 'react'
import {Redirect, useParams} from 'react-router-dom'
import {useRooms} from 'organization/Event/Area/RoomsProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'

type UpdateRoom = (updates: Partial<Room>) => Promise<void>

type RoomContextProps = {
  room: Room
  update: UpdateRoom
  deleteRoom: () => Promise<void>
  endMeeting: () => Promise<void>
  setOnline: (online: boolean) => void
  setPaused: (online: boolean) => void
  toggleRegistration: (hasRegistration: boolean) => void
  processing: boolean
}

const RoomContext = React.createContext<RoomContextProps | undefined>(undefined)

export function StaticRoomProvider(props: {
  room: Room
  children: React.ReactElement
}) {
  const {room} = props
  const [processing, setProcessing] = useState(false)

  const update = useUpdateRoom(room.id, setProcessing)
  const setOnline = useSetOnline(room.id, setProcessing)
  const setPaused = useSetPaused(room.id, setProcessing)
  const remove = useRemove(room.id, setProcessing)
  const endMeeting = useEndMeeting(room.id, setProcessing)
  const toggleRegistration = useToggleRegistration(room.id, setProcessing)

  return (
    <RoomContext.Provider
      value={{
        room,
        update,
        processing,
        setOnline,
        setPaused,
        endMeeting,
        deleteRoom: remove,
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
  const {rooms} = useRooms()
  const [processing, setProcessing] = useState(false)
  const update = useUpdateRoom(id, setProcessing)
  const setOnline = useSetOnline(id, setProcessing)
  const setPaused = useSetPaused(id, setProcessing)
  const endMeeting = useEndMeeting(id, setProcessing)
  const remove = useRemove(id, setProcessing)
  const setPublic = useToggleRegistration(id, setProcessing)
  const areaRoutes = useAreaRoutes()

  const room = rooms.find((r) => r.id === id)
  if (!room) {
    return <Redirect to={areaRoutes.rooms.root} />
  }

  return (
    <RoomContext.Provider
      value={{
        room: room,
        update,
        processing,
        setOnline,
        setPaused,
        endMeeting,
        deleteRoom: remove,
        toggleRegistration: setPublic,
      }}
    >
      {props.children}
    </RoomContext.Provider>
  )
}

function useUpdateRoom(
  id: number,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {update} = useRooms()

  return useCallback<UpdateRoom>(
    (updates) => {
      const url = api(`/rooms/${id}`)
      setProcessing(true)

      return client
        .patch<Room>(url, updates)
        .then(update)
        .finally(() => {
          setProcessing(false)
        })
    },
    [client, setProcessing, update, id],
  )
}

function useToggleRegistration(
  id: number,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {update} = useRooms()

  return useCallback(
    (enable: boolean) => {
      const endpoint = `/rooms/${id}/registration`
      const url = api(endpoint)
      const sendRequest = enable ? client.patch : client.delete

      setProcessing(true)

      sendRequest<Room>(url)
        .then(update)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, setProcessing, update],
  )
}

function useSetOnline(
  id: number,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {update} = useRooms()

  return useCallback(
    (online: boolean) => {
      const endpoint = online ? `/rooms/${id}/start` : `/rooms/${id}/stop`
      const url = api(endpoint)

      setProcessing(true)
      client
        .patch<Room>(url)
        .then(update)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, update, setProcessing],
  )
}

function useSetPaused(
  id: number,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()
  const {update} = useRooms()

  return useCallback(
    (pause: boolean) => {
      const endpoint = pause ? `/rooms/${id}/pause` : `/rooms/${id}/unpause`
      const url = api(endpoint)

      setProcessing(true)
      client
        .patch<Room>(url)
        .then(update)
        .finally(() => {
          setProcessing(false)
        })
    },
    [id, client, update, setProcessing],
  )
}

function useEndMeeting(
  id: number,
  setProcessing: (processing: boolean) => void,
) {
  const {client} = useOrganization()

  return useCallback(() => {
    const endpoint = `/rooms/${id}/end`
    const url = api(endpoint)

    setProcessing(true)
    return client.patch<void>(url).finally(() => {
      setProcessing(false)
    })
  }, [id, client, setProcessing])
}

function useRemove(id: number, setProcessing: (processing: boolean) => void) {
  const {client} = useOrganization()

  return useCallback(() => {
    const endpoint = `/rooms/${id}`
    const url = api(endpoint)

    setProcessing(true)
    return client.delete<void>(url).catch((e) => {
      setProcessing(false)
      throw e // re-throw to prevent downstream from thinking it was a success
    })
  }, [id, client, setProcessing])
}

export function useRoom() {
  const context = React.useContext(RoomContext)
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider')
  }

  return context
}
