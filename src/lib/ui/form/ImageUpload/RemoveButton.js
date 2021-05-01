import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'

export default function RemoveButton(props) {
  if (!props.isVisible) {
    return null
  }

  return (
    <DangerButton
      variant="outlined"
      aria-label={props['aria-label']}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      Remove
    </DangerButton>
  )
}
