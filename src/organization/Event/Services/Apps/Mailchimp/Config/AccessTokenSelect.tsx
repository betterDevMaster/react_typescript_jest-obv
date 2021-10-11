import React, {useState} from 'react'
import styled from 'styled-components'
import {
  MailchimpIntegration,
  useMailchimp,
} from 'organization/Event/Services/Apps/Mailchimp/index'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import Select from '@material-ui/core/Select'
import {onUnknownChangeHandler, useIfMounted} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import {useAccessTokens} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'

export default function AccessTokenSelect() {
  const {tokens} = useAccessTokens()
  const {access_token_id} = useMailchimp()

  const {setToken, error, processing} = useSetAccessToken()

  return (
    <FormControl fullWidth>
      <Label variant="outlined">Access Token</Label>
      <Select
        disabled={processing}
        value={access_token_id || ''}
        onChange={onUnknownChangeHandler(setToken)}
        fullWidth
        inputProps={{
          'aria-label': 'pick access token',
        }}
        variant="outlined"
        error={Boolean(error)}
      >
        {tokens.map((token) => (
          <MenuItem
            key={token.id}
            value={token.id}
            aria-label={`pick ${token.value}`}
          >
            {token.value}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={Boolean(error)} hidden={!error}>
        {error}
      </FormHelperText>
    </FormControl>
  )
}

export function useSetAccessToken() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {update} = useServices()
  const [error, setError] = useState('')

  const ifMounted = useIfMounted()

  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const setToken = (id: number) => {
    if (processing) {
      return
    }

    toggleProcessing()

    client
      .put<MailchimpIntegration>(
        api(`/events/${event.slug}/integrations/mailchimp/access_token`),
        {
          id,
        },
      )
      .then(update)
      .catch((e) => {
        setError(e.message)
      })
      .finally(ifMounted(toggleProcessing))
  }

  return {setToken, error, processing}
}

const Label = styled(InputLabel)`
  background: #ffffff;
`
