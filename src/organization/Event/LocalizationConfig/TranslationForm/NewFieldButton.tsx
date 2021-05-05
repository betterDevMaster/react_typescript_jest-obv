import React from 'react'
import Button from '@material-ui/core/Button'

export default function NewFieldButton(props: {
  onClick: () => void
  visible: boolean
  disabled?: boolean
}) {
  if (!props.visible) {
    return null
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      fullWidth
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label="add field"
    >
      New Field
    </Button>
  )
}
