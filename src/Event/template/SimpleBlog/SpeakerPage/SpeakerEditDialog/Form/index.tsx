import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useForm} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/api-client'
import {fetchFile} from 'lib/http-client'
import UploadedImage from 'Event/template/SimpleBlog/SpeakerPage/SpeakerEditDialog/Form/UploadedImage'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {Speaker} from 'Event/SpeakerPage'
import {useSpeakers} from 'organization/Event/SpeakersProvider'

const imageUploadId = 'speaker-image-upload'

export interface UpdateSpeakerData {
  name: string
  text?: string
}

export default function EditSpeakerForm(props: {
  speaker: Speaker | null
  onDone: () => void
}) {
  const {register, handleSubmit, watch, setValue, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [image, setImage] = useState<null | File>(null)
  const {speaker} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const [loading, setLoading] = useState(true)

  const {update, remove} = useSpeakers()

  const mounted = useRef(true)

  useEffect(() => {
    if (!speaker) {
      return
    }
    setLoading(false)
    setValue('name', speaker.name)
    setValue('text', speaker.text)

    if (speaker.image) {
      fetchFile(speaker.image.name, speaker.image.url)
        .then(setImage)
        .catch(() => {
          // ignore invalid image
        })
    }
    return () => {
      mounted.current = false
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

    const url = api(`/speakers/${speaker.id}`)

    client
      .post<Speaker>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((speaker) => {
        update(speaker)
        props.onDone()
      })
      .catch((e) => {
        setServerError(e)
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

  const handleRemove = () => {
    setSubmitting(true)
    const url = api(`/speakers/${speaker.id}`)

    client
      .delete<Speaker>(url)
      .then(() => {
        remove(speaker)
        props.onDone()
      })
      .catch(() => {
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {form: errors, response: serverError})

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
      <TextEditorContainer>
        {loading ? null : (
          <TextEditor
            data={watch('text')}
            onChange={(val) => setValue('text', val)}
          />
        )}
      </TextEditorContainer>
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
        onClick={handleRemove}
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
