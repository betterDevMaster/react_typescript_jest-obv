import TextField from '@material-ui/core/TextField'
import {FieldProps, useSavedValue} from 'Event/Question'
import React from 'react'

export default function LongAnswerText(props: FieldProps) {
  useSavedValue(props)

  return (
    <TextField
      label={props.question.label}
      inputProps={{
        'aria-label': props.question.label,
        ref: props.register,
      }}
      name={props.name}
      fullWidth
      multiline
      rows={4}
      helperText={props.error || props.question.helper_text}
      required={props.question.is_required}
      error={Boolean(props.error)}
    />
  )
}
