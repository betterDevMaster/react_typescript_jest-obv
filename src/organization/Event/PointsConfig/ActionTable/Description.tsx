import {Action} from 'Event/ActionsProvider'
import CustomButton from 'lib/ui/Button/CustomButton'
import {colors} from 'lib/ui/theme'
import React from 'react'

export default function Description(props: {
  action: Action
  onClick: () => void
}) {
  const label = `edit ${props.action.description}`

  return (
    <CustomButton
      variant="text"
      onClick={props.onClick}
      textColor={colors.secondary}
      aria-label={label}
    >
      {props.action.description}
    </CustomButton>
  )
}
