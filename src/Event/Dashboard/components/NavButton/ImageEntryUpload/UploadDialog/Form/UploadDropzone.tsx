import React from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'

const ACCEPTED_FILE_TYPES = ['image/*']
const MAX_NUM_FILES = 1
const MAX_FILE_SIZE_BYTES = 150000000

export default function UploadDropzone(props: {
  onDrop: (acceptedFile: File) => void
}) {
  const handleDrop = (files: File[]) => {
    props.onDrop(files[0]) // Should only receive one file
  }

  const {getRootProps, getInputProps} = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    maxFiles: MAX_NUM_FILES,
  })
  const {ref: _, ...rootProps} = getRootProps()

  return (
    <PaperDropzone {...rootProps}>
      <input {...getInputProps()} aria-label="image upload" />
      <p>Drop a file here or click to upload</p>
    </PaperDropzone>
  )
}

const PaperDropzone = styled(Paper)`
  cursor: pointer;
  margin-bottom: ${(props) => props.theme.spacing[6]};
  padding: ${(props) => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;

  > p {
    margin: 0;
  }
`
