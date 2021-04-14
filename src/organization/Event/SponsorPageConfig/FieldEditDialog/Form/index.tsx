import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import TextEditor from 'lib/ui/form/TextEditor'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DangerButton from 'lib/ui/Button/DangerButton'
import {ValidationError} from 'lib/api-client'
import {fieldError} from 'lib/form'
import Box from '@material-ui/core/Box'
import Buttons, {
  useButtons,
} from 'organization/Event/SponsorPageConfig/FieldEditDialog/Form/Buttons'
import ButtonConfig from 'organization/Event/SponsorPageConfig/FieldEditDialog/Form/ButtonConfig'

export default function EditSponsorForm(props: {
  sponsor: Sponsor
  onUpdate: (sponsor: Sponsor) => void
  onRemove: (sponsor: Sponsor) => void
}) {
  const {register, handleSubmit, control, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {sponsor} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)

  const {
    buttons,
    loading: loadingButtons,
    add: addButton,
    edit: editButton,
    editing: editingButton,
    update: updateButton,
    stopEdit: stopEditingButton,
    remove: removeButton,
  } = useButtons(props.sponsor)

  const submit = (data: Sponsor) => {
    setSubmitting(true)

    const dataWithButtons = {
      ...data,
      buttons,
    }

    const url = api(`/sponsors/${sponsor.id}`)

    client
      .put<Sponsor>(url, dataWithButtons)
      .then(props.onUpdate)
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  const remove = () => {
    setSubmitting(true)
    const url = api(`/sponsors/${sponsor.id}`)

    client
      .delete<Sponsor>(url)
      .then(() => props.onRemove(sponsor))
      .catch(() => {
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {form: errors, response: serverError})

  return (
    <>
      <ButtonConfig
        onClose={stopEditingButton}
        button={editingButton}
        onChange={updateButton}
        onRemove={removeButton}
      />
      <form onSubmit={handleSubmit(submit)} hidden={Boolean(editingButton)}>
        <TextField
          name="name"
          label="Sponsor Name"
          required
          fullWidth
          inputProps={{
            ref: register({required: 'Sponsor Name is required.'}),
            'aria-label': 'sponsor name',
          }}
          error={Boolean(nameError)}
          helperText={nameError}
          defaultValue={sponsor.name}
        />
        <Box mb={3}>
          <Controller
            name="description"
            control={control}
            defaultValue={sponsor.description || ''}
            render={({onChange, value}) => (
              <TextEditor data={value} onChange={onChange} />
            )}
          />
        </Box>
        <Box mb={3}>
          <Buttons
            buttons={buttons}
            onAdd={addButton}
            edit={editButton}
            loading={loadingButtons}
          />
        </Box>
        <SaveButton
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          aria-label="save sponsor"
          disabled={submitting}
        >
          SAVE
        </SaveButton>
        <RemoveButton
          fullWidth
          variant="outlined"
          aria-label="remove sponsor"
          onClick={remove}
          disabled={submitting}
        >
          REMOVE
        </RemoveButton>
      </form>
    </>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
