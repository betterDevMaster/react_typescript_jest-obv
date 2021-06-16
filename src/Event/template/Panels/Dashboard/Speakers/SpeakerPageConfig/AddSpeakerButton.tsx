import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {Speaker} from 'Event/SpeakerPage'

export interface AddSpeakerData {
  name: string
}

export default function AddSpeakerButton(props: {
  className?: string
  onAdd: (speaker: Speaker) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const addSpeaker = useAddSpeaker()

  const add = () => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    addSpeaker()
      .then(props.onAdd)
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Button
      fullWidth
      className={props.className}
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add speaker"
      onClick={add}
      disabled={submitting}
    >
      Add Speaker
    </Button>
  )
}

function useAddSpeaker() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/speakers`)

  const data: AddSpeakerData = {
    name: 'Speaker',
  }

  return () => client.post<Speaker>(url, data)
}
