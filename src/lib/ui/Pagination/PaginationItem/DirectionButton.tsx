import {PaginationItemProps} from 'lib/ui/Pagination/PaginationItem'
import React from 'react'
import styled from 'styled-components'

export default function DirectionButton(props: PaginationItemProps) {
  const {type, currentPage, numPages: count, disabled, onChange} = props

  const goToTargetPage = () => {
    onChange(targetPage(type, currentPage))
  }

  const isDisabled = disabled || !canNavigate(type, currentPage, count)

  return (
    <StyledButton type="button" disabled={isDisabled} onClick={goToTargetPage}>
      {text(type)}
    </StyledButton>
  )
}

function targetPage(type: PaginationItemProps['type'], currentPage: number) {
  switch (type) {
    case 'previous':
      return currentPage - 1
    case 'next':
      return currentPage + 1
    default:
      throw new Error(`Incorrect type: '${type}'.`)
  }
}

function text(type: PaginationItemProps['type']) {
  switch (type) {
    case 'previous':
      return '< Prev'
    case 'next':
      return 'Next >'
    default:
      throw new Error(`Incorrect type: '${type}'.`)
  }
}

function canNavigate(
  type: PaginationItemProps['type'],
  currentPage: number,
  numPages: number,
) {
  switch (type) {
    case 'previous':
      return currentPage > 1
    case 'next':
      return currentPage < numPages
    default:
      throw new Error(`Incorrect type: '${type}'.`)
  }
}

type StyledButtonProps = {
  disabled: boolean
}

const StyledButton = styled.button<StyledButtonProps>`
  border: none;
  background: none;
  opacity: ${(props) => `${props.disabled ? 0.5 : 1}`};
  color: '#000000';
  padding: 3.5px 8px;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
`
