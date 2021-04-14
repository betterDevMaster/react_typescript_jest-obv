import InputLabel from '@material-ui/core/InputLabel'
import styled from 'styled-components'
import {withStyles} from '@material-ui/core/styles'
import {useEvent} from 'Event/EventProvider'
import {spacing} from 'lib/ui/theme'
import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {ObvioEvent} from 'Event'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import DangerButton from 'lib/ui/Button/DangerButton'
import Typography from '@material-ui/core/Typography'

const imageUploadId = `sponsor-question-icon-upload`
const MAX_FILE_SIZE_BYTES = 5000000 // 5MB

const ATTRIBUTE = 'sponsor_question_icon'

export default function QuestionIconUpload(props: {className?: string}) {
  const {isUploading, upload, setError, error} = useUpload()

  const remove = () => {
    const data = {
      [ATTRIBUTE]: null,
    }

    upload(data)
  }

  return (
    <div className={props.className}>
      <Label>Question Icon</Label>
      <Image />
      <UploadButton
        isUploading={isUploading}
        upload={upload}
        setError={setError}
      />
      <RemoveButton onRemove={remove} isUploading={isUploading} />
      <Error>{error}</Error>
    </div>
  )
}

const Label = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

function Image() {
  const {event} = useEvent()
  if (!event.sponsor_question_icon) {
    return null
  }

  return (
    <ImageBox>
      <img
        src={event.sponsor_question_icon.url}
        alt={event.sponsor_question_icon.name}
      />
    </ImageBox>
  )
}

function UploadButton(props: {
  isUploading: ReturnType<typeof useUpload>['isUploading']
  upload: ReturnType<typeof useUpload>['upload']
  setError: ReturnType<typeof useUpload>['setError']
}) {
  const {event} = useEvent()
  const {isUploading, upload, setError} = props

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
    formData.set('sponsor_question_icon', file)

    upload(formData)
  }

  if (Boolean(event.sponsor_question_icon)) {
    return null
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        disabled={isUploading}
        aria-label="select image to upload"
      >
        <UploadButtonLabel htmlFor={imageUploadId}>Upload</UploadButtonLabel>
      </Button>
      <input
        id={imageUploadId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        value="" // Required to allow uploading multiple times
        hidden
        aria-label="question icon input"
      />
    </>
  )
}

function RemoveButton(props: {onRemove: () => void; isUploading: boolean}) {
  const {event} = useEvent()
  if (!event.sponsor_question_icon) {
    return null
  }

  return (
    <DangerButton
      variant="outlined"
      aria-label={`remove sponsor question icon`}
      onClick={props.onRemove}
      disabled={props.isUploading}
    >
      Remove
    </DangerButton>
  )
}

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

const ImageBox = styled.div`
  width: 200px;
  margin: ${(props) => props.theme.spacing[3]} 0;

  img {
    width: 100%;
    max-height: 100%;
  }
`

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

export function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}
