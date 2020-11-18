import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {Emoji, EMOJI} from 'Event/Dashboard/components/EmojiList/emoji'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'

export default function EmojiSelect(props: {
  value?: Emoji['name']
  onPick: (emoji: string) => void
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>Pick an emoji</InputLabel>
      <Select
        value={props.value}
        fullWidth
        onChange={onUnknownChangeHandler(props.onPick)}
        inputProps={{
          'aria-label': 'pick emoji',
        }}
      >
        {Object.values(EMOJI).map((emoji) => {
          return (
            <MenuItem key={emoji.name} value={emoji.name}>
              <Image src={emoji.image} alt={emoji.name} />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

const Image = styled.img`
  width: 30px;
`
