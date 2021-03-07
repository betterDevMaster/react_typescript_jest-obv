import {FieldProps, useSavedValue} from 'Event/Question'
import React, {useEffect, useState} from 'react'
import CheckboxInput from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import {Controller} from 'react-hook-form'
import {onChangeCheckedHandler} from 'lib/dom'

export default function Checkbox(props: FieldProps) {
  useSavedValue(props)

  return (
    <FormControl
      component="fieldset"
      required={props.question.is_required}
      error={props.hasError}
    >
      <FormLabel component="legend">{props.question.label}</FormLabel>
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
    props.question.options.map((option) => ({checked: false, name: option})),
  )
  const [hasLoaded, setHasLoaded] = useState(false)
  const {onChange, value} = props

  const setChecked = (name: string) => (checked: boolean) => {
    const updated = values.map((o) => {
      const isTarget = o.name === name
      if (!isTarget) {
        return o
      }

      return {
        name,
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
    const saved = values.map(({name}) => {
      return {
        name,
        checked: checked.includes(name),
      }
    })

    setValues(saved)
  }, [value, values, hasLoaded])

  useEffect(() => {
    const checkedOptions = values.filter((o) => o.checked)
    const names = checkedOptions.map(({name}) => name).join(', ')
    onChange(names)
  }, [values, onChange])

  const isChecked = (option: string) => {
    const target = values.find(({name}) => name === option)
    if (!target) {
      return false
    }

    return target.checked
  }

  return (
    <FormGroup>
      {props.question.options.map((option, index) => (
        <FormControlLabel
          key={index}
          control={
            <CheckboxInput
              checked={isChecked(option)}
              onChange={onChangeCheckedHandler(setChecked(option))}
            />
          }
          label={option}
        />
      ))}
    </FormGroup>
  )
}
