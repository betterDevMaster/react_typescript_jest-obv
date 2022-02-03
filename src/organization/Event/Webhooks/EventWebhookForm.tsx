import React, {useEffect} from 'react'
import {Controller} from 'react-hook-form'
import styled from 'styled-components'
import {FormHelperText} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import {useEvent} from 'Event/EventProvider'
import {onUnknownChangeHandler} from 'lib/dom'
import {useValidatedForm} from 'lib/form'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {
  AccessToken,
  useAccessTokens,
} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'
import {
  EventWebhookFormData,
  useWebhooks,
} from 'organization/Event/WebhooksProvider'
import SaltOverlay from 'organization/Event/Webhooks/SaltOverlay'
import {useHistory} from 'react-router'

/**
 * We want to trigger a nav to the access token page
 * if the user selects this value in the select.
 */
const CREATE_NEW_ACCESS_TOKEN_OPTION_VALUE = 0

export default function EventWebhookForm() {
  const routes = useEventRoutes()
  const {event, set: setEvent} = useEvent()
  const {
    control,
    errors,
    handleSubmit,
    register,
    responseError,
    clearErrors,
    setResponseError,
    watch,
  } = useValidatedForm<EventWebhookFormData>()
  const history = useHistory()
  const {generateSalt, salt, saveEventWebhook, submitting} = useWebhooks()

  const {tokens: accessTokens} = useAccessTokens()

  const submit = (form: EventWebhookFormData) => {
    clearErrors()
    saveEventWebhook(form).catch(setResponseError)
  }

  const clickGenerateSalt = () => {
    generateSalt().then(() => {
      setEvent({
        ...event,
        has_webhook_crc_salt: true,
      })
    })
  }

  const accessTokenId = watch('webhook_access_token_id')

  const saltStateText = event.has_webhook_crc_salt ? 'has' : 'does not have'
  const saltOverlayOpen = salt !== ''

  const copyTokenToClipboard = () => {
    const accessToken = accessTokens.filter((token: AccessToken) => {
      return token.id === accessTokenId
    })

    if (accessToken) {
      navigator.clipboard.writeText(accessToken[0].value as string)
    }
  }

  // Handle nav when user selects 'Create New Access Token'
  useEffect(() => {
    if (accessTokenId !== CREATE_NEW_ACCESS_TOKEN_OPTION_VALUE) {
      return
    }

    history.push(`${routes.services.root}?activeTab=accessTokens`)
  }, [accessTokenId, history, routes])

  return (
    <>
      <SaltOverlay open={saltOverlayOpen} salt={salt} />
      <ErrorAlert>{responseError?.message}</ErrorAlert>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          defaultValue={event.webhook_url}
          disabled={submitting}
          error={Boolean(errors.webhook_url)}
          fullWidth
          helperText={
            errors.webhook_url ||
            'Including https://, Must accept an HTTP POST request'
          }
          inputProps={{
            ref: register(),
            'aria-label': 'webhook event url',
          }}
          label="Event Webhook URL"
          name="webhook_url"
        />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={8}>
            <InputLabel error={Boolean(errors.webhook_access_token_id)} shrink>
              Access Token
            </InputLabel>
            <FullGrid container spacing={0}>
              <FullGrid item>
                <Controller
                  control={control}
                  defaultValue={event.webhook_access_token_id || ''}
                  error={Boolean(errors.webhook_access_token_id)}
                  name="webhook_access_token_id"
                  render={({value, onChange}) => (
                    <Select
                      disabled={submitting}
                      error={Boolean(errors.webhook_access_token_id)}
                      fullWidth
                      inputProps={{
                        'aria-label': 'webhook access token selector',
                      }}
                      label="Access Token"
                      onChange={onUnknownChangeHandler(onChange)}
                      value={value}
                    >
                      {accessTokens.map((token) => (
                        <MenuItem
                          key={token.id}
                          value={token.id}
                          aria-label={`webhook access token ${token.value}`}
                        >
                          {token.value}
                        </MenuItem>
                      ))}
                      <MenuItem
                        value={CREATE_NEW_ACCESS_TOKEN_OPTION_VALUE}
                        aria-label="webhook generate access token"
                      >
                        Generate New Token
                      </MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText error={Boolean(errors.webhook_access_token_id)}>
                  <AccessTokenHelperText>
                    {errors.webhook_access_token_id}
                  </AccessTokenHelperText>
                </FormHelperText>
              </FullGrid>
              <Grid item>
                <IconButton
                  aria-label="copy access token"
                  onClick={copyTokenToClipboard}
                  title="Copy Access Token to your clipboard"
                >
                  <FileCopyIcon />
                </IconButton>
              </Grid>
            </FullGrid>
          </Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel shrink>CRC Salt (Optional)</InputLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={event.has_webhook_crc_salt || false}
                  inputProps={{
                    'aria-label': 'webhook crc salt indicator',
                  }}
                />
              }
              label={`Event ${saltStateText} a CRC salt generated`}
            />
          </Grid>
        </Grid>
        <Box mt={2} mb={4}>
          <StyledSaveButton
            aria-label="save webhook event"
            color="primary"
            disabled={submitting}
            type="submit"
            variant="contained"
          >
            Save
          </StyledSaveButton>

          <GenerateSaltButton
            disabled={submitting}
            onClick={clickGenerateSalt}
          />
        </Box>
      </form>
    </>
  )
}

function GenerateSaltButton(props: {disabled: boolean; onClick: () => void}) {
  const {onClick} = props
  const {event} = useEvent()

  const generateText = event.has_webhook_crc_salt === true ? 'Re-' : ''

  return (
    <Button
      aria-label="generate salt"
      color="primary"
      disabled={props.disabled}
      onClick={onClick}
      variant="outlined"
    >
      {`${generateText}Generate CRC Salt`}
    </Button>
  )
}

function AccessTokenHelperText(props: {children?: string}) {
  if (props.children) {
    return <>{props.children}</>
  }

  // Default helper text
  return (
    <>
      The selected token will be used in the request header -{' '}
      <code>Authorization: Bearer ...</code>
    </>
  )
}

const StyledSaveButton = styled(Button)`
  margin-right: ${(props) => props.theme.spacing[4]}!important;
`
const FullGrid = styled(Grid)`
  flex-grow: 1;
`
