import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'
import {ZapierTag} from 'Event/zapier'

export default function ZapierTagInput(props: {
  onChange: (tag: ZapierTag | null) => void
  value?: ZapierTag | null
  disabled?: boolean
}) {
  const {disabled, value} = props
  const {event} = useEvent()

  const name = value || ''

  if (!event.has_zapier) {
    return null
  }

  return (
    <TextField
      value={name}
      label="Zapier Tag"
      fullWidth
      inputProps={{
        'aria-label': 'zapier tag',
      }}
      onChange={onChangeStringHandler(props.onChange)}
      disabled={disabled}
      helperText={'Add zapier tag, when user tag an action'}
    />
  )
}
