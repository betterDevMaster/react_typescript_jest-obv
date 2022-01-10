import React, {useState} from 'react'
import styled from 'styled-components'
import {Controller, useForm} from 'react-hook-form'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'

import {Sponsor} from 'Event/SponsorPage'
import Buttons, {
  useButtons,
} from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog/Form/Buttons'
import ButtonConfig from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog/Form/ButtonConfig'
import NavButton from 'Event/Dashboard/components/NavButton'

import {api} from 'lib/url'
import TextEditor from 'lib/ui/form/TextEditor'
import DangerButton from 'lib/ui/Button/DangerButton'
import {ValidationError} from 'lib/ui/api-client'
import {fieldError} from 'lib/form'
import {spacing} from 'lib/ui/theme'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Label from 'lib/ui/form/ImageUpload/Label'
import ImageUpload from 'lib/ui/form/ImageUpload'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'
import {useFileSelect} from 'lib/ui/form/file'
import {EntityList} from 'lib/list'

import {useOrganization} from 'organization/OrganizationProvider'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'

export interface UpdateSponsorData {
  name: string
  description?: string
  settings: null | {
    buttons?: EntityList<NavButton>
  }
}

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

  const {register, handleSubmit, control, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {sponsor} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const {update, remove} = useSponsors()
  const image = useFileSelect(sponsor?.image)

  const createFormData = (image: File, form: UpdateSponsorData) => {
    const formData = new FormData()
    for (let [key, value] of Object.entries(form)) {
      if (value === null || value === undefined) {
        continue
      }

      formData.set(key, String(value))
    }

    formData.set('image', image)

    return formData
  }

  const data = (form: UpdateSponsorData) => {
    if (image.selected) {
      return createFormData(image.selected, form)
    }

    if (image.wasRemoved) {
      return {
        ...form,
        image: null,
      }
    }

    return form
  }

  const submit = (form: Sponsor) => {
    if (!sponsor) {
      throw new Error(
        'Missing sponsor; was the sponsor set as editing correctly?',
      )
    }

    setSubmitting(true)

    const url = api(`/sponsors/${sponsor.id}`)
    let formData = data(form)
    formData = {
      ...formData,
      settings: {buttons},
    }

    client
      .put<Sponsor>(url, formData)
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

  const descriptionError = fieldError('description', {
    form: errors,
    response: serverError,
  })
  const nameError = fieldError('name', {form: errors, response: serverError})

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
          defaultValue={sponsor.name}
          inputProps={{
            ref: register({required: 'Sponsor Name is required.'}),
            'aria-label': 'sponsor name',
          }}
          error={Boolean(nameError)}
          helperText={nameError}
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
        <ImageContainer>
          <ImageUpload file={image} disabled={submitting}>
            <Cropper width={300} height={100} canResize />
            <Label>Logo</Label>
            <Image alt="favicon" width={100} />
            <UploadButton
              inputProps={{
                'aria-label': 'sponsor image input',
              }}
            />
            <RemoveImageButton aria-label="remove sponsor image" />
          </ImageUpload>
        </ImageContainer>
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
            loading={loadingButtons}
            duplicate={duplicateButton}
          />
        </Box>
        <ErrorContext>{descriptionError}</ErrorContext>
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
  button: NavButton | null
  onClose: () => void
  onChange: (button: NavButton) => void
  onRemove: () => void
}) {
  if (!props.button) {
    return null
  }

  return <ButtonConfig {...props} button={props.button} />
}

function ErrorContext(props: {children?: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
