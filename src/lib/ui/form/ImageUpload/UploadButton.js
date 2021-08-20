import Button from '@material-ui/core/Button'
import {v4 as uuid} from 'uuid'
import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {MAX_FILE_SIZE_BYTES} from 'lib/ui/form/ImageUpload'

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

  if (!props.isVisible) {
    return null
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        aria-label="select image to upload"
        disabled={props.disabled}
        size={props.size}
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
      <Error>{error}</Error>
    </>
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
