import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import {NewGroup} from 'organization/Event/AttendeeManagement/dialog/Form'
import React from 'react'

export default function NewGroupInput(props: {
  group: NewGroup
  onChange: (group: NewGroup) => void
}) {
  const update = (key: keyof NewGroup) => (value: string) => {
    const updated = {
      ...props.group,
      [key]: value,
    }

    props.onChange(updated)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <TextField
          label="Group"
          fullWidth
          variant="outlined"
          inputProps={{'aria-label': 'group name'}}
          onChange={onChangeStringHandler(update('key'))}
        />
      </Grid>
      <Grid item sm={6}>
        <TextField
          label="Value"
          fullWidth
          variant="outlined"
          inputProps={{'aria-label': 'group value'}}
          onChange={onChangeStringHandler(update('value'))}
        />
      </Grid>
    </Grid>
  )
}
