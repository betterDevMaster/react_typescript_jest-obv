import {ButtonProps} from '@material-ui/core/Button'
import React from 'react'

const UploadButton: React.ComponentType<{
  inputProps?: {
    ['aria-label']?: string
  }
  children?: string
  size?: ButtonProps['size']
  label?: string
}>

export default UploadButton
