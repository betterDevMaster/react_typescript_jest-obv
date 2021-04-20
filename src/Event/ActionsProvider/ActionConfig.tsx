import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {useActions} from 'Event/ActionsProvider'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

export default function ActionSelect(props: {
  value?: string | number | null
  onChange: (id: string | null) => void
  useId?: boolean
  disabled?: boolean
}) {
  const {actions} = useActions()

  const setAction = (id: number | string) => {
    const value = id === 0 ? null : id
    props.onChange(String(value))
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Pick an action for points</InputLabel>
      <Select
        value={props.value || ''}
        fullWidth
        onChange={onUnknownChangeHandler(setAction)}
        label="Source"
        inputProps={{
          'aria-label': 'pick action',
        }}
        disabled={props.disabled}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            value={props.useId ? action.id : action.key}
            aria-label={`pick ${action.description}`}
          >
            {action.description}
          </MenuItem>
        ))}
        <MenuItem value={0} aria-label="unassign action">
          None
        </MenuItem>
      </Select>
    </FormControl>
  )
}
