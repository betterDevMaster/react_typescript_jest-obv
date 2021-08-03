import Button from '@material-ui/core/Button'
import React from 'react'

export default function SetPointsButton(props: {
  className?: string
  onClick: () => void
}) {
  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="set points"
      onClick={props.onClick}
      className={props.className}
    >
      Set Points
    </Button>
  )
}
