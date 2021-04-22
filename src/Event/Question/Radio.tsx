import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import RadioInput from '@material-ui/core/Radio'
import {FieldProps, useSavedValue} from 'Event/Question'
import React from 'react'
import {Controller} from 'react-hook-form'

export default function Radio(props: FieldProps) {
  useSavedValue(props)

  return (
    <FormControl
      error={props.hasError}
      component="fieldset"
      fullWidth
      required={props.question.is_required}
      disabled={props.disabled}
    >
      <FormLabel component="legend">{props.question.label}</FormLabel>
      <Controller
        name={props.name}
        control={props.control}
        rules={{
          required: props.question.is_required && 'This is required',
        }}
        defaultValue=""
        render={({onChange, value}) => (
          <RadioGroup aria-label="question" onChange={onChange} value={value}>
            {props.question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<RadioInput />}
                label={option}
              />
            ))}
          </RadioGroup>
        )}
      />
      {props.HelperText}
    </FormControl>
  )
}
