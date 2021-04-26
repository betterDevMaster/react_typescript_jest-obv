import {FileSelect} from 'lib/ui/form/file'
import React from 'react'

const ImageUpload: React.ComponentType<{
  file: FileSelect
  disabled?: boolean
  children: React.ReactElement | React.ReactElement[]
}>

export const Image: React.ComponentType<{
  alt: string
}>

export const Label: React.ComponentType<{
  children: string
}>

export const UploadButton: React.ComponentType<{
  inputProps?: {
    ['aria-label']?: string
  }
}>

export const RemoveButton: React.ComponentType<{
  ['aria-label']?: string
}>

export default ImageUpload
