import {FieldProps, useSavedValue} from 'Event/Question'
import React, {useEffect, useState} from 'react'
import CheckboxInput from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import {Controller} from 'react-hook-form'
import {onChangeCheckedHandler} from 'lib/dom'
import {Option} from 'organization/Event/QuestionsProvider'
import {useAttendeeVariables} from 'Event'
import styled from 'styled-components'

export default function Checkbox(props: FieldProps) {
  useSavedValue(props)
  const v = useAttendeeVariables()

  return (
    <FormControl
      component="fieldset"
      required={props.question.is_required}
      error={props.hasError}
      disabled={props.disabled}
    >
      <StyledFormLabel component="legend" color={props.inputStyles?.labelColor}>
        {v(props.question.label)}
      </StyledFormLabel>
      <Controller
        name={props.name}
        control={props.control}
        defaultValue=""
        rules={{
          required: props.question.is_required && 'This is required',
        }}
        render={({onChange, value}) => (
          <Inputs onChange={onChange} value={value} {...props} />
        )}
      />
      {props.HelperText}
    </FormControl>
  )
}

function Inputs(
  props: FieldProps & {onChange: (...events: any[]) => void; value: any},
) {
  const [values, setValues] = useState(
    props.question.options.map((option) => ({checked: false, option})),
  )
  const [hasLoaded, setHasLoaded] = useState(false)
  const {onChange, value} = props

  const setChecked = (option: Option) => (checked: boolean) => {
    const updated = values.map((item) => {
      const isTarget = item.option.value === option.value
      if (!isTarget) {
        return item
      }

      return {
        ...item,
        checked,
      }
    })

    setValues(updated)
  }

  useEffect(() => {
    if (!value || hasLoaded) {
      return
    }

    setHasLoaded(true)

    const checked = value.split(', ')
    const saved = values.map(({option}) => {
      return {
        option,
        checked: checked.includes(option.value),
      }
    })

    setValues(saved)
  }, [value, values, hasLoaded])

  useEffect(() => {
    const checkedOptions = values.filter((o) => o.checked)
    const names = checkedOptions.map(({option}) => option.value).join(', ')
    onChange(names)
  }, [values, onChange])

  const isChecked = (option: Option) => {
    const target = values.find(({option: o}) => o.value === option.value)
    if (!target) {
      return false
    }

    return target.checked
  }

  return (
    <FormGroup>
      {props.question.options.map((option, index) => (
        <StyledFormControlLabel
          key={index}
          control={
            <CheckboxInput
              checked={isChecked(option)}
              onChange={onChangeCheckedHandler(setChecked(option))}
            />
          }
          label={option.value}
          color={props.inputStyles?.textColor}
        />
      ))}
    </FormGroup>
  )
}

const StyledFormLabel = styled((props) => {
  const {color: _1, ...otherProps} = props

  return <FormLabel {...otherProps} />
})`
  color: ${(props) => (props.color ? `${props.color} !important;` : '')};
`
const StyledFormControlLabel = styled((props) => {
  const {color: _1, ...otherProps} = props

  return <FormControlLabel {...otherProps} />
})`
  color: ${(props) => (props.color ? `${props.color} !important;` : '')};
`
