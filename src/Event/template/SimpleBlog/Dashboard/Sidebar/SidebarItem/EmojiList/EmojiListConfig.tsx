import styled from 'styled-components'
import {
  DEFAULT_EMOJIS,
  createCustomEmoji,
  Emoji,
  isCustom,
} from 'Event/Dashboard/components/EmojiList/emoji'
import React, {useEffect, useState} from 'react'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import TextField from '@material-ui/core/TextField'
import {onUnknownChangeHandler} from 'lib/dom'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
  RemoveButton as RemoveListButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import EmojiSelect from 'Event/Dashboard/components/EmojiList/EmojiSelect'
import EmojiUpload from 'Event/Dashboard/components/EmojiList/EmojiUpload'
import {EmojiListProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/EmojiList'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

export function EmojiListConfig(
  props: ComponentConfigProps & {
    list: EmojiListProps
  },
) {
  const {isVisible, onClose} = props
  const {list} = props
  const deleteFile = useDeleteFile()
  const [emojiWidth, setEmojiWidth] = useState(list.emojiWidth)
  const [emojis, setEmojis] = useState(list.emojis)
  const {remove: removeItem, update: updateItem} = useEditSidebarItem()

  useEffect(() => {
    if (isVisible) {
      return
    }

    setEmojiWidth(list.emojiWidth)
    setEmojis(list.emojis)
  }, [isVisible, list])

  const customEmojis = emojis.filter(isCustom).map(createCustomEmoji)
  const availableEmojis = [...DEFAULT_EMOJIS, ...customEmojis]

  const save = () => {
    const data = {
      emojiWidth,
      emojis,
    }

    updateItem(data)
    onClose()
  }

  const addNewEmoji = (emoji: Emoji['name']) => {
    const added = [...emojis, emoji]
    setEmojis(added)
  }

  const updateEmoji = (index: number) => (target: Emoji['name']) => {
    const updated = emojis.map((e, i) => {
      const isTarget = i === index
      if (isTarget) {
        return target
      }

      return e
    })

    setEmojis(updated)
  }

  const remove = (index: number) => () => {
    const emoji = emojis[index]
    const isLast = emojis.filter((e) => e === emoji).length === 1
    if (isCustom(emoji) && isLast) {
      deleteFile(emoji)
    }

    const removed = emojis.filter((e, i) => i !== index)
    setEmojis(removed)
  }

  return (
    <ComponentConfig title="Emojis" isVisible={isVisible} onClose={onClose}>
      <>
        <TextField
          type="number"
          value={emojiWidth || ''}
          label="Emoji Size"
          onChange={onUnknownChangeHandler(setEmojiWidth)}
          fullWidth
          inputProps={{
            step: 5,
            min: 20,
          }}
        />
        {emojis.map((emoji, index) => (
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
        <SaveButton onClick={save} />
        <RemoveListButton onClick={removeItem} />
      </>
    </ComponentConfig>
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
