import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {spacing} from 'lib/ui/theme'
import {useBackgrounds} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {withStyles} from '@material-ui/core'

const MAX_FILE_SIZE_BYTES = 5000000 // 5MB
const ASPECT_RATIO = 0.5625 // 16:9

export default function BackgroundImageUpload() {
  const {
    uploadBackground,
    isUploading,
    isRemoving,
    error,
    clearError,
    setError,
  } = useBackgrounds()
  const [imageUpload, setImageUpload] = useState<string | Blob>('')
  const [isMimeOk, setIsMimeOk] = useState<boolean>(false)
  const [isDimensionOk, setIsDimensionOk] = useState<boolean>(false)

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
    setImageUpload(file)

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image too large. Please select an image smaller than 5MB.')
      return
    }

    validateMimeType(file, setIsMimeOk, setError)
    validateDimensions(file, setIsDimensionOk, setError)
  }

  // Whenever data flags related to the validity of the image being uploaded are
  // changed, we're checking to see if we're in the possibility to do the upload.
  useEffect(() => {
    // If any of these conditions are met, we're not ready to upload the background
    // yet - there is sill some async stuff happening, but we have SOME of the
    // "upload" flags set.
    if (
      imageUpload === '' ||
      isMimeOk === false ||
      isDimensionOk === false ||
      isUploading === true
    ) {
      return
    }

    const formData = new FormData()
    formData.set('image', imageUpload)

    // Resetting the "upload" flags before posting the background image, prevents
    // multiple uploads of the same background.
    setImageUpload('')
    setIsDimensionOk(false)
    setIsMimeOk(false)

    uploadBackground(formData)
  }, [imageUpload, isDimensionOk, isMimeOk, isUploading, uploadBackground])

  return (
    <Box>
      <Button
        variant="outlined"
        color="primary"
        disabled={isUploading || isRemoving}
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

function validateMimeType(
  file: File,
  setIsMimeOk: Function,
  setError: Function,
): void {
  const reader = new FileReader()

  reader.onloadend = (evt) => {
    if (reader.result === null) {
      setError('Image could not be read. Please try again. [101]')
      return false
    }

    const uint = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4)
    let bytes = ''
    uint.forEach((byte) => {
      bytes += byte.toString(16)
    })
    const hex = bytes.toUpperCase()

    switch (hex) {
      case '89504E47': // type = "image/png";
      case 'FFD8FFE0': // type = "image/jpeg";
      case 'FFD8FFE1':
      case 'FFD8FFE2':
      case 'FFD8FFE3':
      case 'FFD8FFE8':
        setIsMimeOk(true)
        break
      default:
        setIsMimeOk(false)
    }
  }

  reader.readAsArrayBuffer(file.slice(0, 4))
}

function validateDimensions(
  file: File,
  setIsDimensionOk: Function,
  setError: Function,
): void {
  const reader = new FileReader()

  reader.onloadend = (event) => {
    if (reader.result === null) {
      setError('Image could not be read. Please try again. [201]')
      return false
    }

    let imageInfo = new Image()
    imageInfo.src = reader.result.toString()

    imageInfo.onload = () => {
      if (imageInfo.width === 0 || imageInfo.height === 0) {
        setError('Image could not be read. Please try again. [202]')
        setIsDimensionOk(false)
        return
      }

      if (imageInfo.height / imageInfo.width !== ASPECT_RATIO) {
        setError(
          'Aspect ratio of Zoom Background Images needs to be 16:9. [203]',
        )
        setIsDimensionOk(false)
        return
      }

      setIsDimensionOk(true)
    }
  }

  reader.readAsDataURL(file)
}
