import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import React, {useEffect, useState} from 'react'
import Layout from 'organization/user/Layout'
import CreateSpeakerPageForm from './CreateSpeakerPageForm'
import {Speaker} from 'Event'
import SpeakerList from 'organization/Event/SpeakersConfig/SpeakerList'
import AddSpeakerButton from 'organization/Event/SpeakersConfig/AddSpeakerButton'
import SpeakerEditDialog from 'organization/Event/SpeakersConfig/SpeakerEditDialog'
import TitleField from 'organization/Event/SpeakersConfig/TitleField'
import Page from 'organization/Event/Page'

export default function SpeakersConfig() {
  const {speakers, add, update, remove} = useSpeakers()
  const {event} = useEvent()
  const [editing, setEditing] = useState<Speaker | null>(null)
  const {speaker_page: page} = event

  const edit = (speaker: Speaker) => setEditing(speaker)

  const handleAddedSpeaker = (newSpeaker: Speaker) => {
    add(newSpeaker)
    edit(newSpeaker)
  }

  const closeEditDialog = () => setEditing(null)

  const handleUpdatedSpeaker = (target: Speaker) => {
    update(target)
    closeEditDialog()
  }

  const removeEditing = () => {
    if (!editing) {
      throw new Error(`Could not remove speaker; none was selected.`)
    }

    remove(editing)
    closeEditDialog()
  }

  if (!page) {
    return <CreateSpeakerPageForm />
  }
  return (
    <>
      <SpeakerEditDialog
        speaker={editing}
        onClose={closeEditDialog}
        onComplete={handleUpdatedSpeaker}
        onRemove={removeEditing}
      />
      <Layout>
        <Page>
          <TitleField page={page} />
          <StyledAddSpeakerButton onAdd={handleAddedSpeaker} />
          <SpeakerList speakers={speakers} onSelect={edit} />
        </Page>
      </Layout>
    </>
  )
}

function useSpeakers() {
  const {event} = useEvent()
  const {speaker_page: page} = event
  const [speakers, setSpeakers] = useState<Speaker[]>([])

  useEffect(() => {
    if (!page) {
      return
    }
    setSpeakers(page.speakers)
  }, [page])

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

  return {
    speakers,
    add,
    update,
    remove,
  }
}

const StyledAddSpeakerButton = styled(AddSpeakerButton)`
  margin-bottom: ${(props) => props.theme.spacing[8]}!important;
`
