import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {useActions} from 'Event/ActionsProvider'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

export default function ActionConfig(props: {
  button: NavButtonWithSize
  update: <T extends keyof NavButtonWithSize>(
    key: T,
  ) => (value: NavButtonWithSize[T]) => void
}) {
  const {actions} = useActions()

  const value = props.button.actionId || ''

  const setAction = (id: number | string) => {
    const val = typeof id === 'number' ? null : id
    props.update('actionId')(val)
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Pick an action for points</InputLabel>
      <Select
        value={value}
        fullWidth
        onChange={onUnknownChangeHandler(setAction)}
        label="Source"
        inputProps={{
          'aria-label': 'pick action',
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            value={action.key}
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
