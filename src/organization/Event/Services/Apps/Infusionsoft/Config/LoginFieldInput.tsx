import TextField from '@material-ui/core/TextField'
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
    if (!infusionsoft.login_field_label) {
      return
    }

    setField(infusionsoft.login_field_label)
  }, [infusionsoft])

  const hasChanges = field !== infusionsoft.login_field_label
  const canSave = Boolean(field) && hasChanges && !isProcessing

  return (
    <TextField
      value={field}
      onChange={onChangeStringHandler(setField)}
      variant="outlined"
      label="Login Token Custom Field"
      disabled={isProcessing}
      fullWidth
      inputProps={{
        'aria-label': 'login field label',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save(field)}
              disabled={!canSave}
              color="primary"
              aria-label="save login field label"
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

function useSave() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/integrations/infusionsoft/login_field`)
  const {update: updateIntegration} = useServices()
  const [isProcessing, setIsProcessing] = useState(false)
  const isMounted = useIsMounted()

  const [error, setError] = useState<string | null>(null)

  const save = (label: string) => () => {
    if (isProcessing) {
      return
    }
    setIsProcessing(true)
    setError(null)

    client
      .patch<InfusionsoftIntegration>(url, {
        label,
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
