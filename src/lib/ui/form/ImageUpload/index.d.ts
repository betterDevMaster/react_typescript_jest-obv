import {FileSelect} from 'lib/ui/form/file'
import React from 'react'

const ImageUpload: React.ComponentType<{
  file: FileSelect
  disabled?: boolean
  children: React.ReactElement | (React.ReactElement | null)[]
}>

export default ImageUpload
