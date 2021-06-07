import styled from 'styled-components'
import {EmojiList, EMOJI_LIST} from 'Event/template/Panels/Dashboard/EmojiList'
import {
  DEFAULT_EMOJIS,
  createCustomEmoji,
  Emoji,
  isCustom,
} from 'Event/Dashboard/components/emoji'
import EmojiSelect from 'Event/template/Panels/Dashboard/EmojiList/EmojiListConfig/EmojiSelect'
import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import TextField from '@material-ui/core/TextField'
import {onUnknownChangeHandler} from 'lib/dom'
import {useDispatchUpdate, useTemplate} from 'Event/TemplateProvider'
import EmojiUpload from 'Event/template/Panels/Dashboard/EmojiList/EmojiListConfig/EmojiUpload'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export type EmojiListConfig = {
  type: typeof EMOJI_LIST
}

export function EmojiListConfig(props: {
  editing: boolean | null
  onClose: () => void
}) {
  const updateTemplate = useDispatchUpdate()
  const template = useTemplate()
  const {emojiList} = template
  const deleteFile = useDeleteFile()

  if (props.editing === false) {
    return null
  }
  const customEmojis = emojiList.emojis.filter(isCustom).map(createCustomEmoji)
  const availableEmojis = [...DEFAULT_EMOJIS, ...customEmojis]

  const update = <T extends keyof EmojiList>(key: T, value: EmojiList[T]) => {
    updateTemplate({
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
    const emoji = emojiList.emojis[index]
    const isLast = emojiList.emojis.filter((e) => e === emoji).length === 1
    if (isCustom(emoji) && isLast) {
      deleteFile(emoji)
    }

    const updated = emojiList.emojis.filter((e, i) => i !== index)
    update('emojis', updated)
  }

  const setWidth = (width: number) => {
    update('emojiWidth', width)
  }

  return (
    <Dialog onClose={props.onClose} open={true} maxWidth="xs">
      <DialogTitle>Emoji</DialogTitle>
      <DialogContent>
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
            <EmojiSelect
              emojis={availableEmojis}
              value={emoji}
              onPick={updateEmoji(index)}
            />
            <RemoveButton aria-label="remove emoji" onClick={remove(index)}>
              <CloseIcon color="error" />
            </RemoveButton>
          </ExistingEmoji>
        ))}
        <EmojiSelect value="" emojis={availableEmojis} onPick={addNewEmoji} />
        <EmojiUpload onSuccess={addNewEmoji} />
      </DialogContent>
    </Dialog>
  )
}

const ExistingEmoji = styled.div`
  display: flex;
  align-items: center;
`

const RemoveButton = styled(IconButton)`
  margin-left: ${(props) => props.theme.spacing[2]};
`

function useDeleteFile() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (emoji: string) => {
    const url = api(`/events/${event.slug}/emojis/${emoji}`)
    return client.delete(url)
  }
}
