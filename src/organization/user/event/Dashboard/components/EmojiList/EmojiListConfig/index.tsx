import styled from 'styled-components'
import {EmojiList} from 'organization/user/event/Dashboard/components/EmojiList'
import {Emoji} from 'organization/user/event/Dashboard/components/EmojiList/emoji'
import EmojiSelect from 'organization/user/event/Dashboard/components/EmojiList/EmojiListConfig/EmojiSelect'
import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import TextField from '@material-ui/core/TextField'
import {onUnknownChangeHandler} from 'lib/dom'
import {
  useDashboard,
  useUpdateDashboard,
} from 'organization/user/event/Dashboard/state/DashboardProvider'

export default function EmojiListConfig() {
  const updateDashboard = useUpdateDashboard()
  const {emojiList} = useDashboard()

  const update = <T extends keyof EmojiList>(key: T, value: EmojiList[T]) => {
    updateDashboard({
      emojiList: {
        ...emojiList,
        [key]: value,
      },
    })
  }

  const addNewEmoji = (emoji: Emoji['name']) => {
    const updated = [...emojiList.emojis, emoji]
    update('emojis', updated)
  }

  const updateEmoji = (index: number) => (updated: Emoji['name']) => {
    const updatedEmojis = emojiList.emojis.map((e, i) => {
      const isTarget = i === index
      if (isTarget) {
        return updated
      }

      return e
    })

    update('emojis', updatedEmojis)
  }

  const remove = (index: number) => () => {
    const updated = emojiList.emojis.filter((e, i) => i !== index)
    update('emojis', updated)
  }

  const setWidth = (width: number) => {
    update('emojiWidth', width)
  }

  return (
    <>
      <TextField
        type="number"
        value={emojiList.emojiWidth || ''}
        label="Emoji Size"
        onChange={onUnknownChangeHandler(setWidth)}
        fullWidth
        inputProps={{
          step: 5,
          min: 20,
        }}
      />
      {emojiList.emojis.map((emoji, index) => (
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
