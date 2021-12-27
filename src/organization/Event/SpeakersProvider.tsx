import React, {useEffect, useState, useCallback} from 'react'

import {useEvent} from 'Event/EventProvider'
import {Speaker} from 'Event/SpeakerPage'

import {Client} from 'lib/ui/api-client'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'

import {useOrganization} from 'organization/OrganizationProvider'

interface SpeakersContextProps {
  speakers: Speaker[]
  add: (speaker: Speaker) => void
  update: (speaker: Speaker) => void
  remove: (speaker: Speaker) => void
  edit: (speaker: Speaker | null) => void
  speakerloading: boolean
  editing: Speaker | null | undefined
}

const SpeakersContext = React.createContext<undefined | SpeakersContextProps>(
  undefined,
)

export function OrganizationSpeakersProvider(props: {
  children: React.ReactNode
}) {
  const {client} = useOrganization()
  return <SpeakersProvider client={client} {...props} />
}

export function EventSpeakersProvider(props: {children: React.ReactNode}) {
  const {client} = useEvent()
  return <SpeakersProvider client={client} {...props} />
}

export default function SpeakersProvider(props: {
  client: Client
  children: React.ReactNode
}) {
  const {client} = props

  const fetch = useFetchSpeakers(client)
  const list = useSpeakersList(fetch)

  return (
    <SpeakersContext.Provider value={list}>
      {props.children}
    </SpeakersContext.Provider>
  )
}

export function useSpeakersList(request: () => Promise<Speaker[]>) {
  const {data: saved, loading} = useAsync(request)
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [editing, setEditing] = useState<Speaker | null>(null)
  const edit = (speaker: Speaker | null) => setEditing(speaker)

  useEffect(() => {
    if (!saved) {
      return
    }
    setSpeakers(Object(saved)['speakers'])
  }, [saved])

  const add = (newSpeaker: Speaker) => {
    const added = [...speakers, newSpeaker]
    setSpeakers(added)
  }

  const update = (target: Speaker) => {
    const updated = speakers.map((s) => {
      const isTarget = s.id === target.id
      if (isTarget) {
        return target
      }

      return s
    })

    setSpeakers(updated)
  }

  const remove = (target: Speaker) => {
    const removed = speakers.filter((s) => s.id !== target.id)
    setSpeakers(removed)
  }

  return {speakers, update, speakerloading: loading, editing, add, remove, edit}
}

export function useSpeakers() {
  const context = React.useContext(SpeakersContext)

  if (context === undefined) {
    throw new Error('useSpeakers must be used within a SpeakersProvider')
  }

  return context
}

export function useFetchSpeakers(client: Client) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}`)
  return useCallback(
    () => client.get<Speaker[]>(url, {noCache: true}),
    [client, url],
  )
}
