import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'

type SpeakerPageData = {
  title: string
}

export default function CreateSpeakerPageForm() {
  const [submitting, setSubmitting] = useState(false)
  const {register, handleSubmit} = useForm()
  const {event, update: updateEvent} = useEvent()
  const {client} = useOrganization()

  const submit = (data: SpeakerPageData) => {
    setSubmitting(true)
    const url = api(`/events/${event.slug}/speaker_page`)

    client
      .post<ObvioEvent>(url, data)
      .then(updateEvent)
      .catch(() => {
        setSubmitting(false)
      })
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5">Speakers</Title>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            name="title"
            label="Speaker Page Title"
            fullWidth
            inputProps={{
              ref: register,
              'aria-label': 'speaker page title',
              required: 'Title is required',
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            aria-label="create speaker page"
            type="submit"
            disabled={submitting}
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
