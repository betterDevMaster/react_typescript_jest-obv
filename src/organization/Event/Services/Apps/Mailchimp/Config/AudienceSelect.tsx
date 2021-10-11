import React, {useCallback, useEffect, useState} from 'react'
import styled from 'styled-components'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {useAsync} from 'lib/async'
import {onUnknownChangeHandler} from 'lib/dom'
import {
  MailchimpIntegration,
  useMailchimp,
} from 'organization/Event/Services/Apps/Mailchimp/index'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import ConfirmDialog from 'lib/ui/ConfirmDialog'

export type Audience = {
  id: string
  name: string
}

export default function AudienceSelect() {
  const {audiences, loading} = useAudiences()
  const {error, setId} = useSetAudienceId()
  const {audience_id} = useMailchimp()
  const [selectedId, setSelectedId] = useState(audience_id || '')

  useEffect(() => {
    setSelectedId(audience_id || '')
  }, [audience_id])

  const handleConfirm = () => {
    setId(selectedId)
  }

  const handleSelect = (confirm: () => void) => (id: string) => {
    /**
     * If an audience has already been selected, let's show a confirmation dialog
     * to the user.
     */
    const hasExistingAudience = Boolean(audience_id)
    if (hasExistingAudience) {
      setSelectedId(id)
      confirm()
      return
    }

    setId(id)
  }

  return (
    <ConfirmDialog
      onConfirm={handleConfirm}
      description="Existing attendees that have been imported will remain in the system."
    >
      {(confirm) => (
        <FormControl fullWidth>
          <Label variant="outlined">Audience</Label>
          <Select
            disabled={loading}
            value={audience_id || ''}
            onChange={onUnknownChangeHandler(handleSelect(confirm))}
            fullWidth
            inputProps={{
              'aria-label': 'pick audience id',
            }}
            variant="outlined"
            error={Boolean(error)}
          >
            {audiences.map((audience) => (
              <MenuItem
                key={audience.id}
                value={audience.id}
                aria-label={`pick ${audience.name}`}
              >
                {audience.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(error)} hidden={!error}>
            {error}
          </FormHelperText>
        </FormControl>
      )}
    </ConfirmDialog>
  )
}

function useAudiences() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const request = useCallback(() => {
    return client.get<Audience[]>(
      api(`/events/${event.slug}/integrations/mailchimp/audiences`),
    )
  }, [client, event])

  const {data, loading} = useAsync(request)

  return {
    audiences: data || [],
    loading,
  }
}

function useSetAudienceId() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {update} = useServices()
  const [error, setError] = useState('')

  const setId = (id: string) =>
    client
      .put<MailchimpIntegration>(
        api(`/events/${event.slug}/integrations/mailchimp/audience_id`),
        {
          id,
        },
      )
      .then(update)
      .catch((e) => {
        setError(e.message)
      })

  return {error, setId}
}

const Label = styled(InputLabel)`
  background: #ffffff;
`
