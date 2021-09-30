import React from 'react'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import {
  APPROVED,
  PENDING,
  REJECTED,
  useImageEntries,
} from 'organization/Event/ImageEntriesProvider'
import {onUnknownChangeHandler} from 'lib/dom'

export default function StatusSelect() {
  const {filterByStatus, statusFilter} = useImageEntries()

  return (
    <Grid container>
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          onChange={onUnknownChangeHandler(filterByStatus)}
          value={statusFilter}
          inputProps={{
            'aria-label': 'status filter',
          }}
        >
          <MenuItem value={PENDING}>Pending</MenuItem>
          <MenuItem value={APPROVED}>Approved</MenuItem>
          <MenuItem value={REJECTED}>Rejected</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  )
}
