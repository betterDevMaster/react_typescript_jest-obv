import styled from 'styled-components'
import {EmojiList} from 'Dashboard/components/EmojiList'
import {Emoji} from 'Dashboard/components/EmojiList/emoji'
import EmojiSelect from 'Dashboard/components/EmojiList/EmojiListConfig/EmojiSelect'
import {setDashboard} from 'Dashboard/edit/state/actions'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import TextField from '@material-ui/core/TextField'
import {onChangeHandler} from 'lib/dom'

export default function EmojiListConfig() {
  const dispatch = useDispatch()

  const list = useSelector(
    (state: RootState) => state.dashboardEditor.emojiList,
  )

  if (!list) {
    throw new Error('Missing emoji list; was dashboard set correctly?')
  }

  const update = <T extends keyof EmojiList>(key: T, value: EmojiList[T]) => {
    dispatch(
      setDashboard({
        emojiList: {
          ...list,
          [key]: value,
        },
      }),
    )
  }

  const addNewEmoji = (emoji: Emoji['name']) => {
    const updated = [...list.emojis, emoji]
    update('emojis', updated)
  }

  const updateEmoji = (index: number) => (updated: Emoji['name']) => {
    const updatedEmojis = list.emojis.map((e, i) => {
      const isTarget = i === index
      if (isTarget) {
        return updated
      }

      return e
    })

    update('emojis', updatedEmojis)
  }

  const remove = (index: number) => () => {
    const updated = list.emojis.filter((e, i) => i !== index)
    update('emojis', updated)
  }

  const setWidth = (width: number) => {
    update('emojiWidth', width)
  }

  return (
    <>
      <TextField
        type="number"
        value={list.emojiWidth || ''}
        label="Emoji Size"
        onChange={onChangeHandler(setWidth)}
        fullWidth
        inputProps={{
          step: 5,
          min: 20,
        }}
      />
      {list.emojis.map((emoji, index) => (
        <ExistingEmoji key={index}>
          <EmojiSelect value={emoji} onPick={updateEmoji(index)} />
          <RemoveButton aria-label="remove emoji" onClick={remove(index)}>
            <CloseIcon color="error" />
          </RemoveButton>
        </ExistingEmoji>
      ))}
      <EmojiSelect value="" onPick={addNewEmoji} />
    </>
  )
}

const ExistingEmoji = styled.div`
  display: flex;
  align-items: center;
`

const RemoveButton = styled(IconButton)`
  margin-left: ${(props) => props.theme.spacing[2]};
`
