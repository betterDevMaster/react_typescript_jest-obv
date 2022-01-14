import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import React from 'react'

export default function PaginationActions(props: {
  count: number
  page: number
  rowsPerPage: number
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void
}): React.ReactElement {
  const {page, count, rowsPerPage} = props
  const lastPage = Math.ceil(count / rowsPerPage) - 1
  const isFirstPage = page === 0
  const isLastPage = page >= lastPage

  const goToPage = (page: number) => (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => props.onChangePage(event, page)

  const goFirstPage = goToPage(0)
  const goPrevPage = goToPage(page - 1)
  const goNextPage = goToPage(page + 1)
  const goLastPage = goToPage(lastPage)

  return (
    <Box>
      <IconButton
        onClick={goFirstPage}
        disabled={isFirstPage}
        aria-label="go to first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={goPrevPage}
        disabled={isFirstPage}
        aria-label="go to previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={goNextPage}
        disabled={isLastPage}
        aria-label="go to next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={goLastPage}
        disabled={isLastPage}
        aria-label="go to last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
`
