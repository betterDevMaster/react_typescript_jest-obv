import UrlImageAssetUploader from 'lib/asset/UrlImageAssetUploader'
import {IconPickerProps} from 'lib/ui/form/IconPicker'
import React from 'react'

export default function ImagePicker(props: IconPickerProps) {
  const value = props.value || null
  const isImage = value?.startsWith('url')
  const label = isImage ? props.label : null

  return (
    <UrlImageAssetUploader
      onChange={props.onChange}
      value={value}
      label={label}
      alt="icon image"
      uploadInputProps={{
        'aria-label': 'upload icon',
      }}
      removeButtonProps={{
        'aria-label': 'remove icon',
      }}
      width={65}
      height={65}
    />
  )
}
