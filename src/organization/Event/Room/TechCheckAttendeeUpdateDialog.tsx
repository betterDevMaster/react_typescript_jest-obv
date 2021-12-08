import {Attendee} from 'Event/attendee'
import React, {useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import TextField from '@material-ui/core/TextField'

import {fieldError} from 'lib/form'
import {useForm} from 'react-hook-form'
import {ValidationError} from 'lib/ui/api-client'
import Button from '@material-ui/core/Button'
import {spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core/styles'

export default function TechCheckAttendeeUpdateDialog(props: {
  attendee: Attendee | null
  onClose: () => void
  update: (attendee: Attendee) => void
}) {
  const {attendee} = props
  const isVisible = Boolean(props.attendee)

  if (!attendee) {
    return null
  }

  return (
    <Dialog open={isVisible} onClose={props.onClose}>
      <DialogTitle>Attendee</DialogTitle>
      <DialogContent>
        <Form
          attendee={attendee}
          closeDialog={props.onClose}
          updateAttendee={props.update}
        />
      </DialogContent>
    </Dialog>
  )
}

function useUpdate() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee, data: Partial<Attendee>) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}`)
    return client.patch<Attendee>(url, data)
  }
}

function Form(props: {
  attendee: Attendee
  closeDialog: () => void
  updateAttendee: (attendee: Attendee) => void
}) {
  const {register, handleSubmit, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const update = useUpdate()

  const [serverError, setServerError] = useState<
    ValidationError<Partial<Attendee>>
  >(null)
  const {attendee} = props

  const firstNameError = fieldError('first_name', {
    form: errors,
    response: serverError,
  })

  const lastNameError = fieldError('last_name', {
    form: errors,
    response: serverError,
  })

  const submit = (data: Partial<Attendee>) => {
    if (submitting) {
      return
    }

    setServerError(null)
    setSubmitting(true)

    update(props.attendee, data)
      .then((updated) => {
        props.updateAttendee(updated)
      })
      .catch(setServerError)
      .finally(() => {
        setSubmitting(false)
        props.closeDialog()
      })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <TextField
        label="First Name"
        fullWidth
        variant="outlined"
        name="first_name"
        defaultValue={attendee?.first_name || ''}
        inputProps={{
          ref: register({
            required: 'First name is required',
          }),
          'aria-label': 'first name',
        }}
        error={Boolean(firstNameError)}
        helperText={firstNameError}
      />
      <TextField
        label="Last Name"
        fullWidth
        variant="outlined"
        name="last_name"
        defaultValue={attendee?.last_name || ''}
        inputProps={{
          ref: register({
            required: 'Last name is required',
          }),
          'aria-label': 'last name',
        }}
        error={Boolean(lastNameError)}
        helperText={lastNameError}
      />
      <SaveButton
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        size="large"
        disabled={submitting}
        aria-label="save"
      >
        Save
      </SaveButton>
    </form>
  )
}

const SaveButton = withStyles({
  root: {
    marginBottom: spacing[5],
  },
})(Button)
