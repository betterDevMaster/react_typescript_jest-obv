import Button from '@material-ui/core/Button'
import React from 'react'

export default function AddEmojiButton(props: {
  className?: string
  onClick: () => void
}) {
  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add emoji list"
      onClick={props.onClick}
      className={props.className}
    >
      Add Emoji
    </Button>
  )
}
