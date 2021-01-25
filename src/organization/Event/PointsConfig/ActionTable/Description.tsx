import {Action} from 'Event/ActionsProvider'
import Button from 'lib/ui/Button'
import {colors} from 'lib/ui/theme'
import React from 'react'

export default function Description(props: {
  action: Action
  onClick: () => void
}) {
  /**
   * Platform actions are not clickable, as they
   * cannot be edited.
   */
  if (props.action.is_platform_action) {
    return <span>{props.action.description}</span>
  }

  return (
    <Button variant="text" onClick={props.onClick} textColor={colors.secondary}>
      {props.action.description}
    </Button>
  )
}
