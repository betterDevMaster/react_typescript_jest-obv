import {TextField} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import {useEvent} from 'Event/EventProvider'
import {onChangeStringHandler, useIsMounted} from 'lib/dom'
import {api} from 'lib/url'
import {InfusionsoftIntegration} from 'organization/Event/Services/Apps/Infusionsoft'
import {
  useInfusionsoft,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'

export default function LoginFieldIdInput() {
  const infusionsoft = useInfusionsoft()
  const [id, setId] = useState('')
  const {save, isProcessing, error} = useSave()

  useEffect(() => {
    setId(
      infusionsoft.login_field_id ? String(infusionsoft.login_field_id) : '',
    )
  }, [infusionsoft])

  const hasChanges = id !== String(infusionsoft.login_field_id)
  const canSave = Boolean(id) && hasChanges && !isProcessing

  return (
    <TextField
      value={id}
      onChange={onChangeStringHandler(setId)}
      variant="outlined"
      label={label(infusionsoft.login_field_name)}
      fullWidth
      inputProps={{
        'aria-label': 'login field id',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save(id)}
              disabled={!canSave}
              color="primary"
              aria-label="save login field id"
            >
              Save
            </Button>
          </InputAdornment>
        ),
      }}
      error={!!error}
      helperText={error}
    />
  )
}

function label(name: string | null) {
  const field = 'Login Token Custom Field'

  return Boolean(name) ? `${field} - ${name}` : field
}

function useSave() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/integrations/infusionsoft/login_field`)
  const {updateIntegration} = useServices()
  const [isProcessing, setIsProcessing] = useState(false)
  const isMounted = useIsMounted()

  const [error, setError] = useState<string | null>(null)

  const save = (id: string) => () => {
    if (isProcessing) {
      return
    }
    setIsProcessing(true)
    setError(null)

    client
      .patch<InfusionsoftIntegration>(url, {
        id,
      })
      .then(updateIntegration)
      .catch((e) => setError(e.message))
      .finally(() => {
        if (isMounted.current) {
          setIsProcessing(false)
        }
      })
  }

  return {save, isProcessing, error}
}
