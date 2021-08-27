import styled from 'styled-components'
import {BackgroundPickerProps} from 'lib/ui/form/BackgroundPicker'
import React from 'react'
import {FileLocation} from 'lib/http-client'
import {useFileSelect} from 'lib/ui/form/file'
import UploadButton from 'lib/ui/form/ImageUpload/UploadButton'
import Cropper from 'lib/ui/form/ImageUpload/Cropper'
import ImageUpload from 'lib/ui/form/ImageUpload'
import Image from 'lib/ui/form/ImageUpload/Image'
import RemoveImageButton from 'lib/ui/form/ImageUpload/RemoveButton'
import {Asset, useUploadAsset} from 'lib/asset'
import {useCallback} from 'react'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'

export default function ImagePicker(props: BackgroundPickerProps) {
  const {onChange} = props
  const current = parseValues(props.background)

  const file = useFileSelect(current)

  const handleUpload = useCallback(
    (asset: Asset) => {
      const updated = `url(${asset.file.url})`
      onChange(updated)
    },
    [onChange],
  )

  const handleRemove = useCallback(() => {
    onChange('')
  }, [onChange])

  const {processing} = useUploadAsset(handleUpload, handleRemove, file)
  return (
    <Box mb={3}>
      <Label {...props} />
      <ImageUpload file={file} disabled={processing}>
        <Cropper width={1184} height={65} canResize />
        <Image alt="background image" />
        <ButtonBox>
          <UploadButton
            inputProps={{
              'aria-label': 'upload background image',
            }}
            size="small"
          >
            Image
          </UploadButton>
          <RemoveImageButton
            aria-label="remove background image"
            size="small"
          />
        </ButtonBox>
      </ImageUpload>
    </Box>
  )
}

function parseValues(background?: string): FileLocation | null {
  if (!background) {
    return null
  }

  const urlRegex = /url\((.*)\)/

  const isImage = urlRegex.test(background)
  if (!isImage) {
    return null
  }

  const matches = background.match(urlRegex)
  if (!matches || matches.length !== 2) {
    return null
  }

  /**
   * Parse values out of the background CSS style
   */
  const url = matches[1]

  const urlParts = url.split('/')
  const name = urlParts[urlParts.length - 1]

  return {url, name}
}

function Label(props: BackgroundPickerProps) {
  const {background} = props
  const isImage = background?.startsWith('url')

  if (!isImage) {
    return null
  }
  return <StyledInputLabel>{props.label}</StyledInputLabel>
}

const StyledInputLabel = styled(InputLabel)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`

const ButtonBox = styled.div`
  text-align: right;
`
