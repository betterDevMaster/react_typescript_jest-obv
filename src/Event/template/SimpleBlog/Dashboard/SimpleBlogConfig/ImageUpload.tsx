import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import {ObvioEvent} from 'Event'
import InputLabel from '@material-ui/core/InputLabel'
import DangerButton from 'lib/ui/Button/DangerButton'
import {Visible} from 'lib/dom'

const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

export default function ImageUpload(props: {
  label: string
  property: keyof ObvioEvent
  current?: string
}) {
  const {upload, isUploading, error, setError} = useUpload()
  const imageUploadId = `event-${props.property}-image-upload`
  const inputLabel = `${props.property} image input`

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image too large. Please select an image smaller than 5MB.')
      return
    }

    if (isUploading || !file) {
      return
    }

    const formData = new FormData()
    formData.set(props.property, file)

    upload(formData)
  }

  const remove = () => {
    const data = {
      [props.property]: null,
    }

    upload(data)
  }

  const hasCurrent = Boolean(props.current)

  return (
    <Box>
      <Label>{props.label}</Label>
      <Image current={props.current} property={props.property} />
      <Visible if={!hasCurrent}>
        <Button
          variant="outlined"
          color="primary"
          disabled={isUploading}
          aria-label="select image to upload"
        >
          <UploadButtonLabel htmlFor={imageUploadId}>Upload</UploadButtonLabel>
        </Button>
      </Visible>
      <Visible if={hasCurrent}>
        <DangerButton
          variant="outlined"
          aria-label={`remove ${props.property} image`}
          onClick={remove}
          disabled={isUploading}
        >
          Remove
        </DangerButton>
      </Visible>
      <input
        id={imageUploadId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        value="" // Required to allow uploading multiple times
        hidden
        aria-label={inputLabel}
      />
      <Error>{error}</Error>
    </Box>
  )
}

function Image(props: {current?: string; property: string}) {
  if (!props.current) {
    return null
  }

  const alt = `current ${props.property}`

  return (
    <ImageBox>
      <img src={props.current} alt={alt} />
    </ImageBox>
  )
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return (
    <ErrorText color="error">
      We could not upload your file: {props.children}
    </ErrorText>
  )
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

function useUpload() {
  const {event, update: updateEvent} = useEvent()
  const {client} = useOrganization()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const url = api(`/events/${event.slug}`)
  const clearError = () => setError(null)

  const upload = (data: {} | FormData) => {
    if (isUploading) {
      return
    }

    setIsUploading(true)
    clearError()

    client
      .put<ObvioEvent>(url, data)
      .then(updateEvent)
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  return {error, upload, isUploading, setError}
}

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const Label = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

const ImageBox = styled.div`
  width: 200px;
  margin: ${(props) => props.theme.spacing[3]} 0;

  img {
    width: 100%;
    max-height: 100%;
  }
`
