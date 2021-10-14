import React from 'react'
import styled from 'styled-components'
import {
  Emoji,
  EmojiImageProps,
  emojiWithName,
  useSendEmoji,
} from 'Event/Dashboard/components/EmojiList/emoji'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import AddEmojiButton from 'Event/Dashboard/components/EmojiList/AddEmojiButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useToggle} from 'lib/toggle'
import {uuid} from 'lib/uuid'
import {EmojiListConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/EmojiList/EmojiListConfig'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useRemoveSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'

export const EMOJI_LIST = 'Emoji List'
export interface EmojiListProps {
  id: string
  type: typeof EMOJI_LIST
  emojis: Emoji['name'][]
  /**
   * Manually set size of each emoji, if unset
   * each emoji will take up all available
   * space.
   */
  emojiWidth?: number | null
}

export const createEmojiList = (): EmojiListProps => ({
  id: uuid(),
  type: EMOJI_LIST,
  emojis: [],
  emojiWidth: null,
})

export default function EmojiList(props: EmojiListProps) {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const {emojis, emojiWidth} = props
  const removeItem = useRemoveSidebarItem(props)

  const isEmpty = emojis.length === 0
  if (isEmpty) {
    // Add button to create emoji list
    return (
      <EditModeOnly>
        <>
          <EmojiListConfig
            isVisible={configVisible}
            onClose={toggleConfig}
            list={props}
          />
          <RemoveButton size="large" showing onClick={removeItem}>
            Remove Emojis
          </RemoveButton>
          <StyledAddEmojiListButton onClick={toggleConfig} />
        </>
      </EditModeOnly>
    )
  }

  return (
    <>
      <EditModeOnly>
        <EmojiListConfig
          isVisible={configVisible}
          onClose={toggleConfig}
          list={props}
        />
        <RemoveButton size="large" onClick={removeItem}>
          Remove Emojis
        </RemoveButton>
      </EditModeOnly>
      <Editable onEdit={toggleConfig}>
        <Box aria-label="emoji list">
          {emojis.map((name, index) => (
            <Container key={index} width={emojiWidth}>
              <EmojiImage name={name} src={emojiWithName(name).image} />
            </Container>
          ))}
        </Box>
      </Editable>
    </>
  )
}

const EmojiImage = (props: EmojiImageProps) => {
  const {send, sending} = useSendEmoji()
  const {name, src} = props

  return (
    <Image
      aria-label="event emoji"
      src={src}
      alt={name}
      onClick={send(name)}
      style={{opacity: sending ? 0.5 : 1}}
    />
  )
}

const Box = styled.div`
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  display: flex;
  justify-content: center;
`

const Container = styled((props: any) => {
  const {width: _, ...otherProps} = props
  return <div {...otherProps} />
})`
  margin: 0 ${(props) => props.theme.spacing[3]};
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
`

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
`

const StyledAddEmojiListButton = styled(AddEmojiButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
