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
import {useToggle} from 'lib/toggle'
import {EmojiListConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/EmojiList/EmojiListConfig'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Section from 'Event/template/Cards/Dashboard/Sidebar/Section'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {Ordered} from 'lib/list'
import {HasRules} from 'Event/attendee-rules'

export const EMOJI_LIST = 'Emoji List'
export interface EmojiListProps extends Ordered, HasRules {
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
  type: EMOJI_LIST,
  emojis: [],
  emojiWidth: null,
})

export default function EmojiList(props: EmojiListProps) {
  const {emojis, emojiWidth} = props

  const isEditMode = useEditMode()

  const emojiList = emojis.map((name, index) => (
    <Container key={index} width={emojiWidth}>
      <EmojiImage name={name} src={emojiWithName(name).image} />
    </Container>
  ))

  if (isEditMode) {
    return <WithConfig {...props}>{emojiList}</WithConfig>
  }

  return (
    <Section>
      <Box aria-label="emoji list">{emojiList}</Box>
    </Section>
  )
}

function WithConfig(props: EmojiListProps & {children: React.ReactElement[]}) {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const {remove: removeItem} = useEditSidebarItem()

  return (
    <Section>
      <EmojiListConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        list={props}
      />
      <RemoveButton size="large" onClick={removeItem}>
        Remove Emojis
      </RemoveButton>
      <EditableContent onEdit={toggleConfig} {...props} />
    </Section>
  )
}

function EditableContent(
  props: EmojiListProps & {
    onEdit: () => void
    children: React.ReactElement[]
  },
) {
  const {onEdit, emojis} = props

  const isEmpty = emojis.length === 0
  if (isEmpty) {
    return <StyledAddEmojiListButton onClick={onEdit} />
  }

  return (
    <Editable onEdit={onEdit}>
      <Box aria-label="emoji list">{props.children}</Box>
    </Editable>
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
