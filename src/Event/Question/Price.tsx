import {InputAdornment} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import {FieldProps, useSavedValue} from 'Event/Question'
import React from 'react'

export default function Price(props: FieldProps) {
  useSavedValue(props)

  return (
    <TextField
      label={props.question.label}
      inputProps={{
        'aria-label': props.question.label,
        ref: props.register,
      }}
      defaultValue={props.answer}
      name={props.name}
      fullWidth
      helperText={props.error || props.question.helper_text}
      required={props.question.is_required}
      error={Boolean(props.error)}
      disabled={props.disabled}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {props.question.start_adornment || ''}
          </InputAdornment>
        ),
      }}
    />
  )
}
