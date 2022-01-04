import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import RadioInput from '@material-ui/core/Radio'
import {FieldProps, useSavedValue, FormTextField} from 'Event/Question'
import React, {useState} from 'react'
import {onChangeStringHandler} from 'lib/dom'
import {useAttendeeVariables} from 'Event'
import styled from 'styled-components'

/**
 * 'other' value. We set a default here that shouldn't conflict with
 * any user values.
 */
const OTHER = '__other__'

export default function Radio(props: FieldProps) {
  useSavedValue(props)
  const v = useAttendeeVariables()

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
      <StyledFormLabel component="legend" color={props.inputStyles?.labelColor}>
        {v(props.question.label)}
      </StyledFormLabel>
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
          <StyledFormControlLabel
            key={index}
            value={option.value}
            control={
              <StyledRadio
                selectedColor={props.inputStyles?.rdchkSelectedColor}
                unSelectedColor={props.inputStyles?.rdchkUnSelectedColor}
              />
            }
            label={option.value}
            color={props.inputStyles?.textColor}
          />
        ))}
        <OtherOption
          isVisible={props.question.has_other_option}
          hasOtherValue={otherInputVisible}
          {...props}
        />
        <OtherInput
          isVisible={otherInputVisible}
          onChange={setValue}
          value={value}
          {...props}
        />
      </RadioGroup>
      {props.HelperText}
    </FormControl>
  )
}

function OtherOption(
  props: FieldProps & {isVisible: boolean; hasOtherValue: boolean},
) {
  if (!props.isVisible) {
    return null
  }

  return (
    <>
      <StyledFormControlLabel
        value={OTHER}
        control={
          <StyledRadio
            selectedColor={props.inputStyles?.rdchkSelectedColor}
            unSelectedColor={props.inputStyles?.rdchkUnSelectedColor}
            checked={props.hasOtherValue}
          />
        }
        label="Other"
        color={props.inputStyles?.textColor}
      />
    </>
  )
}

function OtherInput(
  props: FieldProps & {
    isVisible: boolean
    value: string
    onChange: (value: string) => void
  },
) {
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
    <FormTextField
      label="Other"
      inputProps={{
        'aria-label': 'other value',
      }}
      value={value}
      onChange={onChangeStringHandler(handleOnChange)}
      styles={props.inputStyles}
    />
  )
}

const StyledFormLabel = styled((props) => {
  const {color, ...otherProps} = props

  return <FormLabel {...otherProps} />
})`
  color: ${(props) => (props.color ? `${props.color} !important;` : '')};
`
const StyledFormControlLabel = styled((props) => {
  const {color, ...otherProps} = props
  return <FormControlLabel {...otherProps} />
})`
  color: ${(props) => (props.color ? `${props.color} !important;` : '')};
`
const StyledRadio = styled(RadioInput)<{
  selectedColor?: string
  unSelectedColor?: string
}>`
  color: ${(props) => props.unSelectedColor};
  &.Mui-checked {
    color: ${(props) => props.selectedColor};
  }
`
