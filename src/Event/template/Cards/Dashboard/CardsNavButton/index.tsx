import NavButton from 'Event/Dashboard/components/NavButton'
import React from 'react'

export type CardsNavButtonProps = NavButton & {
  row: 1 | 2
}

export default function CardsNavButton(props: CardsNavButtonProps) {
  const {row: _, ...buttonProps} = props
  return <NavButton {...buttonProps} />
}
