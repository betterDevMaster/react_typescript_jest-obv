import React, {useEffect, useState} from 'react'
import {Room} from 'Event/room'
import InputAdornment from '@material-ui/core/InputAdornment'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import IconButton from 'lib/ui/IconButton'
import grey from '@material-ui/core/colors/grey'

export default function RegistrationURL(props: {room: Room}) {
  const [copied, setCopied] = useState(false)
  const {
    room: {registration_url},
  } = props

  /**
   * Reset copied indicator if field is shown/hidden
   */
  useEffect(() => {
    setCopied(false)
  }, [registration_url])

  if (!registration_url) {
    return null
  }

  const copy = () => {
    navigator.clipboard.writeText(registration_url).then(() => {
      setCopied(true)
    })
  }

  return (
    <TextField
      value={registration_url}
      fullWidth
      focused={copied}
      variant="outlined"
      label="Registration URL"
      inputProps={{
        'aria-label': 'registration url',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CopyButton
              aria-label="copy registration url"
              onClick={copy}
              copied={copied}
            >
              <FileCopyIcon />
            </CopyButton>
          </InputAdornment>
        ),
      }}
      helperText="Anyone with this URL will be able to join this room directly as an attendee."
    />
  )
}

const CopyButton = styled(IconButton)<{copied: boolean}>`
  color: ${(props) => (props.copied ? props.theme.colors.primary : grey[500])};
`
