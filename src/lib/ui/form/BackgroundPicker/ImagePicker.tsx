import {BackgroundPickerProps} from 'lib/ui/form/BackgroundPicker'
import React from 'react'
import UrlImageAssetUploader from 'lib/asset/UrlImageAssetUploader'

export default function ImagePicker(props: BackgroundPickerProps) {
  const value = props.background || null
  const isImage = value?.startsWith('url')
  const label = isImage ? props.label : null

  return (
    <UrlImageAssetUploader
      onChange={props.onChange}
      value={props.background || null}
      label={label}
      alt="background image"
      uploadInputProps={{
        'aria-label': 'upload background image',
      }}
      removeButtonProps={{
        'aria-label': 'remove background image',
      }}
      canResize
      width={1184}
      height={65}
    />
  )
}
