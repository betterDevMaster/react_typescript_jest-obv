import React from 'react'
import styled from 'styled-components'
import {FormHelperText} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {useValidatedForm} from 'lib/form'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {
  AVAILABLE_WEBHOOK_EVENTS,
  useWebhooks,
  WebhookFormData,
} from 'organization/Event/WebhooksProvider'
import {Controller} from 'react-hook-form'
import {onChangeCheckedHandler, onUnknownChangeHandler} from 'lib/dom'
import {useEffect} from 'react'

export default function WebhookForm() {
  const {generateSalt, saveWebhook, submitting} = useWebhooks()
  const {event, set: setEvent} = useEvent()

  const {
    errors,
    clearErrors,
    handleSubmit,
    responseError,
    setResponseError,
    register,
    control,
    watch,
    reset: resetForm,
  } = useValidatedForm<WebhookFormData>()

  const isDisabled = submitting || !event.webhook_access_token_id

  const requiresCrc = watch('requires_crc')

  const submit = (data: WebhookFormData) => {
    clearErrors()

    saveWebhook(data)
      .then(() => resetForm())
      .catch(setResponseError)
  }

  // If user is asking for a CRC checksum on the webhook, we'll make sure that
  // there is a salt already generated. If no salt exists yet, we'll be kind
  // enough and generate one for them, so they don't have to know/remember to do
  // it themselves.
  useEffect(() => {
    if (!requiresCrc) {
      return
    }

    if (event.has_webhook_crc_salt) {
      return
    }

    generateSalt().then(() => {
      setEvent({
        ...event,
        has_webhook_crc_salt: true,
      })
    })
  }, [requiresCrc, event, generateSalt, setEvent])

  return (
    <>
      <ErrorAlert>{responseError?.message}</ErrorAlert>

      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <InputLabel error={Boolean(errors.webhook_event)} shrink>
              Webhook Action
            </InputLabel>
            <Controller
              name="webhook_event"
              defaultValue=""
              control={control}
              render={({value, onChange}) => (
                <Select
                  value={value}
                  disabled={isDisabled}
                  error={Boolean(errors.webhook_event)}
                  fullWidth
                  inputProps={{
                    'aria-label': 'webhook event',
                  }}
                  label="Webhook Action"
                  onChange={onUnknownChangeHandler(onChange)}
                >
                  {AVAILABLE_WEBHOOK_EVENTS.map((event, key) => (
                    <MenuItem
                      aria-label={`webhook event ${event}`}
                      key={key}
                      value={event}
                    >
                      {event}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            <FormHelperText error>{errors.webhook_event}</FormHelperText>
          </Grid>

          <Grid item xs={12} sm={7}>
            <TextField
              disabled={isDisabled}
              error={Boolean(errors.url)}
              fullWidth
              helperText={
                errors.url ||
                'If different from the Event Webhook URL, Including https://, Must accept an HTTP POST request'
              }
              inputProps={{
                'aria-label': 'webhook url',
                ref: register,
              }}
              label="Webhook URL"
              name="url"
            />
          </Grid>

          <Grid item xs={12} sm={1}>
            <InputLabel shrink>CRC</InputLabel>
            <Controller
              name="requires_crc"
              defaultValue={false}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  color="primary"
                  disabled={isDisabled}
                  inputProps={{
                    'aria-label': 'toggle webhook crc enabled',
                  }}
                  onChange={onChangeCheckedHandler(onChange)}
                />
              )}
            />
          </Grid>

          <Grid item xs={2} sm={1}>
            <StyledAddButton
              aria-label="save webhook"
              color="primary"
              disabled={isDisabled}
              fullWidth
              type="submit"
              variant="outlined"
            >
              Add
            </StyledAddButton>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

const StyledAddButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[3]}!important;
`
