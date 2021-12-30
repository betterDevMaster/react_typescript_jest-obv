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
} from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog/Form/Buttons'
import ButtonConfig from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog/Form/ButtonConfig'
import NavButton from 'Event/Dashboard/components/NavButton'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Label from 'lib/ui/form/ImageUpload/Label'
import ImageUpload from 'lib/ui/form/ImageUpload'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'
import {useFileSelect} from 'lib/ui/form/file'

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

  const {handleSubmit, control, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {sponsor} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const {update, remove} = useSponsors()
  const image = useFileSelect(sponsor?.image)

  const imgData = () => {
    if (image.selected) {
      let formData = new FormData()
      formData.set('image', image.selected)
      return formData
    }

    if (image.wasRemoved) {
      return {
        image: null,
      }
    }

    return {}
  }

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

    client
      .put<Sponsor>(url, imgData())
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

  return (
    <>
      <ButtonEditFields
        button={editingButton}
        onClose={stopEditingButton}
        onChange={updateButton}
        onRemove={removeButton}
      />
      <form onSubmit={handleSubmit(submit)} hidden={Boolean(editingButton)}>
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
        <Error>{descriptionError}</Error>
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

function Error(props: {children?: string | null}) {
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