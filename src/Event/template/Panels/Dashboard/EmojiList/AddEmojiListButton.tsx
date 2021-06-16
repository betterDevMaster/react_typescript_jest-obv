import Button from '@material-ui/core/Button'
import React from 'react'

export default function AddEmojiListButton(props: {
  className?: string
  edit: () => void
}) {
  const addEmojiList = () => {
    props.edit()
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add emoji list"
      onClick={addEmojiList}
      className={props.className}
    >
      Add Emoji
    </Button>
  )
}
