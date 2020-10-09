import {Button} from '@material-ui/core'
import {EMOJI_LIST} from 'Dashboard/components/EmojiList'
import {setComponent} from 'Dashboard/edit/state/actions'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function AddEmojiListButton(props: {className?: string}) {
  const dispatch = useDispatch()

  const addEmojiList = () => {
    dispatch(
      setComponent({
        type: EMOJI_LIST,
      }),
    )
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      aria-label="add emoji list"
      onClick={addEmojiList}
      className={props.className}
    >
      Add Emoji
    </Button>
  )
}
