import NavButton, {NavButtonProps} from 'Event/Dashboard/components/NavButton'
import {useCardsTemplate} from 'Event/template/Cards'
import React from 'react'

export type CardsNavButtonProps = NavButtonProps & {
  row: 1 | 2
}

export default function CardsNavButton(props: CardsNavButtonProps) {
  const {row: _, ...buttonProps} = props
  const {mainNav} = useCardsTemplate()
  return <NavButton {...buttonProps} height={mainNav.buttonHeight} />
}
