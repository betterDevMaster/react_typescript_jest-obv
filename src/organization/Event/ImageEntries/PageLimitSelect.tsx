import React from 'react'
import styled from 'styled-components'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import {onUnknownChangeHandler} from 'lib/dom'
import {useImageEntries} from 'organization/Event/ImageEntriesProvider'

export default function PageLimitSelect() {
  const {pageLimit, updatePerPage} = useImageEntries()

  return (
    <StyledFormControl>
      <Select
        variant="outlined"
        value={pageLimit}
        onChange={onUnknownChangeHandler(updatePerPage)}
        inputProps={{
          'aria-label': 'set page limit',
        }}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </StyledFormControl>
  )
}

const StyledFormControl = styled(FormControl)`
  margin-right: 40px;
  .MuiOutlinedInput-input {
    padding-top: 6px;
    padding-bottom: 6px;
  }
`
