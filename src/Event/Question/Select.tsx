import {FieldProps, useSavedValue} from 'Event/Question'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import SelectInput from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import {Controller} from 'react-hook-form'
import {onUnknownChangeHandler} from 'lib/dom'
import {useAttendeeVariables} from 'Event'

export default function Select(props: FieldProps) {
  const allowsMultiple = props.question.allows_multiple_options
  useSavedValue(props)
  const v = useAttendeeVariables()

  /**
   * MUI Select blows up if you give it an incorrect
   * type. Rather than crash the app, we'll just
   * clear out the value with the correct type.
   *
   * @param value
   * @returns
   */
  const dynamicType = (value: string[] | string) => {
    const defaultValue = allowsMultiple ? [] : ''

    if (!value) {
      return defaultValue
    }

    // Convert back to array
    if (allowsMultiple && !Array.isArray(value)) {
      return value.split(', ')
    }

    return value
  }

  return (
    <FormControl
      fullWidth
      required={props.question.is_required}
      error={props.hasError}
      disabled={props.disabled}
    >
      <InputLabel>{v(props.question.label)}</InputLabel>
      <Controller
        name={props.name}
        control={props.control}
        defaultValue=""
        rules={{
          required: props.question.is_required && 'This is required',
        }}
        render={({onChange, value}) => (
          <SelectInput
            fullWidth
            value={dynamicType(value)}
            onChange={onUnknownChangeHandler((val: string | string[]) => {
              if (!Array.isArray(val)) {
                onChange(val)
                return
              }

              onChange(val.join(', '))
            })}
            multiple={allowsMultiple}
            inputProps={{
              'aria-label': props.question.label,
            }}
          >
            {props.question.options.map(({value}, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </SelectInput>
        )}
      />
      {props.HelperText}
    </FormControl>
  )
}
