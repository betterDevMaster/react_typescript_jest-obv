import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import RadioInput from '@material-ui/core/Radio'
import {FieldProps, useSavedValue} from 'Event/Question'
import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'

/**
 * 'other' value. We set a default here that shouldn't conflict with
 * any user values.
 */
const OTHER = '__other__'

export default function Radio(props: FieldProps) {
  useSavedValue(props)

  const [value, setValue] = useState(props.answer || '')

  const otherInputVisible =
    Boolean(value) &&
    !props.question.options.map(({value}) => value).includes(value)

  return (
    <FormControl
      error={props.hasError}
      component="fieldset"
      fullWidth
      required={props.question.is_required}
      disabled={props.disabled}
    >
      <FormLabel component="legend">{props.question.label}</FormLabel>
      <input
        type="hidden"
        name={props.name}
        value={value}
        ref={props.register}
      />
      <RadioGroup
        aria-label="question"
        onChange={onChangeStringHandler(setValue)}
        value={value}
      >
        {props.question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<RadioInput />}
            label={option.value}
          />
        ))}
        <OtherOption
          isVisible={props.question.has_other_option}
          hasOtherValue={otherInputVisible}
        />
        <OtherInput
          isVisible={otherInputVisible}
          onChange={setValue}
          value={value}
        />
      </RadioGroup>
      {props.HelperText}
    </FormControl>
  )
}

function OtherOption(props: {isVisible: boolean; hasOtherValue: boolean}) {
  if (!props.isVisible) {
    return null
  }

  return (
    <>
      <FormControlLabel
        value={OTHER}
        control={<RadioInput checked={props.hasOtherValue} />}
        label="Other"
      />
    </>
  )
}

function OtherInput(props: {
  isVisible: boolean
  value: string
  onChange: (value: string) => void
}) {
  if (!props.isVisible) {
    return null
  }

  /**
   * Text input value. We need to check for __other__, otherwise that's the
   * text that will be visible in the input.
   */
  const value = props.value === OTHER ? '' : props.value

  const handleOnChange = (text: string) => {
    /**
     * Setting value also needs to handle blank '' text case to avoid
     * de-selecting the 'other' option.
     */
    const value = text || OTHER
    props.onChange(value)
  }

  return (
    <TextField
      label="Other"
      inputProps={{
        'aria-label': 'other value',
      }}
      value={value}
      onChange={onChangeStringHandler(handleOnChange)}
    />
  )
}
