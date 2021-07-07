import React from 'react'
import Box from '@material-ui/core/Box'
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
    <>
      <StyledErrorAlert>{errorMessage}</StyledErrorAlert>
      <StyledSuccessAlert>{successMessage}</StyledSuccessAlert>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          onClick={exportAttendees}
          disabled={processing}
          variant="outlined"
          aria-label="export attendees"
        >
          Export Attendees
        </Button>
      </Box>
    </>
  )
}

const StyledErrorAlert = styled(ErrorAlert)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`

const StyledSuccessAlert = styled(SuccessAlert)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
