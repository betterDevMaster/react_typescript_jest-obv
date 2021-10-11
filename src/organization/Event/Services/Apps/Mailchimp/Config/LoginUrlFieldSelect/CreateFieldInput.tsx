import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {onChangeStringHandler} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {
  Field,
  useSetLoginField,
} from 'organization/Event/Services/Apps/Mailchimp/Config/LoginUrlFieldSelect/LoginUrlFieldSelect'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useState, useEffect} from 'react'

export default function NewFieldInput(props: {
  showing: boolean
  onClose: () => void
  onAdd: (field: Field) => void
}) {
  const {onClose, showing, onAdd} = props
  const [name, setName] = useState('')
  const create = useCreateField()
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const setField = useSetLoginField()
  const [error, setError] = useState('')

  useEffect(() => {
    if (showing) {
      return
    }

    // reset input
    setName('')

    if (processing) {
      toggleProcessing()
    }
  }, [showing, processing, toggleProcessing])

  const save = () => {
    if (processing) {
      return
    }

    setError('')
    toggleProcessing()

    create(name)
      .then((field) => {
        setField(field.id).then(() => onAdd(field))
      })
      .catch((e) => {
        setError(e.message)
        toggleProcessing()
      })
  }

  const canSave = !processing && Boolean(name)

  if (!showing) {
    return null
  }

  return (
    <>
      <TextField
        value={name}
        onChange={onChangeStringHandler(setName)}
        label="New Login Field"
        variant="outlined"
        fullWidth
        inputProps={{
          'aria-label': 'new field name',
          maxLength: 100, // mailchimp limit
        }}
        disabled={processing}
        error={Boolean(error)}
        helperText={error}
      />
      <div>
        <SaveButton
          onClick={save}
          disabled={!canSave}
          color="primary"
          aria-label="save field"
          variant="contained"
        >
          Save
        </SaveButton>
        <Button
          onClick={onClose}
          disabled={processing}
          aria-label="cancel create feild"
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

function useCreateField() {
  const {client} = useOrganization()
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/integrations/mailchimp/fields`)
  return (name: string) => client.post<Field>(url, {name})
}

const SaveButton = styled(Button)`
  margin-right: ${(props) => props.theme.spacing[2]};
`
