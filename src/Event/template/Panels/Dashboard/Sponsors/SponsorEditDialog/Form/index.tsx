import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
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
import {useSponsors} from 'organization/Event/SponsorsProvider'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

export default function EditSponsorForm(props: {
  sponsor: Sponsor
  onDone: () => void
}) {
  const {register, handleSubmit, control, errors} = useForm()
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
      .then(() => remove(sponsor))
      .catch(() => {
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {form: errors, response: serverError})

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
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

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
