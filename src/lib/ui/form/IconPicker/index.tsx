import React from 'react'

import ImagePicker from 'lib/ui/form/IconPicker/ImagePicker'
import IconSelect from 'lib/fontawesome/IconSelect'

export interface IconPickerProps {
  label?: string | null
  value?: string
  onChange: (value: string | null) => void
}

export default function IconPicker(props: IconPickerProps) {
  return (
    <>
      <IconSelect {...props} />
      <ImagePicker {...props} />
    </>
  )
}
