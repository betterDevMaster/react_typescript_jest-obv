import React, {useState} from 'react'
import styled from 'styled-components'
import {
  Emoji,
  EmojiImageProps,
  emojiWithName,
  useSendEmoji,
} from 'Event/Dashboard/components/emoji'
import AddEmojiListButton from 'Event/template/Panels/Dashboard/EmojiList/AddEmojiListButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useTemplate} from 'Event/TemplateProvider'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {EmojiListConfig as ConfigDialog} from 'Event/template/Panels/Dashboard/EmojiList/EmojiListConfig'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export const EMOJI_LIST = 'Emoji List'

export interface EmojiList {
  emojis: Emoji['name'][]
  // Manually set size of each emoji, if unset
  // each emoji will take up all available
  // space
  emojiWidth?: number
}

export default function EmojiList() {
  const template = useTemplate()
  const {emojiList: list} = template

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const edit = () => setIsEditing(true)
  const stopEditing = () => setIsEditing(false)

  const isEmpty = list && list.emojis.length === 0
  if (!list || isEmpty) {
    // Add button to create emoji list
    return (
      <>
        <EmojiListConfig>
          <ConfigDialog editing={isEditing} onClose={stopEditing} />
        </EmojiListConfig>
        <EditModeOnly>
          <StyledAddEmojiListButton edit={edit} />
        </EditModeOnly>
      </>
    )
  }

  return (
    <>
      <EmojiListConfig>
        <ConfigDialog editing={isEditing} onClose={stopEditing} />
      </EmojiListConfig>
      <Editable onEdit={edit}>
        <Box aria-label="emoji list">
          {list.emojis.map((name, index) => (
            <Container key={index} width={list.emojiWidth}>
              <EmojiImage name={name} src={emojiWithName(name).image} />
            </Container>
          ))}
        </Box>
      </Editable>
    </>
  )
}

function EmojiListConfig(props: {children: React.ReactElement}) {
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return null
  }
  return props.children
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

const StyledAddEmojiListButton = styled(AddEmojiListButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
