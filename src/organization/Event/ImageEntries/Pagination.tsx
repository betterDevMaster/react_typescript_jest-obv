import React from 'react'
import styled from 'styled-components'
import {useImageEntries} from 'organization/Event/ImageEntriesProvider'
import Button from '@material-ui/core/Button'

export default function PaginationButtons() {
  const {goPrevPage, goNextPage, hasPrevPage, hasNextPage} = useImageEntries()

  return (
    <>
      <PaginationButton
        variant="outlined"
        onClick={goPrevPage}
        aria-label="go prev page"
        disabled={!hasPrevPage}
      >
        Prev
      </PaginationButton>
      <PaginationButton
        variant="outlined"
        onClick={goNextPage}
        disabled={!hasNextPage}
        aria-label="go next page"
      >
        Next
      </PaginationButton>
    </>
  )
}

const PaginationButton = styled(Button)`
  height: 34px;
`
