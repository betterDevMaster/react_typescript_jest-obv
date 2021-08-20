import {ButtonProps} from '@material-ui/core'
import React from 'react'

const UploadButton: React.ComponentType<{
  inputProps?: {
    ['aria-label']?: string
  }
  children?: string
  size?: ButtonProps['size']
}>

export default UploadButton
