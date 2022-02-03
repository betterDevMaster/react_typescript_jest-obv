import Button from 'lib/ui/Button'
import Icon from 'lib/ui/Icon'
import {v4 as uuid} from 'uuid'
import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {MAX_FILE_SIZE_BYTES} from 'lib/ui/ImageUploader/ImageUpload'
import {Description} from 'lib/ui/typography'

export default function UploadButton(props) {
  const [error, setError] = useState(null)
  const {children: text} = props

  const id = useRef(uuid())

  const handleFileSelect = (e) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image too large. Please select an image smaller than 5MB.')
      return
    }

    if (!file) {
      return
    }

    props.onSelect(file)
  }

  return (
    <ButtonContainer>
      <Button
        variant="contained"
        color="primary"
        aria-label="select image to upload"
        disabled={props.disabled}
        size={props.size}
        startIcon={<Icon className="far fa-arrow-circle-up" />}
      >
        <UploadButtonLabel htmlFor={id.current}>
          {text || 'Upload'}
        </UploadButtonLabel>
      </Button>
      <input
        id={id.current}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        value="" // Required to allow uploading multiple times / re-selecting
        hidden
        aria-label={props.inputProps?.['aria-label']}
      />
      <DescriptionContainer>
        <Description>{props.label}</Description>
      </DescriptionContainer>

      <Error>{error}</Error>
    </ButtonContainer>
  )
}

function Error(props) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}

const UploadButtonLabel = styled.label`
  cursor: pointer;
`

const ButtonContainer = styled.div`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`

const DescriptionContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]};
`
