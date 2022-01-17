import React from 'react'
import styled from 'styled-components'
import {usePagination} from '@material-ui/lab/Pagination'
import Item from './PaginationItem'

export type PaginationProps = {
  count: number
  page: number
  disabled?: boolean
  onChange: (value: number) => void
}

export default function Pagination(props: PaginationProps) {
  const {count, page: currentPage, disabled, onChange} = props

  const {items} = usePagination({
    count,
    page: currentPage,
    disabled,
  })

  return (
    <StyledUl>
      {items.map(({page, type}, index) => {
        return (
          <li key={index}>
            <Item
              type={type}
              numPages={count}
              page={page}
              currentPage={currentPage}
              disabled={disabled}
              onChange={onChange}
            />
          </li>
        )
      })}
    </StyledUl>
  )
}

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`
