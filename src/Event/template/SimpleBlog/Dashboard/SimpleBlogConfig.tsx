import TextField from '@material-ui/core/TextField'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {SimpleBlog, SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'

export type SimpleBlogConfig = {
  type: typeof SIMPLE_BLOG
}

export function SimpleBlogConfig() {
  const template = useTemplate()
  const updateTemplate = useUpdateTemplate()

  const update = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    updateTemplate({
      [key]: value,
    })
  }

  return (
    <>
      <TextField
        value={template.headerBackground}
        label="Header Background"
        fullWidth
        onChange={onChangeStringHandler(update('headerBackground'))}
        inputProps={{
          'aria-label': 'header background input',
        }}
      />
      <TextField
        value={template.logo}
        label="Logo URL"
        fullWidth
        onChange={onChangeStringHandler(update('logo'))}
        inputProps={{
          'aria-label': 'edit logo',
        }}
      />
      <ColorPicker
        label="Primary Color"
        color={template.primaryColor}
        onPick={update('primaryColor')}
      />
    </>
  )
}
