import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/api-client'
import {spacing} from 'lib/ui/theme'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'
import {ObvioEvent} from 'Event'
import {fieldError} from 'lib/form'
import moment from 'moment'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'

export type CreateEventData = Pick<
  ObvioEvent,
  'name' | 'slug' | 'start' | 'end' | 'num_expected_attendees'
>

export default function Form(props: {
  onSubmit: () => void
  register: UseFormMethods['register']
  formErrors: UseFormMethods['errors']
  submitting: boolean
  canSave?: boolean
  responseError: ValidationError<CreateEventData>
  slug?: string
  submitLabel: string
  control: UseFormMethods['control']
  setValue: UseFormMethods['setValue']
  hasEndDateTimeChange: boolean
  setHasEndDateTimeChange: (flag: boolean) => void
}) {
  const {
    submitting,
    formErrors,
    responseError,
    slug,
    register,
    onSubmit,
    setValue,
    submitLabel,
    hasEndDateTimeChange,
    setHasEndDateTimeChange,
  } = props
  const inThreeDays = moment().add(3, 'days').toISOString()
  const inSixDays = moment().add(6, 'days').toISOString()

  const canSave = props.canSave === undefined ? true : props.canSave

  const error = (key: keyof CreateEventData) =>
    fieldError(key, {
      form: formErrors,
      response: responseError,
    })

  const errors = {
    name: error('name'),
    slug: error('slug'),
    start: error('start'),
    end: error('end'),
    numAttendees: error('num_expected_attendees'),
  }

  const handleStartDate = (date: MaterialUiPickersDate) => {
    if (!date) {
      throw new Error('Date is required')
    }
    setValue('start', date.toISOString())
    if (!hasEndDateTimeChange) {
      setValue('end', date.toISOString())
    }
  }

  const handleEndDate = (date: MaterialUiPickersDate) => {
    if (!date) {
      throw new Error('Date is required')
    }
    setValue('end', date.toISOString())
    setHasEndDateTimeChange(true)
  }

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="Event Name"
        name="name"
        required
        fullWidth
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
        inputProps={{
          ref: register({
            required: 'Slug is required',
          }),
          'aria-label': 'domain slug',
        }}
        error={!!errors.slug}
        disabled={submitting}
        helperText={slugHelperText(errors, slug)}
      />
      <Controller
        name="start"
        control={props.control}
        defaultValue={inThreeDays}
        rules={{
          required: 'Start is required',
        }}
        render={({onChange, value}) => (
          <LocalizedDateTimePicker
            disabled={submitting}
            value={value}
            onChange={handleStartDate}
            fullWidth
            label="Start"
            inputProps={{
              'aria-label': 'start',
              onChange,
            }}
          />
        )}
      />
      <Controller
        name="end"
        control={props.control}
        defaultValue={inSixDays}
        rules={{
          required: 'End is required',
        }}
        render={({onChange, value}) => (
          <LocalizedDateTimePicker
            disabled={submitting}
            value={value}
            onChange={handleEndDate}
            fullWidth
            label="End"
            inputProps={{
              'aria-label': 'end',
              onChange,
            }}
          />
        )}
      />
      <TextField
        required
        label="Expected Number of Attendees"
        type="number"
        name="num_expected_attendees"
        fullWidth
        inputProps={{
          ref: register({
            required: 'Expected Number of Attendees is required',
          }),
          'aria-label': 'expected number of attendees',
        }}
        error={!!errors.numAttendees}
        helperText={errors.numAttendees}
        disabled={submitting}
      />
      <ErrorMessage>{responseError && responseError.message}</ErrorMessage>
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

function ErrorMessage(props: {children: string | null}) {
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

export function slugHelperText(errors: Record<string, any>, slug?: string) {
  if (errors.slug) {
    return errors.slug
  }

  if (!slug) {
    return 'Your event slug will be a part of your domain'
  }

  return `Your event will be accessible at: ${slug}.obv.io`
}
