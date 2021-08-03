import React, {useState} from 'react'
import styled from 'styled-components'
import {
  Emoji,
  EmojiImageProps,
  emojiWithName,
  useSendEmoji,
} from 'Event/Dashboard/components/EmojiList/emoji'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useTemplate} from 'Event/TemplateProvider'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {EmojiListConfig} from 'Event/Dashboard/components/EmojiList/EmojiListConfig'
import AddEmojiButton from 'Event/Dashboard/components/EmojiList/AddEmojiButton'

export const EMOJI_LIST = 'Emoji List'

export interface EmojiList {
  emojis: Emoji['name'][]
  // Manually set size of each emoji, if unset
  // each emoji will take up all available
  // space
  emojiWidth?: number | null
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
        <EditModeOnly>
          <EmojiListConfig isVisible={isEditing} onClose={stopEditing} />
          <StyledAddEmojiListButton onClick={edit} />
        </EditModeOnly>
      </>
    )
  }

  return (
    <>
      <EditModeOnly>
        <EmojiListConfig isVisible={isEditing} onClose={stopEditing} />
      </EditModeOnly>
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
