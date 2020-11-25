import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Dashboard} from 'Event/Dashboard'
import {SIMPLE_BLOG} from 'Event/Dashboard/Template/SimpleBlog'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

export default function DashboardTemplateSelect(props: {
  value: Dashboard['template'] | null
  onPick: (template: Dashboard['template']) => void
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>Dashboard Template</InputLabel>
      <Select
        value={props.value || ''}
        fullWidth
        onChange={onUnknownChangeHandler(props.onPick)}
        inputProps={{
          'aria-label': 'dashboard select',
        }}
      >
        <MenuItem value={SIMPLE_BLOG}>{SIMPLE_BLOG}</MenuItem>
      </Select>
    </FormControl>
  )
}
