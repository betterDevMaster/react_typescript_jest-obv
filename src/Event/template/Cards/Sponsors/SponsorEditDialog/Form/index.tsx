import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import TextEditor from 'lib/ui/form/TextEditor'
import Button from '@material-ui/core/Button'
import DangerButton from 'lib/ui/Button/DangerButton'
import {ValidationError} from 'lib/ui/api-client'
import {fieldError} from 'lib/form'
import Box from '@material-ui/core/Box'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Buttons, {
  useButtons,
} from 'Event/template/Cards/Sponsors/SponsorEditDialog/Form/Buttons'
import ButtonConfig from 'Event/template/Cards/Sponsors/SponsorEditDialog/Form/ButtonConfig'
import TextField from '@material-ui/core/TextField'
import {NavButtonProps} from 'Event/Dashboard/components/NavButton'

export default function EditSponsorForm(props: {
  sponsor: Sponsor
  onDone: () => void
}) {
  const {
    buttons,
    loading: loadingButtons,
    add: addButton,
    edit: editButton,
    duplicate: duplicateButton,
    editing: editingButton,
    update: updateButton,
    stopEdit: stopEditingButton,
    remove: removeButton,
  } = useButtons(props.sponsor)

  const {handleSubmit, register, control, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {sponsor} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const {update, remove} = useSponsors()

  const submit = (data: Sponsor) => {
    setSubmitting(true)

    const sponsorData: Sponsor = {
      ...data,
      settings: {
        ...(data.settings || {}),
        buttons,
      },
    }

    const url = api(`/sponsors/${sponsor.id}`)

    client
      .put<Sponsor>(url, sponsorData)
      .then((sponsor) => {
        update(sponsor)
        props.onDone()
      })
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  const handleRemove = () => {
    setSubmitting(true)
    const url = api(`/sponsors/${sponsor.id}`)

    client
      .delete<Sponsor>(url)
      .then(() => {
        remove(sponsor)
        props.onDone()
      })
      .catch(() => {
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {
    form: errors,
    response: serverError,
  })

  return (
    <>
      <ButtonEditFields
        button={editingButton}
        onClose={stopEditingButton}
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
        <Controller
          name="form_id"
          control={control}
          defaultValue={sponsor.form?.id || null}
          render={({onChange, value}) => (
            <FormControl fullWidth>
              <InputLabel filled={Boolean(value)}>Form</InputLabel>
              <FormSelect value={value} onChange={onChange} />
            </FormControl>
          )}
        />
        <Box mb={3}>
          <Buttons
            buttons={buttons}
            onAdd={addButton}
            edit={editButton}
            duplicate={duplicateButton}
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
          onClick={handleRemove}
          disabled={submitting}
        >
          REMOVE
        </RemoveButton>
      </form>
    </>
  )
}

function ButtonEditFields(props: {
  button: NavButtonProps | null
  onClose: () => void
  onChange: (button: NavButtonProps) => void
  onRemove: () => void
}) {
  if (!props.button) {
    return null
  }

  return <ButtonConfig {...props} button={props.button} />
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
