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
import {EmojiListConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/EmojiList/EmojiListConfig'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {Ordered} from 'lib/list'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
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

  const isEmpty = emojis.length === 0
  if (isEmpty) {
    // Add button to create emoji list
    return (
      <EditModeOnly>
        <EmptyConfig {...props} />
      </EditModeOnly>
    )
  }

  const content = (
    <Box aria-label="emoji list">
      {emojis.map((name, index) => (
        <Container key={index} width={emojiWidth}>
          <EmojiImage name={name} src={emojiWithName(name).image} />
        </Container>
      ))}
    </Box>
  )

  if (!isEditMode) {
    return <Section>{content}</Section>
  }

  return <ListWithConfig {...props}>{content}</ListWithConfig>
}

function EmptyConfig(props: EmojiListProps) {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()

  return (
    <Section>
      <Config emojiList={props} showing={showingConfig} toggle={toggleConfig} />
      <StyledAddEmojiListButton onClick={toggleConfig} />
    </Section>
  )
}

function ListWithConfig(
  props: EmojiListProps & {children: React.ReactElement},
) {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()

  return (
    <Section>
      <Config emojiList={props} showing={showingConfig} toggle={toggleConfig} />
      <Editable onEdit={toggleConfig}>{props.children}</Editable>
    </Section>
  )
}

function Config(props: {
  emojiList: EmojiListProps
  showing: boolean
  toggle: () => void
}) {
  const {remove} = useEditSidebarItem()
  const {showing, toggle, emojiList} = props

  useRemoveIfEmpty(remove, emojiList)

  return (
    <>
      <EmojiListConfig isVisible={showing} onClose={toggle} list={emojiList} />
      <RemoveButton size="large" showing onClick={remove}>
        Remove Emojis
      </RemoveButton>
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
