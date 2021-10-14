import {FileSelect} from 'lib/ui/form/file'
import React from 'react'

const ImageUpload: React.ComponentType<{
  file: FileSelect
  disabled?: boolean
  children: React.ReactElement | (React.ReactElement | null)[]

  /**
   * autoUpload - Whether the uploader is used in an auto-upload component. Will
   * determine visibility, such as hiding the selected image since we'll just
   * show it once upload is complete.
   */
  autoUpload?: boolean
}>

export default ImageUpload
