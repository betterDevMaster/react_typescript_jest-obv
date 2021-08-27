import React from 'react'
import Button from '@material-ui/core/Button'
import {Room} from 'Event/room'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import styled from 'styled-components'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import SuccessAlert from 'lib/ui/alerts/SuccessAlert'
import {useGet} from 'lib/requests'

export default function ExportRoomAttendees(props: {room: Room}) {
  const url = api(`/rooms/${props.room.id}/attendees/export`)
  const {client} = useOrganization()

  const {
    send: exportAttendees,
    processing,
    errorMessage,
    successMessage,
  } = useGet(client, url)

  return (
    <div>
      <Button
        onClick={exportAttendees}
        disabled={processing}
        variant="outlined"
        aria-label="export attendees"
      >
        Export Attendees
      </Button>
      <StyledErrorAlert>{errorMessage}</StyledErrorAlert>
      <StyledSuccessAlert>{successMessage}</StyledSuccessAlert>
    </div>
  )
}

const StyledErrorAlert = styled(ErrorAlert)`
  margin-top: ${(props) => props.theme.spacing[2]};
`

const StyledSuccessAlert = styled(SuccessAlert)`
  margin-top: ${(props) => props.theme.spacing[2]};
`
