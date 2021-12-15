import React from 'react'
import styled from 'styled-components'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import {useFileSelect} from 'lib/ui/form/file'
import Box from '@material-ui/core/Box'
import ImageUpload from 'lib/ui/form/ImageUpload'
import InputLabel from '@material-ui/core/InputLabel'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Image from 'lib/ui/form/ImageUpload/Image'
import {FileLocation} from 'lib/http-client'

export type ImageUploaderProps = {
  label?: string
  onChange: (file: string | null) => void
  alt?: string
  canResize?: boolean
  width: number
  height: number
  fileLocation: FileLocation
  processing: boolean
  autoUpload: boolean
}

export default function ImageUploader(props: ImageUploaderProps) {
  const file = useFileSelect(props.fileLocation)

  return (
    <Box mb={3}>
      <Label label={props.label} />
      <ImageUpload
        file={file}
        disabled={props.processing}
        autoUpload={props.autoUpload}
      >
        <Cropper
          width={props.width}
          height={props.height}
          canResize={props.canResize}
        />
        <Image alt={props?.alt || 'uploaded image'} />
        <UploadButton
          inputProps={{
            'aria-label': 'upload image',
          }}
          size="small"
        >
          Image
        </UploadButton>
        <RemoveImageButton aria-label="remove image" size="small" />
      </ImageUpload>
    </Box>
  )
}

function Label(props: {label?: string}) {
  if (!props.label) {
    return null
  }
  return <StyledInputLabel>{props.label}</StyledInputLabel>
}

const StyledInputLabel = styled(InputLabel)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
