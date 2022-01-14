import React from 'react'
import UploadButton from 'lib/ui/ImageUploader/ImageUpload/UploadButton'
import {useFileSelect} from 'lib/ui/form/file'
import Box from 'lib/ui/Box'
import ImageUpload from 'lib/ui/ImageUploader/ImageUpload'
import RemoveIconButton from 'lib/ui/ImageUploader/ImageUpload/RemoveIconButton'
import Cropper from 'lib/ui/ImageUploader/ImageUpload/Cropper'
import Image from 'lib/ui/ImageUploader/ImageUpload/Image'
import {FileLocation} from 'lib/http-client'
import {Label} from 'lib/ui/typography'

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
        <RemoveIconButton aria-label="remove image" size="small" />
        <Label>{props.label}</Label>
      </ImageUpload>
    </Box>
  )
}
