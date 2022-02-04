import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {spacing} from 'lib/ui/theme'
import Button from 'lib/ui/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import {useBackgrounds} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {guardValidDimensions, guardValidMimeType} from 'lib/image'

const MAX_FILE_SIZE_BYTES = 5000000 // 5MB
const ASPECT_RATIO = 0.5625 // 16:9

export default function BackgroundImageUpload() {
  const {busy, upload} = useBackgrounds()
  const [error, setError] = useState<null | string>(null)
  const clearError = () => setError(null)

  const imageUploadId = `background-image-upload`
  const inputLabel = `background image input`

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError()

    const fileCheck = e.target.files || []

    // If there are no files in the file input, we can't do anything more.
    if (fileCheck.length < 1) {
      setError('No image selected to upload')
      return
    }

    // Localize the single-file upload.
    const file = fileCheck[0]

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image too large. Please select an image smaller than 5MB.')
      return
    }

    guardValidMimeType(file)
      .then(guardValidDimensions(ASPECT_RATIO))
      .then(upload)
      .catch(setError)
  }

  return (
    <Box>
      <Button
        variant="outlined"
        color="primary"
        disabled={busy}
        aria-label="select image to upload"
      >
        <UploadButtonLabel htmlFor={imageUploadId}>
          Upload Zoom Background
        </UploadButtonLabel>
      </Button>

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

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`
