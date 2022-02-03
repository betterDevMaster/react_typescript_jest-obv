import DirectionButton from 'lib/ui/Pagination/PaginationItem/DirectionButton'
import PageButton from 'lib/ui/Pagination/PaginationItem/PageButton'
import React from 'react'

type PaginationButtonType =
  | 'page'
  | 'first'
  | 'last'
  | 'next'
  | 'previous'
  | 'start-ellipsis'
  | 'end-ellipsis'

export type PaginationItemProps = {
  type: PaginationButtonType
  numPages: number
  page: number
  currentPage: number
  disabled?: boolean
  onChange: (page: number) => void
}

export default function Item(props: PaginationItemProps) {
  const {type} = props

  switch (type) {
    case 'start-ellipsis':
    case 'end-ellipsis':
      return <Dots />
    case 'page':
      return <PageButton {...props} />
    default:
      return <DirectionButton {...props} />
  }
}

function Dots() {
  return <span>...</span>
}
