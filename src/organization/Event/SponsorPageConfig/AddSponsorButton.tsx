import React, {useState} from 'react'
import {Button} from '@material-ui/core'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {Sponsor} from 'Event/SponsorPage'

export interface AddSponsorData {
  name: string
}

export default function AddSponsorButton(props: {
  className?: string
  onAdd: (sponsor: Sponsor) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const addSponsor = useAddSponsor()

  const add = () => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    addSponsor()
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
      aria-label="add sponsor"
      onClick={add}
      disabled={submitting}
    >
      Add Sponsor
    </Button>
  )
}

function useAddSponsor() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/sponsors`)

  const data: AddSponsorData = {
    name: 'Sponsor',
  }

  return () => client.post<Sponsor>(url, data)
}
