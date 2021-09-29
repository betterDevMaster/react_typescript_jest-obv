import {FieldProps, useSavedValue, FormTextField} from 'Event/Question'
import React from 'react'
import {useAttendeeVariables} from 'Event'

export default function ShortAnswerText(props: FieldProps) {
  useSavedValue(props)
  const v = useAttendeeVariables()
  const helperText = v(props.error || props.question.helper_text || '')
  const label = v(props.question.label)
  const defaultValue = v(props.answer || '')

  return (
    <FormTextField
      label={label}
      inputProps={{
        'aria-label': props.question.label,
        ref: props.register,
      }}
      defaultValue={defaultValue}
      name={props.name}
      fullWidth
      helperText={helperText}
      required={props.question.is_required}
      error={Boolean(props.error)}
      disabled={props.disabled}
      styles={props.inputStyles}
    />
  )
}
