import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/api-client'
import {spacing} from 'lib/ui/theme'
import React from 'react'
import {UseFormMethods} from 'react-hook-form'
import {ObvioEvent} from 'Event'
import {fieldError} from 'lib/form'

export type EventData = Pick<
  ObvioEvent,
  'name' | 'slug' | 'start' | 'end' | 'num_attendees'
>

export default function Form(props: {
  onSubmit: () => void
  register: UseFormMethods['register']
  formErrors: UseFormMethods['errors']
  submitting: boolean
  canSave?: boolean
  responseError: ValidationError<EventData>
  slug?: string
  submitLabel: string
}) {
  const {
    submitting,
    formErrors,
    responseError,
    slug,
    register,
    onSubmit,
    submitLabel,
  } = props

  const canSave = props.canSave === undefined ? true : props.canSave

  const error = (key: keyof EventData) =>
    fieldError(key, {
      form: formErrors,
      response: responseError,
    })

  const errors = {
    name: error('name'),
    slug: error('slug'),
    start: error('start'),
    end: error('end'),
    numAttendees: error('num_attendees'),
  }

  const slugHelperText = () => {
    if (errors.slug) {
      return errors.slug
    }

    if (!slug) {
      return 'Your event slug will be a part of your domain'
    }

    return `Your event will be accessible at: ${slug}.obv.io`
  }

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="Event Name"
        name="name"
        required
        fullWidth
        variant="outlined"
        inputProps={{
          ref: register({
            required: 'Name is required',
          }),
          'aria-label': 'event name',
        }}
        error={!!errors.name}
        helperText={errors.name}
        disabled={submitting}
      />
      <TextField
        label="Unique Slug"
        name="slug"
        required
        fullWidth
        variant="outlined"
        inputProps={{
          ref: register({
            required: 'Slug is required',
          }),
          'aria-label': 'domain slug',
        }}
        error={!!errors.slug}
        disabled={submitting}
        helperText={slugHelperText()}
      />
      <TextField
        type="datetime-local"
        label="Start"
        name="start"
        required
        fullWidth
        variant="outlined"
        inputProps={{
          ref: register({
            required: 'Start is required',
          }),
          'aria-label': 'start',
        }}
        error={!!errors.start}
        helperText={errors.start}
        disabled={submitting}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        type="datetime-local"
        label="End"
        name="end"
        required
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          ref: register({
            required: 'End Time is required',
          }),
          'aria-label': 'end',
        }}
        error={!!errors.end}
        helperText={errors.end}
        disabled={submitting}
      />
      <TextField
        required
        label="Expected Number of Attendees"
        type="number"
        name="num_attendees"
        fullWidth
        variant="outlined"
        inputProps={{
          ref: register({
            required: 'Expected Number of Attendees is required',
          }),
          'aria-label': 'expected number of atttendees',
        }}
        error={!!errors.numAttendees}
        helperText={errors.numAttendees}
        disabled={submitting}
      />
      <Error>{responseError && responseError.message}</Error>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        size="large"
        disabled={submitting || !canSave}
        aria-label="submit"
      >
        {submitLabel}
      </Button>
    </form>
  )
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
