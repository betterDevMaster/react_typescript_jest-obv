import React, {useState} from 'react'
import styled from 'styled-components'
import {Emoji, emojiWithName} from 'Event/Dashboard/components/EmojiList/emoji'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import AddEmojiListButton from 'Event/Dashboard/components/EmojiList/AddEmojiListButton'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {eventClient} from 'Event/api-client'

export const EMOJI_LIST = 'Emoji List'

export interface EmojiList {
  emojis: Emoji['name'][]
  // Manually set size of each emoji, if unset
  // each emoji will take up all available
  // space
  emojiWidth?: number
}

export default function EmojiList() {
  const {emojiList: list} = useTemplate()

  const isEmpty = list && list.emojis.length === 0
  if (!list || isEmpty) {
    // Add button to create emoji list
    return (
      <EditModeOnly>
        <StyledAddEmojiListButton />
      </EditModeOnly>
    )
  }

  return (
    <EditComponent component={{type: EMOJI_LIST}}>
      <Box aria-label="emoji list">
        {list.emojis.map((name, index) => (
          <Container key={index} width={list.emojiWidth}>
            <EmojiImage name={name} src={emojiWithName(name).image} />
          </Container>
        ))}
      </Box>
    </EditComponent>
  )
}

interface EmojiProps {
  name: string
  src: string
}

const EmojiImage = (props: EmojiProps) => {
  const [sending, setSending] = useState(false)
  const {name, src} = props

  const {event} = useEvent()
  const sendEmoji = (name: string) => () => {
    if (!sending) {
      setSending(true)
      setTimeout(() => setSending(false), 1000)
      const url = api(`/events/${event.slug}/emoji_page`)
      eventClient.post(url, {name}).catch((error) => {
        // ignore errors, prevent failing to send emoji from crashing app
        console.error(error)
      })
    }
  }

  return (
    <Image
      aria-label="event emoji"
      src={src}
      alt={name}
      onClick={sendEmoji(name)}
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
