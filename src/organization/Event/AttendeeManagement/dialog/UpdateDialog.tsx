import {Attendee} from 'Event/attendee'
import styled from 'styled-components'
import React, {useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import Form from 'organization/Event/AttendeeManagement/dialog/Form'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from 'lib/ui/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import grey from '@material-ui/core/colors/grey'

export default function UpdateDialog(props: {
  attendee: Attendee | null
  onClose: () => void
}) {
  const {attendee} = props
  const update = useUpdate()
  const isVisible = Boolean(props.attendee)

  if (!attendee) {
    return null
  }

  return (
    <Dialog open={isVisible} onClose={props.onClose}>
      <DialogTitle>Attendee</DialogTitle>
      <DialogContent>
        <LoginUrl attendee={attendee} />
        <Form
          attendee={attendee}
          submit={update.bind(null, attendee)}
          onClose={props.onClose}
          isVisible={isVisible}
        />
      </DialogContent>
    </Dialog>
  )
}

function useUpdate() {
  const list = useAttendees()
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee, data: Partial<Attendee>) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}`)
    return client.patch<Attendee>(url, data).then(list.update)
  }
}

function LoginUrl(props: {attendee: Attendee}) {
  const [copied, setCopied] = useState(false)

  const {login_url} = props.attendee

  const copy = () => {
    navigator.clipboard.writeText(login_url).then(() => {
      setCopied(true)
    })
  }

  return (
    <TextField
      value={login_url}
      fullWidth
      focused={copied}
      variant="outlined"
      label="Login URL"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CopyButton
              aria-label="copy login url"
              onClick={copy}
              copied={copied}
            >
              <FileCopyIcon />
            </CopyButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

const CopyButton = styled(IconButton)<{copied: boolean}>`
  color: ${(props) => (props.copied ? props.theme.colors.primary : grey[500])};
`
