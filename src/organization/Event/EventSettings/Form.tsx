import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/api-client'
import {spacing} from 'lib/ui/theme'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'
import {ObvioEvent} from 'Event'
import {fieldError} from 'lib/form'
import {DateTimePicker} from '@material-ui/pickers'
import moment from 'moment'
import {FileSelect} from 'lib/ui/form/file'
import ImageUpload, {
  Image,
  Label,
  RemoveButton,
  UploadButton,
} from 'lib/ui/form/ImageUpload'
import Box from '@material-ui/core/Box'

export type UpdateEventData = Pick<
  ObvioEvent,
  'name' | 'slug' | 'start' | 'end' | 'num_attendees'
>

export default function Form(props: {
  onSubmit: () => void
  register: UseFormMethods['register']
  formErrors: UseFormMethods['errors']
  submitting: boolean
  canSave?: boolean
  responseError: ValidationError<UpdateEventData>
  slug?: string
  submitLabel: string
  control: UseFormMethods['control']
  favicon: FileSelect
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
  const inThreeDays = moment().add(3, 'days').toISOString()
  const inSixDays = moment().add(6, 'days').toISOString()

  const canSave = props.canSave === undefined ? true : props.canSave

  const error = (key: keyof UpdateEventData) =>
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
        helperText={slugHelperText()}
      />
      <Controller
        name="start"
        control={props.control}
        defaultValue={inThreeDays}
        rules={{
          required: 'Start is required',
        }}
        render={({onChange, value}) => (
          <DateTimePicker
            disabled={submitting}
            value={value}
            onChange={(date) => onChange(date?.toISOString() || '')}
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
          <DateTimePicker
            disabled={submitting}
            value={value}
            onChange={(date) => onChange(date?.toISOString() || '')}
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
        name="num_attendees"
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
      <Box mb={2}>
        <ImageUpload file={props.favicon} disabled={submitting}>
          <Label>Favicon</Label>
          <FaviconBox>
            <Image alt="favicon" />
          </FaviconBox>
          <UploadButton
            inputProps={{
              'aria-label': 'favicon input',
            }}
          />
          <RemoveButton aria-label="remove favicon" />
        </ImageUpload>
      </Box>

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

const FaviconBox = styled.div`
  width: 32px;
`
