import {Asset, useUploadAsset} from 'lib/asset'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import styled from 'styled-components'
import React from 'react'
import {useFileSelect} from 'lib/ui/form/file'
import {createFileLocation} from 'lib/url'
import {useCallback} from 'react'
import Box from '@material-ui/core/Box'
import ImageUpload from 'lib/ui/form/ImageUpload'
import InputLabel from '@material-ui/core/InputLabel'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import Image from 'lib/ui/form/ImageUpload/Image'

export type ImageAssetUploaderProps = {
  label?: string | null
  value: string | null
  onChange: (file: string | null) => void
  alt?: string
  uploadInputProps?: {
    'aria-label'?: string
  }
  removeButtonProps?: {
    'aria-label'?: string
  }
  canResize?: boolean
  width: number
  height: number
}

/**
 * Generic Event Asset uploader/picker for images.
 *
 * @param props
 * @returns
 */
export default function ImageAssetUploader(props: ImageAssetUploaderProps) {
  const {onChange, value} = props
  const current = createFileLocation(value)

  const file = useFileSelect(current)

  const handleUpload = useCallback((asset: Asset) => onChange(asset.file.url), [
    onChange,
  ])

  const handleRemove = useCallback(() => {
    onChange('')
  }, [onChange])

  const {processing} = useUploadAsset(handleUpload, handleRemove, file)
  return (
    <Box mb={3}>
      <Label {...props} />
      <ImageUpload file={file} disabled={processing} autoUpload>
        <Cropper
          width={props.width}
          height={props.height}
          canResize={props.canResize}
        />
        <Image alt={props?.alt || 'uploaded image'} />
        <UploadButton
          inputProps={{
            'aria-label':
              props.uploadInputProps?.['aria-label'] || 'upload image',
          }}
          size="small"
        >
          Image
        </UploadButton>
        <RemoveImageButton
          aria-label={props.removeButtonProps?.['aria-label'] || 'remove image'}
          size="small"
        />
      </ImageUpload>
    </Box>
  )
}

function Label(props: ImageAssetUploaderProps) {
  if (!props.label) {
    return null
  }
  return <StyledInputLabel>{props.label}</StyledInputLabel>
}

const StyledInputLabel = styled(InputLabel)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
