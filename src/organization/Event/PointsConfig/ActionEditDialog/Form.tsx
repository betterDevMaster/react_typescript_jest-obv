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
import {useForm} from 'react-hook-form'

export interface UpdateActionData {
  description: string
  points: number
  max_per_day: number | null
  max_per_event: number | null
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
  const {custom} = useActions()
  const [serverError, setServerError] = useState<
    ValidationError<UpdateActionData>
  >(null)
  const [hasMaxPerDay, setHasMaxPerDay] = useState(false)
  const [hasMaxPerEvent, setHasMaxPerEvent] = useState(false)

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
  }, [action, setValue])

  if (!action) {
    return null
  }

  const submit = (input: UpdateActionData) => {
    const data: UpdateActionData = {
      ...input,
      max_per_day: hasMaxPerDay ? input.max_per_day : null,
      max_per_event: hasMaxPerEvent ? input.max_per_event : null,
    }

    setSubmitting(true)

    const url = api(`/events/${event.slug}/actions/${action.id}`)
    client
      .patch<Action>(url, data)
      .then(custom.update)
      .catch(setServerError)
      .finally(() => {
        setSubmitting(false)
        props.onComplete()
      })
  }

  const remove = () => {
    const url = api(`/events/${event.slug}/actions/${action.id}`)
    client
      .delete<Action>(url)
      .then(() => {
        custom.remove(action)
      })
      .finally(() => {
        setSubmitting(false)
        props.onComplete()
      })
  }

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
        error={fieldError('description', {form: errors, server: serverError})}
      />
      <TextField
        name="points"
        label="Points"
        required
        fullWidth
        type="number"
        disabled={submitting}
        inputProps={{
          ref: register({
            required: 'Points is required',
          }),
          'aria-label': 'action points',
        }}
        error={fieldError('points', {form: errors, server: serverError})}
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
        error={fieldError('max_per_day', {form: errors, server: serverError})}
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
        error={fieldError('max_per_event', {form: errors, server: serverError})}
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

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
