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

export default function LoginFieldInput() {
  const infusionsoft = useInfusionsoft()
  const [field, setField] = useState('')
  const {save, isProcessing, error} = useSave()

  useEffect(() => {
    if (!infusionsoft.login_field_name) {
      return
    }

    setField(infusionsoft.login_field_name)
  }, [infusionsoft])

  const hasChanges = field !== infusionsoft.login_field_name
  const canSave = Boolean(field) && hasChanges && !isProcessing

  return (
    <TextField
      value={field}
      onChange={onChangeStringHandler(setField)}
      variant="outlined"
      label={label(infusionsoft.login_field_name)}
      fullWidth
      inputProps={{
        'aria-label': 'login field name',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save(field)}
              disabled={!canSave}
              color="primary"
              aria-label="save login field name"
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

  const save = (field: string) => () => {
    if (isProcessing) {
      return
    }
    setIsProcessing(true)
    setError(null)

    client
      .patch<InfusionsoftIntegration>(url, {
        field_name: field,
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
