import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import {Action, useActions} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'
import {onChangeCheckedHandler} from 'lib/dom'
import {fieldError} from 'lib/form'
import DangerButton from 'lib/ui/Button/DangerButton'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'
import {useForm, UseFormMethods} from 'react-hook-form'

export interface UpdateActionData {
  description: string
  points: number
  max_per_day: number | null
  max_per_event: number | null
  has_random_points: boolean
  random_min_points: number | null
  random_max_points: number | null
}

export default function Form(props: {
  action: Action | null
  onComplete: () => void
  className?: string
}) {
  const {action} = props
  const {register, handleSubmit, setValue, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {client} = useOrganization()
  const {event} = useEvent()
  const actions = useActions()
  const [serverError, setServerError] = useState<
    ValidationError<UpdateActionData>
  >(null)
  const [hasRandomPoints, setHasRandomPoints] = useState(false)
  const [hasMaxPerDay, setHasMaxPerDay] = useState(false)
  const [hasMaxPerEvent, setHasMaxPerEvent] = useState(false)

  useEffect(() => {
    if (!action) {
      return
    }

    setHasRandomPoints(action.has_random_points)
  }, [action])

  useEffect(() => {
    if (!action) {
      return
    }

    setHasMaxPerDay(Boolean(action.max_per_day))
    setHasMaxPerEvent(Boolean(action.max_per_event))
    setValue('description', action.description)
    setValue('points', action.points)
    setValue('max_per_day', action.max_per_day)
    setValue('max_per_event', action.max_per_event)
    setValue('random_min_points', action.random_min_points)
    setValue('random_max_points', action.random_max_points)
  }, [action, setValue, hasRandomPoints])

  if (!action) {
    return null
  }

  const submit = (input: UpdateActionData) => {
    const data: UpdateActionData = {
      ...input,
      max_per_day: hasMaxPerDay ? input.max_per_day : null,
      max_per_event: hasMaxPerEvent ? input.max_per_event : null,
      has_random_points: hasRandomPoints,
    }

    setSubmitting(true)

    const url = api(`/events/${event.slug}/actions/${action.key}`)
    client
      .patch<Action>(url, data)
      .then(actions.update)
      .catch(setServerError)
      .finally(() => {
        setSubmitting(false)
        props.onComplete()
      })
  }

  const remove = () => {
    const url = api(`/events/${event.slug}/actions/${action.key}`)
    client
      .delete<Action>(url)
      .then(() => {
        actions.remove(action)
      })
      .finally(() => {
        setSubmitting(false)
        props.onComplete()
      })
  }

  const descriptionError = fieldError('description', {
    form: errors,
    server: serverError,
  })

  const maxPerDayError = fieldError('max_per_day', {
    form: errors,
    server: serverError,
  })

  const maxPerEventError = fieldError('max_per_event', {
    form: errors,
    server: serverError,
  })

  return (
    <form onSubmit={handleSubmit(submit)} className={props.className}>
      <TextField
        name="description"
        label="Description"
        required
        fullWidth
        disabled={submitting}
        inputProps={{
          ref: register({
            required: 'Description is required',
          }),
          'aria-label': 'action description',
        }}
        error={Boolean(descriptionError)}
        helperText={descriptionError}
      />
      <FormControl component="fieldset" fullWidth disabled={submitting}>
        <FormControlLabel
          control={
            <Switch
              checked={hasRandomPoints}
              onChange={onChangeCheckedHandler(setHasRandomPoints)}
              color="primary"
              inputProps={{
                'aria-label': 'toggle has random points',
              }}
            />
          }
          label="Randomize points?"
        />
      </FormControl>
      <Points
        hasRandomPoints={hasRandomPoints}
        register={register}
        submitting={submitting}
        errors={errors}
        serverError={serverError}
      />
      <FormControl component="fieldset" fullWidth disabled={submitting}>
        <FormControlLabel
          control={
            <Switch
              checked={hasMaxPerDay}
              onChange={onChangeCheckedHandler(setHasMaxPerDay)}
              color="primary"
              inputProps={{
                'aria-label': 'toggle has max per day',
              }}
            />
          }
          label="Limit per day?"
        />
      </FormControl>
      <TextField
        name="max_per_day"
        label="Max per Day"
        fullWidth
        type="number"
        inputProps={{
          ref: register,
          'aria-label': 'action max per day',
          min: 0,
        }}
        error={Boolean(maxPerDayError)}
        helperText={maxPerDayError}
        disabled={!hasMaxPerDay || submitting}
      />
      <FormControl component="fieldset" fullWidth disabled={submitting}>
        <FormControlLabel
          control={
            <Switch
              checked={hasMaxPerEvent}
              onChange={onChangeCheckedHandler(setHasMaxPerEvent)}
              color="primary"
              inputProps={{
                'aria-label': 'toggle has max per event',
              }}
            />
          }
          label="Limit for event?"
        />
      </FormControl>
      <TextField
        name="max_per_event"
        label="Max per Event"
        fullWidth
        type="number"
        inputProps={{
          ref: register,
          'aria-label': 'action max per event',
          min: 0,
        }}
        error={Boolean(maxPerEventError)}
        helperText={maxPerEventError}
        disabled={!hasMaxPerEvent || submitting}
      />
      <div>
        <SaveButton
          variant="contained"
          color="primary"
          fullWidth
          disabled={submitting}
          type="submit"
          aria-label="save action"
        >
          Save
        </SaveButton>
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove action"
          onClick={remove}
          disabled={submitting}
        >
          REMOVE
        </DangerButton>
      </div>
    </form>
  )
}

function Points(props: {
  submitting: boolean
  register: UseFormMethods['register']
  errors: Record<string, string>
  serverError: ValidationError<UpdateActionData>
  hasRandomPoints: boolean
}) {
  const error = (field: keyof UpdateActionData) =>
    fieldError(field, {
      form: props.errors,
      server: props.serverError,
    })

  const pointsError = error('points')
  const randomMinPointsError = error('random_min_points')
  const randomMaxPointsError = error('random_max_points')

  return (
    <>
      <div hidden={!props.hasRandomPoints}>
        <TextField
          name="random_min_points"
          label="Min Points"
          fullWidth
          type="number"
          disabled={props.submitting}
          inputProps={{
            ref: props.register,
            'aria-label': 'min action points',
          }}
          error={Boolean(randomMinPointsError)}
          helperText={randomMinPointsError}
        />
        <TextField
          name="random_max_points"
          label="Max Points"
          fullWidth
          type="number"
          disabled={props.submitting}
          inputProps={{
            ref: props.register,
            'aria-label': 'max action points',
          }}
          error={Boolean(randomMaxPointsError)}
          helperText={randomMaxPointsError}
        />
      </div>

      <div hidden={props.hasRandomPoints}>
        <TextField
          name="points"
          label="Points"
          required
          fullWidth
          type="number"
          disabled={props.submitting}
          inputProps={{
            ref: props.register({
              required: 'Points is required',
            }),
            'aria-label': 'action points',
          }}
          error={Boolean(pointsError)}
          helperText={pointsError}
        />
      </div>
    </>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
