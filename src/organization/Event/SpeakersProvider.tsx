import {useEvent} from 'Event/EventProvider'
import {Speaker} from 'Event/SpeakerPage'
import React, {useEffect, useState} from 'react'

interface SpeakersContextProps {
  speakers: Speaker[]
  add: (speaker: Speaker) => void
  update: (speaker: Speaker) => void
  remove: (speaker: Speaker) => void
  edit: (speaker: Speaker | null) => void
  editing: Speaker | null
}

const SpeakersContext = React.createContext<undefined | SpeakersContextProps>(
  undefined,
)

export default function SpeakersProvider(props: {
  children: React.ReactElement
}) {
  const {event} = useEvent()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [editing, setEditing] = useState<Speaker | null>(null)

  const edit = (speaker: Speaker | null) => setEditing(speaker)

  useEffect(() => {
    setSpeakers(event.speakers)
  }, [event])

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

  return (
    <SpeakersContext.Provider
      value={{
        speakers,
        add,
        update,
        remove,
        edit,
        editing,
      }}
    >
      {props.children}
    </SpeakersContext.Provider>
  )
}

export function useSpeakers() {
  const context = React.useContext(SpeakersContext)

  if (context === undefined) {
    throw new Error('useSpeakers must be used within a SpeakersProvider')
  }

  return context
}
