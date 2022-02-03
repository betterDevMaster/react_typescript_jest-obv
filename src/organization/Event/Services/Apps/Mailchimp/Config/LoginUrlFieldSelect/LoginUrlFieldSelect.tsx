import React, {useCallback, useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {onUnknownChangeHandler, useIfMounted} from 'lib/dom'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import {
  MailchimpIntegration,
  useMailchimp,
} from 'organization/Event/Services/Apps/Mailchimp/index'
import {useAsync} from 'lib/async'
import {useToggle} from 'lib/toggle'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button, {ButtonProps} from '@material-ui/core/Button'
import CreateFieldInput from 'organization/Event/Services/Apps/Mailchimp/Config/LoginUrlFieldSelect/CreateFieldInput'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

export type Field = {
  id: string
  name: string
}

export default function LoginUrlFieldSelect() {
  const [error, setError] = useState('')
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const [fields, setFields] = useState<Field[]>([])

  const {fields: saved, loading} = useFields()
  const {login_url_field_id} = useMailchimp()
  const setLoginField = useSetLoginField()
  const {flag: showingNewFieldInput, toggle: toggleNewFieldInput} = useToggle()
  const ifMounted = useIfMounted()

  useEffect(() => {
    setFields(saved)
  }, [saved])

  const addField = (field: Field) => {
    setFields((current) => [...current, field])
  }

  const handleNewField = (field: Field) => {
    addField(field)
    toggleNewFieldInput()
  }

  const handleSelectedField = (id: Field['id']) => {
    if (processing) {
      return
    }

    toggleProcessing()
    setError('')

    setLoginField(id)
      .catch((e) => {
        setError(e.message)
      })
      .finally(ifMounted(toggleProcessing))
  }

  const canSelect = !processing && !loading

  return (
    <Box mb={4}>
      <ExistingFieldSelect showing={!showingNewFieldInput}>
        <FormControl fullWidth>
          <Label variant="outlined">Login URL Field</Label>
          <Select
            disabled={!canSelect}
            value={login_url_field_id || ''}
            onChange={onUnknownChangeHandler(handleSelectedField)}
            fullWidth
            inputProps={{
              'aria-label': 'pick login field',
            }}
            variant="outlined"
            error={Boolean(error)}
          >
            {fields.map((field) => (
              <MenuItem
                key={field.id}
                value={field.id}
                aria-label={`pick ${field.name}`}
              >
                {field.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormHelperText error={Boolean(error)} hidden={!error}>
          {error}
        </FormHelperText>
      </ExistingFieldSelect>
      <CreateFieldInput
        showing={showingNewFieldInput}
        onClose={toggleNewFieldInput}
        onAdd={ifMounted(handleNewField)}
      />
      <CreateFieldButton
        showing={!showingNewFieldInput}
        onClick={toggleNewFieldInput}
        aria-label="create new field"
        color="primary"
        variant="outlined"
        disabled={!canSelect}
      >
        Create New Field
      </CreateFieldButton>
    </Box>
  )
}

function useFields() {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()

  const request = useCallback(() => {
    return client.get<Field[]>(
      api(`/events/${slug}/integrations/mailchimp/fields`),
    )
  }, [client, slug])

  const {data, loading} = useAsync(request)

  const fields = useMemo(() => data || [], [data])

  return {
    fields,
    loading,
  }
}

export function useSetLoginField() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {update} = useServices()

  const url = api(`/events/${event.slug}/integrations/mailchimp/login_field`)
  return (id: string) =>
    client
      .put<MailchimpIntegration>(url, {id})
      .then(update)
}

const CreateFieldButton = styled((props: {showing: boolean} & ButtonProps) => {
  const {showing: _, ...otherProps} = props
  return <Button {...otherProps} />
})`
  display: ${(props) => (props.showing ? 'inline-flex' : 'none')};
`

const ExistingFieldSelect = styled.div<{showing: boolean}>`
  display: ${(props) => (props.showing ? 'block' : 'none')};
`

const Label = styled(InputLabel)`
  background: #ffffff;
`
