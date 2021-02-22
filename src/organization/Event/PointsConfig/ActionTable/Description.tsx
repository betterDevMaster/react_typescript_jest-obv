import {Action} from 'Event/ActionsProvider'
import Button from 'lib/ui/Button'
import {colors} from 'lib/ui/theme'
import React from 'react'

export default function Description(props: {
  action: Action
  onClick: () => void
}) {
  const label = `edit ${props.action.description}`

  return (
    <Button
      variant="text"
      onClick={props.onClick}
      textColor={colors.secondary}
      aria-label={label}
    >
      {props.action.description}
    </Button>
  )
}
