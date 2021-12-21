import {PaginationItemProps} from 'lib/ui/Pagination/PaginationItem'
import React from 'react'
import styled from 'styled-components'

export default function PageButton(props: PaginationItemProps) {
  const {currentPage, disabled, page, onChange} = props

  const onChangePage = (page: number) => () => {
    if (page === currentPage) {
      return
    }

    onChange(page)
  }

  const isActive = !disabled && currentPage === page

  return (
    <StyledButton
      type="button"
      disabled={disabled}
      onClick={onChangePage(page)}
      isActive={isActive}
    >
      {page}
    </StyledButton>
  )
}

type ButtonStyleProps = {
  isActive: boolean
}

const StyledButton = styled.button<ButtonStyleProps>`
  padding: 3.5px 8px;
  margin-left: 6.5px;
  margin-right: 6.5px;
  border: none;
  border-radius: 3px;
  background-color: ${(props) => `${props.isActive ? '#3490DC' : '#C4C4C4'}`};
  opacity: ${(props) => `${props.isActive ? 1 : 0.25}`};
  color: ${(props) => `${props.isActive ? '#FFFFFF' : '#000000'}`};
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
`

type NextPrevButtonProps = {
  disabled: boolean
}
