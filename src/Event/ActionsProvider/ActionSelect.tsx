import styled from 'styled-components'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select, {SelectProps} from '@material-ui/core/Select'
import {useActions} from 'Event/ActionsProvider'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

const DEFAULT_LABEL = 'Pick an action for points'

export default function ActionSelect<T extends string | number>(props: {
  value?: T | null
  onChange: (id: T | null) => void
  useId?: boolean
  disabled?: boolean
  variant?: SelectProps['variant']
  disableMargin?: boolean
  label?: string
}) {
  const {actions} = useActions()

  const setAction = (id: T) => {
    const value = id === 0 ? null : id
    props.onChange(value)
  }

  const label = props.label || DEFAULT_LABEL

  return (
    <StyledFormControl disableMargin={props.disableMargin} fullWidth>
      <InputLabel variant={props.variant}>{label}</InputLabel>
      <Select
        value={props.value || ''}
        fullWidth
        onChange={onUnknownChangeHandler(setAction)}
        label="Source"
        inputProps={{
          'aria-label': 'pick action',
        }}
        variant={props.variant}
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
    </StyledFormControl>
  )
}

const StyledFormControl = styled((props) => {
  const {disableMargin, ...otherProps} = props

  return <FormControl {...otherProps} />
})`
  ${(props) => (props.disableMargin ? 'margin: 0!important;' : '')}
`
