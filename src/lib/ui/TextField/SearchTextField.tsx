import React from 'react'
import InputBase from '@material-ui/core/InputBase'
import IconButton from 'lib/ui/IconButton'
import SearchIcon from '@material-ui/icons/Search'

import styled from 'styled-components'

export default function SearchTextField() {
  return (
    <Container>
      <IconButton aria-label="search">
        <SearchIcon />
      </IconButton>
      <StyledInputBase
        placeholder="Search..."
        inputProps={{'aria-label': 'search'}}
      />
    </Container>
  )
}

const Container = styled.div`
  padding: 4px 4px;
  display: flex;
  align-items: center;
  min-width: 250px;
  background-color: #e7e7e7;
`
const StyledInputBase = styled(InputBase)`
  margin-left: ${(props) => props.theme.spacing[1]};
  flex: 1;
`
