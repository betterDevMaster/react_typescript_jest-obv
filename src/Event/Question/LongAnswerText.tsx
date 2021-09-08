import TextField from '@material-ui/core/TextField'
import {FieldProps, useSavedValue} from 'Event/Question'
import React from 'react'
import {useAttendeeVariables} from 'Event'

export default function LongAnswerText(props: FieldProps) {
  useSavedValue(props)
  const v = useAttendeeVariables()
  const helperText = v(props.error || props.question.helper_text || '')
  const label = v(props.question.label)

  return (
    <TextField
      label={label}
      inputProps={{
        'aria-label': props.question.label,
        ref: props.register,
      }}
      name={props.name}
      fullWidth
      multiline
      rows={4}
      helperText={helperText}
      required={props.question.is_required}
      disabled={props.disabled}
      error={Boolean(props.error)}
    />
  )
}
