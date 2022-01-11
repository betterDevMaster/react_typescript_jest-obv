import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Button, TextField} from '@material-ui/core'

import DangerButton from 'lib/ui/Button/DangerButton'
import {api} from 'lib/url'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/ui/api-client'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {Speaker} from 'Event/SpeakerPage'
import {useFileSelect} from 'lib/ui/form/file'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Label from 'lib/ui/form/ImageUpload/Label'
import ImageUpload from 'lib/ui/form/ImageUpload'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Image from 'lib/ui/form/ImageUpload/Image'

import {useSpeakers} from 'organization/Event/SpeakersProvider'
import {useOrganization} from 'organization/OrganizationProvider'

export interface UpdateSpeakerData {
  name: string
  text?: string
  description?: string
}

export default function EditSpeakerForm(props: {
  speaker: Speaker | null
  onDone: () => void
}) {
  const {register, handleSubmit, control, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {speaker} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const image = useFileSelect(speaker?.image)
  const {update, remove} = useSpeakers()

  const createFormData = (image: File, form: UpdateSpeakerData) => {
    const formData = new FormData()
    for (const [key, value] of Object.entries(form)) {
      if (value) formData.set(key, String(value))
    }

    formData.set('image', image)

    return formData
  }

  const data = (form: UpdateSpeakerData) => {
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

  const submit = (form: UpdateSpeakerData) => {
    if (!speaker) {
      throw new Error(
        'Missing speaker; was the speaker set as editing correctly?',
      )
    }

    setSubmitting(true)

    const url = api(`/speakers/${speaker.id}`)

    client
      .put<Speaker>(url, data(form))
      .then((speaker) => {
        update(speaker)
        props.onDone()
      })
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
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
        defaultValue={speaker.name}
        inputProps={{
          ref: register({required: 'Speaker Name is required.'}),
          'aria-label': 'speaker name',
        }}
        error={Boolean(nameError)}
        helperText={nameError}
      />
      <Controller
        name="text"
        control={control}
        defaultValue={speaker.text}
        render={({value, onChange}) => (
          <TextEditorContainer>
            <TextEditor
              data={value}
              onChange={onChange}
              placeholder="Your title context here."
            />
          </TextEditorContainer>
        )}
      ></Controller>
      <ImageContainer>
        <ImageUpload file={image} disabled={submitting}>
          <Cropper width={300} height={300} canResize />
          <Label>Image</Label>
          <Image alt="favicon" width={100} />
          <UploadButton
            inputProps={{
              'aria-label': 'speaker image input',
            }}
          />
          <RemoveImageButton aria-label="remove speaker image" />
        </ImageUpload>
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

const ImageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
