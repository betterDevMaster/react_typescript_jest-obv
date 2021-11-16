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
import {FileSelect} from 'lib/ui/form/file'
import ImageUpload from 'lib/ui/form/ImageUpload'
import Label from 'lib/ui/form/ImageUpload/Label'
import RemoveButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'
import Box from '@material-ui/core/Box'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import {useEvent} from 'Event/EventProvider'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'

export type UpdateEventData = Pick<
  ObvioEvent,
  'name' | 'slug' | 'start' | 'end' | 'num_expected_attendees' | 'is_online'
>

export default function Form(props: {
  onSubmit: () => void
  register: UseFormMethods['register']
  errors: UseFormMethods['errors']
  submitting: boolean
  responseError: ValidationError<UpdateEventData>
  slug?: string
  submitLabel: string
  control: UseFormMethods['control']
  favicon: FileSelect
  setValue: UseFormMethods['setValue']
  hasEndDateTimeChange: boolean
  setHasEndDateTimeChange: (flag: boolean) => void
}) {
  const {
    submitting,
    errors,
    responseError,
    slug,
    register,
    onSubmit,
    control,
    submitLabel,
    setValue,
    hasEndDateTimeChange,
    setHasEndDateTimeChange,
  } = props
  const {event} = useEvent()

  const slugHelperText = () => {
    if (errors.slug) {
      return errors.slug
    }

    if (!slug) {
      return 'Your event slug will be a part of your domain'
    }

    return `Your event will be accessible at: ${slug}.obv.io`
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
      <Box mb={1}>
        <Controller
          control={control}
          name="is_online"
          defaultValue={event.is_online}
          render={({value, onChange}) => (
            <StyledSwitch
              label="Online"
              checked={value}
              onChange={onChangeCheckedHandler(onChange)}
              labelPlacement="top"
              color="primary"
              aria-label="is online"
            />
          )}
        />
      </Box>
      <TextField
        label="Event Name"
        name="name"
        required
        fullWidth
        defaultValue={event.name}
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
        defaultValue={event.slug}
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
        control={control}
        defaultValue={event.start}
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
            error={Boolean(errors.start)}
            helperText={errors.start}
          />
        )}
      />
      <Controller
        name="end"
        control={control}
        defaultValue={event.end}
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
            error={Boolean(errors.end)}
            helperText={errors.end}
          />
        )}
      />
      <TextField
        required
        label="Expected Number of Attendees"
        type="number"
        name="num_expected_attendees"
        defaultValue={event.num_expected_attendees}
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
          <Cropper width={32} height={32} />
          <Label>Favicon</Label>
          <Image alt="favicon" width={32} />
          <UploadButton
            inputProps={{
              'aria-label': 'favicon input',
            }}
          />
          <RemoveButton aria-label="remove favicon" />
        </ImageUpload>
      </Box>
      <ErrorMessage>{responseError && responseError.message}</ErrorMessage>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        size="large"
        disabled={submitting}
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

const StyledSwitch = styled(Switch)`
  margin: 0 0 0 -4px !important;
`
