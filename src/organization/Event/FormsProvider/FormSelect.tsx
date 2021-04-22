import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {onUnknownChangeHandler} from 'lib/dom'
import {useForms} from 'organization/Event/FormsProvider'
import React from 'react'

export default function FormSelect(props: {
  onChange: (id: number | null) => void
  value?: number | null
}) {
  const {forms} = useForms()

  const selectForm = (id: number) => {
    const value = id || null
    props.onChange(value)
  }

  return (
    <Select
      value={props.value || ''}
      fullWidth
      onChange={onUnknownChangeHandler(selectForm)}
      inputProps={{
        'aria-label': 'select form',
      }}
    >
      <MenuItem value={0}>None</MenuItem>
      {forms.map((form) => (
        <MenuItem
          key={form.id}
          value={form.id}
          aria-label={`pick ${form.name}`}
        >
          {form.name}
        </MenuItem>
      ))}
    </Select>
  )
}
