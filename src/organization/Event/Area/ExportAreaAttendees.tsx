import React from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import SuccessAlert from 'lib/ui/alerts/SuccessAlert'
import {Area} from 'organization/Event/AreasProvider'
import {useGet} from 'lib/requests'

export default function ExportAreaAttendees(props: {area: Area}) {
  const {event} = useEvent()
  const url = api(
    `/events/${event.slug}/areas/${props.area.id}/attendees/export`,
  )
  const {client} = useOrganization()

  const {
    send: exportAttendees,
    processing,
    errorMessage,
    successMessage,
  } = useGet(client, url)

  return (
    <>
      <ErrorAlert>{errorMessage}</ErrorAlert>
      <SuccessAlert>{successMessage}</SuccessAlert>
      <Box mb={2}>
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
