import TextField from '@material-ui/core/TextField'
import {Attendee} from 'Event/attendee'
import React from 'react'

export default React.forwardRef(
  (props: {group: string; attendee: Attendee}, ref) => {
    const value = props.attendee.groups[props.group] || ''

    return (
      <TextField
        variant="outlined"
        fullWidth
        inputProps={{ref, 'aria-label': `${props.group} input`}}
        defaultValue={value}
        label={props.group}
        name={`groups[${props.group}]`}
      />
    )
  },
)
