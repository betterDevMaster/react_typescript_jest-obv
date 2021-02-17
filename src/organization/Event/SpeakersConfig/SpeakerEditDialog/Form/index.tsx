import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useForm} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {Speaker} from 'Event'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/api-client'
import UploadedImage from 'organization/Event/SpeakersConfig/SpeakerEditDialog/Form/UploadedImage'
import {fetchFile} from 'lib/http-client'

const imageUploadId = 'speaker-image-upload'

export interface UpdateSpeakerData {
  name: string
  text?: string
}

export default function EditSpeakerForm(props: {
  speaker: Speaker | null
  onComplete: (speaker: Speaker) => void
  onRemove: () => void
}) {
  const {register, handleSubmit, watch, setValue, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState<null | File>(null)
  const {speaker} = props
  const {event} = useEvent()
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)

  useEffect(() => {
    if (!speaker) {
      return
    }

    setValue('name', speaker.name)
    setValue('text', speaker.text)

    if (speaker.image) {
      fetchFile(speaker.image.name, speaker.image.url)
        .then(setImage)
        .catch(() => {
          // ignore invalid image
        })
    }
  }, [speaker, setValue])

  const submit = (data: UpdateSpeakerData) => {
    if (!speaker) {
      throw new Error(
        'Missing speaker; was the speaker set as editing correctly?',
      )
    }

    setSubmitting(true)
    const formData = new FormData()
    if (image) {
      formData.set('image', image)
    }

    formData.set('name', data.name)

    if (data.text) {
      formData.set('text', data.text)
    }

    const url = api(`/events/${event.slug}/speaker_page/speaker/${speaker.id}`)

    client
      .post<Speaker>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then(props.onComplete)
      .catch(setServerError)
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    if (file) {
      setImage(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  if (!speaker) {
    return null
  }

  const remove = () => {
    setSubmitting(true)
    const url = api(`/events/${event.slug}/speaker_page/speaker/${speaker.id}`)

    client
      .delete<Speaker>(url)
      .then(props.onRemove)
      .finally(() => {
        setSubmitting(false)
      })
  }

  const setText = (_: any, editor: any) => {
    setValue('text', editor.getData())
  }

  const nameError = fieldError('name', {form: errors, server: serverError})

  return (
    <form onSubmit={handleSubmit(submit)}>
      <TextField
        name="name"
        label="Speaker Name"
        required
        fullWidth
        inputProps={{
          ref: register({required: 'Speaker Name is required.'}),
          'aria-label': 'speaker name',
        }}
        error={Boolean(nameError)}
        helperText={nameError}
      />
      <input
        type="hidden"
        name="text"
        aria-label="speaker text"
        ref={register}
      />
      <EditorContainer>
        <CKEditor
          editor={ClassicEditor}
          data={watch('text')}
          onChange={setText}
        />
      </EditorContainer>
      <ImageContainer>
        <UploadButton variant="outlined" color="primary">
          <UploadButtonLabel htmlFor={imageUploadId}>
            Upload Image
          </UploadButtonLabel>
        </UploadButton>
        <input
          id={imageUploadId}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          hidden
          aria-label="speaker image input"
        />
        <UploadedImage image={image} onRemove={removeImage} speaker={speaker} />
      </ImageContainer>
      <SaveButton
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        aria-label="save speaker"
        disabled={submitting}
      >
        SAVE
      </SaveButton>
      <RemoveButton
        fullWidth
        variant="outlined"
        aria-label="remove speaker"
        onClick={remove}
        disabled={submitting}
      >
        REMOVE
      </RemoveButton>
    </form>
  )
}

const UploadButton = withStyles({
  root: {
    padding: 0,
  },
})(Button)

const UploadButtonLabel = styled.label`
  padding: 5px 15px;
  cursor: pointer;
`

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

// CKEditor has a min-width, anything less will show blank whitespace
// with scroll. So we'll add a container to hide unneeded
// whitespace
const EditorContainer = styled.div`
  overflow-x: hidden;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`
